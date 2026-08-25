/**
 * The plumbing around the gates — NOT sprint work.
 *
 * These pass out of the box. They cover the two pieces that sit either side
 * of the gates and that no sprint touches: pulling the JSON out of the model's
 * answer, and putting the approved files on disk. If something in here fails,
 * something real broke — it does not mean you have work to do.
 */
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { extractJson } from '../src/generate.js';
import { readExisting, writeFiles } from '../src/writeFiles.js';
import type { GeneratedFile } from '../src/types.js';

const PAYLOAD = {
  pageObject: { path: 'pages/CheckoutPage.ts', contents: "getByTestId('input-phone')" },
  spec: { path: 'specs/checkout.spec.ts', contents: "getByTestId('order-success')" },
  testIds: ['input-phone', 'order-success'],
};

describe('extractJson — parsing the model response', () => {
  it('handles every shape a model actually answers with', () => {
    const json = JSON.stringify(PAYLOAD);

    // Bare object, exactly what the prompt asks for.
    expect(extractJson(json)).toEqual(PAYLOAD);

    // Fenced, both spellings. Models add these despite being told not to.
    expect(extractJson('```json\n' + json + '\n```')).toEqual(PAYLOAD);
    expect(extractJson('```\n' + json + '\n```')).toEqual(PAYLOAD);

    // Prose either side of a fence.
    expect(
      extractJson('Here is the generated code:\n\n```json\n' + json + '\n```\n\nLet me know!'),
    ).toEqual(PAYLOAD);

    // Leading and trailing whitespace / newlines.
    expect(extractJson('\n\n  ' + json + '  \n\n')).toEqual(PAYLOAD);
  });

  it('survives braces inside the generated code', () => {
    // The whole point: pageObject.contents is TypeScript full of { and }.
    // A naive first-brace-to-last-brace slice has to still land correctly.
    const withBraces = {
      ...PAYLOAD,
      pageObject: {
        path: 'pages/CheckoutPage.ts',
        contents: 'export class CheckoutPage {\n  constructor(private page: Page) {}\n}',
      },
    };
    const parsed = extractJson('```json\n' + JSON.stringify(withBraces) + '\n```') as typeof withBraces;
    expect(parsed.pageObject.contents).toContain('constructor(private page: Page) {}');
    expect(parsed).toEqual(withBraces);
  });

  it('finds the payload even when prose before it contains braces', () => {
    // Bare JSON preceded by prose is the shape that broke the naive
    // first-brace-to-last-brace slice: indexOf('{') landed on "{id}".
    const json = JSON.stringify(PAYLOAD);
    expect(extractJson('Use the {id} placeholder for each product. ' + json)).toEqual(PAYLOAD);
    expect(extractJson('Notes: {a} {b} {c}\n\n' + json)).toEqual(PAYLOAD);
  });

  it('throws something readable when there is no JSON at all', () => {
    expect(() => extractJson('I cannot help with that request.')).toThrow(
      /No JSON object in the model response/,
    );
    expect(() => extractJson('')).toThrow(/No JSON object/);
  });

  it('lets malformed JSON fail loudly rather than returning junk', () => {
    // A truncated response (hit max_tokens) must not silently become a
    // half-object the schema gate then has to guess about.
    expect(() => extractJson('{"pageObject": {"path": "a.ts", "contents":')).toThrow();
    expect(() => extractJson('{ this is not json }')).toThrow();
  });
});

describe('writeFiles — putting approved files on disk', () => {
  let outDir: string;

  beforeEach(async () => {
    outDir = await mkdtemp(path.join(os.tmpdir(), 'workshop2-'));
  });
  afterEach(async () => {
    await rm(outDir, { recursive: true, force: true });
  });

  const files: GeneratedFile[] = [
    { path: 'pages/CheckoutPage.ts', contents: 'export class CheckoutPage {}' },
    { path: 'specs/checkout.spec.ts', contents: "import { test } from '@playwright/test';" },
  ];

  it('creates nested directories and writes both files', async () => {
    const written = await writeFiles(files, outDir);

    expect(written).toHaveLength(2);
    expect(await readFile(path.join(outDir, 'pages/CheckoutPage.ts'), 'utf8')).toBe(
      'export class CheckoutPage {}',
    );
    expect(await readFile(path.join(outDir, 'specs/checkout.spec.ts'), 'utf8')).toContain(
      '@playwright/test',
    );
  });

  it('overwrites an existing file rather than appending to it', async () => {
    await mkdir(path.join(outDir, 'pages'), { recursive: true });
    await writeFile(path.join(outDir, 'pages/CheckoutPage.ts'), 'STALE CONTENT', 'utf8');

    await writeFiles(files, outDir);

    const after = await readFile(path.join(outDir, 'pages/CheckoutPage.ts'), 'utf8');
    expect(after).toBe('export class CheckoutPage {}');
    expect(after).not.toContain('STALE');
  });

  it('refuses to write outside the output directory', async () => {
    // The model controls these paths. Treat them as untrusted input.
    for (const escape of ['../escaped.ts', '../../etc/evil.ts', '/tmp/absolute.ts']) {
      await expect(writeFiles([{ path: escape, contents: 'x' }], outDir)).rejects.toThrow(
        /Refusing to write outside/,
      );
    }
  });
});

describe('readExisting — the before side of the HITL diff', () => {
  let outDir: string;

  beforeEach(async () => {
    outDir = await mkdtemp(path.join(os.tmpdir(), 'workshop2-'));
  });
  afterEach(async () => {
    await rm(outDir, { recursive: true, force: true });
  });

  it('reports a missing file as absent, not as empty', async () => {
    const existing = await readExisting([{ path: 'specs/new.spec.ts', contents: 'x' }], outDir);

    // Absent must be undefined, not '': sprint 3 branches on it to decide
    // between "(new file)" and "(rewrite)".
    expect(existing['specs/new.spec.ts']).toBeUndefined();
    expect(Object.keys(existing)).toHaveLength(0);
  });

  it('round-trips what writeFiles just wrote', async () => {
    const file: GeneratedFile = { path: 'specs/checkout.spec.ts', contents: 'line one\nline two' };

    expect(await readExisting([file], outDir)).toEqual({});
    await writeFiles([file], outDir);
    expect(await readExisting([file], outDir)).toEqual({
      'specs/checkout.spec.ts': 'line one\nline two',
    });
  });
});
