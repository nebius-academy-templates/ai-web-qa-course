import { expect, test } from 'vitest';
import { maskEmail, maskOrderNumber } from './mask.ts';

test('maskEmail returns a valid email that is not the original', () => {
  const m = maskEmail('hannah.brooks@techshop-demo.com');
  expect(m).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
  expect(m).not.toBe('hannah.brooks@techshop-demo.com');
});
test('maskEmail is deterministic and keeps different inputs different', () => {
  expect(maskEmail('a@x.com')).toBe(maskEmail('a@x.com'));
  expect(maskEmail('a@x.com')).not.toBe(maskEmail('b@x.com'));
});
test('maskOrderNumber keeps the shape', () => {
  const m = maskOrderNumber('ORD-905512');
  expect(m).toMatch(/^ORD-\d{6}$/);
  expect(m).not.toBe('ORD-905512');
});
