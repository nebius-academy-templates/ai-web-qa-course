/**
 * SPRINT 3 — Human-in-the-loop gate. ✅ SOLVED (instructor copy)
 *
 * DONE WHEN: the diff prints with + / - markers and correct line counts, and
 * anything other than an explicit yes returns approved: false.
 *
 * Check yourself with: npm test -- hitl
 */
import { createInterface } from 'node:readline/promises';
import type { GeneratedFile, HitlDecision, HitlOptions } from '../types.js';

const defaultWrite = (chunk: string): void => void process.stdout.write(chunk);

/**
 * The only path the tests never exercise — they inject their own `ask`, or the
 * suite would hang waiting for a key nobody presses.
 */
async function defaultAsk(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return await rl.question(question);
  } finally {
    rl.close();
  }
}

/** '' is zero lines, not one empty line — otherwise a new file counts +1 too many. */
const lines = (text: string): string[] => (text === '' ? [] : text.split('\n'));

export async function showDiffAndConfirm(
  files: GeneratedFile[],
  options: HitlOptions = {},
): Promise<HitlDecision> {
  const { existing = {}, write = defaultWrite, ask = defaultAsk } = options;

  let linesAdded = 0;
  let linesRemoved = 0;

  for (const file of files) {
    const before = existing[file.path];
    write(`\n--- ${file.path} ${before === undefined ? '(new file)' : '(rewrite)'}\n`);

    // Whole-file replace rather than a real LCS diff. This is a review aid,
    // not `git diff` — pulling in a diff library to save a reviewer two
    // seconds of reading is not the trade this gate is making.
    for (const line of lines(before ?? '')) {
      linesRemoved += 1;
      write(`- ${line}\n`);
    }
    for (const line of lines(file.contents)) {
      linesAdded += 1;
      write(`+ ${line}\n`);
    }
  }

  write(`\n${files.length} file(s), +${linesAdded} -${linesRemoved}\n`);

  // Asked once for the whole batch. Per-file prompting trains the reviewer to
  // hold down 'y', which is the opposite of what this gate is for.
  const answer = (await ask('Write these files? [y/N] ')).trim().toLowerCase();

  return {
    approved: answer === 'y' || answer === 'yes',
    answer,
    linesAdded,
    linesRemoved,
  };
}
