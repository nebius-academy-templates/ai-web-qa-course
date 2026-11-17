/**
 * Shared plumbing for the Stage 1 contrast demo.
 *
 * Both runs go through this so the two capture files are structurally
 * identical and `diff` shows only what the gate changed — nothing else.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYSTEM_PROMPT, generate, renderTicket } from '../../src/generate.js';
import { loadConfig } from '../../src/config.js';
import type { SyntheticUser, TicketData } from '../../src/types.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const OUTPUT_DIR = path.join(here, 'output');

const BAR = '='.repeat(78);

export function heading(text: string): void {
  console.log(`\n${BAR}\n${text}\n${BAR}`);
}

/**
 * Builds the exact text that would go to the API — system prompt and user
 * message, assembled by the pipeline's own renderTicket(), not a copy of it.
 */
export function buildPrompt(ticket: TicketData, users: SyntheticUser[]): string {
  return [
    '########## SYSTEM PROMPT ##########',
    SYSTEM_PROMPT,
    '',
    '########## USER MESSAGE ##########',
    renderTicket(ticket, users),
    '',
  ].join('\n');
}

export async function capture(fileName: string, prompt: string): Promise<string> {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const full = path.join(OUTPUT_DIR, fileName);
  await writeFile(full, prompt, 'utf8');
  return full;
}

/** True when a real API call is possible. */
export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

/**
 * Runs the generation call, but only if a key is present.
 *
 * The contrast this demo exists to show is entirely in the prompt, and the
 * prompt is assembled locally — so the demo is fully rehearsable at zero cost.
 * The live call is the optional half.
 */
export async function maybeGenerate(
  ticket: TicketData,
  users: SyntheticUser[],
): Promise<void> {
  if (!hasApiKey()) {
    heading('GENERATION CALL — SKIPPED');
    console.log('ANTHROPIC_API_KEY is not set, so no request was made and no');
    console.log('tokens were spent. The prompt above is still the exact text');
    console.log('that would have been sent.\n');
    console.log('To make the live call:  export ANTHROPIC_API_KEY=sk-ant-...');
    return;
  }

  heading('GENERATION CALL — LIVE (this spends tokens)');
  const config = loadConfig();
  console.log(`model=${config.model}`);
  const payload = await generate(ticket, users, config);
  console.log('\n--- what came back ---');
  console.log(JSON.stringify(payload, null, 2));
}
