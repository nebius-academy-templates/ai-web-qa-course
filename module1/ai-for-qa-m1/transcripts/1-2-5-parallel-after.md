# Parallel increment, AFTER: explicit uniqueness rule

**Used in:** 1.2.5 (the corrected prompt)

**STATUS: CAPTURED in a real claude.ai chat on 2026-10-31.** The prompt was typed into the claude.ai web chat (signed-in Pro account, driven through a browser), and the output below is copied from that conversation's own data, unedited. This replaces the 2026-10-09 subagent capture.

## Worker 1: corrected prompt, separate new chat (replace {N} with 1 and {NNN} stays as written)

**Prompt (paste exactly):**

```
You are worker 1 of 4, and the other three workers are running this same prompt separately.
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
Every email must be unique across all records and across all four workers: use the format worker1.customer{NNN}@example.com, where 1 is your worker number and {NNN} counts up from 001 within your records. Do not reuse any email.
```

**Model:** `claude-opus-5-5` (Opus 5.5, the default in the claude.ai model picker), effort Medium  
**Date:** 2026-10-31 (reply at 14:20 UTC)  
**Interface:** claude.ai web chat, Pro plan, no project. Account defaults left on: Claude Docs and artifacts, file creation, web search and chat memory.  
**Conversation:** `26f9db61-3e97-4903-a434-2747c47bfcb9` (new chat, one per worker)

**Verbatim output:**

````
Here are 5 fictional customer records for worker 1. Phone numbers use Ofcom's reserved drama range (07700 900000–900999), so none of them can reach a real person. Street names are invented, and postcodes are plausible for each town.

| # | First name | Last name | Email | Phone | Shipping address |
|---|---|---|---|---|---|
| 1 | Eleanor | Whitcombe | worker1.customer001@example.com | 07700 900123 | 14 Larkspur Close, Harrogate, North Yorkshire, HG2 7QX |
| 2 | Rajan | Mehta-Collins | worker1.customer002@example.com | 07700 900456 | Flat 3, 27 Ferncroft Road, Bristol, BS7 9LJ |
| 3 | Siobhan | Archer | worker1.customer003@example.com | 07700 900789 | 82 Thornbury Lane, Chelmsford, Essex, CM2 6TW |
| 4 | Dominic | Fairley | worker1.customer004@example.com | 07700 900314 | 5 Kestrel Mews, Shrewsbury, Shropshire, SY3 8PD |
| 5 | Amara | Okonkwo-Hale | worker1.customer005@example.com | 07700 900628 | 41 Glenmore Crescent, Edinburgh, EH10 5RN |

Here is the same data as CSV, ready to paste:

```csv
first_name,last_name,email,phone,address_line1,address_line2,city,county,postcode
Eleanor,Whitcombe,worker1.customer001@example.com,07700 900123,14 Larkspur Close,,Harrogate,North Yorkshire,HG2 7QX
Rajan,Mehta-Collins,worker1.customer002@example.com,07700 900456,Flat 3,27 Ferncroft Road,Bristol,,BS7 9LJ
Siobhan,Archer,worker1.customer003@example.com,07700 900789,82 Thornbury Lane,,Chelmsford,Essex,CM2 6TW
Dominic,Fairley,worker1.customer004@example.com,07700 900314,5 Kestrel Mews,,Shrewsbury,Shropshire,SY3 8PD
Amara,Okonkwo-Hale,worker1.customer005@example.com,07700 900628,41 Glenmore Crescent,,Edinburgh,,EH10 5RN
```

The set includes a few edge cases that are useful in checkout tests: hyphenated surnames (records 2 and 5), a flat number on a second address line (record 2), and Scottish and Bristol addresses with no county.
````

## Worker 2: corrected prompt, separate new chat (replace {N} with 2 and {NNN} stays as written)

**Prompt (paste exactly):**

```
You are worker 2 of 4, and the other three workers are running this same prompt separately.
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
Every email must be unique across all records and across all four workers: use the format worker2.customer{NNN}@example.com, where 2 is your worker number and {NNN} counts up from 001 within your records. Do not reuse any email.
```

**Model:** `claude-opus-5-5` (Opus 5.5, the default in the claude.ai model picker), effort Medium  
**Date:** 2026-10-31 (reply at 14:21 UTC)  
**Interface:** claude.ai web chat, Pro plan, no project. Account defaults left on: Claude Docs and artifacts, file creation, web search and chat memory.  
**Conversation:** `ee998018-feea-4f18-b5d4-117ee087f058` (new chat, one per worker)

**Verbatim output:**

````
Here are 5 fictional customer records for worker 2. Phone numbers use Ofcom's reserved drama range (07700 900000–900999), so none can reach a real person. Streets and house numbers are invented, and the postcodes follow a realistic format for each town.

