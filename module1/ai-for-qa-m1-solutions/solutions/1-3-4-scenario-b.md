# 1.3.4 Scenario B: AI-generated test cases from Jira tickets (reference business case)

Inputs for the calculator: `scenarios/scenario-b.json`. Reproduce with:
`node ../ai-for-qa-m1/src/token-cost/cli.ts roi scenarios/scenario-b.json`
The numbers below are that output. Money uses the illustrative placeholder rates in `rates.json` (mid tier), so only the order of magnitude matters.

Scenario (from the practice): 20 new tickets per sprint, about 30 minutes per ticket to write test cases by hand, two-engineer team, an engineer reviews every draft.

## Completed template

| Category | Estimate | Notes / assumptions | Acceptable range for the grader |
| --- | --- | --- | --- |
| Setup effort | 12 hours | Two engineers, about 6 h each: prompt template, test-case format, review checklist, a trial on a few old tickets | 8 to 20 h |
| Estimated prompt tokens | about 600 | System prompt about 150 plus ticket text about 450 (words / 0.75) | 400 to 900 |
| Estimated response tokens | about 700 | A table of about 8 test cases | 400 to 1,000 |
| Estimated token cost per request | about 0.0098 (GBP, illustrative) | 600 x 2.4 + 700 x 12 per million, mid tier | under 0.03 |
| Estimated requests per sprint | 20 | One per ticket | 20 (given) |
| Human review (HITL) time per output | 8 minutes | Read the draft, check it against the ticket, remove invented steps, add domain rules the model cannot know | 5 to 15 min |
| Maintenance effort | 2 hours per month, about 0.92 h per sprint | Prompt updates when templates or conventions change (26 sprints / 12 months) | 1 to 4 h per month |
| Current manual effort | 10 hours per sprint | 20 x 30 min | 10 h (given) |
| Estimated AI-assisted effort | 2.67 hours per sprint | 20 x 8 min | consistent with review time x 20 |
| Estimated time saved | 7.33 hours gross, 6.41 hours net per sprint | 10 - 2.67, then minus 0.92 maintenance and a negligible token cost | must equal manual minus assisted |
| Estimated throughput improvement | not claimed | Ticket volume is set by the business, so freed hours are not turned into extra tickets. Freed time is about 6.4 h per sprint for exploratory testing. | blank or an argued figure |
| Estimated reduction in rework | not claimed | No history to support a number; any figure is a guess until measured | blank is acceptable |
| Overall assessment | **Positive** | Net 6.41 h per sprint, payback 1.9 sprints | Positive; Negative acceptable if their own numbers support it |

## Three-condition check

| Condition | Verdict | Justification from the numbers |
| --- | --- | --- |
| Setup effort is justified by expected usage | **Pass** | 20 tickets every sprint, so the 12 h setup is recovered in 1.9 sprints, well inside a year (26 sprints). |
| Human review takes less time than the original task | **Pass** | 8 min review against 30 min manual: 27% of the original effort. |
| The context is stable enough for AI output to stay reliable | **Pass, with a watch item** | The ticket template and the product are stable for this team. If the template changed every sprint, prompts would need constant upkeep and this condition would fail. |

**If a learner marks condition 3 as Fail** (the lesson's own strong-audit example does, for a template that changes every sprint), that is a valid result and the recommendation must then respond to it: pilot, limit the scope to one stable ticket type, or delay. A "Fail" with an "adopt in full" recommendation is the first Next step.

## Model recommendation (174 words)

Recommendation: adopt Claude for drafting test cases from Jira tickets, starting with a two-sprint pilot. Today the team spends about 10 engineer hours per sprint writing test cases for 20 tickets at 30 minutes each. With Claude drafting and an engineer reviewing every draft at about 8 minutes, the same work takes about 2.7 hours, saving roughly 7.3 hours per sprint. After about 0.9 hours of prompt maintenance, the net saving is about 6.4 hours per sprint. Token cost is about 20 pence per sprint at the assumed prices, so it is not a factor. The main cost is the 12-hour setup, which the saving repays in about two sprints. The main risk is review quality: the 8-minute figure is an assumption, and Claude will miss rules that exist only in our heads, so every draft still needs an engineer. The case reverses if review exceeds about 27 minutes per ticket, so the pilot should measure it. If ticket templates start changing every sprint, prompt upkeep will rise and the case should be reassessed.

## Model sensitivity note

Assumption: review of an AI-drafted test case takes about 8 minutes. The saving disappears at about **27 minutes per ticket** (net hours per sprint reach zero once maintenance is counted), and the payback exceeds a year at about **26 minutes**. The lesson's own example rounds this to about 25 minutes; either is acceptable. Review time is the number the pilot must measure. Other assumptions that flip the verdict: tickets per sprint falling below about 2.5 (at that volume the saving no longer covers maintenance), or setup above about 165 hours (payback beyond a year).

## Calculator output (for reference)

| Figure | Value |
| --- | --- |
| Manual effort | 10 h per sprint |
| Assisted effort | 2.67 h per sprint |
| Maintenance | 0.92 h per sprint |
| Token cost | about 0.20 per sprint (illustrative GBP) |
| Net saving | 6.41 h per sprint |
| Payback | 1.9 sprints |
| Break-even review time | 27.2 min |
| Break-even volume | 2.5 tickets per sprint |
