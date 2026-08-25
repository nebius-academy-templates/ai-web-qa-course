#!/usr/bin/env node
/**
 * npm run smoke
 *
 * Proves the box is set up: dependencies resolve, TypeScript runs, the fixture
 * adapter returns a ticket, the gates are importable, and the checkpoints are
 * where the script expects them.
 *
 * Makes no network call and spends no tokens. A missing ANTHROPIC_API_KEY is
 * reported here as a warning, because you can do sprints 1-3 without one —
 * but `npm start` will refuse to run until it is set.
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getTicket } from '../src/adapters/index.js';
import { resolveSource } from '../src/config.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const PASS = '✓';
const FAIL = '✗';
const WARN = '!';

let failures = 0;
let warnings = 0;

function ok(label: string, detail = ''): void {
  console.log(`  ${PASS} ${label}${detail ? ` — ${detail}` : ''}`);
}
function bad(label: string, detail: string): void {
  failures += 1;
  console.log(`  ${FAIL} ${label} — ${detail}`);
}
function warn(label: string, detail: string): void {
  warnings += 1;
  console.log(`  ${WARN} ${label} — ${detail}`);
}

async function check(label: string, fn: () => Promise<string | void>): Promise<void> {
  try {
    ok(label, (await fn()) || '');
  } catch (err) {
    bad(label, err instanceof Error ? err.message.split('\n')[0]! : String(err));
  }
}

async function main(): Promise<void> {
  console.log('\nworkshop-2 smoke test — no API calls, no tokens spent\n');

  console.log('environment');
  ok('node', process.version);
  await check('TICKET_SOURCE', async () => `${resolveSource()} (default: fixture)`);
  if (process.env.ANTHROPIC_API_KEY?.trim()) {
    ok('ANTHROPIC_API_KEY', 'set');
  } else {
    warn(
      'ANTHROPIC_API_KEY',
      'not set. Sprints 1-3 and `npm test` work without it; `npm start` will refuse to run.',
    );
  }

  console.log('\ndependencies');
  for (const pkg of ['@anthropic-ai/sdk', '@faker-js/faker', 'ajv', 'vitest']) {
    await check(pkg, async () => {
      await import(pkg === 'vitest' ? 'vitest/node' : pkg);
      return 'resolves';
    });
  }

  console.log('\npipeline');
  await check('fixture adapter', async () => {
    const ticket = await getTicket('TS-142', 'fixture');
    if (!ticket.acceptanceCriteria.length) throw new Error('ticket has no acceptance criteria');
    return `${ticket.id} "${ticket.title}" — ${ticket.acceptanceCriteria.length} AC, ${ticket.attachments.length} attachment(s)`;
  });

  for (const gate of ['security', 'schema', 'hitl']) {
    await check(`gate: ${gate}`, async () => {
      const mod = (await import(`../src/gates/${gate}.js`)) as Record<string, unknown>;
      const fns = Object.keys(mod).filter((k) => typeof mod[k] === 'function');
      return fns.length ? `exports ${fns.join(', ')}` : 'no functions exported';
    });
  }

  console.log('\ncheckpoints');
  for (const name of ['sprint-2-start', 'sprint-3-start']) {
    await check(name, async () => {
      const dir = path.join(root, 'checkpoints', name, 'gates');
      await stat(dir);
      return `${(await readdir(dir)).filter((f) => f.endsWith('.ts')).join(', ')}`;
    });
  }

  console.log('');
  if (failures > 0) {
    console.log(`${FAIL} smoke test failed: ${failures} problem(s). Try \`rm -rf node_modules && npm install\`.\n`);
    process.exitCode = 1;
    return;
  }

  console.log(`${PASS} smoke test passed${warnings ? ` (${warnings} warning)` : ''}.`);
  console.log('  Next:  npm test        3 failures expected, one per sprint');
  console.log('  Then:  open src/gates/security.ts and start sprint 1\n');
}

main().catch((err: unknown) => {
  console.error(`\n${FAIL} ${err instanceof Error ? err.stack : String(err)}\n`);
  process.exitCode = 1;
});
