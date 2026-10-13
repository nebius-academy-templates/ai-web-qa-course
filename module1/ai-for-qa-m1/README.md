# AI for QA Engineers, Module 1: practice repository

Practice data and two small tools for Module 1. Everything is fictional and belongs to the **TechShop** universe.

## Fake-data convention

- Credentials are visibly fake. Keys and passwords end in `_SYNTHETIC` or contain `SYNTH`.
- Emails use reserved domains (`example.com`, `*.example`, `techshop-demo.com`); UK phones use the Ofcom drama range `07700 900xxx`; IPs use RFC 5737 ranges; SSNs use `987-65-432x`.
- Data is generated with fixed seeds and committed, so everyone sees the same files.

## Requirements and setup

Node 22.18 or later. There are **no npm dependencies**: nothing to install.

```
cp .env.example .env     # optional: only needed for real token counts via the API
npm test                 # the finished tools (38 tests)
npm run test:starter     # the starter exercises (fail until you fill in the TODOs)
```

## What is here

| Folder | Contents |
| --- | --- |
| `data/flaky-test-prompt/` | Jira ticket, DOM snippet, CI log and a 50-test suite for the 1.1 practices |
| `data/data-classification/` | Five samples for 1.2.2 |
| `data/1-2-4-customer-record/` | The 16-field record for 1.2.4 |
| `data/1-2-7-mock-data/` | Schema and a flawed Claude output for 1.2.7 |
| `data/token-cost-estimate/` | Prompts A, B, C for 1.3.2, with a `MANIFEST.md` of word and token counts |
| `data/dirty/users.csv` | 300 messy rows for the scanner |
| `transcripts/` | Prompts for the live-demo captures; see the status note in each file |
| `src/sanitize/` | PII scanner and masker |
| `src/token-cost/` | Token estimate, cost projection and ROI calculator |
| `starter/` | Skeletons of the two tools to fill in |

## PII scanner

```
npm run sanitize -- data/dirty/users.csv           # writes out/users.masked.csv and prints a report
npm run sanitize -- file.json --check              # report only
npm run sanitize -- file.json --json --salt mysalt
```

Masking is deterministic and format-preserving (a masked email is still an email, a masked card is still Luhn-valid), so the masked file still works as test input. The report lists where and what kind of item was found, never the original value.

Exit codes: `0` clean or fully masked, `1` error, `2` findings (with `--check`), `3` items remain that need human review (for example health wording).

### What it misses

This is a teaching tool, not a control. Treat a clean run as "no known pattern found", never as "safe".

- Names and addresses inside free text (names are caught only when the same name appears in a structured field).
- IPv6 addresses, partial card numbers, unusual phone formats.
- It finds shapes. It cannot tell fictional data from real data: `data/data-classification/sample-3` is flagged although it is safe.
- Health and similar attributes are flagged for review by keyword only.

## Token and cost calculator

```
npm run tokens -- estimate data/token-cost-estimate/prompt-b.txt
npm run tokens -- cost --help
npm run tokens -- roi examples/locator-demo-lesson-volume.json
```

Estimates use words / 0.75, cross-checked with characters / 4 for code and logs. They are estimates; set `ANTHROPIC_API_KEY` for exact counts. Prices in `src/token-cost/rates.json` are **illustrative placeholders**: replace them with current rates.
