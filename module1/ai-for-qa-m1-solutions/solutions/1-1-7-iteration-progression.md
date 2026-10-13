# 1.1.7 Iteration progression for the pipeline scenario: reference solution

This replaces the old reference, which answered a different scenario (a manual UI debug of a "Connect account" button).
The scenario here is the one in the task: a Playwright UI test fails in the pipeline because an element on a third-party page no longer redirects the user. Facts arrive one at a time: invalid API response, 401, financial API, expired key.

## Ruling: how many iterations? **Five prompts: Prompt 0 plus four iterations.**

- The task says "Prompt 0 ... Prompts 1 to 4", and the fact deck has four facts, so there are exactly five prompts, and each of the four facts gets its own prompt.
- The 1.1.5 and 1.1.6 TechShop demo is a different exercise with **three** iterations. That is where a "three" in the module comes from and it should not appear in 1.1.7's task text, checklist or reference.
- Wording to use everywhere in 1.1.7: "Prompt 0 plus four iterated prompts, five prompts in all".

## The progression

The first checks quoted below are what the grader prompt expects the drift to look like. I could not run Claude in this build, so they are expected, not captured. **[RUN CHECK]** capture a real run and replace the "first check" lines with verbatim quotes before go-live.

### Prompt 0: the symptom only

```
A Playwright UI test fails in our pipeline. An element on a third-party page is no longer redirecting the user. Help me work out why this failure occurred, starting with what to check first.
```

- Expected first check: UI-level causes. Whether the element's locator or selector changed, whether the click handler or redirect event fires, rendering or timing of the element.
- What narrowed: nothing yet. This is the widest hypothesis set (our test, the third-party page, the network, the environment).
- Leak check: no deck fact present. Any of the four facts here = unmet.

### Prompt 1: add Fact 1 (invalid API response)

```
Same failing test as above: an element on a third-party page no longer redirects the user. I've now found that the third-party page isn't rendering because the API behind it is not returning a valid response. List the most likely causes of an invalid API response in this situation, and what evidence would confirm each.
```

- Expected first check: request and response inspection. Look at the status code, the response body and the network call in the trace.
- What narrowed: from "something in the UI" to "the page's backend call". UI locator and event-handler checks drop out; request/response/network checks come in.

### Prompt 2: add Fact 2 (401)

```
Same failing test; the API behind the third-party page isn't returning a valid response. I've now confirmed the response status is 401. What does a 401 from a third-party API usually mean in a CI run, and what should I check first?
```

- Expected first check: credentials. Confirm the request sends the expected Authorization header and that the credential it carries is current.
- What narrowed: from "any malformed or failing request" to authentication. Payload, schema and network-reachability checks drop out; token, key and header checks come in.
- This is where the grader expects Claude to **first raise expired or invalid credentials as one hypothesis** in most runs, even though the learner has not mentioned a key yet.

### Prompt 3: add Fact 3 (financial API)

```
Same failing test. The API returns 401 and I now know the third-party site is a financial API. Given that, what authentication-related causes are most likely, and what should I check first in our test environment?
```

- Expected first check: provider-specific authentication rules. Key rotation and expiry policies, token scopes, sandbox versus production credentials, IP allow-listing and secrets handling in CI.
- What narrowed: generic 401 causes narrow to what is typical for a regulated financial provider (short-lived or rotated keys, strict environment separation). It also raises a security point, which belongs in this course: check the credential was supplied through the CI secret store, and that no real key sits in a prompt or a log.

### Prompt 4: add Fact 4 (expired key)

```
Same failing test. The API returns 401 from a financial provider, and I've now confirmed that the API key our test environment uses has expired. What should I do to fix this properly, and how do I stop it happening again?
```

- Expected first check: confirm the expiry date, rotate the key through the secrets store, re-run the pipeline.
- What narrowed: diagnosis is done; the question changes from "why" to "fix and prevent" (key rotation, an expiry alert, a health-check test that fails clearly on a 401 instead of a missing redirect).
- Security note for the debrief: never paste the expired (or any) key into the prompt. Describe it ("the key in CI secret X expired on date Y").

## "At which prompt did Claude first name the real cause?"

Expected: **Prompt 2** (after the 401), as one hypothesis among several. Prompt 3 is where it usually becomes the leading hypothesis. Claude should not be told the key has expired before Prompt 4. The grader prompt accepts either a prompt number with a quote, or an explicit "not before Fact 4", and both are correct results. [RUN CHECK]

## The one-shot control

```
A Playwright UI test fails in our pipeline: an element on a third-party page no longer redirects the user. The third-party page isn't rendering because the API behind it isn't returning a valid response. The response status is 401. The third-party site is a financial API. The API key our test environment uses has expired. What should I do to fix this properly, and how do I stop it happening again?
```

Expected observation [RUN CHECK]: the one-shot answer is about as good as Prompt 4's answer. It usually jumps straight to the expired key, skips the UI layer and lists fewer hypotheses.

The honest conclusion the learner should reach (and the grader should accept): if the one-shot is as good, iteration still gave something the one-shot could not. In the pipeline the learner did not have Fact 4 at minute one. The facts arrive one at a time, and each prompt is how the human narrows and decides the next question. The one-shot is only possible after the investigation is finished.

Sentence template to accept: "Compared with iterating, the one-shot prompt [jumped straight to the key / was shorter / listed fewer hypotheses / was just as good], but I could only write it after I had all four facts."
