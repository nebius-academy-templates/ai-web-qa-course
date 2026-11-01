# Front-loaded mega-prompt (breakage experiment)

**Lesson:** 1.1.6 walkthrough (steps 9 and 10). Prompt text below is copied verbatim from the lesson.

**STATUS: CAPTURED in a real claude.ai chat on 2026-10-31.** The prompt was typed into the claude.ai web chat (signed-in Pro account, driven through a browser), and the output below is copied from that conversation's own data, unedited. This replaces the 2026-10-09 subagent capture.

## Prompt (paste exactly, in the conversation the lesson names)

```
You are a QA engineer for TechShop. Generate functional test cases for the Product Search feature — the user can search for mobile phones only. Include positive, negative, boundary and security scenarios (injection, oversized input). For each case: ID, scenario, test data, expected result, priority (High / Medium / Low). Return a table.
```

## What the lesson says to expect

The same ground as iteration 3 in one block: similar cases, similar table. The reviewer reads it cold, with no earlier response to compare against, and nothing says which cases came from the user's context and which from the model's assumptions.

## Reviewer's step (the HITL role)

Open a second new conversation. Compare the two paths:

- Which output is easier to review?
- Where in the one-shot output would a mistake hide longest?
- How many tokens did each path consume? A rough feel, not exact numbers.

## Run details

**Model:** `claude-opus-5-5` (Opus 5.5, the default in the claude.ai model picker), effort Medium  
**Date:** 2026-10-31 (reply at 14:15 UTC)  
**Interface:** claude.ai web chat, Pro plan, no project. Account defaults left on: Claude Docs and artifacts, file creation, web search and chat memory.  
**Conversation:** `31605083-c30d-42b7-80d0-9bf153447f47` (separate new chat)

## Verbatim output

````
Here's a functional test suite for TechShop's Product Search. Since no spec was given, I've assumed a **search field limit of 100 characters** and a **minimum of 2 characters** to trigger search; adjust the boundary values to match your requirements.

| ID | Type | Scenario | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|
| PS-001 | Positive | Search by exact phone model name | `iPhone 15` | Matching iPhone 15 models listed; results relevant and ranked by relevance | High |
| PS-002 | Positive | Search by brand only | `Samsung` | All Samsung mobile phones returned | High |
| PS-003 | Positive | Partial keyword match | `Galax` | Samsung Galaxy phones returned | High |
| PS-004 | Positive | Case-insensitive search | `PIXEL 8`, `pixel 8`, `PiXeL 8` | Identical results for all variants | High |
| PS-005 | Positive | Leading/trailing spaces trimmed | `␣␣Nokia␣␣` | Same results as `Nokia` | Medium |
| PS-006 | Positive | Search by spec/attribute | `128GB`, `5G` | Phones matching that attribute returned | Medium |
| PS-007 | Positive | Multi-word query in different order | `Pro iPhone 15` | Same/similar results as `iPhone 15 Pro` | Medium |
| PS-008 | Positive | Search triggered by Enter key and by Search button | `Xiaomi` + Enter / click | Both trigger search with identical results | Medium |
| PS-009 | Positive | Pagination of large result set | `phone` | Results paginated correctly; no duplicates or gaps across pages | Medium |
| PS-010 | Positive | Typo tolerance (if supported) | `Samsnug` | "Did you mean Samsung?" suggestion or fuzzy results | Low |
| PS-011 | Negative | Non-phone product (category restriction) | `laptop`, `headphones`, `TV` | No results / "Only mobile phones are available" message; no non-phone items shown | High |
| PS-012 | Negative | Phone accessory not shown as phone | `iPhone case`, `charger` | No accessories in results (only phones, if any match) | High |
| PS-013 | Negative | Non-existent phone model | `iPhone 99` | "No results found" message with suggestions; no error | High |
| PS-014 | Negative | Empty search | *(blank)* | Search not submitted, or validation message "Enter a search term" | High |
| PS-015 | Negative | Whitespace only | `␣␣␣␣` | Treated as empty; validation message shown | Medium |
| PS-016 | Negative | Special characters only | `@#$%^&*` | "No results found"; no crash or server error | Medium |
| PS-017 | Negative | Emoji input | `📱📱` | Handled gracefully; no results or encoding error | Low |
| PS-018 | Negative | Non-Latin / Unicode text | `телефон`, `手机` | Handled gracefully; correct encoding, no 500 error | Low |
| PS-019 | Boundary | Below minimum length | `a` (1 char) | Validation message or no search triggered | Medium |
| PS-020 | Boundary | Exactly minimum length | `LG` (2 chars) | Search executes; LG phones returned | Medium |
| PS-021 | Boundary | Max length − 1 | 99-char string | Search executes normally | Medium |
| PS-022 | Boundary | Exactly max length | 100-char string | Search executes normally | Medium |
| PS-023 | Boundary | Max length + 1 | 101-char string | Input blocked at 100 chars or validation message shown | Medium |
| PS-024 | Security | SQL injection | `' OR '1'='1`, `'; DROP TABLE products;--` | Treated as literal text; no DB error exposed; no unintended data returned; table intact | High |
| PS-025 | Security | Reflected XSS | `<script>alert(1)</script>` | Input escaped/encoded on results page; no script execution | High |
| PS-026 | Security | XSS via attribute/event handler | `"><img src=x onerror=alert(1)>` | Rendered as plain text; no script execution | High |
| PS-027 | Security | NoSQL injection (if applicable) | `{"$ne": null}` | Treated as literal string; no data leakage | High |
| PS-028 | Security | Oversized input via API (bypassing UI limit) | 10,000+ char query sent directly to search endpoint | Server rejects with 400/413; no crash, timeout, or stack trace | High |
| PS-029 | Security | Extremely large payload (DoS attempt) | 1 MB+ query string | Request rejected quickly; service remains available | High |
| PS-030 | Security | Category filter tampering | Modify request param `category=phones` → `category=all` | Server enforces phone-only scope; non-phone products not returned | High |
| PS-031 | Security | Error message disclosure | Malformed query (e.g. `%00`, unbalanced quotes) | Generic error message; no stack trace, SQL, or server details exposed | High |
| PS-032 | Security | Rate limiting | 500 searches in 10 seconds from one client | Throttled (e.g. HTTP 429) after threshold; service stable | Medium |

A few notes on coverage: PS-011, PS-012 and PS-030 are the key tests for the "mobile phones only" rule, since that scope must be enforced server-side, not just in the UI. PS-028 and PS-029 matter because UI length limits are easily bypassed.

If you want, I can put this into a spreadsheet you can sort, filter and track execution status in.
````

## Does the real output match the lesson's expectation?

**Yes on content, partly on the reviewing point.** The lesson expects the same ground as iteration 3 in one block. Claude answered in the chat with a single 32-row table (10 positive, 8 negative, 5 boundary, 9 security), with the requested columns plus an extra Type column. The security cases include SQL injection, two XSS strings, NoSQL injection, oversized input sent to the API (10,000+ characters and 1 MB+), category-parameter tampering, error-message disclosure and rate limiting. Unlike iteration 1, it did not create a document.

The lesson says nothing in the one-shot output shows which cases came from the user's context and which from the model's assumptions. This run did flag its two main assumptions in the first paragraph (a 100-character limit and a 2-character minimum) and said the boundary values follow from them, so the reviewer has somewhere to start. Other assumptions, such as typo tolerance, pagination and the rate-limit threshold, are not flagged.
