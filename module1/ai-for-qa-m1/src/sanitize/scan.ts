// Core: scan a JSON / CSV / text input, mask what it finds, and return the findings.
import { findMatches, HEALTH_KEYWORDS } from './detectors.ts';
import { fieldKind } from './fields.ts';
import { parseCsv, stringifyCsv } from './csv.ts';
import { Masker } from './mask.ts';
import { CATEGORY_OF, type Finding, type Kind } from './types.ts';

export type InputFormat = 'json' | 'csv' | 'text';

export interface ScanResult {
  format: InputFormat;
  masked: string;
  findings: Finding[];
  /** Original sensitive values that were replaced; used by the verification step. */
  originals: string[];
  /** Fake values that were handed out (a fake may coincide with someone else's original). */
  produced: string[];
}

export function detectFormat(path: string): InputFormat {
  const p = path.toLowerCase();
  if (p.endsWith('.json')) return 'json';
  if (p.endsWith('.csv')) return 'csv';
  return 'text';
}

class Run {
  findings: Finding[] = [];
  originals = new Set<string>();
  readonly masker: Masker;
  constructor(masker: Masker) {
    this.masker = masker;
  }

  record(location: string, field: string | undefined, kind: Kind, source: 'field' | 'pattern', masked: boolean, note?: string) {
    this.findings.push({ location, field, kind, category: CATEGORY_OF[kind], source, masked, note });
  }

  /** Mask one string value. `field` is the key / header when known. */
  maskString(value: string, field: string | undefined, location: string): string {
    if (value.trim() === '') return value;

    const kind = fieldKind(field);
    if (kind) {
      const out = this.masker.mask(kind, value);
      if (out !== value) this.originals.add(value);
      this.record(location, field, kind, 'field', true);
      return out;
    }

    // No field rule: scan the text with the pattern detectors.
    let out = '';
    let cursor = 0;
    for (const m of findMatches(value)) {
      out += value.slice(cursor, m.start) + this.masker.mask(m.kind, m.value);
      cursor = m.end;
      this.originals.add(m.value);
      this.record(location, field, m.kind, 'pattern', true);
    }
    out += value.slice(cursor);

    // Names registered from name fields may also appear in free text (e.g. a support note).
    const scrubbed = this.masker.scrubNames(out);
    if (scrubbed.count > 0) {
      out = scrubbed.text;
      this.record(location, field, 'name', 'pattern', true, 'name from a name field found in free text');
    }

    // Health / special-category wording: flag for a human, do not rewrite the sentence.
    if (HEALTH_KEYWORDS.test(out)) this.record(location, field, 'health-keyword', 'pattern', false, 'review by a person: possible health or special-category detail');
    return out;
  }
}

// ---- JSON ------------------------------------------------------------------

function collectNamesJson(node: unknown, key: string | undefined, masker: Masker): void {
  if (typeof node === 'string') {
    if (fieldKind(key) === 'name') masker.registerName(node);
  } else if (Array.isArray(node)) node.forEach((n) => collectNamesJson(n, key, masker));
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) collectNamesJson(v, k, masker);
}

function walkJson(node: unknown, key: string | undefined, path: string, run: Run): unknown {
  if (typeof node === 'string') return run.maskString(node, key, path);
  if (typeof node === 'number') {
    const kind = fieldKind(key);
    if (kind === 'amount' || kind === 'account-number' || kind === 'id') {
      const out = run.masker.mask(kind, String(node));
      run.originals.add(String(node));
      run.record(path, key, kind, 'field', true);
      return Number(out);
    }
    return node;
  }
  if (Array.isArray(node)) return node.map((n, i) => walkJson(n, key, `${path}[${i}]`, run));
  if (node && typeof node === 'object') {
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walkJson(v, k, `${path}.${k}`, run)]));
  }
  return node;
}

// ---- CSV -------------------------------------------------------------------

function scanCsv(text: string, run: Run): string {
  const rows = parseCsv(text);
  if (rows.length === 0) return '';
  const header = rows[0];
  // Pass 1: collect name tokens from name columns across the whole file.
  for (const row of rows.slice(1)) header.forEach((h, c) => fieldKind(h) === 'name' && row[c] && run.masker.registerName(row[c]));
  // Pass 2: mask every cell.
  const out = [header, ...rows.slice(1).map((row, r) => row.map((cell, c) => run.maskString(cell, header[c], `row ${r + 1}`)))];
  return stringifyCsv(out);
}

// ---- text / logs -----------------------------------------------------------

function scanText(text: string, run: Run): string {
  const endsWithNewline = text.endsWith('\n');
  const lines = text.split('\n');
  if (endsWithNewline) lines.pop();
  const out = lines.map((line, i) => run.maskString(line, undefined, `line ${i + 1}`));
  return out.join('\n') + (endsWithNewline ? '\n' : '');
}

// ---- public entry point -----------------------------------------------------

export function scan(text: string, format: InputFormat, salt?: string): ScanResult {
  const run = new Run(new Masker(salt));
  let masked: string;
  if (format === 'json') {
    const data: unknown = JSON.parse(text);
    collectNamesJson(data, undefined, run.masker);
    masked = JSON.stringify(walkJson(data, undefined, '$', run), null, 2) + '\n';
  } else if (format === 'csv') {
    masked = scanCsv(text, run);
  } else {
    masked = scanText(text, run);
  }
  return { format, masked, findings: run.findings, originals: [...run.originals], produced: [...run.masker.produced] };
}

/**
 * Verification: does any original sensitive value still appear in the masked output?
 * This is what "unmasked findings remain" means for the exit code.
 */
export function residualOriginals(masked: string, originals: string[], produced: string[] = []): string[] {
  const fakes = new Set(produced);
  return originals.filter((o) => o.length >= 4 && !fakes.has(o) && masked.includes(o));
}
