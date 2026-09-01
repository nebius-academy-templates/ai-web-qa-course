#!/usr/bin/env node
/**
 * STAGE 1 — the pipeline with NO security gate.
 *
 * Loads TS-142 the normal way and hands it straight to the generation call.
 * maskPII() and scaleWithFaker() are never invoked. Everything the customers
 * pasted into that ticket — two phone numbers, four email addresses, a full
 * card number, and the whole of users.csv — goes out verbatim.
 *
 * This is what "we'll add the security bit later" actually looks like.
 *
 *   npm run demo:gateless
 */
import { getTicket } from '../../src/adapters/fixture.js';
import { buildPrompt, capture, heading, maybeGenerate } from './_shared.js';

const ticket = await getTicket('TS-142');

heading('TICKET AS LOADED — no gate has touched this');
console.log(`${ticket.id}: ${ticket.title}`);
console.log(`fields: title, description, ${ticket.acceptanceCriteria.length} AC, ` +
  `${ticket.attachments.length} attachment(s)`);

// No maskPII(). No scaleWithFaker(). The raw ticket, and an empty synthetic
// block, because without the gate there is nothing to substitute in.
const prompt = buildPrompt(ticket, []);

heading('OUTGOING PROMPT — exactly what would hit the API');
console.log(prompt);

const written = await capture('gateless-prompt.txt', prompt);
heading('CAPTURED');
console.log(written);
console.log('\nThis file contains unmasked personal data by design.');
console.log('fixtures/demo/output/ is gitignored. Keep it that way.');

await maybeGenerate(ticket, []);
