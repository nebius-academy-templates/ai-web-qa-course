import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { countWords, estimateTokens, estimateText } from '../src/token-cost/estimate.ts';
import { loadRates, projectCost } from '../src/token-cost/cost.ts';
import { computeRoi, type RoiInput } from '../src/token-cost/roi.ts';

const rates = loadRates();
const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const example = (name: string) => JSON.parse(read(`examples/${name}.json`)) as RoiInput;

test('countWords splits on any whitespace and ignores blanks', () => {
  assert.equal(countWords('  one  two\nthree\t four '), 4);
  assert.equal(countWords(''), 0);
});

test('estimateTokens applies the 0.75 words-per-token rule', () => {
  assert.equal(estimateTokens(9), 12); // lesson: 9 words -> about 12 tokens
  assert.equal(estimateTokens(100), 133);
});

test('prompt files reproduce the numbers in data/token-cost-estimate/MANIFEST.md', () => {
  const manifest = read('data/token-cost-estimate/MANIFEST.md');
  for (const [file, label] of [['a', 'A'], ['b', 'B'], ['c', 'C']] as const) {
    const est = estimateText(read(`data/token-cost-estimate/prompt-${file}.txt`));
    const row = manifest.split('\n').find((l) => l.startsWith(`| ${label} |`));
    assert.ok(row, `manifest row for ${label}`);
    const cells = row.split('|').map((c) => c.trim());
    assert.equal(Number(cells[2]), est.words, `${label} words`);
    assert.equal(Number(cells[4]), est.estimatedTokens, `${label} tokens`);
  }
});

test('projectCost uses rates from config and scales with calls', () => {
  const one = projectCost(1_000_000, 0, 'mid', 1, rates);
  assert.equal(one.costPerCall, rates.tiers.mid.inputPerMillion);
  const many = projectCost(1000, 1000, 'light', 10, rates);
  assert.ok(Math.abs(many.costPerSprint - many.costPerCall * 10) < 1e-12);
});

test('projectCost rejects an unknown tier', () => {
  assert.throws(() => projectCost(1, 1, 'nope', 1, rates), /unknown tier/);
});

test('output tokens cost more than input tokens in every configured tier', () => {
  for (const [name, t] of Object.entries(rates.tiers)) {
    assert.ok(t.outputPerMillion > t.inputPerMillion, name);
  }
});

test('locator demo at the lesson volume (60 per sprint) is positive with a slow payback', () => {
  const r = computeRoi(example('locator-demo-lesson-volume'), rates);
  assert.equal(r.timeSavedHours, 2.25);
  assert.equal(r.maintenanceHoursPerSprint, 0.92);
  assert.equal(r.verdict, 'Positive');
  assert.ok(r.paybackSprints > 11 && r.paybackSprints < 13, `payback ${r.paybackSprints}`);
});

test('locator demo at the brief volume (15 per sprint) is negative: maintenance exceeds the saving', () => {
  const r = computeRoi(example('locator-demo-brief-volume'), rates);
  assert.ok(r.timeSavedHours < r.maintenanceHoursPerSprint);
  assert.equal(r.verdict, 'Negative');
  assert.equal(r.paybackSprints, Infinity);
});

test('break-even volume for the locator workflow is about 25 locators per sprint', () => {
  const r = computeRoi(example('locator-demo-lesson-volume'), rates);
  assert.ok(r.breakEvenItemsPerSprint > 24 && r.breakEvenItemsPerSprint < 26);
});

test('condition 2 fails when review takes longer than the manual task', () => {
  const r = computeRoi({ ...example('locator-demo-lesson-volume'), reviewMinutesPerItem: 4 }, rates);
  assert.equal(r.conditions.reviewFasterThanManual.pass, false);
  assert.equal(r.verdict, 'Negative');
});

test('condition 3 is reported as not assessed when the learner gives no judgement', () => {
  const { contextStable: _omit, ...rest } = example('locator-demo-lesson-volume');
  const r = computeRoi(rest as RoiInput, rates);
  assert.equal(r.conditions.contextStable.pass, null);
});
