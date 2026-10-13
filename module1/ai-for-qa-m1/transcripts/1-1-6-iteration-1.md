# Iteration 1: initial prompt

**Lesson:** 1.1.6 walkthrough (steps 2 to 4). Prompt text below is copied verbatim from the lesson.

**STATUS: CAPTURED via subagent runs on 2026-10-09, not typed into claude.ai.** Each run was a separate Claude instance given the lesson's prompt text with a short instruction to answer without tools. Output is unedited. Re-run in a real chat before go-live if exact fidelity matters.

## Prompt (paste exactly, in the conversation the lesson names)

```
Generate test cases for the Product Search feature of TechShop. The user can search for mobile phones only
```

## What the lesson says to expect

A short, unstructured list: a handful of one-line checks (verify users can search for mobile phones; verify matching phones are displayed; verify a "No products found" message when nothing matches). No IDs, no test data, no priorities, and probably a sentence or two of commentary nobody asked for.

## Reviewer's step (the HITL role)

Before typing anything else, note what is missing against project needs: edge cases and structure. The model did not flag these gaps; the reviewer does.

## Run details

**Model:** `claude-sonnet-5-5` (configured model; the serving model was not verified)  
**Date:** 2026-10-09  
**Conversation:** one subagent conversation shared by iterations 1, 2 and 3

## Verbatim output

````
Here are test cases for TechShop Product Search, scoped to mobile phones only. I've assumed a search box with a results page that supports filters and sorting. Please correct me where TechShop behaves differently.

ASSUMPTIONS
- Search covers the mobile phone catalogue only. Other categories (laptops, tablets, accessories) are out of scope and should not appear in results.
- Searchable fields: brand, model name, and key specs (storage, color, RAM).
- Results show name, image, price, and availability.

1. FUNCTIONAL - POSITIVE

TC-01 Search by full model name
Steps: Enter "iPhone 15 Pro" and submit.
Expected: Results list that model and its variants (storage, color). Every result is a mobile phone.

TC-02 Search by brand
Steps: Enter "Samsung".
Expected: Only Samsung phones are listed.

TC-03 Search by partial keyword
Steps: Enter "Galax".
Expected: Phones with "Galaxy" in the name are returned (or suggested), assuming partial matching is supported.

TC-04 Search is case-insensitive
Steps: Search "IPHONE", "iphone", and "iPhone".
Expected: All three return identical results.

TC-05 Search by spec keyword
Steps: Enter "128GB" or "5G".
Expected: Phones matching that spec are returned.

TC-06 Search using the Enter key and the search button
Expected: Both trigger the search and give the same results.

TC-07 Leading and trailing spaces
Steps: Enter "  Pixel 8  ".
Expected: Spaces are trimmed and the correct results are returned.

TC-08 Multi-word query
Steps: Enter "Samsung Galaxy S24 Ultra".
Expected: The best match is ranked first.

2. SCOPE - MOBILE PHONES ONLY

TC-09 Non-phone product search
Steps: Search "laptop", "tablet", or "headphones".
Expected: No non-phone products are shown. A "no results" message appears, ideally with a hint that only mobile phones are searchable.

TC-10 Phone accessory search
Steps: Search "iPhone case" or "charger".
Expected: No accessories are returned (or a clear message says they are not supported).

TC-11 Mixed query
Steps: Search "iPhone charger".
Expected: Behavior is defined and consistent. Either iPhones appear or a no-result message is shown, but no accessories are listed.

TC-12 Category verification
Steps: Run several different searches and review the results.
Expected: Every returned item belongs to the Mobile Phones category.

3. NEGATIVE AND EDGE CASES

TC-13 Empty search
Steps: Submit with an empty box.
Expected: No crash. Either a validation message appears or the full phone list is shown, per the requirement.

TC-14 Whitespace only
Steps: Enter spaces and submit.
Expected: Treated like an empty search.

TC-15 No matching product
Steps: Enter "xyzabc123".
Expected: A friendly "No results found" message with suggestions. No error page.

TC-16 Misspelling
Steps: Enter "Samsng" or "Iphon".
Expected: Either "Did you mean...?" suggestions or a no-results message.

