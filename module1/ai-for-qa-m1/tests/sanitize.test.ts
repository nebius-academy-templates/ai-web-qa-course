import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { findMatches, luhnValid } from '../src/sanitize/detectors.ts';
import { Masker } from '../src/sanitize/mask.ts';
import { parseCsv, stringifyCsv } from '../src/sanitize/csv.ts';
import { scan, residualOriginals } from '../src/sanitize/scan.ts';
import type { Kind } from '../src/sanitize/types.ts';

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const kinds = (text: string): Kind[] => findMatches(text).map((m) => m.kind);

// ---- detectors: one positive and one negative each ------------------------------------------

test('email: detects an address, ignores text without a domain', () => {
  assert.deepEqual(kinds('contact jane.smith@company.com today'), ['email']);
  assert.deepEqual(kinds('write to jane.smith@ later'), []);
});

test('phone: detects E.164, UK local and no-plus forms, ignores a date', () => {
  assert.deepEqual(kinds('+447700900123'), ['phone']);
  assert.deepEqual(kinds('call 07700 900449 now'), ['phone']);
  assert.deepEqual(kinds('447700900122'), ['phone']);
  assert.deepEqual(kinds('built on 2026-10-05'), []);
});

test('uuid: detects any version including v7, ignores a truncated id', () => {
  assert.deepEqual(kinds('0e76ea3e-17de-7177-80a2-7adc2f7186d8'), ['uuid']);
  assert.deepEqual(kinds('550e8400-e29b-41d4-a716'), []);
});

test('ip: detects an IPv4 address, ignores an out-of-range or short one', () => {
  assert.deepEqual(kinds('from 192.168.14.23 today'), ['ip']);
  assert.deepEqual(kinds('version 999.1.1.1 and 1.2.3'), []);
});

test('national id: detects US SSN and UK NI shapes, ignores a wrong grouping', () => {
  assert.deepEqual(kinds('456-72-8912'), ['national-id']);
  assert.deepEqual(kinds('AB123456C'), ['national-id']);
  assert.deepEqual(kinds('12-345-6789 and AB1234C'), []);
});

test('card: detects a Luhn-valid number, ignores one that fails the Luhn check', () => {
  assert.deepEqual(kinds('card 4111 1111 1111 1111'), ['card']);
  assert.deepEqual(kinds('card 4111 1111 1111 1112'), []);
  assert.equal(luhnValid('4111111111111111'), true);
});

test('api key: detects prefixed and AKIA keys, ignores a short token', () => {
  assert.deepEqual(kinds('key tsk_live_8Fq2Jw9XmP4rZc7LbN1vKd5HyT3aGe6U_SYNTHETIC'), ['api-key']);
  assert.deepEqual(kinds('AKIAIOSFODNN7EXAMPLE'), ['api-key']);
  assert.deepEqual(kinds('tsk_live_short'), []);
});

test('prefixed ids: customer, order and session ids are found, a bare word is not', () => {
  assert.deepEqual(kinds('CUST-20931 ORD-778214 sess_9f3c71a2e4b84d06'), ['customer-id', 'order-number', 'session-id']);
  assert.deepEqual(kinds('customer order session'), []);
});

test('url credentials: detects user:password in a connection string, ignores a URL without credentials', () => {
  assert.deepEqual(kinds('postgres://qa_runner:Stg-Pa55w0rd-SYNTH@db-staging-02.internal.corp:5432/db'), ['url-credentials', 'internal-host']);
  assert.deepEqual(kinds('https://example.com/path'), []);
});

test('internal host: detects .internal/.corp style hostnames, ignores a public one', () => {
  assert.deepEqual(kinds('BASE_URL: https://shop-staging.internal.corp'), ['internal-host']);
  assert.deepEqual(kinds('https://www.techshop-demo.com'), []);
});

test('masked internal host is not flagged again, so masked output re-scans clean', () => {
  const m = new Masker();
  const out = m.mask('internal-host', 'shop-staging.internal.corp');
  assert.deepEqual(kinds(out), []);
  assert.match(out, /^[a-z0-9-]+(\.[a-z0-9-]+)+$/);
});

test('sample 2: key, database credentials and both internal hostnames are masked', () => {
  const text = read('data/data-classification/sample-2-ci-config.yml');
  const result = scan(text, 'text');
  for (const secret of ['tsk_live_8Fq2Jw9XmP4rZc7LbN1vKd5HyT3aGe6U_SYNTHETIC', 'Stg-Pa55w0rd-SYNTH', 'qa_runner', 'db-staging-02.internal.corp', 'shop-staging.internal.corp']) {
    assert.ok(!result.masked.includes(secret), `${secret} must be masked`);
  }
  assert.match(result.masked, /DATABASE_URL: postgres:\/\/testuser:\S+@\S+:5432\/techshop_staging/); // still a valid-looking URL
});

