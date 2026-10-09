# Iteration 2: refine

**Lesson:** 1.1.6 walkthrough (steps 5 and 6). Prompt text below is copied verbatim from the lesson.

**STATUS: CAPTURED via subagent runs on 2026-10-09, not typed into claude.ai.** Each run was a separate Claude instance given the lesson's prompt text with a short instruction to answer without tools. Output is unedited. Re-run in a real chat before go-live if exact fidelity matters.

## Prompt (paste exactly, in the conversation the lesson names)

```
Generate functional test cases for TechShop's Product Search feature. Include positive, negative, and boundary test scenarios.
```

## What the lesson says to expect

A structured set, usually grouped under Positive / Negative / Boundary headings or laid out as a scenario-and-expected-result table: valid search, invalid model, partial keyword, empty input, case sensitivity and a few more. Coverage improved; priorities, test data and security scenarios are still missing, because nothing asked for them. The model considers its answer complete; the gap list is the reviewer's.

## Reviewer's step (the HITL role)

Note again what is missing: priorities, test data, security scenarios.

## Run details

**Model:** `claude-sonnet-5-5` (configured model; the serving model was not verified)  
**Date:** 2026-10-09  
**Conversation:** one subagent conversation shared by iterations 1, 2 and 3

## Verbatim output

````
Here are functional test cases for TechShop's Product Search, grouped into positive, negative, and boundary scenarios. I've kept the earlier assumption that search covers mobile phones only. Limits such as the maximum query length (I've used 100 characters) and the minimum characters before search runs are placeholders. Please confirm the real values from the requirements.

POSITIVE SCENARIOS

TC-P01 Search by exact model name
Precondition: The catalogue contains "iPhone 15 Pro".
Steps: Enter "iPhone 15 Pro" and submit.
Expected: The matching model and its variants are listed first. All results are mobile phones.

TC-P02 Search by brand
Steps: Enter "Samsung" and submit.
Expected: Only Samsung phones are returned.

TC-P03 Search by partial keyword
Steps: Enter "Galax".
Expected: Phones with "Galaxy" in the name are returned (if partial match is supported).

TC-P04 Case-insensitive search
Steps: Search "IPHONE", "iphone", "iPhone".
Expected: The three searches return identical results.

TC-P05 Search by specification
Steps: Enter "128GB" or "5G".
Expected: Phones with that spec are returned.

TC-P06 Multi-word query
Steps: Enter "Samsung Galaxy S24 Ultra".
Expected: The closest match is ranked first.

TC-P07 Submit with Enter key and with the Search button
Expected: Both methods give the same results.

TC-P08 Leading and trailing spaces
Steps: Enter "  Pixel 8  ".
Expected: Spaces are trimmed and Pixel 8 results are returned.

TC-P09 Results display
Expected: Each result shows image, name, price, and availability. The result count matches the number of items shown.

TC-P10 Open a result
Steps: Click a result.
Expected: The correct product detail page opens, and Back returns to the same results page.

TC-P11 Search with filters and sorting
Steps: Search "Samsung", then filter by price range and sort by price low-to-high.
Expected: Results satisfy the filters and are in the right order. Clearing filters restores the original list.

NEGATIVE SCENARIOS

TC-N01 Empty search
Steps: Submit with an empty box.
Expected: No crash. A prompt appears or a default list is shown, per the requirement.

TC-N02 Whitespace only
Steps: Enter spaces and submit.
Expected: Handled the same as an empty search.

TC-N03 No matching product
Steps: Enter "xyzabc123".
Expected: A friendly "No results found" message. No error page.

TC-N04 Non-phone product
Steps: Search "laptop", "tablet", or "iPhone charger".
Expected: No non-phone items are returned. A no-results message is shown, ideally stating that only mobile phones are searchable.

TC-N05 Misspelled term
Steps: Enter "Samsng".
Expected: "Did you mean...?" suggestions or a no-results message. No error.

TC-N06 Special characters only
Steps: Enter "@#$%^&*".
Expected: Handled gracefully with no error and no raw system message.

TC-N07 SQL injection
Steps: Enter ' OR '1'='1 and "; DROP TABLE products;--".
Expected: Treated as plain text. No data exposure and no database error shown.

TC-N08 Script injection
Steps: Enter <script>alert(1)</script>.
Expected: Input is escaped. No script runs, including when the query is echoed back on the results page.

TC-N09 Non-English text and emoji
Steps: Enter "手机" or an emoji.
Expected: No crash. A handled no-results or valid response.

TC-N10 Invalid price filter on results
Steps: Set minimum price greater than maximum price.
Expected: A validation message appears or the range is corrected. No crash.

TC-N11 Network or server failure during search
Steps: Go offline or force a server error, then search.
Expected: A user-friendly error message with a retry option. No blank page.

TC-N12 Out-of-stock phone
Steps: Search for a phone known to be out of stock.
Expected: It is shown with a clear "Out of stock" label (or hidden, per the requirement). It cannot be added to the cart from the results.

BOUNDARY SCENARIOS

TC-B01 Minimum query length
Steps: Enter 1 character, then 2 characters (and 3 if a minimum of 3 is required).
Expected: Behavior matches the rule: a message below the minimum, and results at or above it.

TC-B02 Maximum query length, at the limit
Steps: Enter exactly 100 characters.
Expected: Accepted and processed without error.

TC-B03 Just above the maximum
Steps: Enter 101 characters.
Expected: Input is blocked or truncated, or a message is shown. No crash or layout break.

TC-B04 Very long input
Steps: Paste 5,000 characters.
Expected: Handled safely with no timeout or crash.

TC-B05 Result count of zero, one, and many
Steps: Run searches returning 0, 1, and a large number of results.
Expected: Zero shows the no-results message, one shows a single item correctly, and many are paginated or scrolled correctly.

TC-B06 Page size boundary
Precondition: Page size is 20.
Steps: Run searches returning exactly 20, 21, and 40 results.
Expected: 20 results fit on one page, 21 results produce a second page with 1 item, and 40 results fill two pages. No duplicates or missing items.

TC-B07 Price filter limits
Steps: Set min and max to the lowest and highest prices in the catalogue. Then set min equal to max. Then set 0 and a negative value.
Expected: Boundary prices are included in results, min equal to max returns phones at exactly that price, and 0 or negative values are rejected or handled.

TC-B08 Price just inside and outside a range
Steps: Filter with max 500 when phones priced at 499.99, 500.00, and 500.01 exist.
Expected: 499.99 and 500.00 are included. 500.01 is excluded.

TC-B09 Numeric-only query
Steps: Enter "0", "15", and "99999999999".
Expected: Handled without error, with sensible results or a no-results message.

TC-B10 Repeated searches
Steps: Run the same search several times in a row, and double-click the Search button.
Expected: Consistent results and no duplicate requests causing wrong data.

SUGGESTED EXECUTION PRIORITY
- High: P01, P02, P10, N03, N04, N07, N08, B01, B02, B03, B06
- Medium: P03 to P09, P11, N01, N02, N05, N10 to N12, B05, B07, B08
- Low: N06, N09, B04, B09, B10

If you share the requirements or a screenshot of the search page, I can replace the placeholder limits with the real ones and format this as a spreadsheet with preconditions, test data, and actual-result columns.
````

## Does the real output match the lesson's expectation?

**Partly.** The output is grouped Positive / Negative / Boundary as the lesson says (33 numbered cases), but it already includes SQL injection (TC-N07) and script injection (TC-N08) cases, so "security scenarios are still missing" is not true of this run. It has no priority column. Because iteration 1 was already strong, the step from 1 to 2 shows little improvement.
