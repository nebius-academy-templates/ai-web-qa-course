# 1.1.4 Three-layer prompt for the flaky badge test: reference solution

Scenario (from the lesson): the TechShop test "badge increments after add to cart" fails in CI roughly every third run and passes on retry.
Files: `jira-ticket.md`, `dom-snippet.html`, `ci-log.txt`, `unrelated-suite.spec.ts` in `data/1-1-4-flaky-ci/`.

**The planted cause (do not reveal to learners):** the page script defers the badge update with `setTimeout(..., 150)`, while the test asserts with `{ timeout: 100 }`. The assertion times out at 100 ms, before the update at 150 ms. It passes only when the runner is slow enough between the click and the assertion for the 150 ms to have nearly elapsed. That is why the failing run is on a fast worker and the retry (with more overhead) passes.
Evidence in the files: `Timeout: 100ms`, three `locator resolved to <span hidden id="cart-badge" class="badge">0</span>` lines in the call log, and the `setTimeout(...150)` line in the page script. The fix is to remove the hard-coded `timeout: 100` and use the default (or wait on the `cart:updated` event); retries only hide the flake.

## 1. Context: in or out

| File | Decision | Reason tied to the diagnosis |
| --- | --- | --- |
| `ci-log.txt` | **In** | The failure evidence: the exact assertion, the 100 ms timeout, what the badge contained when it was checked, and the retry that passed. |
| `dom-snippet.html` | **In** | What the test touches (the hidden badge span and the add-to-cart button) and the page script that updates the badge, which is where the timing lives. |
| `jira-ticket.md` | **In** | The expected behaviour (badge hidden at zero, shows the count after an add) so the model can tell a product defect from a test defect. |
| `unrelated-suite.spec.ts` | **Out** | 500 passing tests (50 storefront checks at five viewports in light and dark mode) that never touch the cart or the badge. About 23,000 to 40,000 tokens (see `MANIFEST.md`), roughly 25 times the other three files combined, and nothing in it explains a badge timing failure. It would be noise the model has to filter. |

Acceptable variant: including the suite with an argued reason (for example "to see test conventions") is a Partial, not a fail. Including it with no reason is unmet.

## 2. System prompt

```
You are a Senior QA Automation Engineer investigating a flaky Playwright test.
Base your analysis only on the files provided. Do not assume application behaviour that is not in them, and say so if the evidence is not enough to decide.
Do not recommend adding retries or increasing global timeouts as the fix unless the evidence shows the product is slow.
Answer under three headings: Root Cause / Evidence / Recommended Fix.
Under Evidence, quote the exact lines you rely on.
```

Role, three constraints (evidence only, no invention, no retry-as-fix), one output format. The constraint is aimed at the thing least wanted from a flaky-test diagnosis: papering over the flake with retries.

## 3. User message

```
Diagnose why the "badge increments after add to cart" test fails about one run in three and passes on retry.
```

One task, no role, no standing rules.

## 4. Token estimate (one line of arithmetic)

Lesson rule: words / 0.75, per included file plus the learner's own text.

- Files: ticket 310 words + DOM 136 words + log 258 words = 704 words, 704 / 0.75 = 939 tokens.
- Own text: system prompt about 75 words + user message about 20 words = 95 words, 95 / 0.75 = 127 tokens.
- Total: 939 + 127 = about **1,070 tokens**.

Accepted band: **about 900 to 1,850 tokens** in total. The upper end covers learners who treat code and logs as denser (characters / 4 gives about 1,530 for the three files). `MANIFEST.md` has the per-file figures.

**Verdict: comfortable.** It is a small fraction of any current context window, so truncation and silent degradation are not a concern here. Adding the suite would multiply the size about 25 times (to roughly 24,000 tokens or more) for no gain.

## 5. Verdict lines from an honest run (observed, 2 runs with this system prompt, 2026-11-01)

- **Format:** followed exactly in both runs: Root Cause / Evidence / Recommended Fix, with no preamble and no fourth heading. One run added a "Side note, outside this flake" on the static `aria-label` at the end of Recommended Fix. "Yes, but it added an accessibility side note" is an accurate learner report.
- **Evidence:** both runs quoted the `setTimeout(..., 150)` click handler, the `toHaveText('1', { timeout: 100 })` line, `Timeout: 100ms`, a `locator resolved to <span hidden ...>0</span>` line, the ticket's "server is not involved" sentence and `Previous 9 runs: 3 flaky, 6 clean`. All of these are genuine lines from the files.
- **Your call:** both runs named the 100 ms timeout against the 150 ms delay as the cause, put the defect in the test ("the test is the problem, not the product"), and said not to add retries because `--retries=1` is what hides the flake. A learner who agrees is right. Neither run blamed "a race condition" without quoted lines, so that weak pattern did not occur.
- **Honest about limits:** both runs listed things the files cannot settle, such as why the rate is about one in three (the trace would show it), whether the 150 ms delay is intended, and why the "caps at 9+" test is stable ("I can't see that test's code").

## 6. The completed sentence (second run, no system prompt) (observed, 2 runs, 2026-11-01)

"Without the system prompt the response was less ______ because ______."

**What actually changed:**
- **The format went.** Both runs used their own headings ("Diagnosis / Why it fails only sometimes / Fix / Unrelated problems") and showed code blocks instead of a quoted Evidence section.
- **It went further beyond the task.** Both runs added a section on problems outside the flake: AC6 (the accessible name) and AC7 (the count not surviving navigation, fixed with `sessionStorage`). Both also suggested making flaky tests fail or be reported in CI.
- **It was less careful about unseen code.** One run said as fact that the other badge tests pass "because they don't use this tight timeout". The other hedged ("very likely ... worth confirming"). With the system prompt, both runs said they couldn't see that code.

**What did not change (don't expect it):**
- The diagnosis was just as correct: 100 ms against 150 ms, fix the test.
- Neither run recommended retries.
- The response was not longer. It was about 810 words without the system prompt, against about 950 with it, because the Evidence section adds length.

Accept: "less structured, because the three headings disappeared"; "less focused, because it added AC6/AC7 problems I didn't ask about"; "less careful, because it explained the other tests without seeing their code". Mark unmet: a sentence with no observation ("less consistent because the model defaults to pretrained behaviour"). A learner who writes "less accurate", "longer" or "it recommended retries" must quote the line, because none of these happened in the captured runs.

Raw runs: `run-checks/2026-11-01/114-*.md`.
