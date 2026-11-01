A 401 narrows it down a lot. A 401 means **the API didn't accept the credentials it received, or didn't receive any.** That's an authentication problem. It isn't an outage, and it usually isn't bot blocking either, because bot protection almost always returns 403, 429 or 503.

In a CI run, a 401 usually comes down to one of a few things.

## What a 401 usually means in CI

1. **Credentials are missing in CI.** A secret or environment variable isn't set, is misnamed, or isn't available to this job, branch or fork. The request goes out with no token, or with an empty one.
2. **Credentials have expired or been rotated.** An API key, test-account password or OAuth client secret expired or was changed, and the CI secret wasn't updated. This is the classic reason a test was green for months and then suddenly started failing.
3. **The stored session is stale.** If you reuse a saved login (`storageState`, a cached cookie file or a token fixture), the session inside it has expired or been revoked on the server.
4. **Cookies or headers aren't attached.** The browser has the session, but the request doesn't carry it. Common reasons: third-party cookies are blocked, a `SameSite` change, a login or consent step that got skipped, or a different domain or subdomain than where the cookie was set.
5. **The test account has changed.** The account was locked, disabled, had its password reset, or now needs MFA or re-verification. Shared test accounts are especially prone to this, because someone else may have logged in, changed something, or triggered a lockout.
6. **The auth scheme changed.** The vendor now requires a different header, a new token format, a different auth endpoint or a new scope.

## What to check first, in order

**1. Look at the failing request in the trace (2 minutes)**
- Is there an `Authorization` header or a session cookie at all?
  - **Missing or empty:** this points to causes 1 or 4. Your setup isn't supplying credentials.
  - **Present:** the credential is being sent and rejected. This points to causes 2, 3, 5 or 6.
- Read the **response body and the `WWW-Authenticate` header**. They often name the reason directly, for example `invalid_token`, `token_expired`, `invalid_client`, or "API key not found".

**2. Check the secret in CI**
- Is the variable defined for this pipeline, environment and branch? Note that secrets are often withheld from PRs coming from forks.
- Was it changed or rotated recently? Check the secret's last-updated date and when the key expires on the vendor side.
- Add a safe debug line to the pipeline that logs **whether** the value is set and its length, never the value itself:
  ```bash
  echo "API_TOKEN set: ${API_TOKEN:+yes} (len ${#API_TOKEN})"
  ```

**3. Try the same credentials outside CI**
- Use the exact CI credential locally, or with `curl`:
  ```bash
  curl -i -H "Authorization: Bearer $API_TOKEN" https://api.vendor.example/endpoint
  ```
- **Fails locally too:** the credential itself is bad (expired, revoked or locked account). Regenerate it or fix the account.
- **Works locally:** something about how CI passes it is wrong (cause 1 or 4).

**4. If you use a saved session, regenerate it**
- Delete or refresh the `storageState` file, or make sure your global setup logs in fresh on every run, and run again. If the test passes, the session had gone stale. Fix it for good by logging in during `globalSetup` on every run rather than committing or caching session files.

**5. Log into the test account by hand**
- Check for lockouts, password-reset prompts, new MFA requirements or a "verify your email" screen.

**6. Check the vendor's side**
- Look at their changelog or developer notifications for auth changes, key expiry policies or deprecations. Check their dashboard to see if your key or app is still active.

## A quick decision guide

| Finding | Likely cause | Fix |
|---|---|---|
| No auth header or cookie on the request | Missing secret or cookie not attached | Fix the CI variable or the login/cookie setup |
| Header present, body says expired or invalid | Expired or rotated credential | Regenerate the key and update the CI secret |
| Works after refreshing `storageState` | Stale saved session | Log in fresh in `globalSetup` each run |
| Fails the same way locally with the same credential | Bad credential or account problem | Check the account and the vendor dashboard |
| Works locally, fails only in CI | Secret not passed into the job | Check secret scope, branch and env mapping |

A safety note while you debug: don't print tokens, passwords or full `Authorization` headers in CI logs, and don't upload traces that contain them to anywhere public. Playwright traces record request headers. If a secret ends up exposed, rotate it.

If you share the 401 response body (with any tokens removed) and how the test authenticates (API key, login flow, or saved session), I can point to the specific fix.
