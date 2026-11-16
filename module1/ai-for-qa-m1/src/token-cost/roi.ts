// Part 3: the cost-benefit template from lesson 1.3.3, as arithmetic.
// Everything is per sprint (two weeks). Monthly figures are converted with sprintsPerYear / 12.
import type { Rates } from './cost.ts';
import { projectCost } from './cost.ts';

export interface RoiInput {
  name: string;
  /** Items (locators, test cases, triaged failures) handled per sprint. */
  itemsPerSprint: number;
  manualMinutesPerItem: number;
  /** Minutes a human spends per AI output: read, verify, correct. This is the HITL cost. */
  reviewMinutesPerItem: number;
  /** One-off hours before the workflow is productive. */
  setupHours: number;
  maintenanceHoursPerMonth: number;
  tokensInPerItem: number;
  tokensOutPerItem: number;
  tier: string;
  /** Gateway, hosting, licences etc. per sprint, in the rates currency. */
  toolingCostPerSprint?: number;
  /** Hours of rework avoided per sprint (0 if you have no history to support a number). */
  reworkHoursSavedPerSprint?: number;
  /** Learner's judgement for condition 3; undefined means "not assessed". */
  contextStable?: boolean;
}

export type Verdict = 'Positive' | 'Neutral' | 'Negative';

export interface RoiResult {
  name: string;
  manualHours: number;
  assistedHours: number;
  timeSavedHours: number;
  maintenanceHoursPerSprint: number;
  tokenCostPerSprint: number;
  toolingCostPerSprint: number;
  /** Token + tooling cost converted to engineer hours at the configured hourly rate. */
  moneyCostInHours: number;
  reworkHoursSavedPerSprint: number;
  netHoursPerSprint: number;
  netValuePerSprint: number;
  currency: string;
  /** Sprints until cumulative net saving covers setup; Infinity when net is not positive. */
  paybackSprints: number;
  /** Items per sprint below which the workflow loses time. */
  breakEvenItemsPerSprint: number;
  /** Review minutes per item above which the workflow loses time (setup ignored). */
  breakEvenReviewMinutes: number;
  verdict: Verdict;
  conditions: {
    setupJustified: { pass: boolean; why: string };
    reviewFasterThanManual: { pass: boolean; why: string };
    contextStable: { pass: boolean | null; why: string };
  };
}

const round = (n: number, dp = 2) => (Number.isFinite(n) ? Math.round(n * 10 ** dp) / 10 ** dp : n);

export function computeRoi(input: RoiInput, rates: Rates): RoiResult {
  const items = input.itemsPerSprint;
  const sprintsPerMonth = rates.sprintsPerYear / 12;

  const manualHours = (items * input.manualMinutesPerItem) / 60;
  const assistedHours = (items * input.reviewMinutesPerItem) / 60;
  const timeSavedHours = manualHours - assistedHours;

  const maintenanceHoursPerSprint = input.maintenanceHoursPerMonth / sprintsPerMonth;
  const tokenCostPerSprint = projectCost(input.tokensInPerItem, input.tokensOutPerItem, input.tier, items, rates).costPerSprint;
  const toolingCostPerSprint = input.toolingCostPerSprint ?? 0;
  const moneyCostInHours = (tokenCostPerSprint + toolingCostPerSprint) / rates.engineerHourlyRate;
  const rework = input.reworkHoursSavedPerSprint ?? 0;

  const overheadHours = maintenanceHoursPerSprint + moneyCostInHours;
  const netHoursPerSprint = timeSavedHours + rework - overheadHours;
  const netValuePerSprint = netHoursPerSprint * rates.engineerHourlyRate;
  const paybackSprints = netHoursPerSprint > 0 ? input.setupHours / netHoursPerSprint : Infinity;

  const savedMinutesPerItem = input.manualMinutesPerItem - input.reviewMinutesPerItem;
  const breakEvenItemsPerSprint = savedMinutesPerItem > 0 ? ((overheadHours - rework) * 60) / savedMinutesPerItem : Infinity;
  const breakEvenReviewMinutes = items > 0 ? input.manualMinutesPerItem - ((overheadHours - rework) * 60) / items : 0;

  const verdict: Verdict = netHoursPerSprint <= 0 ? 'Negative' : paybackSprints > rates.sprintsPerYear ? 'Neutral' : 'Positive';

  return {
    name: input.name,
    manualHours: round(manualHours),
    assistedHours: round(assistedHours),
    timeSavedHours: round(timeSavedHours),
    maintenanceHoursPerSprint: round(maintenanceHoursPerSprint),
    tokenCostPerSprint: round(tokenCostPerSprint, 3),
    toolingCostPerSprint: round(toolingCostPerSprint),
    moneyCostInHours: round(moneyCostInHours, 3),
    reworkHoursSavedPerSprint: round(rework),
    netHoursPerSprint: round(netHoursPerSprint),
    netValuePerSprint: round(netValuePerSprint),
    currency: rates.currency,
    paybackSprints: round(paybackSprints, 1),
    breakEvenItemsPerSprint: round(breakEvenItemsPerSprint, 1),
    breakEvenReviewMinutes: round(breakEvenReviewMinutes, 1),
    verdict,
    conditions: {
      setupJustified: {
        pass: Number.isFinite(paybackSprints) && paybackSprints <= rates.sprintsPerYear,
        why: Number.isFinite(paybackSprints)
          ? `setup of ${input.setupHours} h is recovered in ${round(paybackSprints, 1)} sprints (limit: ${rates.sprintsPerYear}, one year)`
          : `net saving per sprint is ${round(netHoursPerSprint)} h, so setup of ${input.setupHours} h is never recovered`,
      },
      reviewFasterThanManual: {
        pass: input.reviewMinutesPerItem < input.manualMinutesPerItem,
        why: `review ${input.reviewMinutesPerItem} min vs manual ${input.manualMinutesPerItem} min per item`,
      },
      contextStable: {
        pass: input.contextStable ?? null,
        why: input.contextStable === undefined ? 'not assessed: this is a judgement, not arithmetic' : input.contextStable ? 'judged stable' : 'judged unstable',
      },
    },
  };
}
