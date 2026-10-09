import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countWords, estimateTokens, charsOver4 } from './estimate.ts';

test('countWords ignores extra whitespace and blanks', () => {
  assert.equal(countWords('  one  two\nthree\t four '), 4);
  assert.equal(countWords(''), 0);
});
test('estimateTokens: 9 words is about 12 tokens (lesson example)', () => {
  assert.equal(estimateTokens(9), 12);
  assert.equal(estimateTokens(100), 133);
});
test('charsOver4 rounds characters / 4', () => {
  assert.equal(charsOver4('Error: locator.click: Timeout 30000ms exceeded.'), 12);
});
