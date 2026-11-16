import { expect, test } from 'vitest';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { findMatches, luhnValid } from '../src/sanitize/detectors.ts';
import { Masker } from '../src/sanitize/mask.ts';
import { parseCsv, stringifyCsv } from '../src/sanitize/csv.ts';
import { scan, residualOriginals } from '../src/sanitize/scan.ts';
import type { Kind } from '../src/sanitize/types.ts';

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const kinds = (text: string): Kind[] => findMatches(text).map((m) => m.kind);

// ---- detectors: one positive and one negative each ------------------------------------------

test('email: detects an address, ignores text without a domain', () => {
  expect(kinds('contact jane.smith@company.com today')).toEqual(['email']);
  expect(kinds('write to jane.smith@ later')).toEqual([]);
});

test('phone: detects E.164, UK local and no-plus forms, ignores a date', () => {
  expect(kinds('+447700900123')).toEqual(['phone']);
  expect(kinds('call 07700 900449 now')).toEqual(['phone']);
  expect(kinds('447700900122')).toEqual(['phone']);
  expect(kinds('built on 2026-10-05')).toEqual([]);
});

test('uuid: detects any version including v7, ignores a truncated id', () => {
  expect(kinds('0e76ea3e-17de-7177-80a2-7adc2f7186d8')).toEqual(['uuid']);
  expect(kinds('550e8400-e29b-41d4-a716')).toEqual([]);
});

test('ip: detects an IPv4 address, ignores an out-of-range or short one', () => {
  expect(kinds('from 192.168.14.23 today')).toEqual(['ip']);
  expect(kinds('version 999.1.1.1 and 1.2.3')).toEqual([]);
});

test('national id: detects US SSN and UK NI shapes, ignores a wrong grouping', () => {
  expect(kinds('456-72-8912')).toEqual(['national-id']);
  expect(kinds('AB123456C')).toEqual(['national-id']);
  expect(kinds('12-345-6789 and AB1234C')).toEqual([]);
});

test('card: detects a Luhn-valid number, ignores one that fails the Luhn check', () => {
  expect(kinds('card 4111 1111 1111 1111')).toEqual(['card']);
  expect(kinds('card 4111 1111 1111 1112')).toEqual([]);
  expect(luhnValid('4111111111111111')).toBe(true);
});

test('api key: detects prefixed and AKIA keys, ignores a short token', () => {
  expect(kinds('key tsk_live_8Fq2Jw9XmP4rZc7LbN1vKd5HyT3aGe6U_SYNTHETIC')).toEqual(['api-key']);
  expect(kinds('AKIAIOSFODNN7EXAMPLE')).toEqual(['api-key']);
  expect(kinds('tsk_live_short')).toEqual([]);
});

test('prefixed ids: customer, order and session ids are found, a bare word is not', () => {
  expect(kinds('CUST-20931 ORD-778214 sess_9f3c71a2e4b84d06')).toEqual(['customer-id', 'order-number', 'session-id']);
  expect(kinds('customer order session')).toEqual([]);
});

test('url credentials: detects user:password in a connection string, ignores a URL without credentials', () => {
  expect(kinds('postgres://qa_runner:Stg-Pa55w0rd-SYNTH@db-staging-02.internal.corp:5432/db')).toEqual(['url-credentials', 'internal-host']);
  expect(kinds('https://example.com/path')).toEqual([]);
});

test('internal host: detects .internal/.corp style hostnames, ignores a public one', () => {
  expect(kinds('BASE_URL: https://shop-staging.internal.corp')).toEqual(['internal-host']);
  expect(kinds('https://www.techshop-demo.com')).toEqual([]);
});

test('masked internal host is not flagged again, so masked output re-scans clean', () => {
  const m = new Masker();
  const out = m.mask('internal-host', 'shop-staging.internal.corp');
  expect(kinds(out)).toEqual([]);
  expect(out).toMatch(/^[a-z0-9-]+(\.[a-z0-9-]+)+$/);
});

test('sample 2: key, database credentials and both internal hostnames are masked', () => {
  const text = read('data/1-2-2-samples/sample-2-ci-config.yml');
  const result = scan(text, 'text');
  for (const secret of ['tsk_live_8Fq2Jw9XmP4rZc7LbN1vKd5HyT3aGe6U_SYNTHETIC', 'Stg-Pa55w0rd-SYNTH', 'qa_runner', 'db-staging-02.internal.corp', 'shop-staging.internal.corp']) {
    expect(!result.masked.includes(secret), `${secret} must be masked`).toBeTruthy();
  }
  expect(result.masked).toMatch(/DATABASE_URL: postgres:\/\/testuser:\S+@\S+:5432\/techshop_staging/); // still a valid-looking URL
});

test('overlaps: an API key wins over the digits inside it', () => {
  expect(kinds('tsk_live_8Fq2Jw9XmP4rZc7LbN1vKd5HyT3aGe6U_SYNTHETIC')).toEqual(['api-key']);
});

