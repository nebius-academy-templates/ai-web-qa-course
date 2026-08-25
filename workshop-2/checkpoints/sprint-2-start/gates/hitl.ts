/**
 * SPRINT 3 — Human-in-the-loop gate.
 *
 * Everything upstream is a machine checking a machine. This is the one place a
 * person sees what is about to be written and can say no. Default to no.
 *
 * DONE WHEN: the diff prints with + / - markers and correct line counts, and
 * anything other than an explicit yes returns approved: false.
 *
 * Check yourself with: npm test -- hitl
 */
import type { GeneratedFile, HitlDecision, HitlOptions } from '../types.js';

/**
 * Renders a unified-ish diff of the files about to be written and asks the
 * human to approve.
 *
 * `write` and `ask` are injectable so this stays testable without a TTY —
 * the tests pass fakes and assert on what was written and what was returned.
 * Use the parameters, never process.stdout / readline directly, or the tests
 * will hang waiting for input that never comes.
 *
 * @param files    what the pipeline wants to write
 * @param options  existing file contents, plus the write/ask injection points
 */
export async function showDiffAndConfirm(
  files: GeneratedFile[],
  options: HitlOptions = {},
): Promise<HitlDecision> {
  // TODO (sprint 3): render the diff, ask for approval, return a HitlDecision.
  //
  // const { existing = {}, write = defaultWrite, ask = defaultAsk } = options;
  //
  // For each file:
  //   - print a header with the path and whether it is new or a rewrite
  //   - for a NEW file, every line is added: prefix each with '+ '
  //   - for an EXISTING file, print removed lines from existing[file.path]
  //     with '- ' and the new lines with '+ '. A whole-file replace is fine —
  //     this is a review aid, not `git diff`. Do not pull in a diff library.
  //   - count lines as you go
  //
  // Then ask exactly once, for all files together:
  //   const answer = (await ask('Write these files? [y/N] ')).trim().toLowerCase();
  //
  // Return { approved, answer, linesAdded, linesRemoved } where approved is
  // true ONLY for 'y' or 'yes'. Empty input, 'n', 'maybe', a stray newline —
  // all of it is a no. The tests check that '' and 'n' both refuse, and they
  // check the exact line counts, so count added and removed separately.
  //
  // defaultAsk should use node:readline/promises against process.stdin; that
  // path is never exercised by the tests, only by a real run.
  throw new Error('Not implemented — sprint 3');
}
