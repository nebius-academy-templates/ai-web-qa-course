# 1.1.7 Iteration progression for the pipeline scenario: reference solution

This replaces the old reference, which answered a different scenario (a manual UI debug of a "Connect account" button).
The scenario here is the one in the task: a Playwright UI test fails in the pipeline because an element on a third-party page no longer redirects the user. Facts arrive one at a time: invalid API response, 401, financial API, expired key.

## Ruling: how many iterations? **Five prompts: Prompt 0 plus four iterations.**

- The task says "Prompt 0 ... Prompts 1 to 4", and the fact deck has four facts, so there are exactly five prompts, and each of the four facts gets its own prompt.
- The 1.1.5 and 1.1.6 TechShop demo is a different exercise with **three** iterations. That is where a "three" in the module comes from and it should not appear in 1.1.7's task text, checklist or reference.
- Wording to use everywhere in 1.1.7: "Prompt 0 plus four iterated prompts, five prompts in all".

## The progression

The observed lines below come from one five-prompt conversation in claude.ai on 2026-11-01 (Opus 5.5; conversation 3320bf67). The prompts were sent exactly as written here, one at a time. Two earlier chains run outside claude.ai are noted where they differ. Quotes are word for word.

### Prompt 0: the symptom only

```
A Playwright UI test fails in our pipeline. An element on a third-party page is no longer redirecting the user. Help me work out why this failure occurred, starting with what to check first.
```

- Observed first check: **the trace**. "Start with the trace, not the code." It then split "no longer redirecting" into four cases: the click never landed, the click landed but nothing navigated, it navigated somewhere else (a consent page or CAPTCHA), or it opened in a new tab. The locator comes up under the first case. Accept "check the trace" or "check the locator" as the first check.
- What narrowed: nothing yet. This is the widest hypothesis set.
- Leak check: no deck fact present. Any of the four facts here = unmet. (The response did not mention credentials, tokens or 401s.)

### Prompt 1: add Fact 1 (invalid API response)

```
Same failing test as above: an element on a third-party page no longer redirects the user. I've now found that the third-party page isn't rendering because the API behind it is not returning a valid response. List the most likely causes of an invalid API response in this situation, and what evidence would confirm each.
```

- Observed: a list of ten causes, each with the evidence that would confirm it, starting with bot protection, rate limiting and IP blocking.
- The expired-credential hypothesis **already appears here**, at number 7: "Missing or expired authentication or session state. An API key, token, cookie or storage-state file used by the test has expired or rotated." The two earlier chains also raised it at this prompt.
- What narrowed: from "something in the UI" to "the page's backend call".

### Prompt 2: add Fact 2 (401)

```
Same failing test; the API behind the third-party page isn't returning a valid response. I've now confirmed the response status is 401. What does a 401 from a third-party API usually mean in a CI run, and what should I check first?
```

- Observed first check: "Check first: the response itself and the request headers", meaning the `WWW-Authenticate` header and the body, which "often state the reason outright".
- It split the causes into two branches: credentials absent, or credentials present but rejected. "Expired or rotated credentials" was first in the second branch. It was not called the most likely cause overall. (In both earlier chains it was: "the classic reason a test was green for months and then suddenly started failing".)
- What narrowed: from any failing request to authentication.

### Prompt 3: add Fact 3 (financial API)

```
Same failing test. The API returns 401 and I now know the third-party site is a financial API. Given that, what authentication-related causes are most likely, and what should I check first in our test environment?
```

- Observed: "That shifts the likely causes towards things that expire on a schedule and things that break when tests run in parallel." Its list: expired OAuth tokens and refresh-token rotation, expired consent, an expired client certificate (mTLS), request signing and clock skew, sandbox resets or key rotation, and extra authentication or lockout.
- Note for graders: "the API key expired" becomes *less* prominent here. It splits into several things that expire, and key rotation is item 5.
- Security point: it said the pipeline should use the provider's sandbox and "Real customer credentials and production endpoints should never be in an automated UI test", and asked for the error body "with token values redacted".

### Prompt 4: add Fact 4 (expired key)

```
Same failing test. The API returns 401 from a financial provider, and I've now confirmed that the API key our test environment uses has expired. What should I do to fix this properly, and how do I stop it happening again?
```

- Observed: "Generate a new sandbox key" under a team or service account, store it only in the CI secret store, revoke the old key, search for other copies, rerun.
- Prevention: record the expiry and an owner, alert before expiry, a preflight check that fails fast with a clear message, automated rotation, less dependence on the live provider, and "Apply the same tracking to the other expiring pieces mentioned earlier: client certificates, consents and sandbox".
- Security note for the debrief: never paste the expired (or any) key into the prompt. Describe it ("the key in CI secret X expired on date Y"). The claude.ai run did not say this itself, so it belongs in the debrief.

## "At which prompt did Claude first name the real cause?"

Observed in all three chains: **Prompt 1**, as one hypothesis in a list of eight to ten. In claude.ai it was number 7. At Prompt 2 it became the first credential-rejection cause (claude.ai) or the leading cause (the earlier chains). Claude was not told the key had expired before Prompt 4.

Grading: accept **Prompt 1 or Prompt 2** with a quote that names expired or rotated credentials. "Prompt 3" needs a quote, and a learner who gives it has probably missed the earlier mention. "Not before Fact 4" is accepted only with a quote showing their run did not raise it.

## The one-shot control

```
A Playwright UI test fails in our pipeline: an element on a third-party page no longer redirects the user. The third-party page isn't rendering because the API behind it isn't returning a valid response. The response status is 401. The third-party site is a financial API. The API key our test environment uses has expired. What should I do to fix this properly, and how do I stop it happening again?
```

Observed in claude.ai (conversation e90159d7), compared with Prompt 4 of the chain: **about as good, and in the same shape.**
- **Same plan.** Both said: new sandbox key, CI secret store, revoke the old key, rerun, then expiry alerts, an owner, a preflight check and less reliance on the live provider. The one-shot was more specific on that last point: stub the API with `page.route()` and keep a few sandbox contract tests in a separate job.
- **Similar length:** about 575 words against about 510.
- **It went straight to the key.** It did not re-check the diagnosis. (Both earlier one-shots outside claude.ai did open with "Confirm it's really expiry".)
- **It did not skip the UI layer.** Don't accept "skipped the UI layer" without a quote.
- **What the chain added.** Prompt 4 carried over the other expiring items found at Prompt 3 (certificates, consents, sandbox resets). The one-shot did not mention them. Neither answer warned against pasting the key into chat.

The honest conclusion the learner should reach (and the grader should accept): if the one-shot is as good, iteration still gave something the one-shot could not. In the pipeline the learner did not have Fact 4 at minute one. The facts arrive one at a time, and each prompt is how the human narrows and decides the next question. The one-shot is only possible after the investigation is finished.

Sentence template to accept: "Compared with iterating, the one-shot prompt [was just as good / went straight to the key / did not mention the other things that expire], but I could only write it after I had all four facts."
