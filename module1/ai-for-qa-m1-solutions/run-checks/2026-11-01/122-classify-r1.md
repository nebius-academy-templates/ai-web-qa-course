Two of the five are unsafe because they hold live credentials or full customer details. One is fine to paste as it is, and two only need some quick masking first.

| File | Verdict | Main problem |
|---|---|---|
| 1. Test log | **Unsafe** | Customer email, customer ID, live session token |
| 2. CI config | **Unsafe** | Database password, live payments API key, internal hostnames |
| 3. Test fixture | **Safe** | Nothing. The data is synthetic and uses reserved ranges |
| 4. Mock dataset | **Safe once IDs are swapped** | User IDs could link back to real accounts |
| 5. API response | **Unsafe** | Full customer profile: name, contacts, home address, order |

---

### 1. sample-1-test-log.txt: Unsafe

**Data types:**
- **Personal data:** the email `hannah.brooks@techshop-demo.com` appears 6 times. It links to a named person and to account activity (failed logins, lockout).
- **Customer identifier:** `CUST-20931`.
- **Credential:** `sess_9f3c71a2e4b84d06`, shown in the log line and again in the `set-cookie` header. A session ID is effectively a password while the session is valid. Anyone who has it can take over the session.
- **Low risk:** request ID, API paths, file path, timestamps.

The password is already masked (`********`), which is good.

**Mask before sending:**
- Email → `user_a@example.com`. Use the same placeholder on every line so the sequence of attempts still makes sense.
- `CUST-20931` → `CUST-XXXXX`
- Both session ID values → `sess_REDACTED`

Everything you need to debug the failure stays intact: the assertion, the stack line and the 401. The masking takes out nothing useful.

### 2. sample-2-ci-config.yml: Unsafe

**Data types:**
- **Credential:** `DATABASE_URL` contains a username and password (`qa_runner:Stg-Pa55w0rd-SYNTH`).
- **Credential:** `PAYMENTS_API_KEY`. The `tsk_live_` prefix suggests a production key, which makes this the most dangerous item in all five files.
- **Infrastructure details:** `shop-staging.internal.corp` and `db-staging-02.internal.corp:5432` reveal internal hostnames, the port and the database name.

**Mask before sending:**
- The password and the whole API key → `<REDACTED>`
- Hostnames → generic names such as `db.internal.example`

**The real fix:** if this were real, masking the copy you paste wouldn't be enough. Secrets written in plain text in a CI file are already exposed to anyone with repo access, and they stay in git history. Rotate both credentials. Then move them into the CI system's secret store (`${{ secrets.DATABASE_URL }}`) so the file is safe to share by default.

### 3. sample-3-test-fixture.json: Safe

**Data types:** names, emails, phone numbers, loyalty tier, product SKU and price. They look like personal data, but they're synthetic:
- `"generatedBy": "faker (seed 4242)"` shows the records were generated, not copied from real customers.
- `.example` is a domain reserved for testing (RFC 2606/6761). It can never belong to a real person.
- `+44 7700 900xxx` is an Ofcom range set aside for drama and fiction. It's never assigned to real phones.

**Mask before sending:** nothing. Only check that the whole fixture was generated and that nobody hand-edited real records into it. Fixtures like this are the right way to share test data.

### 4. sample-4-mock-dataset.csv: Safe once IDs are swapped

**Data types:**
- **Pseudonymous identifiers:** `usr_…` IDs
- **Account attributes:** subscription tier, billing cycle, active status

The file has no names, contacts or payment details. A public LLM couldn't work out who these users are. But if the IDs were real, anyone with access to your systems could match each one to a person. Under UK GDPR, pseudonymised data like this still counts as personal data. Many company policies treat it the same way.

**Mask before sending:** replace the IDs with row numbers or new random tokens (`user_01`, `user_02`, …). This costs nothing, and the data is just as useful for any analysis or test-design question. Also, if the real subscription mix is commercially sensitive, share only the columns the question needs.

### 5. sample-5-api-response.json: Unsafe

**Data types:**
- **Directly identifying personal data:** full name, email, phone, full home address including the postcode (BS8 is a real Bristol area)
- **Customer and transaction data:** customer ID, order number, order total, timestamp
- **Preference data:** marketing consent

Taken together, this is a complete customer profile. Leaking it is a reportable kind of incident if it's real. The `example.com` email and the 7700 900 phone number hint that this sample is synthetic. Still, a real response from this endpoint would look exactly the same, so treat it as real.

**Mask before sending:**
- Name → `Customer A`
- Email → `customer_a@example.com`
- Phone → `+44 7700 900000`
- Address → a placeholder such as `1 Test Street, Testville, AB1 2CD`
- `CUST-31877` and `ORD-905512` → `CUST-XXXXX` and `ORD-XXXXXX`. Mask these in the `endpoint` field too.
- The order total and timestamp can usually stay unless the question doesn't need them.

---

### Rules of thumb for future pastes

1. **Credentials are never OK to share**, whatever the environment. Treat "staging" and "test" credentials as real. They often unlock more than people expect.
2. **Mask consistently, not randomly.** Map each real value to one stable placeholder (`user_a`, `CUST-A`) so the model can still follow the logic.
3. **Keep the structure, swap the values.** The model needs field names, shapes and error messages, not the real data.
4. **Check the ID fields as well as the obvious personal data.** Endpoint paths, log lines and headers often repeat the IDs you masked in the body.
5. **Check your company's AI policy.** Consumer chat tools and enterprise or API plans can have different data-retention and training terms. Your org may approve some tools and not others.
