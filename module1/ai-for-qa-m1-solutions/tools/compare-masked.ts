// Checks a masked customer record against the reference masked record: same keys and order,
// every identifier changed, every value in the same shape, task fields still typed correctly.
// Usage: node tools/compare-masked.ts <masked.json> [original.json]
import { readFileSync } from 'node:fs';

const [maskedPath, originalPath = '../ai-for-qa-m1/data/1-2-4-customer-record/customer-record.json'] = process.argv.slice(2);
if (!maskedPath) {
  console.error('usage: node tools/compare-masked.ts <masked.json> [original.json]');
  process.exit(1);
}
const load = (p: string) => JSON.parse(readFileSync(p, 'utf8')) as Record<string, string | number>;
const original = load(originalPath);
const reference = load(new URL('../solutions/1-2-4-masked-record.json', import.meta.url).pathname);
const candidate = load(maskedPath);

// Shape of a value: digits -> 9, letters -> a / A, everything else kept.
const shape = (v: string | number) => String(v).replace(/[0-9]/g, '9').replace(/[a-z]/g, 'a').replace(/[A-Z]/g, 'A');
const SAME_VALUE = new Set(['state', 'orderDate']); // clean fields: keeping them is correct
const SHAPE_STRICT = new Set(['customerId', 'email', 'phone', 'nationalId', 'accountNumber', 'ipAddress', 'orderNumber', 'dateOfBirth', 'postalCode']);

const problems: string[] = [];
if (JSON.stringify(Object.keys(candidate)) !== JSON.stringify(Object.keys(reference))) problems.push('keys or key order differ from the reference');

for (const k of Object.keys(reference)) {
  const c = candidate[k];
  if (c === undefined) {
    problems.push(`${k}: missing`);
    continue;
  }
  if (SAME_VALUE.has(k)) {
    if (c !== original[k]) problems.push(`${k}: a clean field should be kept as-is`);
    continue;
  }
  if (c === original[k]) problems.push(`${k}: unchanged from the original`);
  if (typeof c !== typeof reference[k]) problems.push(`${k}: type ${typeof c}, expected ${typeof reference[k]}`);
  // email and IP lengths vary naturally, so compare their structure loosely
  if (SHAPE_STRICT.has(k) && !['email', 'ipAddress'].includes(k) && shape(c).length !== shape(reference[k]).length) problems.push(`${k}: shape ${shape(c)} differs from ${shape(reference[k])}`);
}
if (!/^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(String(candidate.email))) problems.push('email is not a valid email');
if (typeof candidate.purchaseAmount !== 'number') problems.push('purchaseAmount must stay a number');
if (!/^ORD-\d+$/.test(String(candidate.orderNumber))) problems.push('orderNumber must stay ORD- followed by digits');

if (problems.length) {
  console.log('DIFFERENCES FROM REFERENCE:\n- ' + problems.join('\n- '));
  process.exit(2);
}
console.log('matches the reference: same keys, all identifiers changed, shapes and types preserved');
