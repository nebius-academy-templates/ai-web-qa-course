There are two separate problems here. The immediate one is the expired key. The underlying one is that a UI test can fail because of a credential on someone else's API. Fix the first today and the second over the next sprint or so.

## 1. Fix it now: rotate the key properly

1. **Confirm it's really expiry.** A 401 can also mean the key was revoked, has the wrong scope, or belongs to the wrong environment (sandbox vs. live). Look at the response body or the provider's dashboard. Many financial APIs return a specific error code such as `token_expired` or `invalid_api_key`.
2. **Get a new key from the provider's sandbox/test environment**, not production. A test pipeline shouldn't hold live credentials for a financial API. If it does, treat that as a separate issue to fix now.
3. **Store it in your secrets manager or CI secret store** (GitHub Actions secrets, GitLab CI variables, Vault, AWS Secrets Manager, etc.), never in the repo or a committed `.env` file. Update the secret there, not in the test code.
4. **Revoke the old key** once the new one works, and record the new key's expiry date.
5. **Re-run the pipeline** and check that the test passes for the right reason: the page renders and the redirect happens.

## 2. Fix it properly: stop UI tests depending on a live third-party API

Your UI test is meant to check *your* app's behaviour, and right now it also checks that a vendor's API is up and that your key is valid. That makes it flaky for reasons that have nothing to do with your code.

**Mock the third-party API in most UI tests.** Playwright can intercept the network calls:

```ts
await page.route('**/api.financialprovider.com/**', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(require('./fixtures/provider-success.json')),
  });
});
```

This also lets you test the cases you can't easily trigger live: a 401, a 500, a timeout, a malformed response. You probably *should* be testing how your app behaves when this API returns a 401, because real users will eventually hit that too.

If the element redirects to a page hosted by the third party, consider asserting on your side of the handoff (the redirect URL and its parameters are correct) rather than loading their page in every test.

**Keep a small set of real integration or contract tests** against the provider's sandbox. Run them separately, for example nightly or as a non-blocking pipeline stage. Their job is to catch the vendor changing their API or your credentials going bad, and when they fail it should be obvious that the cause is external.

## 3. Stop it happening again

- **Fail fast with a clear message.** Add a pre-flight step (Playwright `globalSetup` or a pipeline step) that makes one cheap authenticated call to the provider. On a 401, it fails with something like "Financial API key for TEST env is invalid or expired; rotate secret `FIN_API_KEY`" instead of a confusing "element didn't redirect" failure deep in a UI test.
- **Track expiry dates.** If the provider exposes key expiry through an API, check it on a schedule and alert 2–4 weeks ahead. If not, put the expiry in your secrets manager's metadata or a shared calendar with a reminder.
- **Automate rotation if the provider supports it.** Some issue short-lived tokens through OAuth client credentials. Your test setup can fetch a fresh token each run, which removes the expiry problem entirely.
- **Give the credential an owner.** Name a team or person responsible for it, and write a short runbook: where the key lives, how to rotate it, who has access to the provider's dashboard.
- **Use a service or team account, not an individual's.** Keys tied to a person's account tend to expire or vanish when that person leaves or changes roles.

**In short:** rotate the key into your secrets store today. Then mock the API in your UI tests, move live-API checks into a separate, clearly labelled test stage, and add expiry alerting so the next expiry shows up as a reminder rather than a broken pipeline.
