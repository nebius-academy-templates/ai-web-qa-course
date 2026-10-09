# 1.1.4 Three-layer prompt for the flaky badge test: reference solution

Scenario (from the lesson): the TechShop test "badge increments after add to cart" fails in CI roughly every third run and passes on retry.
Files: `jira-ticket.md`, `dom-snippet.html`, `ci-log.txt`, `unrelated-suite.spec.ts` in `data/flaky-test-prompt/`.

**The planted cause (do not reveal to learners):** the page script defers the badge update with `setTimeout(..., 150)`, while the test asserts with `{ timeout: 100 }`. The assertion times out at 100 ms, before the update at 150 ms. It passes only when the runner is slow enough between the click and the assertion for the 150 ms to have nearly elapsed. That is why the failing run is on a fast worker and the retry (with more overhead) passes.
Evidence in the files: `Timeout: 100ms`, three `locator resolved to <span hidden id="cart-badge" class="badge">0</span>` lines in the call log, and the `setTimeout(...150)` line in the page script. The fix is to remove the hard-coded `timeout: 100` and use the default (or wait on the `cart:updated` event); retries only hide the flake.

## 1. Context: in or out

| File | Decision | Reason tied to the diagnosis |
| --- | --- | --- |
| `ci-log.txt` | **In** | The failure evidence: the exact assertion, the 100 ms timeout, what the badge contained when it was checked, and the retry that passed. |
| `dom-snippet.html` | **In** | What the test touches (the hidden badge span and the add-to-cart button) and the page script that updates the badge, which is where the timing lives. |
| `jira-ticket.md` | **In** | The expected behaviour (badge hidden at zero, shows the count after an add) so the model can tell a product defect from a test defect. |
| `unrelated-suite.spec.ts` | **Out** | 50 passing tests that never touch the cart or the badge. About 1,400 to 2,400 tokens (see `MANIFEST.md`), more than the other three files combined, and nothing in it explains a badge timing failure. It would be noise the model has to filter. |

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

**Verdict: comfortable.** It is a small fraction of any current context window, so truncation and silent degradation are not a concern here. Adding the suite would roughly double the size for no gain.

## 5. Expected verdict lines (what an honest run looks like) [RUN CHECK]

I could not run Claude in this build. These are what the grader prompt expects a learner to find, not observed output.

- **Format:** usually followed (three headings). If Claude adds a preamble or a fourth section, the learner reports it as "no, it added ...".
- **Evidence:** the supporting lines are the `3 x locator resolved to ... 0` call-log lines, the `Timeout: 100ms` line, or the `setTimeout(..., 150)` line in the DOM script.
- **Your call:** agree if Claude identifies the 100 ms timeout against the 150 ms deferral. A response that blames "a race condition" with no quoted line is the weak pattern the grader is told to catch.

## 6. The completed sentence (second run, no system prompt) [RUN CHECK]

"Without the system prompt the response was less ______ because ______."

Expected shapes of an honest answer, from the grader prompt: the three-heading format disappears; the response gets longer or more generic; or it proposes fixes beyond the evidence (adding retries, rewriting the feature). A sentence that restates the lesson with no observation ("less consistent because the model defaults to pretrained behaviour") is unmet. Capture a real pair of runs before go-live so the grader can recognise the typical difference.