test('overlaps: an API key wins over the digits inside it', () => {
  assert.deepEqual(kinds('tsk_live_8Fq2Jw9XmP4rZc7LbN1vKd5HyT3aGe6U_SYNTHETIC'), ['api-key']);
});

// ---- format-preserving masking --------------------------------------------------------------

test('masked email is still a valid email and differs from the original', () => {
  const m = new Masker();
  const out = m.mask('email', 'jane.smith@company.com');
  assert.match(out, /^[\w.+-]+@[\w-]+\.[a-z]{2,}$/);
  assert.notEqual(out, 'jane.smith@company.com');
});

test('masked phone keeps its separators, length and country code', () => {
  const m = new Masker();
  for (const p of ['+447700900123', '+1-415-555-0198', '+44 7700 900698', '07700 900449', '447700900122']) {
    const out = m.mask('phone', p);
    assert.equal(out.length, p.length, p);
    assert.deepEqual([...out].map((c) => /\d/.test(c)), [...p].map((c) => /\d/.test(c)), `shape of ${p}`);
    assert.notEqual(out, p);
  }
  assert.ok(m.mask('phone', '+447700900123').startsWith('+447'));
  assert.ok(m.mask('phone', '+1-415-555-0198').startsWith('+1-'));
});

test('masked uuid is still a uuid and keeps its version and variant', () => {
  const m = new Masker();
  const out = m.mask('uuid', '0e76ea3e-17de-7177-80a2-7adc2f7186d8');
  assert.match(out, /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/);
});

test('masked card is Luhn-valid with the same length and grouping', () => {
  const m = new Masker();
  const out = m.mask('card', '4111 1111 1111 1111');
  assert.match(out, /^\d{4} \d{4} \d{4} \d{4}$/);
  assert.equal(luhnValid(out.replace(/ /g, '')), true);
});

