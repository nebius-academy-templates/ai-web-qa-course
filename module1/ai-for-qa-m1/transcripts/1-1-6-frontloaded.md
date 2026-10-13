# Front-loaded mega-prompt (breakage experiment)

**Lesson:** 1.1.6 walkthrough (steps 9 and 10). Prompt text below is copied verbatim from the lesson.

**STATUS: CAPTURED via subagent runs on 2026-10-09, not typed into claude.ai.** Each run was a separate Claude instance given the lesson's prompt text with a short instruction to answer without tools. Output is unedited. Re-run in a real chat before go-live if exact fidelity matters.

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

**Model:** `claude-sonnet-5-5` (configured model; the serving model was not verified)  
**Date:** 2026-10-09  
**Conversation:** separate new subagent conversation

## Verbatim output

````
Below are functional test cases for TechShop Product Search, scoped to mobile phones only.

Assumptions (please confirm with the requirements):
- The search box accepts free text and returns matching mobile phones only (by name, brand, model).
- Search is case-insensitive and trims leading and trailing spaces.
- The maximum input length is 100 characters (adjust to the real limit).
- Non-phone products (laptops, headphones, cases) are in the catalog but must never appear in results.

| ID | Scenario | Test data | Expected result | Priority |
|---|---|---|---|---|
| **Positive** | | | | |
| TC-PS-001 | Search by exact brand | `Samsung` | Only Samsung phones are listed, each with name, image and price | High |
| TC-PS-002 | Search by exact model | `iPhone 15 Pro` | iPhone 15 Pro appears as the top result | High |
| TC-PS-003 | Search by partial keyword | `Galax` | Phones whose names contain "Galax" (e.g. Galaxy S24) are listed | High |
| TC-PS-004 | Case-insensitive search | `sAmSuNg`, `SAMSUNG`, `samsung` | All three return identical results | High |
| TC-PS-005 | Search by brand and model | `Xiaomi Redmi Note 13` | Matching Redmi Note 13 phones are listed | Medium |
| TC-PS-006 | Leading and trailing spaces | `  Pixel 8  ` | Spaces are trimmed; Pixel 8 results are shown | Medium |
| TC-PS-007 | Multiple spaces between words | `iPhone    15` | Results match `iPhone 15` (or no crash if not normalized) | Low |
| TC-PS-008 | Search triggered with the Enter key | Type `Nokia`, press Enter | Results are shown, same as clicking the search button | High |
| TC-PS-009 | Search triggered with the search button | Type `Nokia`, click Search | Nokia phones are listed | High |
| TC-PS-010 | Multi-word query matching several phones | `Samsung Galaxy` | All Galaxy phones are listed, sorted by relevance | Medium |
| TC-PS-011 | Search by spec or keyword, if supported | `5G`, `128GB` | Phones with that attribute are listed | Low |
| TC-PS-012 | Result count and pagination | `Samsung` with more results than the page size | Count is correct; pagination or load-more works; no duplicates across pages | Medium |
| TC-PS-013 | Result item navigation | Click a result from `iPhone 15` | The product detail page opens for the correct phone | High |
| TC-PS-014 | Search persists in the input after results load | `Pixel` | The query stays visible in the search box with results | Low |
| TC-PS-015 | Out-of-stock phone appears | Name of an out-of-stock phone | Phone is listed and marked "Out of stock" (or hidden, per requirements) | Medium |
| **Negative** | | | | |
| TC-PS-016 | No matching product | `Nonexistentphone999` | "No results found" message is shown; no error; suggestions optional | High |
| TC-PS-017 | Empty search | Empty field, click Search | No search runs, or a prompt appears ("Enter a search term"); no error page | High |
| TC-PS-018 | Whitespace-only input | `     ` | Treated as empty; no results listing the whole catalog by mistake | Medium |
| TC-PS-019 | Non-phone product query | `Dell laptop`, `AirPods`, `phone case` | No non-phone products are returned; "no results" is shown | High |
| TC-PS-020 | Mixed query: phone plus non-phone | `Samsung headphones` | Only phones (if any match) are returned; no headphones appear | Medium |
| TC-PS-021 | Numbers only | `12345` | "No results" message; no error | Low |
| TC-PS-022 | Special characters only | `@#$%^&*()` | "No results" message; page is stable | Medium |
| TC-PS-023 | Misspelled query | `Samsng` | "No results" or a "Did you mean Samsung?" suggestion; no error | Low |
| TC-PS-024 | Unsupported language and Unicode | `三星`, `Самсунг`, emoji `📱` | Handled gracefully; no garbled output; no server error | Low |
| TC-PS-025 | Discontinued or inactive phone | Name of a delisted phone | Phone is not shown in results | Medium |
| TC-PS-026 | Search while backend is unavailable | Simulate API 500 or timeout | A friendly error message with retry is shown; no stack trace exposed | Medium |
| TC-PS-027 | Network offline | Disconnect, then search `iPhone` | An offline or connection error message is shown; no blank page | Low |
| **Boundary** | | | | |
| TC-PS-028 | Minimum length: 1 character | `a` | Behaves per requirement (results shown or "enter at least 2 characters"); no error | Medium |
| TC-PS-029 | Just below the minimum, if one exists | 1 character when the minimum is 2 | A validation message is shown; no request is sent | Medium |
| TC-PS-030 | Exactly at the maximum length | String of 100 characters | Accepted; search runs; returns "no results" or valid results; no error | High |
| TC-PS-031 | One above the maximum length | String of 101 characters | Input is truncated or rejected with a message; no server error | High |
| TC-PS-032 | Result count: exactly one match | A unique model name | Exactly one result is displayed | Low |
| TC-PS-033 | Result count: exactly one page boundary | Query returning page size (e.g. 20) and page size + 1 results | Page 1 shows 20; the extra item appears on page 2 | Low |
| TC-PS-034 | Price or filter boundary, if filters exist | Min price = max price; price 0; negative price | Valid values filter correctly; invalid values are rejected | Low |
| **Security** | | | | |
| TC-PS-035 | SQL injection: tautology | `' OR '1'='1` | Treated as plain text; "no results" shown; no data leak, no SQL error | High |
| TC-PS-036 | SQL injection: comment and union | `' UNION SELECT username,password FROM users--` | Treated as plain text; no DB error or data returned | High |
| TC-PS-037 | SQL injection: destructive | `'; DROP TABLE products;--` | Query is parameterized; catalog is intact; no error | High |
| TC-PS-038 | Blind SQL injection (time-based) | `' OR SLEEP(5)--` | Response time is normal (no 5 s delay); no error | Medium |
| TC-PS-039 | NoSQL injection, if applicable | `{"$ne": null}` | Treated as plain text; no extra results | Medium |
| TC-PS-040 | Reflected XSS in the query | `<script>alert('XSS')</script>` | Script does not execute; the query is HTML-encoded when echoed ("Results for ...") | High |
| TC-PS-041 | XSS via attribute or event handler | `"><img src=x onerror=alert(1)>` | No alert; output is encoded | High |
| TC-PS-042 | XSS via URL parameter | `/search?q=<script>alert(1)</script>` | Script does not execute; value is sanitized | High |
| TC-PS-043 | Oversized input: very long string | 10,000 characters of `A` | Request rejected or truncated gracefully; no crash, no timeout, no 500 | High |
| TC-PS-044 | Oversized input: extreme size via URL or API | 1 MB payload in `q` | 413 or 414 (or validation error) returned; server stays responsive | Medium |
| TC-PS-045 | Command and template injection | `; ls -la`, `${7*7}`, `{{7*7}}` | Treated as plain text; `49` is never rendered; no command executed | Medium |
| TC-PS-046 | Path traversal | `../../etc/passwd` | Treated as plain text; no file content returned | Medium |
| TC-PS-047 | LDAP, header or CRLF injection | `%0d%0aSet-Cookie:x=1` | No header injection; input is sanitized | Low |
| TC-PS-048 | Null byte and control characters | `iPhone%00`, `\u0000` | Handled safely; no error or truncation exploit | Low |
| TC-PS-049 | Error message information disclosure | Malformed input such as `'` or `\` | Generic message only; no stack trace, SQL, or server details | High |
| TC-PS-050 | Rate limiting or abuse | 100+ rapid search requests from one client | Throttled (429) or remains stable; no degradation for other users | Medium |
| TC-PS-051 | Search is not scoped by authorization bypass | Craft API call with extra params (`category=laptops`, `admin=true`) | The mobile-phone-only restriction is enforced server-side; extra params ignored | Medium |
| TC-PS-052 | Search history or autocomplete leakage | Type a partial query; check suggestions | Suggestions show only public phone names, never other users' queries or hidden data | Low |
| **Non-functional checks tied to search** | | | | |
| TC-PS-053 | Response time | `Samsung` under normal load | Results appear in 2 seconds or less (confirm the SLA) | Medium |
| TC-PS-054 | Browser and device compatibility | Search `iPhone` on Chrome, Firefox, Safari, mobile viewport | Same behavior and layout on all | Low |

Summary: 54 cases (positive 15, negative 12, boundary 7, security 18, non-functional 2). High priority cases should go into the smoke and regression suites first. The security cases (TC-PS-035 to TC-PS-049) are best run with a proxy tool such as OWASP ZAP or Burp Suite for deeper coverage.
````

## Does the real output match the lesson's expectation?

**Yes.** One table (about 59 rows) with the same columns and security coverage as iteration 3, in a single reply. As the lesson says, nothing in it shows which cases came from the user's context and which from the model's assumptions (it states its own assumed length limits only at the top). Compare directly with iteration 3 to judge reviewability.
