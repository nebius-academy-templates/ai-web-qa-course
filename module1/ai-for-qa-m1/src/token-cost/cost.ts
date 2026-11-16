// Part 2: cost projection. Rates come from rates.json, never from the code.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export interface TierRate {
  inputPerMillion: number;
  outputPerMillion: number;
}
export interface Rates {
  currency: string;
  tiers: Record<string, TierRate>;
  engineerHourlyRate: number;
  sprintsPerYear: number;
  wordsPerToken: number;
}

export function loadRates(path?: string): Rates {
  const file = path ?? join(dirname(fileURLToPath(import.meta.url)), 'rates.json');
  return JSON.parse(readFileSync(file, 'utf8')) as Rates;
}

export interface CostResult {
  tier: string;
  currency: string;
  costPerCall: number;
  callsPerSprint: number;
  costPerSprint: number;
}

export function projectCost(
  inputTokens: number,
  outputTokens: number,
  tier: string,
  callsPerSprint: number,
  rates: Rates,
): CostResult {
  const rate = rates.tiers[tier];
  if (!rate) throw new Error(`unknown tier "${tier}" (known: ${Object.keys(rates.tiers).join(', ')})`);
  const costPerCall = (inputTokens * rate.inputPerMillion + outputTokens * rate.outputPerMillion) / 1_000_000;
  return {
    tier,
    currency: rates.currency,
    costPerCall,
    callsPerSprint,
    costPerSprint: costPerCall * callsPerSprint,
  };
}
