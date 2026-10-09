// Findings report. It never contains original values, so it is safe to attach to a ticket.
import type { Category, Finding, Kind } from './types.ts';

export interface Report {
  file: string;
  format: string;
  totalFindings: number;
  masked: number;
  reviewOnly: number;
  byCategory: Record<string, number>;
  byKind: Record<string, number>;
  byField: Record<string, { count: number; kinds: string[]; category: Category }>;
  reviewItems: { location: string; field?: string; kind: Kind; note?: string }[];
  residualOriginals: number;
  /** Plain-language verdict used for the exit code. */
  status: 'clean' | 'masked' | 'findings-present' | 'unmasked-remain';
}

export function buildReport(file: string, format: string, findings: Finding[], residual: number, checkOnly: boolean): Report {
  const byCategory: Record<string, number> = {};
  const byKind: Record<string, number> = {};
  const byField: Report['byField'] = {};
  for (const f of findings) {
    byCategory[f.category] = (byCategory[f.category] ?? 0) + 1;
    byKind[f.kind] = (byKind[f.kind] ?? 0) + 1;
    const name = f.field ?? '(free text)';
    const e = (byField[name] ??= { count: 0, kinds: [], category: f.category });
    e.count++;
    if (!e.kinds.includes(f.kind)) e.kinds.push(f.kind);
  }
  const reviewItems = findings.filter((f) => !f.masked).map(({ location, field, kind, note }) => ({ location, field, kind, note }));
  const masked = findings.filter((f) => f.masked).length;
  let status: Report['status'];
  if (findings.length === 0) status = 'clean';
  else if (checkOnly) status = 'findings-present';
  else status = residual > 0 || reviewItems.length > 0 ? 'unmasked-remain' : 'masked';
  return { file, format, totalFindings: findings.length, masked, reviewOnly: reviewItems.length, byCategory, byKind, byField, reviewItems, residualOriginals: residual, status };
}

export function exitCode(r: Report): number {
  switch (r.status) {
    case 'clean':
    case 'masked':
      return 0;
    case 'findings-present':
      return 2;
    case 'unmasked-remain':
      return 3;
  }
}

export function formatReport(r: Report): string {
  const lines: string[] = [];
  lines.push(`# PII scan report: ${r.file}`, '', `Format: ${r.format}  |  Findings: ${r.totalFindings} (masked: ${r.masked}, review only: ${r.reviewOnly})  |  Status: ${r.status}`, '');

  lines.push('## By category', '', '| Category | Findings |', '| --- | ---: |');
  for (const [k, v] of Object.entries(r.byCategory)) lines.push(`| ${k} | ${v} |`);

  lines.push('', '## By field', '', '| Field | Category | Kinds | Findings |', '| --- | --- | --- | ---: |');
  for (const [k, v] of Object.entries(r.byField).sort((a, b) => b[1].count - a[1].count)) lines.push(`| ${k} | ${v.category} | ${v.kinds.join(', ')} | ${v.count} |`);

  lines.push('', '## Verification (the four checks from 1.2.4)', '');
  lines.push(`1. Direct identifiers replaced: ${r.byCategory['direct identifier'] ? 'yes, ' + r.byCategory['direct identifier'] + ' replaced' : 'none found'}`);
  lines.push(`2. Indirect identifiers replaced or removed: ${r.byCategory['indirect identifier'] ? 'yes, ' + r.byCategory['indirect identifier'] + ' replaced' : 'none found'}`);
  lines.push('3. Structure and format preserved: replacements keep the shape of each value (emails stay emails, numbers stay numbers); confirm for the fields your task asserts on');
  lines.push(`4. Could the person be re-identified from what remains: ${r.residualOriginals === 0 && r.reviewOnly === 0 ? 'no original value found in the output, but regex masking cannot see everything (see README, "What it misses")' : 'POSSIBLY: ' + r.residualOriginals + ' original value(s) still present, ' + r.reviewOnly + ' item(s) need a person to review'}`);

  if (r.reviewItems.length) {
    lines.push('', '## Needs a person', '');
    const show = r.reviewItems.slice(0, 20);
    for (const it of show) lines.push(`- ${it.location}${it.field ? ` (${it.field})` : ''}: ${it.kind}${it.note ? ' - ' + it.note : ''}`);
    if (r.reviewItems.length > show.length) lines.push(`- ... and ${r.reviewItems.length - show.length} more`);
  }
  return lines.join('\n') + '\n';
}