| # | First name | Last name | Email | Phone | Shipping address |
|---|---|---|---|---|---|
| 1 | Eleanor | Whitcombe | worker2.customer001@example.com | 07700 900214 | 14 Larkspur Close, Harrogate, North Yorkshire, HG2 7QD |
| 2 | Rajesh | Pattinson | worker2.customer002@example.com | 07700 900587 | Flat 3, 22 Merrion Terrace, Bristol, BS6 9LX |
| 3 | Siobhan | Calloway | worker2.customer003@example.com | 07700 900731 | 8 Thistledown Road, Norwich, Norfolk, NR4 6JF |
| 4 | Marcus | Fenwick-Hale | worker2.customer004@example.com | 07700 900046 | 57 Kelvinbrook Avenue, Glasgow, G12 8TW |
| 5 | Priya | Ashdown | worker2.customer005@example.com | 07700 900862 | 2 Orchard Mews, Lewes, East Sussex, BN7 1XR |

The same data as CSV:

```csv
first_name,last_name,email,phone,address_line1,city,county,postcode
Eleanor,Whitcombe,worker2.customer001@example.com,07700 900214,14 Larkspur Close,Harrogate,North Yorkshire,HG2 7QD
Rajesh,Pattinson,worker2.customer002@example.com,07700 900587,"Flat 3, 22 Merrion Terrace",Bristol,,BS6 9LX
Siobhan,Calloway,worker2.customer003@example.com,07700 900731,8 Thistledown Road,Norwich,Norfolk,NR4 6JF
Marcus,Fenwick-Hale,worker2.customer004@example.com,07700 900046,57 Kelvinbrook Avenue,Glasgow,,G12 8TW
Priya,Ashdown,worker2.customer005@example.com,07700 900862,2 Orchard Mews,Lewes,East Sussex,BN7 1XR
```

All emails use the reserved example.com domain, follow the worker2.customer{NNN} format, and run from 001 to 005 with no repeats.
````

## Worker 3: corrected prompt, separate new chat (replace {N} with 3 and {NNN} stays as written)

**Prompt (paste exactly):**

```
You are worker 3 of 4, and the other three workers are running this same prompt separately.
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
Every email must be unique across all records and across all four workers: use the format worker3.customer{NNN}@example.com, where 3 is your worker number and {NNN} counts up from 001 within your records. Do not reuse any email.
```

**Model:** `claude-opus-5-5` (Opus 5.5, the default in the claude.ai model picker), effort Medium  
**Date:** 2026-10-31 (reply at 14:21 UTC)  
**Interface:** claude.ai web chat, Pro plan, no project. Account defaults left on: Claude Docs and artifacts, file creation, web search and chat memory.  
**Conversation:** `eacca367-6370-4c34-b6e6-17f602159d11` (new chat, one per worker)

**Verbatim output:**

````
Here are 5 fictional customer records for worker 3:

| # | First name | Last name | Email | Phone | Shipping address |
|---|---|---|---|---|---|
| 1 | Eleanor | Whitcombe | worker3.customer001@example.com | 07700 900314 | 14 Larkspur Close, Harrogate, North Yorkshire, HG2 7QX |
| 2 | Rajan | Mistry | worker3.customer002@example.com | 07700 900582 | Flat 3, 27 Bramwell Road, Leicester, LE3 9TJ |
| 3 | Fiona | McAllister | worker3.customer003@example.com | 07700 900127 | 8 Glenmorrow Crescent, Paisley, Renfrewshire, PA2 8LW |
| 4 | Thomas | Pryce-Evans | worker3.customer004@example.com | 07700 900869 | 52 Heol Ffynnon, Carmarthen, Carmarthenshire, SA31 4DN |
| 5 | Amara | Okonkwo | worker3.customer005@example.com | 07700 900445 | 109 Saltmarsh Lane, Norwich, Norfolk, NR6 2BF |

The phone numbers fall in Ofcom's 07700 900000–900999 range, which is set aside for drama and fiction and is never assigned to real people. The emails use the reserved example.com domain, so no mail can reach a real inbox. Street names are invented. Town names and postcode formats are real UK ones, so they should pass address validation that only checks format. They won't pass a postcode lookup service, though.
````

## Worker 4: corrected prompt, separate new chat (replace {N} with 4 and {NNN} stays as written)

**Prompt (paste exactly):**

```
You are worker 4 of 4, and the other three workers are running this same prompt separately.
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
Every email must be unique across all records and across all four workers: use the format worker4.customer{NNN}@example.com, where 4 is your worker number and {NNN} counts up from 001 within your records. Do not reuse any email.
```

**Model:** `claude-opus-5-5` (Opus 5.5, the default in the claude.ai model picker), effort Medium  
**Date:** 2026-10-31 (reply at 14:22 UTC)  
**Interface:** claude.ai web chat, Pro plan, no project. Account defaults left on: Claude Docs and artifacts, file creation, web search and chat memory.  
**Conversation:** `15186d31-6452-4869-aceb-a4fad6a0e9fd` (new chat, one per worker)

