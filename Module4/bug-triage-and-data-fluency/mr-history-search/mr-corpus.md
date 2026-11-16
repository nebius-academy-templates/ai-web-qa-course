# Asset A — TechShop MR corpus (18 entries, 3 months, 3 components)
This is the raw corpus. It's intentionally unfiltered across three components; you scope it yourself. Terminology is deliberately varied: the same type of failure is described differently across entries, so a keyword search would miss cross-MR patterns. The 
practice
 uses this same corpus.
Checkout component (8 MRs)
MR !187 | Status: Merged | Date: 2024-01-08
Title: Increase checkout page load timeout
Description: Adjusted Playwright timeout from 20000ms to 30000ms for checkout flow tests
after intermittent failures in staging. Tests were timing out on the shipping options
request during high-load periods. No code change to application.
Linked Jira: SHOP-1791 (P3, resolved — closed as environment issue)
Failure mentioned: Intermittent timeout on shipping options API call
MR !193 | Status: Merged | Date: 2024-01-15
Title: Fix flaky cart persistence test
Description: Cart contents were not persisting between page navigations in tests due to a
race condition in the session restore logic. Added explicit wait for cart-loaded event
before proceeding to checkout.
Linked Jira: SHOP-1809 (P3, resolved)
Failure mentioned: AssertionError — cart item count was 0 after navigation
MR !204 | Status: Merged | Date: 2024-01-22
Title: Fix: update confirm payment locator after provider redirect
Description: After Stripe updated their payment redirect flow, the DOM structure on the
payment confirmation page changed. The previous selector "checkout-confirm" was replaced
with "confirm-payment" in Stripe's new UI. Updated data-testid from "checkout-confirm" to
"confirm-payment" throughout checkout spec.
Linked Jira: SHOP-1847 (P2, resolved)
Failure mentioned: ElementNotFound on payment confirmation button — test could not locate
the confirm button after being redirected from Stripe payment page.
MR !211 | Status: Merged | Date: 2024-02-03
Title: Add retry logic for order submission API
Description: The /api/orders endpoint was occasionally returning 503 under load. Added
exponential backoff retry in the checkout service. No test changes.
Linked Jira: SHOP-1872 (P2, resolved)
Failure mentioned: 503 Service Unavailable on POST /api/orders
MR !218 | Status: Merged | Date: 2024-02-14
Title: Refactor: checkout step component naming
Description: Renamed step components from CheckoutStep1/2/3 to ShippingStep, PaymentStep,
ConfirmationStep for clarity. Updated all test references. No functional changes.
Linked Jira: none
Failure mentioned: none (refactor only)
MR !226 | Status: Reverted | Date: 2024-02-28
Title: Optimise: lazy load payment confirmation component
Description: Attempted to lazy-load the payment confirmation UI to improve LCP. Caused
intermittent failures where the confirm payment button was not mounted when the test
tried to interact with it. Reverted after 2 hours in staging.
Linked Jira: SHOP-1901 (P1, resolved by revert)
Failure mentioned: TimeoutError on button[data-testid="confirm-payment"] — button present
in DOM but not yet mounted/interactive when test clicked it.
MR !234 | Status: Merged | Date: 2024-03-05
Title: Add address validation to checkout step 2
Description: Added client-side address validation before proceeding to payment step.
Required updates to checkout spec to fill address fields before clicking continue.
Linked Jira: none (feature addition)
Failure mentioned: Test was failing because it skipped address step — updated test.
MR !241 | Status: Open | Date: 2024-03-10
Title: Investigate: confirm payment button timeout on slow networks
Description: QA reported that the confirm payment button times out on staging when network
latency exceeds 2 seconds. Investigating whether the payment provider SDK loads
synchronously and blocks button mounting.
Linked Jira: SHOP-1934 (P2, in progress)
Failure mentioned: TimeoutError on confirm-payment button under simulated latency.
Product search component (6 MRs)
MR !189 | Status: Merged | Date: 2024-01-10
Title: Fix: search results not updating on second query
Description: Search results were stale after typing a second query without clearing the
input. Fixed debounce logic in search handler. Updated search spec.
Linked Jira: SHOP-1796 (P3, resolved)
Failure mentioned: AssertionError — results matched first query, not second query input.
MR !197 | Status: Merged | Date: 2024-01-18
Title: Add product category filter to search results
Description: Added filter chips to search results page. Extended search spec to cover
filter interactions.
Linked Jira: none (feature addition)
Failure mentioned: none
MR !208 | Status: Merged | Date: 2024-01-30
Title: Fix: search bar loses focus on mobile viewport
Description: Search input was losing focus on mobile-sized viewports causing test failures
on the mobile project. Desktop tests were unaffected.
Linked Jira: SHOP-1861 (P3, resolved)
Failure mentioned: Input not receiving text — focus lost after keydown event on mobile.
MR !215 | Status: Merged | Date: 2024-02-10
Title: Fix: search dropdown closes before result can be selected
Description: Race condition caused the search results dropdown to close before the test
could click a result. Added explicit wait for dropdown to be stable before interaction.
Linked Jira: SHOP-1884 (P3, resolved)
Failure mentioned: ElementNotFound on search result item — dropdown had closed.
MR !229 | Status: Merged | Date: 2024-03-01
Title: Reindex: update search index after product catalog update
Description: Product catalog was updated with 240 new SKUs. Search index was rebuilt.
Some tests that relied on specific product counts in results were updated to use ">= 1"
assertions instead of exact counts.
Linked Jira: none (maintenance)
Failure mentioned: AssertionError — expected exact result count that changed after reindex.
MR !237 | Status: Open | Date: 2024-03-08
Title: Investigate: search returns 0 results for some queries on staging
Description: QA team reported search returning no results for valid product queries on
staging-12. Appears to be related to enhanced_search_v2 feature flag which was enabled on
staging-12 but not other environments. Under investigation.
Linked Jira: SHOP-1929 (P2, in progress)
Failure mentioned: AssertionError — search results count was 0 for known valid queries.
Authentication component (4 MRs)
MR !192 | Status: Merged | Date: 2024-01-14
Title: Fix: session token expiry causing mid-test logouts
Description: Test sessions were expiring during long-running checkout tests due to a
15-minute session timeout. Increased test session duration to 60 minutes.
Linked Jira: SHOP-1807 (P3, resolved)
Failure mentioned: User unexpectedly logged out mid-test — session token expired.
MR !203 | Status: Merged | Date: 2024-01-21
Title: Add MFA bypass for test users
Description: Multi-factor authentication was enabled on staging for all users. Added a
test-user bypass flag so E2E tests do not need to handle MFA flows.
Linked Jira: SHOP-1843 (P2, resolved)
Failure mentioned: Test stalled waiting for MFA input that never appeared in test flow.
MR !222 | Status: Merged | Date: 2024-02-20
Title: Fix: password reset flow breaks subsequent login test
Description: Password reset test was not cleaning up its state, leaving the user in a
password-reset-required state. Subsequent login test failed because it could not log in
without completing the reset flow.
Linked Jira: SHOP-1893 (P3, resolved)
Failure mentioned: Login assertion failed — user was redirected to password reset page.
MR !232 | Status: Merged | Date: 2024-03-04
Title: Update auth fixtures for new user role: guest checkout
Description: New guest checkout user role added. Auth fixtures updated to include guest
user type. Checkout tests updated to use registered user fixture explicitly.
Linked Jira: none (feature addition)
Failure mentioned: none
