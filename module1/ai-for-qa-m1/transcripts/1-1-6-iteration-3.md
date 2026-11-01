# Iteration 3: close the loop

**Lesson:** 1.1.6 walkthrough (steps 7 and 8). Prompt text below is copied verbatim from the lesson.

**STATUS: CAPTURED in a real claude.ai chat on 2026-10-31.** The prompt was typed into the claude.ai web chat (signed-in Pro account, driven through a browser), and the output below is copied from that conversation's own data, unedited. This replaces the 2026-10-09 subagent capture.

## Prompt (paste exactly, in the conversation the lesson names)

```
Generate functional test cases for TechShop's Product Search feature. The user can search for mobile phones only. Include positive, negative, and boundary scenarios, plus security scenarios (injection in the search field, oversized input). For each test case give: ID, scenario, test data, expected result, and priority (High / Medium / Low). Return a table.
```

## What the lesson says to expect

A table with all five columns (ID, scenario, test data, expected result, priority) and the security cases now present: an injection string in the search field, an oversized input, probably a special-character case. Priorities mostly High for the happy path and the injection case. Good enough to use: three iterations, each adding only what the previous review found missing.

## Reviewer's step (the HITL role)

Check all five columns are present and that the security cases are real (an actual injection string, an actual oversized input).

## Run details

**Model:** `claude-opus-5-5` (Opus 5.5, the default in the claude.ai model picker), effort Medium  
**Date:** 2026-10-31 (reply at 14:14 UTC)  
**Interface:** claude.ai web chat, Pro plan, no project. Account defaults left on: Claude Docs and artifacts, file creation, web search and chat memory.  
**Conversation:** `47f00cbd-3ca1-42c1-a643-0bf9670d7faf` (same chat as iterations 1 and 2)

## Verbatim output

Claude answered in the chat this time; the document from iterations 1 and 2 was not changed.

