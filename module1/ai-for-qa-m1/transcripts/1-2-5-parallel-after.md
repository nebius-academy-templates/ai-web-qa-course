# Parallel increment, AFTER: explicit uniqueness rule

**Used in:** 1.2.5 (the corrected prompt)

**STATUS: CAPTURED via subagent runs on 2026-10-09, not typed into claude.ai.** Each run was a separate Claude instance given the lesson's prompt text with a short instruction to answer without tools. Output is unedited. Re-run in a real chat before go-live if exact fidelity matters.

## Worker 1: corrected prompt, separate new chat (replace {N} with 1 and {NNN} stays as written)

**Prompt (paste exactly):**

```
You are worker 1 of 4, and the other three workers are running this same prompt separately.
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
Every email must be unique across all records and across all four workers: use the format worker1.customer{NNN}@example.com, where 1 is your worker number and {NNN} counts up from 001 within your records. Do not reuse any email.
```

**Model:** `claude-sonnet-5-5` (configured model; the serving model was not verified)  
**Date:** 2026-10-09  
**Fresh conversation:** yes, one new subagent conversation per worker

**Verbatim output:**

````
Here are 5 fictional TechShop checkout-test customers (all data is invented; phone numbers use the Ofcom drama range 07700 900xxx, and the addresses are fictional).

| # | First name | Last name | Email | Phone | Shipping address |
|---|-----------|-----------|-------|-------|------------------|
| 1 | Oliver | Hartley | worker1.customer001@example.com | 07700 900101 | 14 Mill Lane, Headingley, Leeds, West Yorkshire, LS6 2AB |
| 2 | Priya | Nair | worker1.customer002@example.com | 07700 900102 | 52 Whitehall Road, Clifton, Bristol, BS8 4DL |
| 3 | Callum | Reid | worker1.customer003@example.com | 07700 900103 | 7 Princes Terrace, Dowanhill, Glasgow, G12 9JU |
| 4 | Megan | Prosser | worker1.customer004@example.com | 07700 900104 | 23 Castle Street, Cardiff, CF10 1BS |
| 5 | Tomasz | Wilkins | worker1.customer005@example.com | 07700 900105 | 91 Abbey Gardens, Jesmond, Newcastle upon Tyne, NE2 3QT |

All five emails follow the worker1.customer{NNN}@example.com format, counting from 001 to 005, so none will clash with the other workers' records.
````

## Worker 2: corrected prompt, separate new chat (replace {N} with 2 and {NNN} stays as written)

**Prompt (paste exactly):**

```
You are worker 2 of 4, and the other three workers are running this same prompt separately.
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
Every email must be unique across all records and across all four workers: use the format worker2.customer{NNN}@example.com, where 2 is your worker number and {NNN} counts up from 001 within your records. Do not reuse any email.
```

**Model:** `claude-sonnet-5-5` (configured model; the serving model was not verified)  
**Date:** 2026-10-09  
**Fresh conversation:** yes, one new subagent conversation per worker

**Verbatim output:**

````
| # | First name | Last name | Email | Phone | Shipping address |
|---|---|---|---|---|---|
| 1 | Eleanor | Whitcombe | worker2.customer001@example.com | 07700 900214 | 14 Alder Close, Harrogate, North Yorkshire, HG1 4QT |
| 2 | Rhys | Pritchard | worker2.customer002@example.com | 07700 900358 | 27 Castle Terrace, Cardiff, CF10 3BE |
| 3 | Priya | Natarajan | worker2.customer003@example.com | 07700 900472 | Flat 6, 9 Mill Lane, Leicester, LE2 7HS |
| 4 | Callum | Dunmore | worker2.customer004@example.com | 07700 900586 | 52 Kirkgate, Perth, PH1 5UF |
| 5 | Imogen | Fairweather | worker2.customer005@example.com | 07700 900631 | 3 Harbour View, Falmouth, Cornwall, TR11 3AX |

All of this is fictional. The phone numbers are in the 07700 900xxx range, which Ofcom reserves for drama and test use, and the emails use the reserved example.com domain. Street names and postcodes look realistic, but they are invented and may not match real properties.
````

## Worker 3: corrected prompt, separate new chat (replace {N} with 3 and {NNN} stays as written)

**Prompt (paste exactly):**

```
You are worker 3 of 4, and the other three workers are running this same prompt separately.
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
Every email must be unique across all records and across all four workers: use the format worker3.customer{NNN}@example.com, where 3 is your worker number and {NNN} counts up from 001 within your records. Do not reuse any email.
```

