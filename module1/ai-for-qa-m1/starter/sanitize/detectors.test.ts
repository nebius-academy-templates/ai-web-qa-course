import { expect, test } from 'vitest';
import { findMatches, luhnValid } from './detectors.ts';

const kinds = (t: string) => findMatches(t).map((m) => m.kind);

test('luhnValid accepts a valid test card and rejects a typo', () => {
  expect(luhnValid('4000001234567899')).toBe(true);
  expect(luhnValid('4000001234567890')).toBe(false);
});
test('email', () => {
  expect(kinds('contact hannah.brooks@techshop-demo.com now')).toEqual(['email']);
  expect(kinds('no address here')).toEqual([]);
});
test('phone', () => {
  expect(kinds('call +44 7700 900101')).toEqual(['phone']);
  expect(kinds('order 12345')).toEqual([]);
});
test('uuid, including a version 7 UUID', () => {
  expect(kinds('ref 018f3b2e-7c41-7a52-9d0e-3b6f1c2a4d58')).toEqual(['uuid']);
  expect(kinds('ref 123e4567-e89b-12d3-a456-426614174000')).toEqual(['uuid']);
});
test('ip', () => {
  expect(kinds('from 203.0.113.42')).toEqual(['ip']);
  expect(kinds('version 1.2.3')).toEqual([]);
});
test('card only when Luhn-valid', () => {
  expect(kinds('card 4000 0012 3456 7899')).toEqual(['card']);
  expect(kinds('card 4000 0012 3456 7890')).toEqual([]);
});