// ---- format-preserving masking --------------------------------------------------------------

test('masked email is still a valid email and differs from the original', () => {
  const m = new Masker();
  const out = m.mask('email', 'jane.smith@company.com');
  expect(out).toMatch(/^[\w.+-]+@[\w-]+\.[a-z]{2,}$/);
  expect(out).not.toBe('jane.smith@company.com');
});

test('masked phone keeps its separators, length and country code', () => {
  const m = new Masker();
  for (const p of ['+447700900123', '+1-415-555-0198', '+44 7700 900698', '07700 900449', '447700900122']) {
    const out = m.mask('phone', p);
    expect(out.length, p).toBe(p.length);
    expect([...out].map((c) => /\d/.test(c)), `shape of ${p}`).toEqual([...p].map((c) => /\d/.test(c)));
    expect(out).not.toBe(p);
  }
  expect(m.mask('phone', '+447700900123').startsWith('+447')).toBeTruthy();
  expect(m.mask('phone', '+1-415-555-0198').startsWith('+1-')).toBeTruthy();
});

test('masked uuid is still a uuid and keeps its version and variant', () => {
  const m = new Masker();
  const out = m.mask('uuid', '0e76ea3e-17de-7177-80a2-7adc2f7186d8');
  expect(out).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/);
});

test('masked card is Luhn-valid with the same length and grouping', () => {
  const m = new Masker();
  const out = m.mask('card', '4111 1111 1111 1111');
  expect(out).toMatch(/^\d{4} \d{4} \d{4} \d{4}$/);
  expect(luhnValid(out.replace(/ /g, ''))).toBe(true);
});

test('masked ip, national id and date keep their formats', () => {
  const m = new Masker();
  expect(m.mask('ip', '192.168.14.23')).toMatch(/^\d{1,3}(\.\d{1,3}){3}$/);
  expect(m.mask('national-id', '456-72-8912')).toMatch(/^\d{3}-\d{2}-\d{4}$/);
  expect(m.mask('national-id', 'AB123456C')).toMatch(/^[A-Z]{2}\d{6}[A-D]$/);
  const d = m.mask('dob', '1992-08-14');
  expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(!Number.isNaN(Date.parse(d))).toBeTruthy();
});

test('masking is deterministic for a salt and differs between salts', () => {
  expect(new Masker('a').mask('uuid', '0e76ea3e-17de-7177-80a2-7adc2f7186d8')).toBe(new Masker('a').mask('uuid', '0e76ea3e-17de-7177-80a2-7adc2f7186d8'));
  expect(new Masker('a').mask('ip', '10.0.0.1')).not.toBe(new Masker('b').mask('ip', '10.0.0.1'));
});

test('distinct emails stay distinct after masking (uniqueness is preserved)', () => {
  const m = new Masker();
  const outs = new Set(Array.from({ length: 500 }, (_, i) => m.mask('email', `user${i}@example.com`)));
  expect(outs.size).toBe(500);
});

// ---- csv ------------------------------------------------------------------------------------

test('csv round trip keeps quoted commas, quotes and empty cells', () => {
  const rows = [['a', 'b', 'c'], ['1', 'x, y', 'say "hi"'], ['', '', '']];
  expect(parseCsv(stringifyCsv(rows))).toEqual(rows);
});

// ---- whole-file behaviour ---------------------------------------------------------------------

test('customer-record.json: every identifier is masked and every value keeps its shape', () => {
  const original = JSON.parse(read('data/1-2-4-customer-record/customer-record.json'));
  const result = scan(read('data/1-2-4-customer-record/customer-record.json'), 'json');
  const out = JSON.parse(result.masked);
  expect(Object.keys(out)).toEqual(Object.keys(original));

  const shapes: Record<string, RegExp> = {
    customerId: /^CUST-\d{5}$/,
    email: /^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/,
    phone: /^\+1-\d{3}-\d{3}-\d{4}$/,
    address: /^\d+ \w+ Street$/,
    postalCode: /^\d{5}$/,
    dateOfBirth: /^\d{4}-\d{2}-\d{2}$/,
    nationalId: /^\d{3}-\d{2}-\d{4}$/,
    accountNumber: /^\d{10}$/,
    ipAddress: /^\d{1,3}(\.\d{1,3}){3}$/,
    orderNumber: /^ORD-\d{6}$/,
  };
  for (const [k, re] of Object.entries(shapes)) expect(out[k], k).toMatch(re);

  expect(typeof out.purchaseAmount).toBe('number'); // the test asserts on a number
  expect(out.state).toBe(original.state); // clean fields are kept
  expect(out.orderDate).toBe(original.orderDate);
  for (const k of ['customerId', 'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode', 'dateOfBirth', 'nationalId', 'accountNumber', 'ipAddress', 'orderNumber', 'purchaseAmount']) {
    expect(out[k], `${k} must change`).not.toBe(original[k]);
  }
  expect(residualOriginals(result.masked, result.originals, result.produced)).toEqual([]);
});

