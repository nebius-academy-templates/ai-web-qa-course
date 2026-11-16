# Parallel increment, BEFORE: no uniqueness instruction

**Used in:** 1.2.5 (the named failure mode the syllabus requires: generated values repeated across records or CI workers)

**STATUS: CAPTURED in a real claude.ai chat on 2026-10-31.** The prompt was typed into the claude.ai web chat (signed-in Pro account, driven through a browser), and the output below is copied from that conversation's own data, unedited. This replaces the 2026-10-09 subagent capture.

## Worker 1: same prompt, separate new chat

**Prompt (paste exactly):**

```
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
```

**Model:** `claude-opus-5-5` (Opus 5.5, the default in the claude.ai model picker), effort Medium  
**Date:** 2026-10-31 (reply at 14:18 UTC)  
**Interface:** claude.ai web chat, Pro plan, no project. Account defaults left on: Claude Docs and artifacts, file creation, web search and chat memory.  
**Conversation:** `97747fd1-60fa-44c7-9742-1edba2e4d241` (new chat, one per worker)

**Verbatim output:**

````
Here are 5 fictional customer records for your TechShop checkout tests. Emails use the reserved `example.com` / `example.co.uk` domains, and phone numbers come from Ofcom's ranges reserved for fiction, so none of them can reach a real person.

| # | First name | Last name | Email | Phone | Shipping address |
|---|---|---|---|---|---|
| 1 | Oliver | Hartwell | oliver.hartwell@example.co.uk | 07700 900123 | 14 Fernleigh Road, Islington, London, N7 8QT |
| 2 | Priya | Mensah-Clarke | priya.mclarke@example.com | 0161 496 0457 | Flat 3, 22 Albion Crescent, Didsbury, Manchester, M20 4XJ |
| 3 | Callum | Rourke | c.rourke@example.co.uk | 0131 496 0782 | 9 Thistlebank Lane, Morningside, Edinburgh, EH10 5RW |
| 4 | Eleanor | Whitlock | ellie.whitlock@example.com | 07700 900846 | The Old Forge, 3 Mill Street, Bradford-on-Avon, Wiltshire, BA15 1LZ |
| 5 | Dafydd | Prys-Owen | dafydd.prysowen@example.co.uk | 029 2018 0391 | 57 Heol Glanffrwd, Canton, Cardiff, CF11 9PD |

A few notes for testing:

