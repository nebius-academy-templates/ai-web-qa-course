That narrows it down a lot. The question is now: **why does this API answer your CI browser differently from a normal visitor?** Before going through the causes, pin down what "invalid" actually means, because that alone rules out most of the list.

## First: capture the actual response

From the Playwright trace (Network tab), or by logging it in the test, record:

- **Status code:** 200, 3xx, 401/403, 429, 5xx, or no response at all?
- **Content-Type:** JSON as expected, or `text/html`?
- **Body:** valid JSON in the wrong shape, an HTML page, empty, or cut off?
- **Response headers:** `server`, `cf-ray`, `x-cache`, `retry-after`, `www-authenticate`, and any vendor-specific headers

To log it in the test:

```ts
page.on('response', async (res) => {
  if (res.url().includes('/the-api-path')) {
    console.log(res.status(), res.headers()['content-type']);
    console.log((await res.text()).slice(0, 500));
  }
});
page.on('requestfailed', (req) => console.log('FAILED', req.url(), req.failure()?.errorText));
```

Then compare it with the same request made from your own browser (DevTools → Network → "Copy as cURL").

## Most likely causes, roughly in order

### 1. Bot detection / WAF blocking the CI runner
Very common for third-party sites. Headless browsers and datacenter IPs get flagged by Cloudflare, Akamai, DataDome and similar services.

**Evidence that confirms it:**
- 403 or 429, or a 200 whose body is an **HTML challenge page** ("Checking your browser", "Access denied") instead of JSON
- Headers like `cf-ray`, `cf-mitigated: challenge`, `x-datadome`, `akamai-grn`
- The same test passes locally in headed mode but fails headless, or fails only from CI IPs
- A `curl` from the CI runner gets the same block

### 2. Rate limiting
Parallel workers, retries, and many pipelines sharing one egress IP can add up to a lot of traffic.

**Evidence:**
- HTTP 429, often with `retry-after` or `x-ratelimit-remaining: 0`
- Fails intermittently or more often when the pipeline is busy; passes when the test runs alone
- It started after you raised the worker count or added more tests that hit this site

### 3. API contract change on the third party's side
They changed the API (renamed fields, new version, new required parameter) and the request or the response handling no longer matches.

**Evidence:**
- 200 with valid JSON in an **unexpected shape**, or a 400 with a validation error in the body
- Console errors on the page like `Cannot read properties of undefined`
- It fails the same way **everywhere**, including in your own browser, which means it isn't your environment
- Their changelog or status page, or the timing (started on a specific date with no change on your side)

### 4. Third-party outage or degradation
**Evidence:**
- 5xx responses (500/502/503/504) or timeouts
- Their status page, or reports from other users
- It fails from every location and recovers without you changing anything

### 5. Authentication, session or consent state is missing
The API may depend on a cookie, token or consent choice that a fresh CI browser context doesn't have, or that your saved `storageState` holds in an expired form.

**Evidence:**
- 401/403 with `www-authenticate` or an "unauthorized"/"token expired" body
- The request is missing a cookie or `Authorization` header compared with your working browser (diff the request headers)
- You use a stored auth state file that is old, or whose token has a known expiry
- Passes after logging in or accepting consent manually first

### 6. Your own test setup is intercepting or changing the request
Easy to overlook. A `page.route()` mock, a HAR replay, a service worker or a blocked-resources list may be catching this call.

**Evidence:**
- Search the test and fixtures for `page.route`, `context.route`, `routeFromHAR`, `serviceWorkers`, and any resource-blocking logic
- In the trace, the response is marked as fulfilled by a route, or the timing is impossibly fast
- A HAR file that was recorded before the API changed and is now stale

### 7. CI network path issues (proxy, DNS, TLS)
Corporate proxies, egress firewalls and TLS-inspecting middleboxes can block or alter third-party traffic.

**Evidence:**
- `requestfailed` events with errors like `net::ERR_CERT_AUTHORITY_INVALID`, `ERR_NAME_NOT_RESOLVED`, `ERR_TUNNEL_CONNECTION_FAILED`, or `ERR_CONNECTION_RESET`
- A response that comes from your proxy (a proxy error page, a proxy `server` header) rather than the vendor
- `curl -v` from the runner shows the same failure; recent changes to network or firewall rules

### 8. Region or locale differences
The CI runner's region may get a different API endpoint, a geo-block, or region-specific behaviour.

**Evidence:**
- A 451 or a "not available in your region" body, or a redirect to a regional domain
- Different results when you set `locale`/`timezoneId` or run from a runner in another region
- The runner's public IP geolocates somewhere unexpected

### 9. CORS or browser-specific request differences
If the page calls the API from the browser, a change in their CORS policy, or a header your browser config sends or omits, can break it in the browser while `curl` works fine.

**Evidence:**
- Console errors like "blocked by CORS policy"
- The preflight `OPTIONS` request fails, or the response lacks `access-control-allow-origin`
- `curl` returns valid data but the browser request fails

## A quick way to triage

| What you see | Most likely causes |
|---|---|
| HTML body instead of JSON, 403 | Bot detection / WAF (1) |
| 429 | Rate limiting (2) |
| 200, valid JSON, wrong shape / 400 | Contract change (3) |
| 5xx / timeout | Outage (4), or network path (7) |
| 401 | Auth/session state (5) |
| No real network request, or instant response | Your own route or mocks (6) |
| `net::ERR_*` in `requestfailed` | Network path (7) |
| Fails in CI only, passes locally | 1, 2, 5, 7, 8 |
| Fails everywhere, including your own browser | 3 or 4 |

The single most useful check is **"does it fail in my own browser too?"** If yes, the problem is on the third party's side (3 or 4) and there's little you can fix except mocking it. If it fails only in CI, the cause is in your environment, and the status code plus the body will usually point straight at one of 1, 2, 5, 7 or 8.

If you share the status code, content type, and the first few hundred characters of the response body, I can tell you which of these it most likely is.
