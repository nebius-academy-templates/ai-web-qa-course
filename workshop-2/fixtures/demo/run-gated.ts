#!/usr/bin/env node
/**
 * STAGE 1 — the same ticket, through the real security gate.
 *
 * Identical to run-gateless.ts in every respect except two calls: maskPII()
 * strips the personal data out, and scaleWithFaker() puts believable
 * synthetic values back in so the model still has realistic shapes to
 * generate against.
 *
 * Imports the reference implementation from .instructor/, because the
 * participant-facing src/gates/security.ts is still a throwing stub at this
 * point in the workshop.
 *
 *   npm run demo:gated
 */
import { getTicket } from '../../src/adapters/fixture.js';
import { maskPII, scaleWithFaker } from '../../.instructor/solution/gates/security.js';
import { buildPrompt, capture, heading, maybeGenerate } from './_shared.js';

const ticket = await getTicket('TS-142');

heading('TICKET AS LOADED — identical input to the gateless run');
console.log(`${ticket.id}: ${ticket.title}`);

const { masked, report } = maskPII(ticket);
const users = scaleWithFaker(3);

heading('MASKING REPORT');
console.log(`fieldsScanned : ${report.fieldsScanned}`);
console.log(`fieldsMasked  : ${report.fieldsMasked}`);
console.log('byCategory    :');
for (const [category, count] of Object.entries(report.byCategory)) {
  console.log(`  ${category.padEnd(8)} ${count}`);
}

const prompt = buildPrompt(masked, users);

heading('OUTGOING PROMPT — exactly what would hit the API');
console.log(prompt);

const written = await capture('gated-prompt.txt', prompt);
heading('CAPTURED');
console.log(written);

await maybeGenerate(masked, users);
