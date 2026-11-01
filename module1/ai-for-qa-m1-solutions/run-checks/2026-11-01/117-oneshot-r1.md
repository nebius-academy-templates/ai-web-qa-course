Your code is probably fine. The test is failing because of an expired credential, so the fix has two parts: get a working key back in place the right way, then change the setup so an expired key can't quietly break a UI test again.

## 1. Fix it now

**Confirm the cause before changing anything.** Call the API directly with the test key, using curl or the provider's dashboard or API explorer. Make sure the 401 body says something like "expired" or "invalid key", and rule out a wrong environment, IP allowlisting or a missing scope. Some providers return 401 for all of these.

**Get a new key through the proper channel.**
- Generate it in the provider's **sandbox/test environment**, not production. Financial APIs nearly always have one, and a UI test should never touch real accounts or real money.
- Create it under a **service account or team-owned account**, not one person's login. Keys tied to a person often expire or get revoked when that person's access changes or they leave.
- Give it the **smallest set of permissions** the test needs.

**Store it as a secret, not in code.**
- Put it in your CI's secret store (GitHub Actions secrets, GitLab CI variables, Azure Key Vault, AWS Secrets Manager, Vault, etc.) and inject it as an environment variable at runtime.
- If the old key was ever committed to the repo or a config file, treat it as leaked. Revoke it, even though it has expired, and remove it from the codebase going forward.

**Revoke the old key** once the new one works, and re-run the pipeline to confirm the test passes.

**Check production too.** If the test key expired on a schedule, the production key may be on a similar one. Find out when it expires before your customers do.

## 2. Stop it happening again

### Fix the design problem: your UI test depends on a live third party
The deeper issue is that a test of *your* redirect behaviour fails whenever *someone else's* API or credential has a problem. Split the concerns:

- **Mock the third-party API in UI tests.** Playwright can intercept the network calls and return fixed responses:
  ```ts
  await page.route('**/api.provider.com/**', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(fixtureResponse),
    })
  );
  ```
  That makes your UI tests fast, deterministic and independent of the provider's uptime and your credentials. Also mock the 401/500 cases, so you test how *your* app handles the provider failing.
- **Keep a small number of real integration/contract tests** against the provider's sandbox, in a separate job, possibly scheduled (e.g. nightly) rather than on every commit. When they fail, the failure clearly means "the integration is broken", not "the UI is broken".

### Make credential failures obvious
- Add a **pre-flight check** at the start of the integration suite that makes one cheap authenticated call. If it gets a 401, fail at once with a clear message like `Provider API key invalid or expired. Rotate TEST_PROVIDER_API_KEY`. Without it, someone has to trace a UI timeout back to an auth error.
- Make sure 401s from the provider are **logged with the status and body**, not swallowed as a generic rendering failure.

### Track expiry before it happens
- **Write down every external credential** (owner, environment, where it's stored, expiry date) somewhere the team can see.
- **Set alerts before expiry**: a calendar reminder, a ticket, or a scheduled job that checks key age or expiry through the provider's API, if it has one, and warns you 2–4 weeks ahead.
- **Automate rotation** where the provider supports it (some issue short-lived tokens through OAuth client credentials, which avoids long-lived keys entirely). Many secret managers can run rotation on a schedule.
- **Assign a clear owner** (a team, not a person) for each third-party integration's credentials.

## Summary
1. Verify the 401 really is the expired key.
2. Issue a new **sandbox** key under a **service account**, store it in your **CI secret store**, and revoke the old one.
3. Check when the production key expires.
4. **Mock the provider in UI tests** and move real API checks into a separate, clearly labelled integration job with a pre-flight auth check.
5. **List your credentials, alert before they expire, and automate rotation** where you can.

If you tell me which CI system and secret store you use, I can sketch the exact config for injecting the key and the scheduled expiry check.
