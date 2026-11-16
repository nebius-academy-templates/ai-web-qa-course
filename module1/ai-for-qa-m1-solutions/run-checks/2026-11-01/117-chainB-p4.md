Good, so the cause is confirmed. The fix itself is simple. The more useful part is making sure an expiring key never breaks your pipeline by surprise again.

## Part 1: Fix it now

**1. Generate a new key in the provider's sandbox/test dashboard**
- Make sure you're in the **sandbox/test environment**, not live. Check that the new key's environment matches the base URL your tests call.
- Give it the **same scopes and permissions** as the old key, and nothing more.
- Note the new key's **expiry date** (and the rotation policy, if the provider has one). You'll need it for Part 2.
- If the provider requires it, update any linked items too: IP allowlist entries, mTLS certificates, or webhook secrets tied to the key.

**2. Update the secret where CI reads it**
- Replace the value in your secrets store: GitHub Actions secrets, GitLab CI variables, Vault, AWS Secrets Manager, Azure Key Vault, or wherever it lives.
- Check **every place** the key is used: other pipelines, other environments (staging, QA), local `.env` templates, and other teams' jobs that share it. Expired keys are often copied into several places.
- Don't paste the key into chat, tickets, commits or pipeline logs.

**3. Verify before you rerun the whole suite**
- Do one quick authenticated call from a CI job (or locally with the same secret). Log only the status, never the key:
  ```bash
  curl -s -o /dev/null -w "%{http_code}\n" \
    -H "Authorization: Bearer $FIN_API_KEY" \
    https://sandbox.provider.example/health-or-cheap-endpoint
  ```
  Expect a 200. Then rerun the failing Playwright test.

**4. Clean up**
- **Revoke the old key** in the dashboard, even though it has already expired, so it can't be reactivated or confused with the new one.
- Remove any cached sessions or `storageState` files created with the old credentials.
- Turn retries back on for that test if you disabled them while debugging.

---

## Part 2: Stop it happening again

The root cause isn't really "the key expired." Keys are supposed to expire. The real gap is that **nothing told you before it did**, and the test pipeline had no clear owner for that credential. Fix both.

### 1. Give the credential an owner and a record
- Record in your secrets inventory or runbook: **what the key is for, which environment, who owns it, when it expires, and how to rotate it.**
- Make the owner a **team or rota, not one person.** Keys often expire after the person who created them has moved on.

### 2. Get warned before expiry
Do one or more of these, strongest first:
- **Automate the rotation.** If the provider has an API for key management, a scheduled job can create a new key, update the secret store, verify it, and revoke the old one. Secret managers like AWS Secrets Manager and Vault support rotation functions for exactly this.
- **Watch for expiry.** If the provider exposes key metadata, or you store the expiry date alongside the secret, run a scheduled check that alerts **30, 14 and 7 days** before expiry.
- **At minimum:** set a shared calendar reminder or a ticket that comes due about two weeks before expiry, assigned to the owning team.
- **Turn on the provider's expiry notifications,** and make sure they go to a **team mailbox or channel**, not one person's inbox.

### 3. Fail fast with a clear message
Add a **preflight check** to `globalSetup` that calls the API once before the suite runs. When auth fails, it should stop with an error that names the cause:
```ts
// global-setup.ts
export default async function globalSetup() {
  const res = await fetch(`${process.env.FIN_API_BASE}/health-or-cheap-endpoint`, {
    headers: { Authorization: `Bearer ${process.env.FIN_API_KEY}` },
  });
  if (res.status === 401) {
    throw new Error(
      'Financial sandbox API key rejected (401). It has probably expired or been revoked. ' +
      'Rotate it following docs/runbooks/fin-api-key.md.'
    );
  }
}
```
Next time, the pipeline says "the API key expired" straight away instead of "an element didn't redirect." That would have saved you this whole investigation.

### 4. Decouple the UI test from the live credential
- In the main UI suite, **stub the financial API** with `page.route()` and fixture responses. An expiring key then can't block unrelated changes.
- Keep a **small, separate integration check** against the real sandbox, run on a schedule (for example nightly) and owned by the team that manages the credential. It still catches real auth and contract problems, but it alerts the right people instead of blocking everyone's merges.

### 5. General credential hygiene (worth doing while you're in there)
- One key per purpose and environment, so you don't share a key across CI, local development and staging. Rotations then don't break unexpected things.
- Least-privilege scopes.
- Sandbox only, never live financial credentials in test pipelines.
- Keep trace and log artifacts private with short retention, since traces record headers.

---

## A short checklist

- [ ] New sandbox key generated (same scopes, expiry date noted)
- [ ] CI secret updated everywhere it's used
- [ ] Verified with one authenticated call, then the test rerun
- [ ] Old key revoked, stale sessions cleared
- [ ] Owner and expiry recorded in the runbook or secrets inventory
- [ ] Expiry alert or automated rotation set up
- [ ] `globalSetup` preflight with a clear auth error
- [ ] Plan to stub the API in UI tests and move real calls to a scheduled integration check

If you tell me which CI system and secrets store you use, and whether the provider offers a key-management API, I can sketch the rotation job or expiry check for your setup.
