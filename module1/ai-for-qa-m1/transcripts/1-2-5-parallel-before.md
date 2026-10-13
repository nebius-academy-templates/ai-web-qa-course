# Parallel increment, BEFORE: no uniqueness instruction

**Used in:** 1.2.5 (the named failure mode the syllabus requires: generated values repeated across records or CI workers)

**STATUS: CAPTURED via subagent runs on 2026-10-09, not typed into claude.ai.** Each run was a separate Claude instance given the lesson's prompt text with a short instruction to answer without tools. Output is unedited. Re-run in a real chat before go-live if exact fidelity matters.

## Worker 1: same prompt, separate new chat

**Prompt (paste exactly):**

```
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
```

**Model:** `claude-sonnet-5-5` (configured model; the serving model was not verified)  
**Date:** 2026-10-09  
**Fresh conversation:** yes, one new subagent conversation per worker

**Verbatim output:**

````
Here are 5 fictional customer records for TechShop checkout testing. The names, emails and phone numbers are made up. The phone numbers use Ofcom's reserved drama ranges, so they won't connect to real people. The emails use the reserved `example.com` domain. The street addresses are invented, and the postcodes are realistic in format but not tied to real properties.

| # | First name | Last name | Email | Phone | Shipping address |
|---|-----------|-----------|-------|-------|------------------|
| 1 | Eleanor | Whitfield | eleanor.whitfield@example.com | 020 7946 0321 | 14 Harcourt Lane, London, SW11 3QT |
| 2 | Rajesh | Patel | rajesh.patel@example.com | 0161 496 0872 | 7 Alderley Court, Manchester, M20 4HB |
| 3 | Siobhan | McAllister | siobhan.mcallister@example.com | 0141 496 0455 | 52 Kelvin Row, Glasgow, G12 8LP |
| 4 | Tomasz | Kowalczyk | tomasz.kowalczyk@example.com | 07700 900316 | Flat 3, 21 Priory Road, Bristol, BS6 7NR |
| 5 | Megan | Llewellyn | megan.llewellyn@example.com | 029 2018 0743 | 9 Castle View, Cardiff, CF10 3AZ |

**Notes for your tests:**
- The records cover a mix of England, Scotland and Wales, with a flat address (Flat 3) and a mobile number (07700 900xxx) to test varied input formats.
- If your checkout validates postcodes against a real address lookup, some of these may fail. In that case, swap in postcodes from your test environment's allowlist.
- I can also produce these as CSV or JSON, or add edge cases such as long names, apostrophes, hyphens, accented characters or Northern Ireland (BT) postcodes.
````

## Worker 2: same prompt, separate new chat

**Prompt (paste exactly):**

```
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
```

**Model:** `claude-sonnet-5-5` (configured model; the serving model was not verified)  
**Date:** 2026-10-09  
**Fresh conversation:** yes, one new subagent conversation per worker

**Verbatim output:**

````
Here are 5 fictional customer records for TechShop checkout testing. The names, emails and phone numbers are made up. The phone numbers use the UK's reserved drama ranges (e.g. 07700 900xxx), so they can't belong to real people. The emails use the reserved `example.com` domain. The street addresses follow real UK formats, but the house numbers and street and postcode combinations are invented and may not exist.

| # | First name | Last name | Email | Phone | Shipping address |
|---|-----------|-----------|-------|-------|------------------|
| 1 | Eleanor | Whitfield | eleanor.whitfield@example.com | 07700 900124 | 14 Marlow Close, Reading, Berkshire, RG1 4QT |
| 2 | Rhys | Pritchard | rhys.pritchard@example.com | 07700 900358 | 27 Castle Terrace, Cardiff, CF10 3NP |
| 3 | Aisha | Rahman | aisha.rahman@example.com | 07700 900472 | Flat 3, 52 Deansgate Mews, Manchester, M3 2BW |
| 4 | Callum | MacLeod | callum.macleod@example.com | 07700 900615 | 8 Thistle Gardens, Edinburgh, EH3 6RA |
| 5 | Priya | Nair | priya.nair@example.com | 07700 900839 | 101 Alder Road, Bristol, BS6 7JD |

A few notes for your tests:
- The records cover England, Wales and Scotland, plus a flat address, so you can check address-line handling.
- If your checkout validates postcodes against a real address database (e.g. via a postcode lookup API), these combinations may be rejected. In that case, swap in addresses that you know pass validation.
- If you need other cases, such as Northern Ireland (BT postcodes), names with apostrophes or hyphens, or very long address lines, I can add them.
````

## Worker 3: same prompt, separate new chat

**Prompt (paste exactly):**

```
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
```

**Model:** `claude-sonnet-5-5` (configured model; the serving model was not verified)  
**Date:** 2026-10-09  
**Fresh conversation:** yes, one new subagent conversation per worker

**Verbatim output:**

````
Here are 5 fictional customer records for TechShop checkout testing. All names, emails, phone numbers and street addresses are made up. The postcodes follow valid UK formats, but the street addresses are invented and may not exist. Phone numbers use the Ofcom-reserved drama ranges (07700 900xxx and 01632 960xxx), and emails use the reserved `example.com` domain, so none can reach a real person.

