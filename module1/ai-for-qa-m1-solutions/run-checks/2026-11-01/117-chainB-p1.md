That narrows things down a lot. The redirect problem is a symptom: the page never finishes rendering, so the element either isn't there or isn't wired up. The real question is why the API isn't giving the page what it needs.

Here are the likely causes, roughly from most to least likely in a CI setting. Each comes with the evidence that would confirm it. Most of that evidence is in the **Network tab of your Playwright trace**, so open it on the failing API call before anything else.

---

### 1. Your CI environment is being blocked or challenged
Bot protection (Cloudflare, Akamai, DataDome and similar), WAF rules, or rate limits that target datacenter IPs. These are very common with third-party sites.

**Evidence:**
- A status of **403, 429 or 503**, often with an HTML body instead of JSON. Look for "Just a moment…", "Access denied" or a CAPTCHA.
- Response headers such as `cf-ray`, `cf-mitigated: challenge`, `x-datadome`, `server: AkamaiGHost`, or a `Retry-After` header.
- The same request **works locally** (from a residential or office IP) and fails from the runner.
- Rate limiting shows up as failures that start partway through a run or only under parallel workers. It gets better with `workers: 1` or fewer retries.

### 2. The third-party API is down or degraded
A real outage, a partial outage, or a bad deploy on their side.

**Evidence:**
- **5xx** responses (500, 502, 504), or timeouts with no response at all.
- The vendor's status page or incident feed shows a problem around the time of the failure.
- It **fails locally too**, and from a plain `curl` of the same endpoint.
- The failures line up with a specific time window rather than with a change on your side.

### 3. The API contract changed
The API returns 200, but the body no longer matches what the page's frontend expects. Fields may have been renamed or removed, the shape may differ, or a versioned endpoint may have been retired. In that case the page's JavaScript throws during rendering.

**Evidence:**
- A **200 status with a body that looks different** from what you'd expect (compare with a trace from a past green run if you have one).
- **Console errors** in the trace at render time, such as `TypeError: Cannot read properties of undefined`, JSON parse errors, or a framework error boundary.
- A 404/410 on an old versioned path, or a deprecation header (`Sunset`, `Deprecation`).
- Note: this would usually break the page for real users as well, so check it by hand in a normal browser.

### 4. Auth, session or cookie problems
Missing, expired or rejected credentials. Examples: an expired API key or test-account token in CI secrets, a session cookie that isn't set because a login or consent step was skipped, or third-party cookies blocked in the test browser.

**Evidence:**
- **401 or 403** with a JSON error body (e.g. `invalid_token`, `unauthorized`), as opposed to the HTML challenge page in cause 1.
- The request in the trace is **missing** the `Authorization` header or the expected cookies, compared with the same request in a working manual session.
- A CI secret that recently expired or was rotated, or a stored `storageState` file that has gone stale.
- It passes when you run locally with fresh credentials.

### 5. CORS or other browser-side request failures
The browser blocks the request or its response before the page can use it. Possible causes: a CORS policy change, mixed content, a CSP change, or a preflight that fails.

**Evidence:**
- Console errors that mention **CORS**, `Access-Control-Allow-Origin`, `blocked by CSP`, or mixed content.
- In the trace, the request appears as **failed or canceled** with no usable status, or the `OPTIONS` preflight fails.
- A `curl` of the same endpoint **succeeds**, because CORS only applies inside browsers.

### 6. A network or proxy problem in the pipeline
DNS failures, corporate proxy or egress rules, TLS interception, or a missing CA certificate on the runner.

**Evidence:**
- Errors such as `net::ERR_NAME_NOT_RESOLVED`, `ERR_CONNECTION_REFUSED`, `ERR_CERT_AUTHORITY_INVALID` or `ERR_TUNNEL_CONNECTION_FAILED`, rather than an HTTP status.
- A `curl -v` to the endpoint from **the runner itself** (as a debug step in the pipeline) fails in the same way.
- Recent changes to the runner image, network policy or proxy config.

### 7. Request differences from geo, locale or headers
The API returns a different or empty response depending on region, `Accept-Language`, user agent or feature flags. For example, the service may not be available in the runner's region.

**Evidence:**
- The response body is valid but empty, or includes a region or availability message.
- Copying the exact request from the trace (same headers) reproduces the issue locally, while changing the locale or region header makes it go away.

### 8. Your own test setup is interfering
A leftover `page.route()` mock, a HAR replay, or an ad or tracker blocker in the test setup that catches the API call.

**Evidence:**
- In the trace, the request is shown as fulfilled by a route, or never reaches the network.
- The test passes when you temporarily remove global fixtures or route handlers.

---

## Quick ways to tell them apart

| What you see in the trace | Most likely cause |
|---|---|
| 403/429/503 with an **HTML** challenge page | 1. Bot/IP blocking |
| 5xx or timeout, also fails locally | 2. Vendor outage |
| 200, but console shows render errors | 3. Contract change |
| 401/403 with a **JSON** error | 4. Auth/session |
| Request "failed", CORS/CSP in console | 5. Browser policy |
| `net::ERR_*`, no HTTP status | 6. Network/proxy |
| 200 with an empty or regional body | 7. Geo/locale |
| Request never leaves the browser | 8. Your test setup |

The fastest single check: **run the same request from the CI runner and from your machine**, with `curl -v` or a Playwright `request` call. If it fails only from CI, it's likely cause 1, 4, 6 or 7. If it fails from both, think 2 or 3.

If you paste the failing request's status, response headers and the start of the response body from the trace, I can tell you which of these it is.
