# 1.2.2 Classify five QA data samples: reference key

Files are in `data/data-classification/` of the learner repo. Everything in them is synthetic.
The question the learner answers: if these were real, could they be pasted into a public LLM?

Verdicts: samples **1, 2 and 5 unsafe**; samples **3 and 4 safe** (with a caveat each). This matches the grader prompt.

The four pre-send checks from 1.2.1: real names or personal information; IDs or other indirect identifiers; credentials or secrets; internal systems revealed.

| # | File | Verdict | Checks failed |
| --- | --- | --- | --- |
| 1 | `sample-1-test-log.txt` | **Unsafe** | personal information, indirect IDs |
| 2 | `sample-2-ci-config.yml` | **Unsafe** | credentials, internal systems |
| 3 | `sample-3-test-fixture.json` | **Safe** (caveat) | none |
| 4 | `sample-4-mock-dataset.csv` | **Safe** (caveat) | none |
| 5 | `sample-5-api-response.json` | **Unsafe** (most sensitive) | personal information, indirect IDs |

## Sample 1: test log after a failed login

- **Data types:** direct identifier: the email `hannah.brooks@techshop-demo.com` (appears in the request body, a WARN line and four attempt lines). Indirect identifiers: `customerId=CUST-20931` and `sessionId=sess_9f3c71a2e4b84d06` (the session also appears in a `set-cookie` header). Together they tie a named person to an account and a live session.
- **Verdict:** unsafe for a public LLM. Combination risk: email + customer ID + session ID identifies one person and their session.
- **Tier:** enterprise API after masking; local model if masking is not possible.
- **Mask:** the email (everywhere, consistently), the customer ID, the session ID (including the cookie copy). The log structure is what a model needs to debug, not the real values.
- **Not PII, leave alone:** `req-7d21c0` request ID, timestamps, the masked `"password":"********"`.

## Sample 2: CI configuration

- **Data types:** credential: `PAYMENTS_API_KEY` (shape `tsk_live_..._SYNTHETIC`). Internal system details: `DATABASE_URL` (a Postgres URL with a user name, a password and the host `db-staging-02.internal.corp`) and `BASE_URL` (`shop-staging.internal.corp`).
- **Verdict:** unsafe. Check 3 (credential) and check 4 (internal systems) both fail.
- **Tier:** enterprise API after masking; raw config only on a local model. Ideally rotate the key if a real one was ever pasted.
- **Mask:** the key, the whole database URL (user, password and host), and the base URL host. Naming the key but not the two `internal.corp` hostnames is a **Partial**: the hostnames tell an outsider where staging and the database live.
- **Safe to leave:** the workflow steps, action versions, cron schedule, timeouts.

## Sample 3: test fixture (the "safe" sample that looks unsafe)

- **Data types:** names, emails and phone numbers are present, but all are visibly fictional: `fx-001`..`fx-004` IDs, `customerN@techshop-test.example` (a reserved `.example` domain), phone numbers in the reserved `+44 7700 900xxx` range, and a header `generatedBy: faker (seed 4242)`.
- **Verdict:** safe. No real person to expose, and fictional data is the whole reason fixtures exist. Marking it unsafe because "it has names and emails" is the field-shapes-mistaken-for-people error.
- **Caveat (strong answers include it):** safe only while the fixture is genuinely synthetic. A fixture that is an anonymised production export, or that has had real data pasted in, would change the verdict. Check provenance, not shape.

## Sample 4: mock dataset (the second "safe" sample)

- **Data types:** anonymous IDs (`usr_a41f9c02`...), subscription type, billing cycle, active flag. No names, contact details or company data.
- **Verdict:** safe.
- **Caveat:** safe as long as the IDs cannot be joined back to real records. If `usr_...` values are actual user IDs from production, they become indirect identifiers.

## Sample 5: customer API response (most sensitive)

- **Data types:** direct identifiers: name `Daniel Okafor`, email, phone, full home address (line 1, line 2, city, postcode). Indirect identifiers: `customerId`, `orderNumber`. Also order total and timestamp.
- **Verdict:** unsafe, the highest-sensitivity sample.
- **Mask order (as in the grader key):** name and address first, then email and phone, then both IDs.
- **Tier:** enterprise API only after full masking; raw form only on a local model.

## What the scanner says about these samples

`npm run sanitize -- <file> --check` exits 2 (findings present) on **all five** files:

- Samples 1, 2 and 5 are true positives. On sample 2 it finds four things: the API key, the `user:password` inside the database URL, and both `internal.corp` hostnames, which are exactly the masking targets in the key above.
- Samples 3 and 4 are flagged too (names, emails and phones in 3; the `userId` column in 4). That is the lesson's point: a regex finds shapes, it cannot tell a faker-generated name from a real one or an anonymous ID from a production ID. Provenance is a human judgement, and the scanner must not be used to decide "safe".
- Practical use: run it as a prompt-hygiene check on files you did **not** generate yourself, and treat a clean run as "no known pattern found", never as "safe".

## What a model typically gets wrong on this set [RUN CHECK]

From the grader prompt: Claude over-flags sample 3 (names and emails read as "unsafe") and under-lists the masking targets on sample 2 (the key only, hostnames missed). I could not run Claude here, so capture a real run before go-live and confirm the pattern.
