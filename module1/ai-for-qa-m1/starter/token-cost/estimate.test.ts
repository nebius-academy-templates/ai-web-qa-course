import { expect, test } from 'vitest';
import { countWords, estimateTokens, charsOver4 } from './estimate.ts';

test('countWords ignores extra whitespace and blanks', () => {
  expect(countWords('  one  two\nthree\t four ')).toBe(4);
  expect(countWords('')).toBe(0);
});
test('estimateTokens: 8 words is about 11 tokens (lesson 1.3.1 example)', () => {
  expect(estimateTokens(8)).toBe(11);
  expect(estimateTokens(100)).toBe(133);
});
test('charsOver4 rounds characters / 4', () => {
  expect(charsOver4('Error: locator.click: Timeout 30000ms exceeded.')).toBe(12);
});
