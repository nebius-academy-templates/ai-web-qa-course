# 1.3.4 Scenario C: AI-assisted CI/CD log triage (reference business case)

Inputs for the calculator: `scenarios/scenario-c.json`. Reproduce with:
`node ../ai-for-qa-m1/src/token-cost/cli.ts roi scenarios/scenario-c.json`
Money uses the illustrative placeholder rates in `rates.json` (mid tier).

Scenario (from the practice): a pipeline runs about 30 times a day with about a 15% failure rate; one QA engineer owns triage; Claude produces a first-pass classification that the engineer confirms or corrects.

The practice gives no manual time per failure, so the template **has to assume one**, and the notes must say so. I assume 12 minutes (open the log, find the failing step, decide whether it is a product defect, a test defect, an environment problem or a flake). **[SME CHECK]**

## Completed template

| Category | Estimate | Notes / assumptions | Acceptable range for the grader |
| --- | --- | --- | --- |
| Setup effort | 10 hours | Log-extraction step, prompt with the failure categories, about 10 labelled examples, review of the first 30 classifications | 6 to 20 h |
| Estimated prompt tokens | about 1,800 | System prompt and categories about 300, plus the failing test's log excerpt about 1,500. The lesson's table puts a single failed test at 500 to 2,000 tokens and a full pipeline log at 8,000 to 30,000, which is why only the excerpt is sent. | 800 to 3,000 |
| Estimated response tokens | about 250 | Category, confidence, a one-line reason, the log line relied on | 100 to 400 |
| Estimated token cost per request | about 0.0073 (GBP, illustrative) | 1,800 x 2.4 + 250 x 12 per million, mid tier | under 0.03 |
| Estimated requests per sprint | 45 | 30 runs x 15% = 4.5 failures per day, x 10 working days | 40 to 50 |
| Human review (HITL) time per output | 4.8 minutes on average | Assumption: 80% of classifications are confirmed in about 3 minutes, 20% need a correction or a full read at about 12 minutes (0.8 x 3 + 0.2 x 12) | 3 to 8 min |
| Maintenance effort | 2 hours per month, about 0.92 h per sprint | Prompt and category updates as the pipeline and test names change | 1 to 4 h per month |
| Current manual effort | 9 hours per sprint | 45 failures x 12 min (assumed) | 6 to 12 h |
| Estimated AI-assisted effort | 3.6 hours per sprint | 45 x 4.8 min | consistent with review time x 45 |
| Estimated time saved | 5.4 hours gross, 4.47 hours net per sprint | 9 - 3.6, then minus 0.92 maintenance and a negligible token cost | must equal manual minus assisted |
| Estimated throughput improvement | not claimed | The failure count is set by the pipeline; the freed time is not turned into extra triage | blank or argued |
| Estimated reduction in rework | not claimed | No history on misclassified failures | blank is acceptable |
| Overall assessment | **Positive** | Net 4.47 h per sprint, payback 2.2 sprints | Positive; Negative acceptable if their numbers support it |

## Three-condition check

| Condition | Verdict | Justification from the numbers |
| --- | --- | --- |
| Setup effort is justified by expected usage | **Pass** | 45 failures per sprint recurring; 10 h setup is recovered in 2.2 sprints. |
| Human review takes less time than the original task | **Pass** | 4.8 min average against 12 min manual (40%). This is the binding cost: it depends on trusting the first pass enough to confirm quickly. |
| The context is stable enough for AI output to stay reliable | **Pass, with a watch item** | Log format and test names are stable while the pipeline is unchanged. A pipeline restructure or a new test framework changes the logs and the prompt needs rework. |

**If a learner marks condition 3 as Fail**, the recommendation has to respond (pilot on the current pipeline only, or delay until the restructure lands). Accept either verdict if the numbers support it.

## Model recommendation (169 words)

Recommendation: adopt, as a limited pilot for two sprints. Triage today costs about 9 engineer hours per sprint: roughly 45 pipeline failures at about 12 minutes each. With Claude producing a first-pass classification and the engineer confirming or correcting it, I estimate about 4.8 minutes per failure, or 3.6 hours, saving 5.4 hours per sprint, about 4.5 hours after prompt maintenance. Token cost is roughly 33 pence per sprint, so engineer time is the real cost: 10 hours of setup, repaid in about two sprints. Two assumptions carry the case: that four in five classifications can be confirmed in about three minutes, and that the log excerpt we send stays stable. The case reverses if average handling per failure rises above about 11 minutes, so the pilot must measure it. Send only the failing test's excerpt, never a full pipeline log or anything containing customer data. If the pipeline or log format is restructured, prompts need rework and the return should be reassessed. The engineer still owns every classification.

## Model sensitivity note

Assumption: the engineer needs an average of 4.8 minutes per failure to confirm or correct the first-pass classification. The saving disappears at about **10.8 minutes per failure** (net hours reach zero once maintenance is counted), so a team whose engineers do not trust the output and re-read every log gets no return. The number to measure in the pilot is the real average handling time per failure. Failure volume matters far less here: the case still holds down to about 8 failures per sprint.

## Calculator output (for reference)

| Figure | Value |
| --- | --- |
| Manual effort | 9 h per sprint |
| Assisted effort | 3.6 h per sprint |
| Maintenance | 0.92 h per sprint |
| Token cost | about 0.33 per sprint (illustrative GBP) |
| Net saving | 4.47 h per sprint |
| Payback | 2.2 sprints |
| Break-even review time | 10.8 min |
| Break-even volume | 7.8 failures per sprint |
