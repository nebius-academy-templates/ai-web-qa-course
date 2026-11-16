That context matters. Financial APIs (banking, payments, open banking aggregators and the like) use stricter authentication than most third parties: short-lived tokens, expiring consents, client certificates, signed requests, and tight account-security controls. Each of these has a built-in expiry or a security check that can start failing on a particular day with no code change, which matches what you're seeing.

## Most likely causes for a financial API

### 1. Expired access token, or a broken refresh flow
Financial APIs often issue OAuth access tokens that last minutes, not hours. The test setup depends on refreshing them.

- **Refresh token rotation:** many providers issue a new refresh token on every refresh and invalidate the old one. If **parallel CI workers or concurrent pipelines** refresh with the same stored refresh token, the first one wins and every other one gets a 401. Some providers treat reuse of an old refresh token as theft and **revoke the whole token family**, so even the "winner" stops working.
- **The refresh token itself expired** (often 30–90 days), or the stored token in your secrets/`storageState` is simply old
- **Confirm it:** the body or `WWW-Authenticate` says `invalid_token`/`expired`. Decode the token's `exp`. Check whether failures started when you increased parallelism or added a second pipeline using the same credentials. Look for `invalid_grant` on the token endpoint call.

### 2. Expired user consent (open banking / account access)
Under regimes like PSD2 and UK Open Banking, access to account data rests on a **consent that expires** and needs periodic reauthorisation (historically 90 days, now longer in some regions and set by the provider in others). When it lapses, tokens stop working even though they look valid.

- **Confirm it:** an error like `consent_expired`, `consent revoked`, or `reauthorisation required`. The consent creation date in the provider's dashboard is about one consent period before the first failure. Re-running the consent flow by hand fixes it.

### 3. Expired or missing mTLS client certificate
Many financial APIs require **mutual TLS**: your client presents a certificate on every request. These certificates expire (often yearly) and are easy to forget.

- Depending on the setup, an expired or missing certificate can surface as a 401, a 403, or a TLS handshake failure
- **Confirm it:** check the certificate's expiry (`openssl x509 -in cert.pem -noout -enddate`). Check that the certificate and key are actually present in the CI environment (mounted secret, file path) and loaded by whatever makes the call. Look at whether the failure date lines up with the certificate's `notAfter`.

### 4. Request signing failures, including clock skew
Many financial APIs require each request, or the token request, to be **signed** (JWS, HMAC, `private_key_jwt` client assertions) with a timestamp or nonce. They usually tolerate very little clock difference.

- **Confirm it:** errors mentioning `signature`, `iat`, `nbf`, "timestamp out of range", or "replayed nonce". Compare the runner's clock with real time (`date -u`). Check that the signing key in CI is the current one and hasn't been rotated on the provider side (JWKS changes).

### 5. Sandbox vs production mix-up
Financial providers almost always have separate sandbox and production environments with **completely separate credentials**.

- **Confirm it:** check that the base URL and the credential the test uses belong to the same environment. Check whether someone recently changed an environment variable or the config that selects the environment. A sandbox key sent to production (or the reverse) gives a 401.

### 6. Test account locked or flagged by security controls
Fraud and security systems on financial platforms are aggressive. Repeated logins from datacenter IPs, many parallel sessions, or failed attempts can **lock the test account, force a password reset, or require step-up authentication (MFA/SCA)** that an automated test can't complete.

- **Confirm it:** try logging in as the test user by hand. Check the provider dashboard or email inbox for lockout or "suspicious activity" notices. Look for an MFA challenge in the trace before the 401.

### 7. Credential rotation policy or revoked keys
Financial providers often **force periodic API key or client-secret rotation**, or revoke keys after a security event.

- **Confirm it:** the same credential fails from outside CI too. The provider portal shows the key as expired or revoked, or there's a rotation notice in email or the developer portal. Ask who owns the integration whether keys were rotated and whether CI secrets were updated.

### 8. IP allowlisting
Some financial APIs only accept calls from registered IPs. A change in CI runner IPs (new runner pool, new cloud region, moving to hosted runners) can cause rejections. Usually that's a 403, but some providers return a 401.

- **Confirm it:** the runner's egress IP isn't on the provider's allowlist. It passes from an allowlisted network.

## What to check first in your test environment

In order of how fast each check is and how likely it is to be the cause:

1. **Read the 401 body and `WWW-Authenticate` header.** Financial APIs usually return a specific error code (`invalid_token`, `consent_expired`, `invalid_client`, `invalid_signature`). That code often points straight at one of the causes above.
2. **Confirm environment and credential pairing:** sandbox URL with sandbox credentials. It takes a minute and rules out cause 5.
3. **Check expiry dates in one pass:** access/refresh token `exp`, consent creation date, client certificate `notAfter`. Compare each against the date of the first failure. A match is almost certainly your answer.
4. **Check for concurrency:** do several workers or pipelines share one refresh token or test account? If failures started when parallelism increased, suspect refresh-token rotation (cause 1) or account lockout (cause 6).
5. **Try the same credentials outside CI.** If they fail everywhere, the credential, consent or account is bad (1, 2, 6, 7). If they work locally, look at the CI environment: missing cert or secret, clock skew, IP allowlist (3, 4, 8).

## Two cautions specific to financial APIs

- **Don't log secrets while debugging.** Tokens, client secrets, private keys and certificate material shouldn't end up in CI logs, Playwright traces or HAR files that get uploaded as artifacts. Traces record request headers, including `Authorization`, so treat trace artifacts as sensitive or redact them.
- **Make sure the test only ever touches the sandbox.** UI tests shouldn't run against a production financial API with real accounts. Beyond the security and compliance risk, production fraud controls are exactly what produce lockouts and step-up challenges. Longer term, it's often best to mock the provider for the redirect test, and keep one separate, non-blocking sandbox test that checks the real authentication still works.

If you share the error code or message from the 401 body (with any token values removed), I can tell you which of these it points to.