````
| ID | Scenario | Test data | Expected result | Priority |
|---|---|---|---|---|
| POS-01 | Search by exact phone name | iPhone 15 | iPhone 15 shown as top result | High |
| POS-02 | Search by brand | Samsung | Only Samsung phones listed | High |
| POS-03 | Search by model only | Pixel 8 | Google Pixel 8 returned | High |
| POS-04 | Multi-word search | Samsung Galaxy S24 | Galaxy S24 ranked first | High |
| POS-05 | Partial keyword | Galax | All Samsung Galaxy phones returned | Medium |
| POS-06 | Case-insensitive search | iPHONE / iphone / IPHONE | Same results for all variants | Medium |
| POS-07 | Leading and trailing spaces trimmed | "  OnePlus 12  " | Same results as "OnePlus 12" | Medium |
| POS-08 | Search by attribute | 5G, 256GB, dual SIM | Only phones with that attribute | Medium |
| POS-09 | Generic category term | phone, smartphone, mobile | All phones returned, no other categories | High |
| POS-10 | Brand shared with non-phone products | Apple | Only iPhones; no iPad, Mac, Watch | High |
| POS-11 | Product family shared with tablets | Galaxy | Galaxy phones only; no Galaxy Tab or Buds | High |
| POS-12 | Result card details | iPhone 15 | Card shows image, name, price, rating, stock status | High |
| POS-13 | Open result | Pixel 8 → click result | Pixel 8 product page opens | High |
| POS-14 | Brand and price filters | Brand = Apple, £200–£600 | Only Apple phones in range | High |
| POS-15 | Sort by price | Price: Low to High | Results in ascending price order | Medium |
| POS-16 | Autocomplete shows phones only | Type "Gal" | Suggests Galaxy phones only, no Galaxy Tab | High |
| NEG-01 | Empty search | (blank) | Not submitted, or "Enter a search term" | High |
| NEG-02 | Spaces only | "     " | Treated as empty search | Medium |
| NEG-03 | Search for a non-phone product | MacBook Air, iPad | "No results" message; no laptops or tablets | High |
| NEG-04 | Search for accessories | iPhone case, charger | No accessories listed | High |
| NEG-05 | Phone not stocked | Motorola Razr | "No results found" with suggestions | High |
| NEG-06 | Gibberish | xyzqwe123 | "No results" message; no error page | Medium |
| NEG-07 | Misspelling | iphnoe, samsng | "Did you mean…" or corrected results | Medium |
| NEG-08 | Category forced via URL | `&category=tablets` | Parameter ignored or rejected; phones only | High |
| NEG-09 | Invalid price range | Min £800, Max £200 | Validation message; filter not applied | Medium |
| NEG-10 | Non-numeric price | abc, -50 | Input rejected or validation message | Medium |
| BND-01 | Minimum length | a (1 character) | Results or minimum-length message; no error | Low |
| BND-02 | Just below max length | 254 characters | Accepted; search runs | Medium |
| BND-03 | At max length | 255 characters | Accepted; search runs | Medium |
| BND-04 | Just above max length | 256 characters | Capped at 255 or validation message | Medium |
| BND-05 | Price filter lower edge | Phone at £200; range £200–£600 | Phone included | High |
| BND-06 | Price filter upper edge | £600.00 and £600.01; range £200–£600 | £600.00 included; £600.01 excluded | High |
| BND-07 | Results equal page size | Exactly 20 results | One page; no Next control | Medium |
| BND-08 | Results one over page size | 21 results | Two pages; page 2 shows 1 phone | Medium |
| BND-09 | Exactly one result | OnePlus 12 | One card; count reads "1 result" | Low |
| SEC-01 | SQL injection | `' OR '1'='1' --` | Treated as plain text; no extra data, no DB error | High |
| SEC-02 | SQL injection (UNION) | `iphone' UNION SELECT username, password FROM users --` | No data leak; no-results or sanitised search | High |
| SEC-03 | Stored or reflected XSS | `<script>alert(1)</script>` | Script not executed; term shown escaped | High |
| SEC-04 | XSS via attribute | `"><img src=x onerror=alert(1)>` | No script runs; input encoded in page and URL | High |
| SEC-05 | NoSQL injection | `{"$gt": ""}` | Treated as text; no full catalogue dump or error | High |
| SEC-06 | Command injection | `iphone; ls -la` / `` `whoami` `` | Treated as text; no command runs | High |
| SEC-07 | HTML injection | `<h1>Hacked</h1>` | Rendered as text, not HTML | Medium |
| SEC-08 | Oversized input in the UI | 10,000 characters pasted | Input capped; no crash or timeout | High |
| SEC-09 | Oversized input via API | 1 MB query sent directly to the search endpoint | Rejected with 400/413; server stays responsive | High |
| SEC-10 | Error messages don't leak details | Malformed query (e.g. `%%%`, `\x00`) | Generic error; no stack trace, SQL or server details | High |
| SEC-11 | Rate limiting | 500 searches in 1 minute from one client | Throttled (e.g. 429); service stays available | Medium |

The boundary cases assume a 255-character input limit and 20 results per page. Swap in TechShop's real values if they differ.

I can also add this table to the TechShop doc from earlier if you'd like.
````

## Does the real output match the lesson's expectation?

**Mostly yes.** The lesson expects a five-column table with real security cases. Claude replied in the chat, not in the document, with exactly the five requested columns and 46 rows: 16 positive (POS-), 10 negative (NEG-), 9 boundary (BND-) and 11 security (SEC-). The security cases use real strings: `' OR '1'='1' --`, a UNION SELECT, `<script>alert(1)</script>`, an attribute-based XSS, NoSQL and command injection, a 10,000-character paste and a 1 MB API query. Priorities are High / Medium / Low as asked, with High on the happy path and on every injection case. The reply ends by offering to add the table to the earlier document.

What does not match is the story around it. The lesson presents iteration 3 as the first time these columns and security cases appear, but iterations 1 and 2 had already produced them.
