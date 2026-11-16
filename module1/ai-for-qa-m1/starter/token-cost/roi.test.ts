import { expect, test } from 'vitest';
import { computeRoi } from './roi.ts';

const base = { manualMinutesPerItem: 6, reviewMinutesPerItem: 1.5, setupHours: 16, maintenanceHoursPerMonth: 1, tokenCostInHours: 0.01 };
const near = (a: number, b: number, tol = 0.01) => expect(Math.abs(a - b) <= tol, `${a} vs ${b}`).toBeTruthy();

test('60 items per sprint is net positive and pays back within a year', () => {
  const r = computeRoi({ ...base, itemsPerSprint: 60 });
  near(r.timeSavedHours, 4.5);
  near(r.maintenanceHoursPerSprint, 0.46);
  near(r.netHoursPerSprint, 4.03);
  expect(r.verdict).toBe('Positive');
});
test('15 items per sprint cannot cover maintenance: Negative, never pays back', () => {
  const r = computeRoi({ ...base, itemsPerSprint: 15, reviewMinutesPerItem: 4, maintenanceHoursPerMonth: 2 });
  expect(r.netHoursPerSprint <= 0).toBeTruthy();
  expect(r.paybackSprints).toBe(Infinity);
  expect(r.verdict).toBe('Negative');
});
test('slow payback (more than 26 sprints) is Neutral', () => {
  const r = computeRoi({ ...base, itemsPerSprint: 60, setupHours: 200 });
  expect(r.verdict).toBe('Neutral');
});
