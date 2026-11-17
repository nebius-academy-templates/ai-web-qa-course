#!/usr/bin/env node
/**
 * npm run checkpoint <n>
 *
 * Copies checkpoints/sprint-<n>-start/gates/ over src/gates/, so a sprint that
 * ran out of time does not block the next one.
 *
 * Deliberately a folder copy and not a git branch: this workshop lives inside
 * a repo that also holds the participant's course work, and `git checkout`
 * would swing the whole tree, uncommitted edits and all.
 */
import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const raw = process.argv[2]?.trim().toLowerCase();
  const arg = raw?.replace(/^sprint-?/, '').replace(/-start$/, '');

  // `solution` is instructor material — all three gates working, so the
  // pipeline can be dry-run end to end before a session. See .instructor/.
  const isSolution = arg === 'solution';

  if (!arg || (!isSolution && !/^[0-9]+$/.test(arg))) {
    console.error('Usage: npm run checkpoint <n>        e.g. npm run checkpoint 2');
    console.error('  2 = start sprint 2 (sprint 1 solved for you)');
    console.error('  3 = start sprint 3 (sprints 1 and 2 solved for you)');
    process.exitCode = 1;
    return;
  }

  const from = isSolution
    ? path.join(root, '.instructor', 'solution', 'gates')
    : path.join(root, 'checkpoints', `sprint-${arg}-start`, 'gates');
  const to = path.join(root, 'src', 'gates');

  if (!(await exists(from))) {
    const available = (await readdir(path.join(root, 'checkpoints'), { withFileTypes: true }))
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .join(', ');
    console.error(`No checkpoint "${isSolution ? 'solution' : `sprint-${arg}-start`}". Available: ${available || '(none)'}`);
    process.exitCode = 1;
    return;
  }

  await mkdir(to, { recursive: true });
  const files = (await readdir(from)).filter((f) => f.endsWith('.ts'));

  console.log(`Restoring ${isSolution ? 'the full solution' : `checkpoint sprint-${arg}-start`} into src/gates/`);
  console.log('This OVERWRITES your src/gates/*.ts. Anything you wrote there is gone.\n');
  for (const file of files) {
    await copyFile(path.join(from, file), path.join(to, file));
    console.log(`  ${file}`);
  }

  const failing = isSolution ? 0 : Math.max(0, 4 - Number(arg));
  console.log(`\nDone. Run \`npm test\` — you should now see ${failing} failing test file(s).`);
  if (isSolution) {
    console.log('Back to the participant starting state with: git checkout src/gates/');
  }
}

main().catch((err: unknown) => {
  console.error(`✗ ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