test('log sample: email, customer id and session id are masked consistently', () => {
  const text = read('data/1-2-2-samples/sample-1-test-log.txt');
  const result = scan(text, 'text');
  expect(!result.masked.includes('hannah.brooks@techshop-demo.com')).toBeTruthy();
  expect(!result.masked.includes('CUST-20931')).toBeTruthy();
  expect(!result.masked.includes('sess_9f3c71a2e4b84d06')).toBeTruthy();
  const emails = new Set(result.masked.match(/testuser_\d{6}@example\.com/g));
  expect(emails.size, 'the same original email maps to one fake everywhere').toBe(1);
  expect(result.masked.split('\n').length).toBe(text.split('\n').length);
});

test('dirty users.csv: edge cases are caught', () => {
  const text = read('data/dirty/users.csv');
  const result = scan(text, 'csv');
  const orig = parseCsv(text);
  const out = parseCsv(result.masked);
  const col = (name: string) => orig[0].indexOf(name);

  expect(out.length, 'row count unchanged').toBe(orig.length);
  // phone number written without the +
  const noPlus = orig.findIndex((r, i) => i > 0 && /^447\d{9}$/.test(r[col('phone')]));
  expect(noPlus > 0).toBeTruthy();
  expect(out[noPlus][col('phone')]).not.toBe(orig[noPlus][col('phone')]);
  // v7 UUID in an innocuous column
  const v7 = orig.findIndex((r, i) => i > 0 && /-7[0-9a-f]{3}-/.test(r[col('ref_code')]));
  expect(v7 > 0).toBeTruthy();
  expect(out[v7][col('ref_code')]).not.toBe(orig[v7][col('ref_code')]);
  // email inside a free-text note
  const noted = orig.findIndex((r, i) => i > 0 && /\.alt@/.test(r[col('support_notes')]));
  expect(noted > 0).toBeTruthy();
  expect(!/\.alt@/.test(out[noted][col('support_notes')])).toBeTruthy();
  // rows with a missing field survive untouched
  const missing = orig.findIndex((r, i) => i > 0 && r[col('email')] === '');
  expect(out[missing][col('email')]).toBe('');
  // first names (including non-ASCII ones) must not survive in notes
  expect(residualOriginals(result.masked, result.originals, result.produced)).toEqual([]);
});

test('dirty users.csv: the lesson starter regexes miss cases this scanner catches', () => {
  const text = read('data/dirty/users.csv');
  const lessonPhone = /\+\d{1,3}(?:[ -]?\d){7,14}\b/g;
  const lessonUuid = /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\b/g;
  const ours = { phone: 0, uuid: 0 };
  for (const line of text.split('\n')) for (const m of findMatches(line)) if (m.kind === 'phone' || m.kind === 'uuid') ours[m.kind]++;
  expect((text.match(lessonPhone) ?? []).length < ours.phone, 'lesson phone regex misses local and no-plus numbers').toBeTruthy();
  expect((text.match(lessonUuid) ?? []).length < ours.uuid, 'lesson uuid regex misses v7 uuids').toBeTruthy();
});

test('health wording is flagged for review, not rewritten', () => {
  const result = scan('note\nCustomer mentioned a disability.\n', 'text');
  expect(result.masked.includes('disability')).toBeTruthy();
  expect(result.findings.some((f) => f.kind === 'health-keyword' && !f.masked)).toBeTruthy();
});

// ---- exit codes -------------------------------------------------------------------------------

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const cliPath = fileURLToPath(new URL('../src/sanitize/cli.ts', import.meta.url));

// Runs the scanner CLI the same way `npm run sanitize` does: Node with the tsx loader.
function cli(...args: string[]) {
  return spawnSync(process.execPath, ['--import', 'tsx', cliPath, ...args], { encoding: 'utf8', cwd: projectRoot });
}

test('exit codes: 0 when fully masked, 2 in --check mode with findings, 3 when review items remain, 1 on error', () => {
  const dir = 'out/test';
  expect(cli('data/1-2-4-customer-record/customer-record.json', '--out', `${dir}/r.json`).status).toBe(0);
  expect(cli('data/1-2-4-customer-record/customer-record.json', '--check').status).toBe(2);
  expect(cli('data/dirty/users.csv', '--out', `${dir}/u.csv`).status).toBe(3);
  // The scanner cannot know a fixture is synthetic, so sample 3 is flagged too: telling safe from unsafe stays a human call.
  expect(cli('data/1-2-2-samples/sample-3-test-fixture.json', '--check').status).toBe(2);
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/clean.txt`, 'nothing sensitive here\n');
  expect(cli(`${dir}/clean.txt`, '--check').status).toBe(0);
  expect(cli('does-not-exist.json').status).toBe(1);
});