**Verbatim output:**

````
Here are 5 fictional customer records for TechShop checkout tests. Phone numbers use Ofcom's 07700 900xxx range, which is reserved for drama and fiction, so none of them can reach a real person. Street names and house numbers are invented, and the town and postcode formats are realistic.

| # | First name | Last name | Email | Phone | Shipping address |
|---|---|---|---|---|---|
| 1 | Harriet | Pemberton | worker4.customer001@example.com | 07700 900412 | 14 Larkspur Close, Harrogate, North Yorkshire, HG2 7QX |
| 2 | Rhys | Calloway | worker4.customer002@example.com | 07700 900587 | Flat 3, 22 Thornbury Road, Cardiff, CF14 9LW |
| 3 | Priya | Ashdown | worker4.customer003@example.com | 07700 900139 | 7 Mill Brook Lane, Bath, Somerset, BA2 6TJ |
| 4 | Callum | Strachan | worker4.customer004@example.com | 07700 900764 | 41 Kelvinhaugh Gardens, Glasgow, G3 8NZ |
| 5 | Eleanor | Whitcombe | worker4.customer005@example.com | 07700 900926 | 9 Orchard Rise, Canterbury, Kent, CT2 0PF |

The same records as JSON, for fixtures:

```json
[
  {"firstName":"Harriet","lastName":"Pemberton","email":"worker4.customer001@example.com","phone":"07700 900412","address":{"line1":"14 Larkspur Close","line2":"","city":"Harrogate","county":"North Yorkshire","postcode":"HG2 7QX","country":"GB"}},
  {"firstName":"Rhys","lastName":"Calloway","email":"worker4.customer002@example.com","phone":"07700 900587","address":{"line1":"Flat 3","line2":"22 Thornbury Road","city":"Cardiff","county":"","postcode":"CF14 9LW","country":"GB"}},
  {"firstName":"Priya","lastName":"Ashdown","email":"worker4.customer003@example.com","phone":"07700 900139","address":{"line1":"7 Mill Brook Lane","line2":"","city":"Bath","county":"Somerset","postcode":"BA2 6TJ","country":"GB"}},
  {"firstName":"Callum","lastName":"Strachan","email":"worker4.customer004@example.com","phone":"07700 900764","address":{"line1":"41 Kelvinhaugh Gardens","line2":"","city":"Glasgow","county":"","postcode":"G3 8NZ","country":"GB"}},
  {"firstName":"Eleanor","lastName":"Whitcombe","email":"worker4.customer005@example.com","phone":"07700 900926","address":{"line1":"9 Orchard Rise","line2":"","city":"Canterbury","county":"Kent","postcode":"CT2 0PF","country":"GB"}}
]
```

All emails use the `worker4.customerNNN@example.com` prefix and run from 001 to 005, so they won't collide with the other three workers. The `example.com` domain is reserved and never delivers mail. If your checkout validates postcodes against a real lookup service such as PAF, these postcodes are in a valid format but may not resolve to these exact streets.
````

## What to check when capturing

- Run in four separate new chats, as in the BEFORE capture, with N replaced by 1 to 4 (already done in the prompts above).
- Run the duplicate checker on the four tables. Expected: no email repeats, and every email follows `workerN.customerNNN@example.com`.
- Still verify by hand: Claude may ignore the format on one record. The fix lives in the prompt, not in CI, and the check is still the learner's job.

## Result of the duplicate check

20 email occurrences, 20 distinct, **0 repeated**. Every email follows `workerN.customerNNN@example.com`, with N matching the worker and NNN running 001 to 005, so the prompt fix worked for the field it names.

It did nothing for the other fields, and in this run the overlap is worse than in the before run:

- Eleanor Whitcombe appears in all four workers, and 14 Larkspur Close, Harrogate appears in all four (HG2 7QX for workers 1 and 3, HG2 7QD for worker 2, and Harriet Pemberton at HG2 7QX for worker 4).
- Phone `07700 900314`: workers 1 and 3. Phone `07700 900587`: workers 2 and 4.
- Priya Ashdown: workers 2 and 4.
- Across both runs, `07700 900123` (before workers 1 and 2, after worker 1) and `07700 900764` (before worker 4, after worker 4) also repeat.

This supports the lesson's point that the fix only covers the field the prompt names. If the checkout tests key on phone number or address, each of those fields needs its own uniqueness rule.

**Checker caveat:** run directly on this file, `check-duplicate-emails.ts` reports 16 repeated emails. They are not real duplicates: workers 1, 2 and 4 each shows the same records twice in one reply (a table plus a CSV or JSON copy), and the checker counts each copy. The counts above use only the tables. Strip the second copy, or check one copy per worker, before running it.