test('masked ip, national id and date keep their formats', () => {
  const m = new Masker();
  assert.match(m.mask('ip', '192.168.14.23'), /^\d{1,3}(\.\d{1,3}){3}$/);
  assert.match(m.mask('national-id', '456-72-8912'), /^\d{3}-\d{2}-\d{4}$/);
  assert.match(m.mask('national-id', 'AB123456C'), /^[A-Z]{2}\d{6}[A-D]$/);
  const d = m.mask('dob', '1992-08-14');
  assert.match(d, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(!Number.isNaN(Date.parse(d)));
});

test('masking is deterministic for a salt and differs between salts', () => {
  assert.equal(new Masker('a').mask('uuid', '0e76ea3e-17de-7177-80a2-7adc2f7186d8'), new Masker('a').mask('uuid', '0e76ea3e-17de-7177-80a2-7adc2f7186d8'));
  assert.notEqual(new Masker('a').mask('ip', '10.0.0.1'), new Masker('b').mask('ip', '10.0.0.1'));
});

test('distinct emails stay distinct after masking (uniqueness is preserved)', () => {
  const m = new Masker();
  const outs = new Set(Array.from({ length: 500 }, (_, i) => m.mask('email', `user${i}@example.com`)));
  assert.equal(outs.size, 500);
});

// ---- csv ------------------------------------------------------------------------------------

test('csv round trip keeps quoted commas, quotes and empty cells', () => {
  const rows = [['a', 'b', 'c'], ['1', 'x, y', 'say "hi"'], ['', '', '']];
  assert.deepEqual(parseCsv(stringifyCsv(rows)), rows);
});

// ---- whole-file behaviour ---------------------------------------------------------------------

test('customer-record.json: every identifier is masked and every value keeps its shape', () => {
  const original = JSON.parse(read('data/1-2-4-customer-record/customer-record.json'));
  const result = scan(read('data/1-2-4-customer-record/customer-record.json'), 'json');
  const out = JSON.parse(result.masked);
  assert.deepEqual(Object.keys(out), Object.keys(original));

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
  for (const [k, re] of Object.entries(shapes)) assert.match(out[k], re, k);

  assert.equal(typeof out.purchaseAmount, 'number'); // the test asserts on a number
  assert.equal(out.state, original.state); // clean fields are kept
  assert.equal(out.orderDate, original.orderDate);
  for (const k of ['customerId', 'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode', 'dateOfBirth', 'nationalId', 'accountNumber', 'ipAddress', 'orderNumber', 'purchaseAmount']) {
    assert.notEqual(out[k], original[k], `${k} must change`);
  }
  assert.deepEqual(residualOriginals(result.masked, result.originals, result.produced), []);
});

test('log sample: email, customer id and session id are masked consistently', () => {
  const text = read('data/data-classification/sample-1-test-log.txt');
  const result = scan(text, 'text');
  assert.ok(!result.masked.includes('hannah.brooks@techshop-demo.com'));
  assert.ok(!result.masked.includes('CUST-20931'));
  assert.ok(!result.masked.includes('sess_9f3c71a2e4b84d06'));
  const emails = new Set(result.masked.match(/testuser_\d{6}@example\.com/g));
  assert.equal(emails.size, 1, 'the same original email maps to one fake everywhere');
  assert.equal(result.masked.split('\n').length, text.split('\n').length);
});

test('dirty users.csv: edge cases are caught', () => {
  const text = read('data/dirty/users.csv');
  const result = scan(text, 'csv');
  const orig = parseCsv(text);
  const out = parseCsv(result.masked);
  const col = (name: string) => orig[0].indexOf(name);

  assert.equal(out.length, orig.length, 'row count unchanged');
  // phone number written without the +
  const noPlus = orig.findIndex((r, i) => i > 0 && /^447\d{9}$/.test(r[col('phone')]));
  assert.ok(noPlus > 0);
  assert.notEqual(out[noPlus][col('phone')], orig[noPlus][col('phone')]);
  // v7 UUID in an innocuous column
  const v7 = orig.findIndex((r, i) => i > 0 && /-7[0-9a-f]{3}-/.test(r[col('ref_code')]));
  assert.ok(v7 > 0);
  assert.notEqual(out[v7][col('ref_code')], orig[v7][col('ref_code')]);
  // email inside a free-text note
  const noted = orig.findIndex((r, i) => i > 0 && /\.alt@/.test(r[col('support_notes')]));
  assert.ok(noted > 0);
  assert.ok(!/\.alt@/.test(out[noted][col('support_notes')]));
  // rows with a missing field survive untouched
  const missing = orig.findIndex((r, i) => i > 0 && r[col('email')] === '');
  assert.equal(out[missing][col('email')], '');
  // first names (including non-ASCII ones) must not survive in notes
  assert.deepEqual(residualOriginals(result.masked, result.originals, result.produced), []);
});

test('dirty users.csv: the lesson starter regexes miss cases this scanner catches', () => {
  const text = read('data/dirty/users.csv');
  const lessonPhone = /\+\d{1,3}(?:[ -]?\d){7,14}\b/g;
  const lessonUuid = /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\b/g;
  const ours = { phone: 0, uuid: 0 };
  for (const line of text.split('\n')) for (const m of findMatches(line)) if (m.kind === 'phone' || m.kind === 'uuid') ours[m.kind]++;
  assert.ok((text.match(lessonPhone) ?? []).length < ours.phone, 'lesson phone regex misses local and no-plus numbers');
  assert.ok((text.match(lessonUuid) ?? []).length < ours.uuid, 'lesson uuid regex misses v7 uuids');
});

test('health wording is flagged for review, not rewritten', () => {
  const result = scan('note\nCustomer mentioned a disability.\n', 'text');
  assert.ok(result.masked.includes('disability'));
  assert.ok(result.findings.some((f) => f.kind === 'health-keyword' && !f.masked));
});

// ---- exit codes -------------------------------------------------------------------------------

function cli(...args: string[]) {
  return spawnSync(process.execPath, [new URL('../src/sanitize/cli.ts', import.meta.url).pathname, ...args], { encoding: 'utf8', cwd: new URL('..', import.meta.url).pathname });
}

test('exit codes: 0 when fully masked, 2 in --check mode with findings, 3 when review items remain, 1 on error', () => {
  const dir = 'out/test';
  assert.equal(cli('data/1-2-4-customer-record/customer-record.json', '--out', `${dir}/r.json`).status, 0);
  assert.equal(cli('data/1-2-4-customer-record/customer-record.json', '--check').status, 2);
  assert.equal(cli('data/dirty/users.csv', '--out', `${dir}/u.csv`).status, 3);
  // The scanner cannot know a fixture is synthetic, so sample 3 is flagged too: telling safe from unsafe stays a human call.
  assert.equal(cli('data/data-classification/sample-3-test-fixture.json', '--check').status, 2);
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/clean.txt`, 'nothing sensitive here\n');
  assert.equal(cli(`${dir}/clean.txt`, '--check').status, 0);
  assert.equal(cli('does-not-exist.json').status, 1);
});
