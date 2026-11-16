import { expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { countWords, estimateTokens, estimateText } from '../src/token-cost/estimate.ts';
import { loadRates, projectCost } from '../src/token-cost/cost.ts';
import { computeRoi, type RoiInput } from '../src/token-cost/roi.ts';

const rates = loadRates();
const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const example = (name: string) => JSON.parse(read(`examples/${name}.json`)) as RoiInput;

test('countWords splits on any whitespace and ignores blanks', () => {
  expect(countWords('  one  two\nthree\t four ')).toBe(4);
  expect(countWords('')).toBe(0);
});

test('estimateTokens applies the 0.75 words-per-token rule', () => {
  expect(estimateTokens(8)).toBe(11); // lesson 1.3.1 one-line prompt: 8 words -> about 11 tokens
  expect(estimateTokens(100)).toBe(133);
});

test('prompt files reproduce the numbers in data/1-3-2-prompts/MANIFEST.md', () => {
  const manifest = read('data/1-3-2-prompts/MANIFEST.md');
  for (const [file, label] of [['a', 'A'], ['b', 'B'], ['c', 'C']] as const) {
    const est = estimateText(read(`data/1-3-2-prompts/prompt-${file}.txt`));
    const row = manifest.split('\n').find((l) => l.startsWith(`| ${label} |`));
    expect(row, `manifest row for ${label}`).toBeDefined();
    const cells = row!.split('|').map((c) => c.trim());
    expect(Number(cells[2]), `${label} words`).toBe(est.words);
    expect(Number(cells[4]), `${label} tokens`).toBe(est.estimatedTokens);
  }
});

test('projectCost uses rates from config and scales with calls', () => {
  const one = projectCost(1_000_000, 0, 'mid', 1, rates);
  expect(one.costPerCall).toBe(rates.tiers.mid.inputPerMillion);
  const many = projectCost(1000, 1000, 'light', 10, rates);
  expect(Math.abs(many.costPerSprint - many.costPerCall * 10) < 1e-12).toBeTruthy();
});

test('projectCost rejects an unknown tier', () => {
  expect(() => projectCost(1, 1, 'nope', 1, rates)).toThrow(/unknown tier/);
});

test('output tokens cost more than input tokens in every configured tier', () => {
  for (const [name, t] of Object.entries(rates.tiers)) {
    expect(t.outputPerMillion > t.inputPerMillion, name).toBeTruthy();
  }
});

test('locator demo at the lesson volume (60 per sprint) is positive with a slow payback', () => {
  const r = computeRoi(example('locator-demo-lesson-volume'), rates);
  expect(r.timeSavedHours).toBe(2.25);
  expect(r.maintenanceHoursPerSprint).toBe(0.92);
  expect(r.verdict).toBe('Positive');
  expect(r.paybackSprints > 11 && r.paybackSprints < 13, `payback ${r.paybackSprints}`).toBeTruthy();
});

test('locator demo at the brief volume (15 per sprint) is negative: maintenance exceeds the saving', () => {
  const r = computeRoi(example('locator-demo-brief-volume'), rates);
  expect(r.timeSavedHours < r.maintenanceHoursPerSprint).toBeTruthy();
  expect(r.verdict).toBe('Negative');
  expect(r.paybackSprints).toBe(Infinity);
});

test('break-even volume for the locator workflow is about 25 locators per sprint', () => {
  const r = computeRoi(example('locator-demo-lesson-volume'), rates);
  expect(r.breakEvenItemsPerSprint > 24 && r.breakEvenItemsPerSprint < 26).toBeTruthy();
});

test('condition 2 fails when review takes longer than the manual task', () => {
  const r = computeRoi({ ...example('locator-demo-lesson-volume'), reviewMinutesPerItem: 4 }, rates);
  expect(r.conditions.reviewFasterThanManual.pass).toBe(false);
  expect(r.verdict).toBe('Negative');
});

test('condition 3 is reported as not assessed when the learner gives no judgement', () => {
  const { contextStable: _omit, ...rest } = example('locator-demo-lesson-volume');
  const r = computeRoi(rest as RoiInput, rates);
  expect(r.conditions.contextStable.pass).toBe(null);
});
