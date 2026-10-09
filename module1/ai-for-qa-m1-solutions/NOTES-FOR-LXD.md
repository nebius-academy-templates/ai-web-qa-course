# Notes for LXD: discrepancies and decisions

Rule applied throughout, per your instruction: where the lessons and the brief disagree, **lesson text and the TechShop universe win**.

## Needs your decision
1. **ROI volume.** The brief's 15 locators per sprint gives net -0.36 h (Negative, never pays back). The lesson's numbers need about 60 per sprint (net +1.33 h, payback 12.1 sprints). Break-even is about 24.6 per sprint. **Decision taken (lesson wins):** `examples/locator-demo-lesson-volume.json` (60/sprint) is the canonical worked example; `locator-demo-brief-volume.json` (15/sprint) is kept only as a labelled "what if volume is too low" Negative case. Change if you prefer otherwise.
2. **1.2.3 table vs. masking.** The table shows `[EMAIL]` placeholders; the tool produces format-preserving fakes, because 1.2.4 needs a valid email, order number and numeric amount.
3. **Grader key vs. lesson.** DOB: lesson says direct, grader says sensitive. Account number: lesson says indirect, grader says direct. Treatment is the same (mask), so impact is small; see `solutions/1-2-4-classification-key.md`.
4. **1.1.7 count.** Five prompts in all (Prompt 0 plus four iterations).
5. **1.2.7 / 1.2.5.** The parallel-uniqueness step is not in the practice; recommended as an extension (before/after transcripts are ready).
6. **Front-loaded prompt role sentence.** The lesson's front-loaded prompt starts with "You are a QA engineer for TechShop." and iterations 1 to 3 do not. Kept as written in the lesson (earlier I had removed it; reverted). Decide whether to add the role to the iterations too.

## Lesson numbers that look wrong
- `Error: locator.click: Timeout 30000ms exceeded.` is called about 28 tokens; word/char estimates give 7 to 12. Check with a real tokenizer.
- 1.3.1: the one-line prompt is 8 words, not 9; the structured prompt is 32 words, not 38 (token figures roughly hold).

## Written by me because the lessons did not print them
Prompts A, B, C (1.3.2); the 1.3.4 scenario C manual triage time (12 min per failure); the sample files and 1.2.7 flawed CSV.

## Cannot be produced here (must be captured by a person)
All real Claude transcripts (`transcripts/*.md`), tokenizer screenshots (`transcripts/screenshots/README.md` lists them) and actual token counts. Items marked **[RUN CHECK]** and **[SME CHECK]** in `solutions/` need a human before go-live.

## Deviations from the brief
Zero dependencies (no faker, csv-parse, dotenv or vitest): the npm registry was blocked in the build environment. Node 22 native TypeScript and `node:test` are used instead. Node/TS was not objected to; confirm.

## Transcript findings (captured 2026-10-09 via subagent runs, not typed into claude.ai)
- **1.1.6 iteration 1** returned 43 numbered cases, not the "handful of one-line checks" the lesson expects. **Iteration 2** (33 cases) already included SQL and script injection. The three-step "each iteration adds what was missing" story is weak for this model; the real gain is the table, columns and priorities. Rewrite the expectation text for steps 3, 6 and 8, or choose a deliberately weaker starting prompt.
- **1.2.5 before:** four independent runs gave 3 repeated emails across workers (20 occurrences, 17 distinct). **After** (with the uniqueness rule): 0 repeated. Say "can" not "will" in the lesson.
- **1.2.6 structured prompt:** clean 20 rows, 20 distinct emails; did not reproduce the lesson's occasional 19 or 21 rows.
- Raw unedited outputs are in `ai-for-qa-m1/transcripts/raw/`. Re-run in real chats before go-live if exact fidelity matters.
