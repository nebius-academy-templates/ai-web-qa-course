#!/usr/bin/env node
/**
 * ticket ID -> adapter -> SECURITY gate -> Claude -> SCHEMA gate -> HITL gate -> disk
 *
 * Each stage prints what it did. If a gate is still a stub it throws here,
 * loudly, naming the sprint — that is the intended experience on day one.
 */
import { getTicket } from './adapters/index.js';
import { loadConfig } from './config.js';
import { generate } from './generate.js';
import { maskPII, scaleWithFaker } from './gates/security.js';
import { validateOutput } from './gates/schema.js';
import { showDiffAndConfirm } from './gates/hitl.js';
import { readExisting, writeFiles } from './writeFiles.js';
import type { GeneratedFile, GenerationOutput } from './types.js';

const SYNTHETIC_USER_COUNT = 5;

function step(n: number, label: string): void {
  console.log(`\n[${n}/6] ${label}`);
}

async function main(): Promise<void> {
  const ticketId = process.argv[2];
  if (!ticketId) {
    console.error('Usage: npm start -- <TICKET-ID>      e.g. npm start -- TS-142');
    process.exitCode = 1;
    return;
  }

  // Fails here, before any network call, if the environment is wrong.
  const config = loadConfig();
  console.log(`source=${config.source}  model=${config.model}  output=${config.outputDir}`);

  step(1, `Fetching ${ticketId} via the ${config.source} adapter`);
  const ticket = await getTicket(ticketId, config.source);
  console.log(`  "${ticket.title}" — ${ticket.acceptanceCriteria.length} acceptance criteria, ` +
    `${ticket.attachments.length} attachment(s)`);

  step(2, 'SECURITY gate — masking PII');
  const { masked, report } = maskPII(ticket);
  const categories = Object.entries(report.byCategory)
    .map(([k, v]) => `${k}=${v}`)
    .join(' ');
  console.log(`  scanned ${report.fieldsScanned} fields, masked ${report.fieldsMasked}  (${categories})`);
  const users = scaleWithFaker(SYNTHETIC_USER_COUNT);
  console.log(`  ${users.length} synthetic users generated`);

  step(3, 'Generating with Claude');
  const raw = await generate(masked, users, config);

  step(4, 'SCHEMA gate — validating the response');
  const result = validateOutput(raw);
  if (!result.valid) {
    console.error('  rejected:');
    for (const err of result.errors) console.error(`    - ${err}`);
    process.exitCode = 1;
    return;
  }
  const output = raw as GenerationOutput;
  console.log(`  ok — ${output.testIds.length} test ids referenced`);

  step(5, 'HITL gate — review');
  const files: GeneratedFile[] = [output.pageObject, output.spec];
  const existing = await readExisting(files, config.outputDir);
  const decision = await showDiffAndConfirm(files, { existing });
  if (!decision.approved) {
    console.log(`  declined ("${decision.answer}") — nothing written`);
    return;
  }

  step(6, 'Writing files');
  for (const written of await writeFiles(files, config.outputDir)) {
    console.log(`  wrote ${written}`);
  }
}

main().catch((err: unknown) => {
  console.error(`\n✗ ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