**1. Oliver Hartley**
- Email: oliver.hartley@example.com
- Phone: 07700 900142
- Shipping address: 14 Marlowe Close, Bristol, BS8 2QT

**2. Priya Venkataraman**
- Email: priya.venkataraman@example.com
- Phone: 07700 900287
- Shipping address: Flat 3, 27 Kingsley Road, Manchester, M14 5RJ

**3. Callum MacGregor**
- Email: callum.macgregor@example.com
- Phone: 07700 900355
- Shipping address: 8 Thistle Lane, Edinburgh, EH6 4NP

**4. Aisha Rahman-Clarke**
- Email: aisha.rahmanclarke@example.com
- Phone: 01632 960418
- Shipping address: 52 Brindley Street, Birmingham, B16 8TX

**5. Rhys Llewellyn**
- Email: rhys.llewellyn@example.com
- Phone: 07700 900569
- Shipping address: 3 Harbour View, Cardiff, CF10 5AL

These cover a mix of regions (England, Scotland and Wales), a flat with a unit number, a hyphenated surname, and both mobile and landline numbers. That should help you test address and name validation.

I can also produce them as CSV or JSON, or add edge cases such as apostrophes in names, very long addresses, or Northern Ireland postcodes.
````

## Worker 4: same prompt, separate new chat

**Prompt (paste exactly):**

```
Generate 5 fictional customer records for TechShop checkout tests. Include first name, last name, email, phone number and shipping address. Use realistic UK addresses and ensure all data is fictional.
```

**Model:** `claude-sonnet-5-5` (configured model; the serving model was not verified)  
**Date:** 2026-10-09  
**Fresh conversation:** yes, one new subagent conversation per worker

**Verbatim output:**

````
Here are 5 fictional customer records for TechShop checkout testing. The names, emails and phone numbers are made up. The phone numbers use Ofcom's reserved drama ranges (07700 900xxx, 020 7946 0xxx, 0161 496 0xxx, 0113 496 0xxx and 0131 496 0xxx), so they can't belong to real people. The emails use the reserved `example.com` domain, so they can't be delivered to a real inbox. The street addresses are realistic in format, but the building numbers are invented, and the postcodes are not tied to real properties, so treat them as test data only.

| # | First name | Last name | Email | Phone | Shipping address |
|---|-----------|-----------|-------|-------|------------------|
| 1 | Oliver | Hargreaves | oliver.hargreaves@example.com | 07700 900123 | 14 Maple Grove, Chorlton, Manchester, M21 8QT |
| 2 | Priya | Nair | priya.nair@example.com | 020 7946 0231 | Flat 3, 27 Elmwood Road, Camden, London, NW1 8AB |
| 3 | Callum | MacLeod | callum.macleod@example.com | 0131 496 0457 | 8 Thistle Court, Leith, Edinburgh, EH6 5NP |
| 4 | Sophie | Williams | sophie.williams@example.com | 07700 900688 | 52 Beaumont Street, Jesmond, Newcastle upon Tyne, NE2 3LR |
| 5 | Imogen | Thatcher | imogen.thatcher@example.com | 0113 496 0814 | 39 Orchard Lane, Headingley, Leeds, LS6 2DH |

**Notes for testing**
- If your checkout validates postcodes against a real address lookup (for example Royal Mail PAF or a third-party service), some of these may be rejected. In that case, swap in postcodes from a test fixture for that service.
- If you also need edge cases, I can add records with apostrophes or hyphens in names (e.g. O'Brien, Smith-Jones), long address lines, Channel Islands or Northern Ireland (BT) postcodes, or missing optional fields.
````

## What to check when capturing

- Run the prompt in **four separate new chats**, one per simulated parallel worker, using the identical text each time. This is what a CI pipeline does: each worker asks independently.
- Paste each worker's table above, then run `node scripts/check-duplicate-emails.ts` on the four files to list any email that appears in more than one record or more than one worker.
- **Not guaranteed to collide.** A run with no repeated emails proves nothing about the prompt, which is exactly the lesson's point. If four runs happen not to collide, record that honestly and run a few more workers; do not edit the data.
- This is the data-reuse pattern, **not** a concurrency defect (several processes updating one shared value). Keep the two apart in the write-up.

## Result of the duplicate check (`scripts/check-duplicate-emails.ts` over the four outputs)

20 email occurrences, 17 distinct, **3 emails repeated across workers**:

- `eleanor.whitfield@example.com`: workers 1 and 2
- `callum.macleod@example.com`: workers 2 and 4
- `priya.nair@example.com`: workers 2 and 4

Several names also repeated (Priya Nair, Callum MacLeod, Rhys, Aisha Rahman). This is the failure the lesson describes: four independent runs of the same prompt reuse the same values. It is data reuse across workers, not a concurrency defect. One run is not proof it always happens; the lesson should say "can", not "will".
