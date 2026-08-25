/**
 * SPRINT 3 — this file fails until src/gates/hitl.ts is implemented.
 *
 * Note the injected `write` and `ask`: the gate must never touch stdin
 * directly, or this suite hangs forever waiting for a key nobody presses.
 */
import { describe, expect, it } from 'vitest';
import { showDiffAndConfirm } from '../src/gates/hitl.js';
import type { GeneratedFile } from '../src/types.js';

const NEW_FILE: GeneratedFile = {
  path: 'specs/checkout.spec.ts',
  contents: ['line one', 'line two', 'line three'].join('\n'),
};

/** Collects everything the gate rendered. */
function recorder() {
  const chunks: string[] = [];
  return { chunks, write: (chunk: string) => void chunks.push(chunk), get text() { return chunks.join(''); } };
}

describe('SPRINT 3 — human-in-the-loop gate', () => {
  it('renders a diff, defaults to no, and only approves on an explicit yes', async () => {
    // --- A brand-new file: every line is an addition -----------------------
    const out = recorder();
    const newFile = await showDiffAndConfirm([NEW_FILE], {
      existing: {},
      write: out.write,
      ask: async () => 'y',
    });

    expect(out.text).toContain('specs/checkout.spec.ts');
    expect(out.text).toContain('+ line one');
    expect(out.text).toContain('+ line three');
    expect(newFile.linesAdded).toBe(3);
    expect(newFile.linesRemoved).toBe(0);
    expect(newFile.approved).toBe(true);
    expect(newFile.answer).toBe('y');

    // --- An existing file: removals show up too ----------------------------
    const rewrite = recorder();
    const decision = await showDiffAndConfirm([NEW_FILE], {
      existing: { 'specs/checkout.spec.ts': ['old one', 'old two'].join('\n') },
      write: rewrite.write,
      ask: async () => 'yes',
    });

    expect(rewrite.text).toContain('- old one');
    expect(rewrite.text).toContain('- old two');
    expect(rewrite.text).toContain('+ line one');
    expect(decision.linesRemoved).toBe(2);
    expect(decision.linesAdded).toBe(3);
    expect(decision.approved).toBe(true);

    // --- Default is no -----------------------------------------------------
    for (const answer of ['', 'n', 'no', 'maybe', '\n', 'Y please']) {
      const result = await showDiffAndConfirm([NEW_FILE], {
        write: () => {},
        ask: async () => answer,
      });
      expect(result.approved, `"${answer}" must not approve`).toBe(false);
    }

    // --- Case and whitespace are forgiven on a real yes ---------------------
    const shouty = await showDiffAndConfirm([NEW_FILE], {
      write: () => {},
      ask: async () => '  Y  ',
    });
    expect(shouty.approved).toBe(true);
    expect(shouty.answer).toBe('y');

    // --- Asked once for the whole batch, not once per file ------------------
    let asked = 0;
    const batch = recorder();
    await showDiffAndConfirm(
      [NEW_FILE, { path: 'pages/CheckoutPage.ts', contents: 'only line' }],
      {
        write: batch.write,
        ask: async () => {
          asked += 1;
          return 'n';
        },
      },
    );
    expect(asked).toBe(1);
    expect(batch.text).toContain('pages/CheckoutPage.ts');
  });
});
