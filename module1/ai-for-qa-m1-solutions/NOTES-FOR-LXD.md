# Notes for LXD: discrepancies and decisions

Rule applied throughout, per your instruction: where the lessons and the brief disagree, **lesson text and the TechShop universe win**.

## Needs your decision
1. **ROI volume.** The brief's 15 locators per sprint gives net -0.36 h (Negative, never pays back). The lesson's numbers need about 60 per sprint (net +1.33 h, payback 12.1 sprints). Break-even is about 24.6 per sprint. **Decision taken (lesson wins):** `examples/locator-demo-lesson-volume.json` (60/sprint) is the canonical worked example; `locator-demo-brief-volume.json` (15/sprint) is kept only as a labelled "what if volume is too low" Negative case. Change if you prefer otherwise.
2. **1.2.3 table vs. masking.** The table shows `[EMAIL]` placeholders; the tool produces format-preserving fakes, because 1.2.4 needs a valid email, order number and numeric amount.
3. **Grader key vs. lesson.** DOB: lesson says direct, grader says sensitive. Account number: lesson says indirect, grader says direct. Treatment is the same (mask), so impact is small; see `solutions/1-2-4-classification-key.md`.
4. **1.1.7 count.** Five prompts in all (Prompt 0 plus four iterations).
5. **1.2.7 / 1.2.5.** The parallel-uniqueness step is not in the practice; recommended as an extension (before/after transcripts are ready).
6. **Front-loaded prompt role sentence.** The lesson's front-loaded prompt starts with "You are a QA engineer for TechShop." and iterations 1 to 3 do not. Kept as written in the lesson (earlier I had removed it; reverted). Decide whether to add the role to the iterations too.

## Lesson numbers that look wrong (final figures for the lesson text)
| Text | Lesson says | Words | Characters | Lesson rule (words / 0.75) | Chars / 4 | Use in the lesson |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `Error: locator.click: Timeout 30000ms exceeded.` (1.3.1, 1.1.3) | about 28 tokens | 5 | 47 | 7 | 12 | **about 12 tokens** (provisional until a tokenizer count is captured; 28 is not supported by either method) |
| One-line prompt (1.3.1) | 9 words, about 12 tokens | 8 | 45 | 11 | 11 | **8 words, about 11 tokens** |
| Structured prompt (1.3.1) | 38 words, about 50 to 55 tokens | 32 | 209 | 43 | 52 | **32 words, about 43 tokens** (the rule the lesson teaches; chars / 4 gives 52) |

The tests and starter now use the corrected one-line example (8 words, about 11 tokens).
Exact count for the error line: put `ANTHROPIC_API_KEY` and `TOKEN_COUNT_MODEL` in `.env`, then run `npm run tokens -- estimate - --actual` and paste the line. The API count includes a few tokens of message overhead.

## Written by me because the lessons did not print them
Prompts A, B, C (1.3.2); the 1.3.4 scenario C manual triage time (12 min per failure); the sample files and 1.2.7 flawed CSV.

## Cannot be produced here (must be captured by a person)
All real Claude transcripts (`transcripts/*.md`), tokenizer screenshots (`transcripts/screenshots/README.md` lists them) and actual token counts. Items marked **[RUN CHECK]** and **[SME CHECK]** in `solutions/` need a human before go-live.

## Deviations from the brief
Toolset matches Workshop 2 and the syllabus: `@anthropic-ai/sdk`, `@faker-js/faker`, `ajv`, `tsx`, `typescript`, `vitest` (same versions, same lockfile tree). An earlier build shipped with zero dependencies only because the npm registry was blocked in the build environment; that was a build constraint, not a teaching decision, and has been reversed. Tests use Vitest (`test`/`expect`) and scripts run through tsx. The SDK, Faker and Ajv are installed but not yet used by Module 1 code (token counting still calls the API with `fetch`; the dirty-data generator uses its own seeded PRNG so committed data stays identical).

## Transcript findings (captured 2026-10-09 via subagent runs, not typed into claude.ai)
- **1.1.6 iteration 1** returned 43 numbered cases, not the "handful of one-line checks" the lesson expects. **Iteration 2** (33 cases) already included SQL and script injection. The three-step "each iteration adds what was missing" story is weak for this model; the real gain is the table, columns and priorities. Rewrite the expectation text for steps 3, 6 and 8, or choose a deliberately weaker starting prompt.
- **1.2.5 before:** four independent runs gave 3 repeated emails across workers (20 occurrences, 17 distinct). **After** (with the uniqueness rule): 0 repeated. Say "can" not "will" in the lesson.
- **1.2.6 structured prompt:** clean 20 rows, 20 distinct emails; did not reproduce the lesson's occasional 19 or 21 rows.
- Raw unedited outputs are in `ai-for-qa-m1/transcripts/raw/`. Re-run in real chats before go-live if exact fidelity matters.
