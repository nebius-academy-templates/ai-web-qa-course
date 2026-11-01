Good, you've found the cause. The fix itself is quick. Most of the value is in doing it cleanly, and in making sure the next expiry shows up as a warning weeks ahead instead of a confusing redirect failure in a UI test.

## Part 1: Fix it properly

### 1. Find out who owns the key and where it's used
Before you generate anything, work out:

- **Who owns the integration** with the provider (which team, which provider account). Financial providers often limit key creation to specific admins, and your org may have an approval process.
- **Everywhere this key is used.** Search CI secret stores, secret managers, `.env` templates, deployment configs and other pipelines. If other jobs or services use the same key, they're broken too (or soon will be), and they all need the new one.
- **That it's a sandbox key.** Confirm the expired key belongs to the provider's sandbox/test environment. If your test environment turns out to use a *production* key, raise that separately: it shouldn't, and the fix is to switch to sandbox credentials, not to renew the production key.

### 2. Issue a new key, with the right scope and lifetime
In the provider's developer portal (sandbox environment):

- Create a new key **with the minimum permissions** the tests need, not a copy of whatever the old key had
- Note the **expiry date** and write it down somewhere, because you'll need it in Part 2
- If the provider lets you choose the lifetime, pick the shortest one you can realistically rotate. Longer isn't safer just because it fails less often.

### 3. Store it in the secret store, nowhere else
- Put the new key in your CI secret store or secret manager (GitHub Actions secrets, GitLab CI variables, Vault, AWS Secrets Manager, etc.)
- **Don't** commit it to the repo, paste it into chat, a ticket or a config file, or print it in logs
- Update **every** location from step 1. Ideally there's only one source the pipelines read from; if there are several copies, this is a good moment to consolidate them.

### 4. Verify, then revoke the old key
- Re-run the failing test, and any other job that uses the key
- Once everything passes, **revoke the old key** in the provider portal, even though it's expired. That keeps the key inventory clean and makes sure nothing is quietly still depending on it.
- Check that no Playwright traces, HAR files or logs from your debugging captured credentials in uploaded CI artifacts. Delete those artifacts if they did.

## Part 2: Stop it happening again

The real failure here is that an expiry date was known in advance and nobody was warned. Fix that at several layers.

### 1. Keep a record of each credential and its expiry
For each third-party credential, record: what it is, which environment, **owner**, **expiry date**, where it's stored, and what uses it. This can be a table in your runbook or metadata on the secret itself; many secret managers support expiry dates, tags and descriptions. The key point is that the expiry date and an owner are written down somewhere people will look.

### 2. Get warned before expiry, not after
- **Automated expiry check:** a scheduled CI job (e.g. daily) that checks the expiry and fails or alerts once it's **within 30 days**, then again at 14 and 7 days. If the provider has an API or endpoint that reports key expiry, use it. Otherwise, store the expiry date as metadata alongside the secret and check against that.
- **Secret manager notifications**, if yours supports expiry or rotation reminders
- **A calendar reminder or ticket** assigned to the owning team, as a backup. Tie it to a team or group, not one person who might be on leave or might leave the company.

### 3. Make the test fail clearly when credentials are bad
Today an expired key showed up as "element no longer redirects", which took several steps to trace back. Add a **preflight check** in global setup or a setup project that calls a lightweight authenticated endpoint on the provider before any UI tests run. If it gets a 401, fail at once with a clear message such as:

> `Provider sandbox API key rejected (401). It may have expired; see the rotation runbook: <link>`

This turns a long debugging session into a one-line diagnosis.

### 4. Make rotation a routine, documented process
- Write a **short rotation runbook**: who can issue keys, where to store them, which jobs to update, how to verify, and when to revoke the old one
- If the provider supports **two active keys at once**, rotate with overlap: issue the new key, deploy it, verify, then revoke the old one. That way rotation never causes downtime.
- If the provider has an API for key management, consider **automating rotation** on a schedule. A key that rotates every month without anyone doing anything is much less likely to cause this kind of outage.

### 5. Reduce how much the UI test depends on the live provider
As mentioned earlier, the redirect test doesn't need a live financial API to check *your* behaviour. Consider:

- **Mocking the provider** with `page.route()` for the main UI test suite, so credential problems can't block it
- Keeping **one dedicated integration/smoke test** against the provider sandbox that runs on a schedule and alerts the owning team. This test and the preflight check are where credential problems should surface, not your general UI suite.

## Summary checklist

**Now:**
- [ ] Confirm owner, usage locations, and that it's a sandbox key
- [ ] Issue a new least-privilege sandbox key and note its expiry
- [ ] Update every secret store location; never commit or log it
- [ ] Re-run tests, revoke the old key, clean up any artifacts that captured credentials

**To prevent a repeat:**
- [ ] Record the credential with owner and expiry date
- [ ] Scheduled expiry check alerting at 30/14/7 days
- [ ] Preflight auth check with a clear failure message
- [ ] Rotation runbook, with overlapping keys or automation if supported
- [ ] Mock the provider in the UI suite; keep a separate sandbox smoke test

If you tell me which CI system and secret store you use, I can sketch the scheduled expiry check and the Playwright preflight setup for your stack.
