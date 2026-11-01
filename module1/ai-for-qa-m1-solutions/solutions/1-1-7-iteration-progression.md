# 1.1.7 Iteration progression for the pipeline scenario: reference solution

This replaces the old reference, which answered a different scenario (a manual UI debug of a "Connect account" button).
The scenario here is the one in the task: a Playwright UI test fails in the pipeline because an element on a third-party page no longer redirects the user. Facts arrive one at a time: invalid API response, 401, financial API, expired key.

## Ruling: how many iterations? **Five prompts: Prompt 0 plus four iterations.**

- The task says "Prompt 0 ... Prompts 1 to 4", and the fact deck has four facts, so there are exactly five prompts, and each of the four facts gets its own prompt.
- The 1.1.5 and 1.1.6 TechShop demo is a different exercise with **three** iterations. That is where a "three" in the module comes from and it should not appear in 1.1.7's task text, checklist or reference.
- Wording to use everywhere in 1.1.7: "Prompt 0 plus four iterated prompts, five prompts in all".

## The progression

The "observed" lines below come from two full five-prompt chains captured on 2026-11-01 (chain A and chain B, raw output in `run-checks/2026-11-01/117-chain*.md`). Each chain was one fresh conversation, given the prompts exactly as written here, one at a time. Quotes are verbatim. Where the real drift differs from what was expected before, that is said in place.

### Prompt 0: the symptom only

```
A Playwright UI test fails in our pipeline. An element on a third-party page is no longer redirecting the user. Help me work out why this failure occurred, starting with what to check first.
```

- Observed first check: **the failure artifacts, then UI-level causes.** Both chains opened with the trace rather than the locator. A: "Before you change anything, get the evidence from the failed CI run" (trace, screenshot, exact error), then "Did the locator match anything?". B: "Look at what the browser actually saw (start here)", then "Is the element still there, with the same text, role or attributes your locator uses?". Accept "check the trace" or "check the locator" as the first check.
- What narrowed: nothing yet. This is the widest hypothesis set (our test, the third-party page, the network, the environment).
- Leak check: no deck fact present. Any of the four facts here = unmet. (Neither captured response mentioned credentials, tokens or keys at this stage.)

### Prompt 1: add Fact 1 (invalid API response)

```
Same failing test as above: an element on a third-party page no longer redirects the user. I've now found that the third-party page isn't rendering because the API behind it is not returning a valid response. List the most likely causes of an invalid API response in this situation, and what evidence would confirm each.
```

- Observed first check: **request and response inspection**, as expected. A: "First: capture the actual response" (status code, content type, body, headers). B: open the trace's Network tab "on the failing API call before anything else". Both then gave a ranked list of eight or nine causes, with bot or WAF blocking first, and an outage or contract change next.
- The expired-credential hypothesis **already appears here**, ranked fourth or fifth. A: "a cookie, token or consent choice ... that your saved `storageState` holds in an expired form". B: "an expired API key or test-account token in CI secrets".
- What narrowed: from "something in the UI" to "the page's backend call". UI locator and event-handler checks drop out; request/response/network checks come in.

### Prompt 2: add Fact 2 (401)

```
Same failing test; the API behind the third-party page isn't returning a valid response. I've now confirmed the response status is 401. What does a 401 from a third-party API usually mean in a CI run, and what should I check first?
```

- Observed first check: **credentials**, as expected. A: "Check first: were credentials sent at all?". B: "Look at the failing request in the trace ... Is there an `Authorization` header or a session cookie at all?".
- What narrowed: from "any malformed or failing request" to authentication. Payload, schema and network-reachability checks drop out; token, key and header checks come in.
- Observed: by this point, expiry has become **a leading hypothesis**, not just one of several. A: "This is the most common cause when a test 'suddenly' starts failing with no code change". B: "Credentials have expired or been rotated ... This is the classic reason a test was green for months and then suddenly started failing". Both say the 401 rules out the earlier causes (A: "outage, rate limiting, contract change"; B: "It isn't an outage, and it usually isn't bot blocking either").

### Prompt 3: add Fact 3 (financial API)

```
Same failing test. The API returns 401 and I now know the third-party site is a financial API. Given that, what authentication-related causes are most likely, and what should I check first in our test environment?
```

