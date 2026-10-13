# Weak prompt: Generate some user data.

**Used in:** 1.2.6 walkthrough steps 2 and 3

**STATUS: CAPTURED via subagent runs on 2026-10-09, not typed into claude.ai.** Each run was a separate Claude instance given the lesson's prompt text with a short instruction to answer without tools. Output is unedited. Re-run in a real chat before go-live if exact fidelity matters.

## Weak prompt (new conversation)

**Prompt (paste exactly):**

```
Generate some user data.
```

**Model:** `claude-sonnet-5-5` (configured model; the serving model was not verified)  
**Date:** 2026-10-09  
**Conversation:** new subagent conversation

**Verbatim output:**

````
Here's a sample set of synthetic user records you can use for testing:

```json
[
  {
    "id": 1,
    "first_name": "Amara",
    "last_name": "Okafor",
    "email": "amara.okafor@example.com",
    "age": 29,
    "country": "Nigeria",
    "plan": "pro",
    "signup_date": "2026-01-14",
    "is_active": true
  },
  {
    "id": 2,
    "first_name": "Liam",
    "last_name": "Walsh",
    "email": "liam.walsh@example.com",
    "age": 41,
    "country": "Ireland",
    "plan": "free",
    "signup_date": "2026-02-03",
    "is_active": true
  },
  {
    "id": 3,
    "first_name": "Mei",
    "last_name": "Tanaka",
    "email": "mei.tanaka@example.com",
    "age": 34,
    "country": "Japan",
    "plan": "enterprise",
    "signup_date": "2025-11-22",
    "is_active": true
  },
  {
    "id": 4,
    "first_name": "Diego",
    "last_name": "Ramírez",
    "email": "diego.ramirez@example.com",
    "age": 23,
    "country": "Mexico",
    "plan": "free",
    "signup_date": "2026-05-09",
    "is_active": false
  },
  {
    "id": 5,
    "first_name": "Sofia",
    "last_name": "Lindqvist",
    "email": "sofia.lindqvist@example.com",
    "age": 52,
    "country": "Sweden",
    "plan": "pro",
    "signup_date": "2025-08-30",
    "is_active": true
  }
]
```

All names, emails, and details are fictional, and the emails use the reserved `example.com` domain so they won't hit real inboxes.

Since this looks like QA work, I can also generate:
- A larger set (50, 100, or more records) as JSON, CSV, or SQL inserts
- Edge cases, such as empty fields, very long names, special characters, invalid emails, and boundary ages
- Extra fields like addresses, phone numbers, or order history

Tell me the format, count, and fields you need.
````

## What to check when capturing

- The lesson says to expect a format Claude chose (a JSON array or a Markdown table), five to ten records, and fields nobody asked for (id, username, date of birth, maybe role or status).
- Record: format chosen, number of records, extra fields, and whether anything requires the values to be fictional or unique.
