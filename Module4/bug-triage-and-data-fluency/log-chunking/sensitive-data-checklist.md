# Asset 2: Sensitive data reference list
Use this as a checklist every time you prepare a CI log for LLM input.
Sensitive data patterns to look for in CI logs
1. API keys and tokens
- Pattern: Long alphanumeric strings assigned to variable names containing `KEY`, `TOKEN`, `SECRET`, `API`, `AUTH`
- Common examples: `STRIPE_API_KEY`, `GITHUB_TOKEN`, `AWS_SECRET_ACCESS_KEY`, `SENDGRID_API_KEY`
- Placeholder format: `[REDACTED_STRIPE_API_KEY]`, `[REDACTED_GITHUB_TOKEN]`
2. Database connection strings
- Pattern: `protocol://username:password@hostname:port/database`
- Common examples: `postgres://`, `mysql://`, `mongodb+srv://`
- Placeholder format: `[REDACTED_DB_CONNECTION_STRING]`
3. Internal hostnames and service URLs
- Pattern: URLs containing `.internal`, `.corp`, `.local`, `.private`, or non-public domain names
- Common examples: `https://api-gw.internal.company.corp`, `https://db.private.example.com`
- Placeholder format: `[REDACTED_INTERNAL_API_URL]`, `[INTERNAL_HOST]`
4. User credentials in environment variables
- Pattern: Variables named `PASSWORD`, `PASSWD`, `USER_PASS`, `ADMIN_PASSWORD`, `TEST_USER_SECRET`
- Placeholder format: `[REDACTED_TEST_PASSWORD]`
5. Internal project and ticket identifiers
- Pattern: Jira/Linear project keys in formats like `PROJ-1234`, `SHOP-7812`, `ENG-451`
- Placeholder format: `[INTERNAL_TICKET_REF]`
6. Machine names and infrastructure IDs
- Pattern: Auto-generated runner names like `fv-az941-812`, container IDs, internal IP addresses
- Placeholder format: `[REDACTED_MACHINE_NAME]`, `[INTERNAL_HOST_IP]`
7. Authentication headers logged accidentally
- Pattern: `Authorization: Bearer eyJhbGci...`, `X-API-Key: ...`
- Placeholder format: `[REDACTED_AUTH_HEADER]`
