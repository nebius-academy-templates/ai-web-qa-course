import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maskEmail, maskOrderNumber } from './mask.ts';

test('maskEmail returns a valid email that is not the original', () => {
  const m = maskEmail('hannah.brooks@techshop-demo.com');
  assert.match(m, /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
  assert.notEqual(m, 'hannah.brooks@techshop-demo.com');
});
test('maskEmail is deterministic and keeps different inputs different', () => {
  assert.equal(maskEmail('a@x.com'), maskEmail('a@x.com'));
  assert.notEqual(maskEmail('a@x.com'), maskEmail('b@x.com'));
});
test('maskOrderNumber keeps the shape', () => {
  const m = maskOrderNumber('ORD-905512');
  assert.match(m, /^ORD-\d{6}$/);
  assert.notEqual(m, 'ORD-905512');
});
