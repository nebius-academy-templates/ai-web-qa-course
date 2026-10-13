import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findMatches, luhnValid } from './detectors.ts';

const kinds = (t: string) => findMatches(t).map((m) => m.kind);

test('luhnValid accepts a valid test card and rejects a typo', () => {
  assert.equal(luhnValid('4000001234567899'), true);
  assert.equal(luhnValid('4000001234567890'), false);
});
test('email', () => {
  assert.deepEqual(kinds('contact hannah.brooks@techshop-demo.com now'), ['email']);
  assert.deepEqual(kinds('no address here'), []);
});
test('phone', () => {
  assert.deepEqual(kinds('call +44 7700 900101'), ['phone']);
  assert.deepEqual(kinds('order 12345'), []);
});
test('uuid, including a version 7 UUID', () => {
  assert.deepEqual(kinds('ref 018f3b2e-7c41-7a52-9d0e-3b6f1c2a4d58'), ['uuid']);
  assert.deepEqual(kinds('ref 123e4567-e89b-12d3-a456-426614174000'), ['uuid']);
});
test('ip', () => {
  assert.deepEqual(kinds('from 203.0.113.42'), ['ip']);
  assert.deepEqual(kinds('version 1.2.3'), []);
});
test('card only when Luhn-valid', () => {
  assert.deepEqual(kinds('card 4000 0012 3456 7899'), ['card']);
  assert.deepEqual(kinds('card 4000 0012 3456 7890'), []);
});
