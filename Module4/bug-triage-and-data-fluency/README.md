# AI for QA (web) — Automated Bug Triage & Data Fluency: practice files

All data in this folder is synthetic. Hostnames, e-mail addresses, keys, connection strings, user IDs and MR numbers are fictional TechShop values created for the course; none of them resolve to a real system or person.

Folders are named by the task you do with the files. Each lesson page tells you which folder and which files to open.

| Folder | Files | What you do with them |
|---|---|---|
| `login-failure-triage/` | `playwright-ci.log` · `api.log` · `auth-service.log` · `grafana-stream.log` · `log-reading-worksheet.txt` | Read four log sources for one failing login test and fill in the triage worksheet |
| `log-chunking/` | `techshop-ci.log` · `sensitive-data-checklist.md` · `chunking-sheet.txt` | Chunk, label and redact a full CI log, then build and send the prompt |
| `bug-report/` | `product-search.log` · `prompt-template.txt` · `worksheet.txt` · `sample-report-seeded.txt` | Prepare an excerpt, prompt Claude for a bug report, validate your report and the seeded sample |
| `k6-report-reading/` | `k6-flash-sale-report.txt` · `review-sheet.txt` | Read a K6 load-test report, ask Claude for a stakeholder summary, and review it against the report |
| `ci-suite-triage/` | `techshop-ci-runs.csv` · `four-metric-prompt.txt` · `triage-sheet.txt` | Run the four-metric prompt on a 100-row CI dataset, verify the table, and triage the suite by trend and distribution |
| `flash-sale-percentiles/` | `response-times.txt` · `thresholds.txt` · `percentile-prompt.txt` · `percentile-sheet.txt` | Calculate percentiles by hand, run the percentile prompt on three endpoints, verify the table, and triage by threshold and tail |
| `mr-history-search/` | `mr-corpus.md` · `contextual-search-worksheet.txt` | Scope the 18-entry merge-request corpus and run a contextual search for similar past failures |

Reference answers and expert comments are **not** in this repository — they are shown on the platform after submission.

Note for maintainers: `log-chunking/techshop-ci.log` intentionally contains a fictional `sk_test_…` value. GitHub push protection may flag it; allow it via the repository's secret-scanning bypass rather than altering the log.
