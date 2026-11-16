That's useful to know. Financial APIs (banking, payments, open banking, aggregators) have much stricter auth than typical APIs. Credentials are shorter-lived, there are more layers, and expiry is often enforced by regulation. Several of the generic causes from before become much more likely, and a few new ones come in.

## Most likely causes with a financial API

### 1. Sandbox and production credentials are mixed up
Financial providers almost always keep **sandbox/test and live environments completely separate**, each with its own keys, base URLs and accounts. A sandbox key sent to a production URL (or the reverse) gets a 401.

**Check:** Compare the base URL the page calls (seen in the trace) with the environment your credentials belong to. Look for config drift: an env variable that defaults to production, or a recent change to the environment the third-party page points at.

### 2. A short-lived OAuth access token has expired, or refresh failed
Financial APIs often issue access tokens that last **minutes, not days**. Many also use **refresh token rotation**, where each refresh token works only once. If two parallel workers or retries refresh at the same moment, the second one invalidates the session. If a cached token gets reused, it fails.

**Check:**
- The token's `exp` claim, if it's a JWT. You can decode it locally, but don't paste live tokens into online decoders.
- Whether it fails **only with parallel workers or on retries**. Try `workers: 1` and `retries: 0`.
- Whether your setup caches a token between runs or jobs.

### 3. User consent has expired
Open banking rules often require consent to be **renewed periodically**. Under PSD2/UK Open Banking, the usual period is 90 days, with longer periods allowed in some regimes now. Aggregator-style APIs also invalidate access when the linked account needs re-authentication. The result is a 401 (or a provider-specific error) even though the client credentials are fine.

**Check:** The error body for codes such as `consent_expired`, `consent_revoked`, `ITEM_LOGIN_REQUIRED` or `reauthorization_required`. Also check the date the test account's consent or link was created. A test that ran green for about three months and then broke is a strong hint.

### 4. Mutual TLS (mTLS) client certificate problems
Many banking and open banking APIs require a **client certificate** in addition to the token, and the token may be bound to that certificate. An expired certificate, a missing one on the CI runner, or the wrong one (sandbox vs production) can produce a 401. It can also produce a TLS handshake failure before any HTTP status appears.

**Check:**
- The certificate's expiry date:
  ```bash
  openssl x509 -in client.crt -noout -enddate
  ```
- That the certificate and key are actually mounted and readable in the CI job, not only on your machine.
- Whether a TLS proxy on the runner is intercepting traffic. mTLS doesn't survive interception.

### 5. Request signing or clock skew
Some financial APIs require **signed requests** (HMAC signatures, JWS-signed payloads or signed JWT client assertions) with timestamps that are valid for only a few minutes. A runner whose clock is off, or a signing key that has changed, gets a 401.

**Check:**
- The runner's clock against an accurate time source (`date -u` in the pipeline, compared with real UTC).
- Error messages like `invalid_signature`, `timestamp out of range`, `jwt expired` or `iat in the future`.
- Whether the signing key or key ID (`kid`) was rotated on either side.

### 6. Key rotation or credential revocation
Financial providers often enforce **mandatory key rotation** and revoke keys automatically, for example on a fixed schedule or after a key was detected in a log or repo.

**Check:** The provider's developer dashboard for the key's status, expiry date, or a revocation notice. Look for security emails sent to whoever owns the developer account.

### 7. IP allowlisting
Some financial APIs only accept calls from **allowlisted IPs**. Shared CI runners use changing IPs that won't be on the list. This more often gives a 403, but some providers return 401.

**Check:** Whether the provider's dashboard has an IP allowlist, and whether the failure happens only from CI and never locally or from a fixed-IP runner.

### 8. Missing scope or permission
The token is valid but lacks the scope this endpoint needs (for example `accounts:read` vs `payments:write`). The provider may also have changed what scope an endpoint requires.

**Check:** The `scope` claim in the token, and the error body for `insufficient_scope`. Note that this is more often a 403.

---

## What to check first, in order

1. **The 401 response body and the `WWW-Authenticate` header.** Financial APIs usually return specific error codes. That one field often tells you whether you're dealing with consent, an expired token, a signature or a certificate problem.
2. **Environment match.** Compare the base URL with the credential's environment (sandbox vs live). This is quick, and it's a common mistake.
3. **Expiry dates, all of them:** the access token (`exp`), the refresh token, the user consent, the mTLS certificate and the API key. These all expire on independent schedules, and any one of them can produce this failure.
4. **CI-specific setup:** are the certificate files, secrets and signing keys present in the job? Is the runner clock correct? Is the runner IP allowlisted?
5. **Concurrency:** rerun with a single worker and no retries to rule out refresh-token rotation conflicts.
6. **The provider's dashboard and changelog:** key status, revocations, auth changes, and sandbox resets. Some sandboxes wipe test accounts and consent on a schedule.

## A few cautions specific to financial APIs

- **Always test against the sandbox, never against live accounts or real customer data.** If this test touches production financial credentials, that's worth fixing on its own, apart from the bug itself.
- **Traces and logs are sensitive here.** Playwright traces record headers, cookies and response bodies, which can include tokens and account data. Keep trace artifacts private and give them a short retention period. Rotate any credential that ends up in a log.
- **Don't hammer the auth endpoint while debugging.** Financial providers often lock or flag accounts after repeated failed auth attempts. Turn off retries on this test until the cause is known.
- **The longer-term fix:** for the UI test itself, consider stubbing the financial API with `page.route()` using fixture responses. Keep a separate, small and clearly owned integration check that manages consent and token refresh properly. That way an expiring consent doesn't block your whole pipeline.

If you can share the error code or message from the 401 body (with tokens and account details removed) and tell me whether the provider uses OAuth, mTLS or signed requests, I can narrow this down to the specific cause.