TC-17 Special characters
Steps: Enter "@#$%^&*".
Expected: Handled gracefully, with no error and no raw system message.

TC-18 Very long input
Steps: Enter 500 or more characters.
Expected: Input is limited or handled without a crash or layout break.

TC-19 Numeric only
Steps: Enter "15" or "12345".
Expected: Sensible results or a no-results message.

TC-20 Non-English characters and emoji
Steps: Enter text such as "手机" or an emoji.
Expected: No crash. No-results or a handled response.

4. SECURITY

TC-21 SQL injection
Steps: Enter ' OR '1'='1 and "; DROP TABLE products;--".
Expected: Treated as plain text. No data exposure or error leakage.

TC-22 XSS
Steps: Enter <script>alert(1)</script>.
Expected: Input is escaped. No script runs, including when the query is echoed back on the results page ("Results for ...").

5. FILTERS AND SORTING (on search results)

TC-23 Filter by brand
Expected: Only the selected brand remains.

TC-24 Filter by price range
Expected: All results fall within the range. Invalid ranges (min greater than max) are handled.

TC-25 Combined filters
Steps: Apply brand, price, and storage together.
Expected: Results satisfy all filters. Clearing filters restores the original list.

TC-26 Sort by price low-to-high and high-to-low
Expected: Order is correct.

TC-27 Sort by relevance, rating, or newest
Expected: Order is correct, if these options exist.

6. RESULTS PAGE AND UI

TC-28 Result card content
Expected: Image, name, price, and stock status are shown correctly.

TC-29 Result count
Expected: The displayed count matches the number of items.

TC-30 Pagination or infinite scroll
Expected: Navigating pages works with no duplicates or missing items. The query and filters persist.

TC-31 Click a result
Expected: The correct product detail page opens, and Back returns to the same results.

TC-32 Out-of-stock phone
Expected: It appears in results with a clear "Out of stock" label (or is hidden, per the requirement).

TC-33 Search term retained
Expected: The query stays in the search box after submission.

7. AUTOCOMPLETE AND SUGGESTIONS (if available)

TC-34 Suggestions appear after typing 2 or 3 characters.
TC-35 Suggestions contain only mobile phones.
TC-36 Selecting a suggestion runs the search with that term.
TC-37 Keyboard navigation (arrow keys and Enter) works in the suggestion list.

8. NON-FUNCTIONAL

TC-38 Performance
Expected: Results return within about 2 seconds under normal load, and the UI shows a loading indicator.

TC-39 Responsive and cross-browser
Expected: Search works on Chrome, Firefox, Safari, and Edge, and on mobile and tablet viewports.

TC-40 Accessibility
Expected: The search box has a label, is reachable by keyboard, works with a screen reader, and has sufficient contrast.

TC-41 Concurrency and rapid input
Steps: Submit several searches quickly, or double-click the search button.
Expected: Results correspond to the latest query, with no duplicate requests causing wrong data.

TC-42 Network failure
Steps: Go offline or have the server return an error during a search.
Expected: A user-friendly error message with a retry option.

TC-43 URL behavior
Expected: The search URL can be shared or refreshed and shows the same results. Editing the query parameter by hand behaves correctly.

PRIORITY SUGGESTION
- High: TC-01, 02, 09, 12, 13, 15, 21, 22, 23, 24, 31
- Medium: most of the remaining functional, filter, and UI cases
- Low: TC-20, 37, 43 and other less likely scenarios

If you share the requirements or a screenshot of the search page, I can tailor these into a formal format (ID, preconditions, test data, expected results) or a spreadsheet, and remove the cases that don't apply.
````

## Does the real output match the lesson's expectation?

**No. The lesson expects a short list of about three one-line checks; the run returned 43 numbered test cases (TC-01 to TC-43) with steps, expected results, an assumptions block and grouped sections, a long structured document.** It had no priorities column and no explicit test-data column (steps carry the data), but it is far from "a handful of one-line checks". The lesson's expectation text for step 3 needs rewriting, or the demo will not show the quality jump it relies on.
