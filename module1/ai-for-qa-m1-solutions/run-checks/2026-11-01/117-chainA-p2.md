A 401 is good news for debugging. It rules out most of the earlier list (outage, rate limiting, contract change) and means one specific thing: **the API doesn't accept the credentials on the request.** Either none were sent, or the ones that were sent were rejected.

(A 403 would mean "I know who you are, and you're not allowed". A 401 means "I don't know who you are". Some WAFs and vendors blur this line, so it's still worth checking the body.)

## Check first: were credentials sent at all?

This one check splits the problem in two. In the Playwright trace, open the failing request and look at its **request headers**:

- Is there an `Authorization` header (e.g. `Bearer ...`)?
- Is there a `Cookie` header containing the session/auth cookie?
- Is there an API key header or query parameter, if the API uses one?

Compare this with the same request from a browser where the page works (DevTools → Network → the request → Headers).

Also read the **response**:

- The `WWW-Authenticate` header often says exactly why, e.g. `error="invalid_token", error_description="The access token expired"`.
- The body may say "token expired", "missing credentials", "invalid signature" and so on.

Then follow whichever branch applies.

## Branch A: credentials are missing from the request

The test never got them, or the browser didn't send them.

**1. A CI secret isn't reaching the test**
- The env var is unset or empty in CI: renamed, removed, scoped to another environment or branch, or expired in the secret store
- **PRs from forks** usually don't get repository secrets, so the test runs with an empty token
- Evidence: log whether the variable is set (`!!process.env.API_TOKEN`, never the value itself). Check whether the failure is limited to certain branches or PR sources.

**2. A saved auth state (`storageState`) is missing or wasn't loaded**
- The global setup login step failed or was skipped, the file path differs in CI, or the project/config doesn't reference it
- Evidence: check that the file exists in CI and has the expected cookies/origins in it. Look at global setup logs.

**3. The browser is refusing to send the cookie**
- Because it's a *third-party* page, its auth cookie may be a cross-site cookie. Browsers are increasingly blocking third-party cookies, and `SameSite=Lax/Strict` cookies aren't sent in a cross-site context. A Playwright or Chromium version bump can change this behaviour.
- The cookie domain or path doesn't match the API host (e.g. cookie set on `www.vendor.com`, API on `api.vendor.com`)
- Evidence: the cookie is in the context (`await context.cookies()`) but missing from the request's `Cookie` header. The trace may show it as filtered. Check whether a browser version change lines up with the first failure.

## Branch B: credentials are sent, but rejected

**4. The token or session has expired**
- This is the most common cause when a test "suddenly" starts failing with no code change. A long-lived token, a hard-coded token in config, or a `storageState` file committed weeks ago has reached its expiry.
- Evidence: decode the JWT (if it is one) and check the `exp` claim. `WWW-Authenticate` or the body says "expired". Logging in fresh fixes it.

**5. The credential was rotated or revoked**
- Someone rotated the API key or the test account's password, the test account was disabled or locked (failed login attempts from parallel CI runs can trigger lockouts), or the vendor revoked the key
- Evidence: the same credential also fails from `curl` or your own machine. The vendor dashboard shows the key as revoked or the account as locked. Ask whoever owns the integration.

**6. Wrong credential for the environment**
- A staging key sent to production, or the other way round, or a credential for another tenant or region
- Evidence: the base URL in CI differs from local. Check which secret maps to which environment.

**7. Clock skew on the CI runner**
- JWTs and signed requests (HMAC, AWS-style signatures) are rejected if the runner's clock is off by more than a few minutes, because the token looks "not yet valid" or the signature looks stale
- Evidence: errors mentioning `nbf`, "token not yet valid", "request time too skewed". Compare `date -u` on the runner with real time.

**8. The vendor changed its auth requirements**
- New scheme, a new required header or scope, or deprecation of the old key type
- Evidence: fails everywhere with the same credential. Check the vendor's changelog or developer announcements.

## Suggested order

1. **Request headers:** are the credentials there? (Splits A from B)
2. **`WWW-Authenticate` header and response body:** often names the exact reason
3. **If missing:** check that the CI secret is set, and that `storageState` exists and is loaded, then check cookie domain/SameSite
4. **If present:** check expiry (decode the JWT), then try the same credential outside CI to separate "bad credential" from "CI environment problem"
5. **Timeline:** what changed around the first failure? Token issue date, secret rotation, Playwright/browser version bump, CI config change

## Avoiding a repeat

If the cause turns out to be expiry, don't commit a long-lived auth state. Generate it at the start of each run in a setup project (log in, then `storageState` save), and make the setup step fail loudly if login doesn't succeed, so you get "login failed" instead of a confusing redirect failure several steps later.

If you can share the `WWW-Authenticate` header, the response body, and whether the auth header/cookie is on the request, I can help pin down the exact cause.