- Observed first check: in both chains, **"Read the 401 body and `WWW-Authenticate` header"**, then check that sandbox and production credentials are not mixed up, then "Check expiry dates in one pass" (A) / "Expiry dates, all of them" (B). The cause lists became specific to financial providers: short-lived OAuth tokens and refresh failures, expired consent, mTLS certificates, request signing and clock skew, account lockout, key rotation, IP allow-listing.
- Note for graders: the plain "API key expired" hypothesis gets *less* prominent here, not more. It splits into several expiring things (token, consent, certificate, key), and the key itself was item 6 or 7 on the list.
- What narrowed: generic 401 causes narrow to what is typical for a regulated financial provider (short-lived or rotated keys, strict environment separation). It also raises a security point, which belongs in this course. Both chains raised it unprompted: "Traces record request headers, including `Authorization`, so treat trace artifacts as sensitive" (A), and "Always test against the sandbox, never against live accounts" (B).

### Prompt 4: add Fact 4 (expired key)

```
Same failing test. The API returns 401 from a financial provider, and I've now confirmed that the API key our test environment uses has expired. What should I do to fix this properly, and how do I stop it happening again?
```

- Observed first check: A: "Find out who owns the key and where it's used" before generating anything. B: "Generate a new key in the provider's sandbox/test dashboard". Both then said to store the key only in the secret store, verify it, revoke the old key and re-run.
- What narrowed: diagnosis is done; the question changes from "why" to "fix and prevent" (key rotation, an expiry alert, a health-check test that fails clearly on a 401 instead of a missing redirect).
- Prevention in both chains: a record of each credential with its owner and expiry, a warning before expiry, a preflight check that fails clearly on a 401, and less dependence of the UI test on the live provider.
- Security note for the debrief: never paste the expired (or any) key into the prompt. Describe it ("the key in CI secret X expired on date Y"). Both chains said the same: "Don't paste the key into chat, tickets, commits or pipeline logs" (B).

## "At which prompt did Claude first name the real cause?"

Observed in both chains: **Prompt 1** (invalid API response), as one hypothesis among eight or nine, ranked fourth or fifth. That is earlier than the old reference expected. It became **the leading hypothesis at Prompt 2** (the 401). At Prompt 3 it split into several financial-API expiries (token, consent, certificate, key). Claude was not told the key had expired before Prompt 4.

Grading: accept **Prompt 1 or Prompt 2** with a quote that names expired or rotated credentials. A learner who answers Prompt 1 is reading the output closely, not mistaken. "Prompt 3" needs a quote, and a learner who gives it has probably missed the earlier mention. "Not before Fact 4" is accepted only with a quote showing their run genuinely didn't raise it, since neither captured chain behaved that way.

## The one-shot control

```
A Playwright UI test fails in our pipeline: an element on a third-party page no longer redirects the user. The third-party page isn't rendering because the API behind it isn't returning a valid response. The response status is 401. The third-party site is a financial API. The API key our test environment uses has expired. What should I do to fix this properly, and how do I stop it happening again?
```

Observed (2 one-shot runs against the two Prompt 4 answers): **about as good, and in the same shape.** Both versions said to issue a new sandbox key, store it in the CI secret store, revoke the old one, mock the provider with `page.route` for the UI test, add a preflight auth check and set expiry alerts. The real differences:
- **Shorter:** about 680 to 740 words, against 940 to 1,080 for Prompt 4.
- **It re-checks the diagnosis.** Both one-shots still opened with "Confirm it's really expiry. A 401 can also mean the key was revoked, has the wrong scope, or belongs to the wrong environment". The Prompt 4 answers took the confirmed fact as given. So "jumps straight to the expired key" is only half true.
- **It does not skip the UI layer.** Both one-shots told the learner to stop the UI test depending on the live API. Don't accept "skipped the UI layer" without a quote.
- **It missed the security cautions the chain picked up.** Neither one-shot warned against pasting the key into chat, or said that Playwright traces can capture credentials. Both Prompt 4 answers did, carried over from the Prompt 3 discussion. This is the clearest thing iterating added.

The honest conclusion the learner should reach (and the grader should accept): if the one-shot is as good, iteration still gave something the one-shot could not. In the pipeline the learner did not have Fact 4 at minute one. The facts arrive one at a time, and each prompt is how the human narrows and decides the next question. The one-shot is only possible after the investigation is finished.

Sentence template to accept: "Compared with iterating, the one-shot prompt [was just as good / was shorter / left out the security cautions about keys in chat and traces], but I could only write it after I had all four facts."
