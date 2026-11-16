// STARTER: the lesson 1.3.3 cost-benefit template as arithmetic. Everything is per sprint (two weeks).
// Run: npm run test:starter

export interface RoiInput {
  itemsPerSprint: number;
  manualMinutesPerItem: number;
  /** Minutes a human spends reading, verifying and fixing each AI output. */
  reviewMinutesPerItem: number;
  setupHours: number;
  maintenanceHoursPerMonth: number;
  /** Token cost per sprint, already converted to hours of engineer time. */
  tokenCostInHours: number;
}

export interface RoiResult {
  timeSavedHours: number;
  maintenanceHoursPerSprint: number;
  netHoursPerSprint: number;
  /** setupHours / net; Infinity when net is not positive. */
  paybackSprints: number;
  verdict: 'Positive' | 'Neutral' | 'Negative';
}

export const SPRINTS_PER_YEAR = 26;

export function computeRoi(input: RoiInput): RoiResult {
  // TODO 1: timeSavedHours = items * (manual - review) / 60
  // TODO 2: maintenanceHoursPerSprint = maintenanceHoursPerMonth / (SPRINTS_PER_YEAR / 12)
  // TODO 3: net = timeSaved - maintenance - tokenCostInHours
  // TODO 4: payback = setupHours / net, or Infinity when net <= 0
  // TODO 5: verdict: Negative if net <= 0; Neutral if payback > SPRINTS_PER_YEAR; otherwise Positive
  throw new Error('TODO: computeRoi');
}