- **Edge cases built in:** a flat number in the first address line (#2), a named house with no simple street number (#4), hyphenated surnames (#2, #5), and a Welsh street name (#5). These are all useful for catching validation bugs.
- **Postcodes** follow valid UK formats but the street/postcode combinations are invented. If your checkout validates against a live address lookup (e.g. Royal Mail PAF), these may be rejected. In that case you'll need your provider's sandbox test addresses.
- **Phone #5** uses Cardiff's 029 2018 0xxx range, which Ofcom also reserves for drama use.

Want these as a CSV or JSON file, or with extra fields like billing address or test card numbers from your payment provider's sandbox?
````

## Worker 2: same prompt, separate new chat

**Prompt (paste exactly):**

```
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
```

**Model:** `claude-opus-5-5` (Opus 5.5, the default in the claude.ai model picker), effort Medium  
**Date:** 2026-10-31 (reply at 14:19 UTC)  
**Interface:** claude.ai web chat, Pro plan, no project. Account defaults left on: Claude Docs and artifacts, file creation, web search and chat memory.  
**Conversation:** `b79ba642-ee33-4fe0-80b5-07317c4c7e13` (new chat, one per worker)

**Verbatim output:**

````
Here are 5 fictional customer records. Phone numbers come from Ofcom's ranges reserved for fiction and testing, and emails use the reserved `example.co.uk` domain, so none of them can reach a real person.

| # | First name | Last name | Email | Phone | Shipping address |
|---|---|---|---|---|---|
| 1 | Harriet | Pemberton | harriet.pemberton@example.co.uk | 07700 900123 | 14 Larkspur Close, Harrogate, North Yorkshire, HG2 9XQ |
| 2 | Rajan | Mistry | rajan.mistry@example.co.uk | 020 7946 0451 | Flat 3, 27 Calloway Road, London, SE15 6ZT |
| 3 | Siobhan | Doherty | s.doherty@example.co.uk | 0161 496 0782 | 8 Thornbury Mews, Stockport, Greater Manchester, SK4 7QW |
| 4 | Owen | Llewellyn | owen.llewellyn@example.co.uk | 029 2018 0349 | 52 Penrhos Avenue, Cardiff, CF14 9ZJ |
| 5 | Callum | Fraser | callum.fraser88@example.co.uk | 0131 496 0215 | 2F1, 19 Brunstane Terrace, Edinburgh, EH7 4YX |

Street names are invented and the postcodes follow valid UK formatting for each area. The variety is useful for testing: a flat number on its own line, a Scottish tenement-style flat reference ("2F1"), a hyphen-free Welsh surname and a name with a numeric email.

One thing to watch: if your checkout validates addresses against a live lookup such as Royal Mail PAF or getAddress.io, these invented postcodes will fail. For those tests you'd need the provider's sandbox or test postcodes. I can also put these in CSV or JSON for your test fixtures if that helps.
````

## Worker 3: same prompt, separate new chat

**Prompt (paste exactly):**

```
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
```

**Model:** `claude-opus-5-5` (Opus 5.5, the default in the claude.ai model picker), effort Medium  
**Date:** 2026-10-31 (reply at 14:19 UTC)  
**Interface:** claude.ai web chat, Pro plan, no project. Account defaults left on: Claude Docs and artifacts, file creation, web search and chat memory.  
**Conversation:** `742b91b3-f7b5-4ac0-9a6f-2a1b06997e9a` (new chat, one per worker)

**Verbatim output:**

````
Here are 5 fictional customer records. Emails use the reserved `example.com` domain and phone numbers come from Ofcom's ranges set aside for fiction and testing, so none of them can reach a real person. Street names are invented, and postcodes follow the correct UK format for each area.

| # | First name | Last name | Email | Phone | Shipping address |
|---|---|---|---|---|---|
| 1 | Eleanor | Whitcombe | eleanor.whitcombe@example.com | 07700 900142 | Flat 3, 27 Larkspur Mews, London, SE15 4QZ |
| 2 | Rajesh | Pemberton | r.pemberton@example.com | 0161 496 0387 | 14 Thornfield Crescent, Didsbury, Manchester, M20 6XJ |
| 3 | Siobhan | Gallagher | siobhan.g@example.com | 07700 900815 | 8 Cranleigh Gardens, Clifton, Bristol, BS8 3PW |
| 4 | Tomasz | Ellery | tomasz.ellery@example.com | 0131 496 0254 | 2F1, 46 Brackenhill Place, Edinburgh, EH9 2LT |
| 5 | Amara | Fenwick-Hale | amara.fh@example.com | 0113 496 0671 | Rosewood Cottage, 5 Millbrook Lane, Headingley, Leeds, LS6 3DN |

A few things built in for checkout coverage: a flat number (record 1), an Edinburgh tenement-style address (record 4), a named house plus street (record 5), a hyphenated surname (record 5), and a mix of mobile and landline formats.

One caution: if TechShop validates addresses against a live postcode lookup such as Royal Mail PAF, these may fail, since the streets don't exist. For those tests you'd need your provider's test addresses instead.

Want these as CSV or JSON, or with extra edge cases like long names, apostrophes (O'Neill) or BFPO addresses?
````

## Worker 4: same prompt, separate new chat

**Prompt (paste exactly):**

```
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
```

**Model:** `claude-opus-5-5` (Opus 5.5, the default in the claude.ai model picker), effort Medium  
**Date:** 2026-10-31 (reply at 14:20 UTC)  
**Interface:** claude.ai web chat, Pro plan, no project. Account defaults left on: Claude Docs and artifacts, file creation, web search and chat memory.  
**Conversation:** `7d332fd0-cac4-4454-a635-d205b6d5325e` (new chat, one per worker)

**Verbatim output:**

````
Here are 5 fictional customer records. Emails use the reserved `example.com` domain and phone numbers come from Ofcom's range set aside for drama and fiction (07700 900xxx), so nothing will reach a real person. Street names are invented, while towns and postcode formats are realistic so they pass UK address validation.

| # | First name | Last name | Email | Phone | Shipping address |
|---|---|---|---|---|---|
| 1 | Eleanor | Whitfield | eleanor.whitfield@example.com | 07700 900142 | 14 Larkspur Close, Harrogate, North Yorkshire, HG2 7QX |
| 2 | Rajan | Mistry | rajan.mistry@example.com | 07700 900387 | Flat 3, 22 Coppergate Road, Leicester, LE2 9TB |
| 3 | Siobhan | Gallagher | s.gallagher@example.com | 07700 900519 | 7 Thornfield Terrace, Bristol, BS6 8RW |
| 4 | Thomas | Ellery | tom.ellery@example.com | 07700 900764 | 41 Kestrel Way, Norwich, Norfolk, NR4 6LJ |
| 5 | Amara | Okafor | amara.okafor@example.com | 07700 900905 | 118 Marlowe Avenue, Glasgow, G12 0PZ |

And as JSON for test fixtures:

```json
[
  {"firstName": "Eleanor", "lastName": "Whitfield", "email": "eleanor.whitfield@example.com", "phone": "07700 900142", "address": {"line1": "14 Larkspur Close", "line2": "", "city": "Harrogate", "county": "North Yorkshire", "postcode": "HG2 7QX", "country": "GB"}},
  {"firstName": "Rajan", "lastName": "Mistry", "email": "rajan.mistry@example.com", "phone": "07700 900387", "address": {"line1": "Flat 3", "line2": "22 Coppergate Road", "city": "Leicester", "county": "", "postcode": "LE2 9TB", "country": "GB"}},
  {"firstName": "Siobhan", "lastName": "Gallagher", "email": "s.gallagher@example.com", "phone": "07700 900519", "address": {"line1": "7 Thornfield Terrace", "line2": "", "city": "Bristol", "county": "", "postcode": "BS6 8RW", "country": "GB"}},
  {"firstName": "Thomas", "lastName": "Ellery", "email": "tom.ellery@example.com", "phone": "07700 900764", "address": {"line1": "41 Kestrel Way", "line2": "", "city": "Norwich", "county": "Norfolk", "postcode": "NR4 6LJ", "country": "GB"}},
  {"firstName": "Amara", "lastName": "Okafor", "email": "amara.okafor@example.com", "phone": "07700 900905", "address": {"line1": "118 Marlowe Avenue", "line2": "", "city": "Glasgow", "county": "", "postcode": "G12 0PZ", "country": "GB"}}
]
```

The postcodes are valid in format and use real outward codes, but the full postcodes may not exist. If your checkout calls a live postcode lookup service, such as Royal Mail PAF, you may need to swap in known-valid test postcodes from that provider's sandbox. I can also add edge cases, such as names with apostrophes or hyphens, long address lines, or a BFPO address.
````

## What to check when capturing

- Run the prompt in **four separate new chats**, one per simulated parallel worker, using the identical text each time. This is what a CI pipeline does: each worker asks independently.
- Paste each worker's table above, then run `node scripts/check-duplicate-emails.ts` on the four files to list any email that appears in more than one record or more than one worker.
- **Not guaranteed to collide.** A run with no repeated emails proves nothing about the prompt, which is exactly the lesson's point. If four runs happen not to collide, record that honestly and run a few more workers; do not edit the data.
- This is the data-reuse pattern, **not** a concurrency defect (several processes updating one shared value). Keep the two apart in the write-up.

## Result of the duplicate check (`scripts/check-duplicate-emails.ts` over the four outputs)

20 email occurrences, 20 distinct, **0 repeated**. The named failure did not reproduce on emails in this run. Each worker built emails from its own made-up names, sometimes on different domains (`example.com`, `example.co.uk`).

Other fields did repeat across workers. That is the same data-reuse failure, on fields the checker doesn't look at:

- Phone `07700 900123`: workers 1 and 2. Phone `07700 900142`: workers 3 and 4.
- Rajan Mistry: workers 2 and 4. Siobhan Gallagher: workers 3 and 4.
- 14 Larkspur Close, Harrogate: workers 2 and 4 (with different postcodes).

For the lesson: emails are not guaranteed to collide, as the notes above warn, so the text should say "can", not "will". A phone or name uniqueness check would have caught this run. If the demo needs an email collision, run more workers rather than editing the data. This is data reuse across workers, not a concurrency defect.

**Checker caveat:** run directly on this file, `check-duplicate-emails.ts` reports 5 repeated emails. They are not real duplicates: worker 4 shows the same records twice in one reply (a table plus a CSV or JSON copy), and the checker counts each copy. The counts above use only the tables. Strip the second copy, or check one copy per worker, before running it.
