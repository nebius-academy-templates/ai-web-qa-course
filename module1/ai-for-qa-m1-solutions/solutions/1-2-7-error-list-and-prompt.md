# 1.2.7 Find the errors, then generate and verify: reference answers

Data: `data/1-2-7-mock-data/schema.md` and `claude-output-flawed.csv` in the learner repo.

## Part A: confirmed error list (5 violations)

I checked the five rows against the schema one field at a time. The grader key holds: **five distinct violations, rows 1 and 5 clean.**

| Row | Record | Violation | Schema requirement broken |
| --- | --- | --- | --- |
| 2 | James Patel | Email `maya.chen@example.com` is the same as row 1 | Email must be **unique** |
| 3 | Sofia Garcia | Email `sofia.garcia@example` has no top-level domain | Email must be a **valid format** |
| 3 | Sofia Garcia | Country `Spain` | Country must be one of United States, Canada, United Kingdom, Australia (**allowed list**) |
| 4 | Liam Wilson | Age `17` | Age must be an integer from 18 to 80 (**range**) |
| 4 | Liam Wilson | Monthly Spend `1200` | Monthly Spend must be a number from 50 to 1000 (**range**) |

- Row 1 (Maya Chen): all valid (28, Canada, 245).
- Row 5 (Emma Brown): all valid (45, United Kingdom, 510).
- **Note on counting:** that is five violations across **three** rows (rows 2, 3 and 4), and row 3 has two. A learner who lists "rows 2, 3, 4" and names all five violations is complete. A learner who flags rows 1 or 5 has a false positive.
- Row 2's duplicate is a violation of the *second* occurrence; row 1 is the original. Accept "rows 1 and 2 share an email" as long as the learner ties it to uniqueness.
- The sixth thing a sharp learner may notice: the first-name/last-name pair "James Patel" with Maya Chen's email looks like a copy error. Not a schema violation, not required.

Seeded in `claude-output-flawed.csv` exactly as above (5 rows, 5 seeded violations).

## Part B: reference generation prompt

Written as I would send it. It covers the five required elements: fields, ranges, allowed countries, unique emails, Markdown table output.

```
You are generating fictional test data for a QA exercise.

Generate 10 customer records as a Markdown table with exactly these columns, in this order:
First Name, Last Name, Email, Age, Country, Monthly Spend.

Rules:
- First Name and Last Name: text, realistic and fictional.
- Email: valid email format, on the domain example.com, and unique across all 10 records. No email may appear twice.
- Age: an integer from 18 to 80 inclusive.
- Country: one of exactly these four values: United States, Canada, United Kingdom, Australia. No other country.
- Monthly Spend: a number from 50 to 1000 inclusive.
- All data must be fictional. Do not use real people or real contact details.
- Every cell must be filled; no blanks, no "N/A".

Return only the table, nothing else.
```

Why each line is there: columns and order stop Claude choosing its own schema; "inclusive" settles the boundaries; "exactly these four values" stops Spain-type errors; "unique across all 10 records" is explicit because, as the lesson says, the model will not infer uniqueness from a field name; "return only the table" keeps the output checkable.

## Verification checklist: how to judge a learner's run

- The grader accepts a table with violations as long as the learner **reports** them. Reporting Claude's mistakes is the skill, and "all checks passed" on a table that visibly has 9 records is the failure the grader prompt names.
- The checks in order of how often a real run is likely to trip them [RUN CHECK, not observed here]: record count (19 or 21 rows instead of 10 happens occasionally per the walkthrough), duplicate emails, edge values at the range limits. Capture a real run to confirm before go-live.
- Uniqueness is the check that takes the most attention: with 10 emails every pair has to be compared, and a duplicate does not announce itself the way a wrong country does.

## Open item from the grader prompt: the parallel-uniqueness step

The grader prompt's draft note says the original brief had a fifth step (regenerate emails safe for four parallel workers) that the source activity does not contain, and that the syllabus skill "prompts for correct test data incrementing" is otherwise exercised nowhere.

**Recommendation: extend Part B with the parallel step, now that the contradiction in 1.2.5 is easy to resolve.** The 1.2.5 definition is coherent as written: the parallel increment failure is generated data *reusing the same values across records or CI workers*, fixed in the prompt, and it is explicitly *not* a concurrency defect. The extension would read: "Now regenerate the emails so they are unique across four parallel workers" with an incrementing or worker-prefixed scheme (`worker1.customer001@example.com`). I have not changed the learner-facing practice text, because that is an LXD decision, but the transcripts folder has before/after files ready for it.