**Model:** `claude-sonnet-5-5` (configured model; the serving model was not verified)  
**Date:** 2026-10-09  
**Fresh conversation:** yes, one new subagent conversation per worker

**Verbatim output:**

````
Here are 5 fictional customer records for TechShop checkout tests (worker 3). All names, phone numbers and addresses are invented. Phone numbers use the Ofcom drama range (07700 900xxx), which is reserved for fictional use.

| # | First name | Last name | Email | Phone | Shipping address |
|---|---|---|---|---|---|
| 1 | Imogen | Hartley | worker3.customer001@example.com | 07700 900301 | 14 Alder Close, Harrogate, North Yorkshire, HG1 4QT |
| 2 | Rhys | Pritchard | worker3.customer002@example.com | 07700 900302 | 27 Bryn Road, Swansea, West Glamorgan, SA2 0AP |
| 3 | Fiona | McAllister | worker3.customer003@example.com | 07700 900303 | 8 Thistle Lane, Perth, Perth and Kinross, PH1 5RB |
| 4 | Tobias | Whitcombe | worker3.customer004@example.com | 07700 900304 | 52 Orchard Way, Taunton, Somerset, TA1 3JL |
| 5 | Amara | Okonkwo | worker3.customer005@example.com | 07700 900305 | 3 Kingsway Mews, Leicester, Leicestershire, LE1 7DA |

Emails run from worker3.customer001 to worker3.customer005 and follow the required format, so they won't clash with the other workers' records. The streets are made up and the postcodes are only plausible for each town, so don't use them for real delivery or address validation.
````

## Worker 4: corrected prompt, separate new chat (replace {N} with 4 and {NNN} stays as written)

**Prompt (paste exactly):**

```
You are worker 4 of 4, and the other three workers are running this same prompt separately.
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
Every email must be unique across all records and across all four workers: use the format worker4.customer{NNN}@example.com, where 4 is your worker number and {NNN} counts up from 001 within your records. Do not reuse any email.
```

**Model:** `claude-sonnet-5-5` (configured model; the serving model was not verified)  
**Date:** 2026-10-09  
**Fresh conversation:** yes, one new subagent conversation per worker

**Verbatim output:**

````
Here are 5 fictional customer records for TechShop checkout tests. All data is made up. Phone numbers use the Ofcom drama range (07700 900xxx), and the addresses are invented, so they shouldn't map to real people.

| # | First name | Last name | Email | Phone | Shipping address |
|---|---|---|---|---|---|
| 1 | Oliver | Hartley | worker4.customer001@example.com | 07700 900401 | 14 Maple Grove, Chorlton, Manchester M21 8QR |
| 2 | Priya | Nair | worker4.customer002@example.com | 07700 900402 | 52 Kingsway Road, Headingley, Leeds LS6 3HT |
| 3 | Callum | Reid | worker4.customer003@example.com | 07700 900403 | 7 Harbour View, Leith, Edinburgh EH6 7BN |
| 4 | Megan | Powell | worker4.customer004@example.com | 07700 900404 | 23 Castle Street, Roath, Cardiff CF24 3AD |
| 5 | Tom | Whitaker | worker4.customer005@example.com | 07700 900405 | 91 Queens Park Avenue, Bristol BS3 4LP |

The emails follow the worker4.customer{NNN}@example.com format (001 to 005), so they won't collide with the other workers' records.

The postcodes are in realistic formats, but they may not match the street names exactly. That's fine for checkout form validation tests. If your tests call a postcode lookup service, swap in real addresses first.
````

## What to check when capturing

- Run in four separate new chats, as in the BEFORE capture, with N replaced by 1 to 4 (already done in the prompts above).
- Run the duplicate checker on the four tables. Expected: no email repeats, and every email follows `workerN.customerNNN@example.com`.
- Still verify by hand: Claude may ignore the format on one record. The fix lives in the prompt, not in CI, and the check is still the learner's job.

## Result of the duplicate check

20 email occurrences, 20 distinct, **0 repeated**. All emails follow `workerN.customerNNN@example.com` with N matching the worker and NNN running 001 to 005. Phone numbers and surnames still overlap in places (for example Rhys Pritchard, `07700 900358`, appears in both worker 2's output and the earlier before-run), so the fix only covers the field the prompt names.
