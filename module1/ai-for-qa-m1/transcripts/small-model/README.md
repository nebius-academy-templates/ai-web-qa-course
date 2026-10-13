# Small-model re-run of 1.1.6 iterations 1 to 3

Captured 2026-10-09 via a subagent on the smallest available model tier, using the lesson's exact prompts (same conversation for all three). Raw, unedited output is in `raw/`.

Result: it did **not** produce the short list the lesson describes. Iteration 1 returned about 223 lines of detailed cases (ID, title, preconditions, steps, test data, expected result); iteration 2 already contained injection/script cases. Model size alone does not make the starting prompt weak enough for the lesson's story.
