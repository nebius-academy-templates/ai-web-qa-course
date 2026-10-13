# 1.3.2 Token estimates and rankings: reference answers

The three prompts are in `data/token-cost-estimate/` (`prompt-a.txt`, `prompt-b.txt`, `prompt-c.txt`). **The lesson never printed their text, so I wrote them to match the lesson's own worked examples** (B is about 35 words of instruction plus about 25 words of DOM, C is a long exhaustive-analysis instruction plus a full page). **[SME CHECK]** if the original practice text exists elsewhere, replace my files with it and rerun `node scripts/make-manifests.ts`.

## The six cells (canonical accepted ranges)

Input is words / 0.75 (the lesson rule). Because logs, HTML and code tokenize more densely than prose, the upper bound also allows characters / 4. Both are shown in `MANIFEST.md`.

| Prompt | Words | Input tokens: rule point | Input tokens: accepted range | Output tokens: accepted range |
| --- | ---: | ---: | --- | --- |
| A (weak one-liner) | 9 | 12 | **11 to 15** | **40 to 150** |
| B (structured, scoped DOM) | 58 | 77 | **69 to 142** | **10 to 25** |
| C (over-specified, full page) | 188 | 251 | **226 to 496** | **500 to 1,000** |

Output reasoning, which is what the grader should look for:
- **A** asks only for "a locator", so the model adds alternatives and a paragraph of reasoning.
- **B** says "Return only the locator, no explanation", so one line.
- **C** asks for every strategy with pros, cons, a comparison, a ranking and a justified recommendation, so an essay.

The output ranges are my estimates from what each prompt asks for, not captured runs. **[RUN CHECK]** measure real responses; the manifest also has an empty "actual tokenizer count" column that needs a tokenizer or API key.

## Levers (evidence from the prompt text)

| Prompt | Prompt Size | Response Size | Model Choice | Request Frequency |
| --- | --- | --- | --- | --- |
| A | Under-used: no DOM, so the model has nothing to base a locator on | Unscoped: no instruction on how much to return | Not differentiated by the text | Not differentiated by the text |
| B | Well used: only the login form | Well used: "return only the locator" | Not differentiated | Not differentiated |
| C | Misused: nav, hero, footer and head add nothing to a single-button locator | Misused: an essay when one line is used | Not differentiated | Not differentiated |

A strong answer says that Model Choice and Request Frequency are not visible in the prompt text, and then notes that a generator running hundreds of times a day in CI multiplies whatever the other two levers cost, and that routine locator work belongs on a lighter tier.

## Ranking by cost: **B, A, C** (lowest to highest)

**C is last** in every reading: more than three times the input of B and, above all, an output 20 to 100 times larger.

**A versus B is the close call, and the rule that settles it is that output costs more than input.** On input alone A is cheapest (about 12 tokens against about 100), but output is billed at roughly 3 to 5 times the input rate (and 5 times in the sample `rates.json`). B's output is one line (about 17 tokens); A's is usually a locator plus alternatives and a paragraph (about 90). With the illustrative mid-tier rates in `src/token-cost/rates.json`, 1,000 calls cost about:

| Prompt | Assumed in / out tokens | Per call | Per 1,000 calls |
| --- | --- | ---: | ---: |
| B | 100 / 17 | 0.00044 | 0.44 |
| A | 12 / 90 | 0.00111 | 1.11 |
| C | 350 / 750 | 0.00984 | 9.84 |

(GBP, illustrative placeholder rates, computed with `npm run tokens -- cost`.) So B is cheaper than A, and the lesson's message holds: scoping the output saves more than trimming the input.

**Grader guidance:** the grader prompt accepts "A or B first", and I would keep that. A learner who puts A first because their own estimates make A cheaper (for example, they guessed a very short A output) is internally consistent and should be accepted. What must hold is **C last**, and a learner who puts A first should be pointed at output tokens, not marked wrong. **[SME CHECK]**

## Ranking by expected quality: **A, C, B** (lowest to highest), with C versus B settled

- **A is lowest.** There is no DOM, so the model has to guess what the page looks like. The locator may be right by luck (`getByRole('button', { name: 'Sign in' })` is the generic best guess), but nothing in the prompt lets it check.
- **C versus B, the ruling: C is never better than B on the locator itself, and is worse as an answer.** Both give the model the real DOM, so the locator they return should be the same. C adds noise (the whole page) and invites a long ranking of strategies including CSS and XPath, which gives the model more chances to recommend something brittle, and it buries the usable line in several hundred tokens. So B is at least as good on the locator and clearly better in usability (one line, ready to paste). Order: **C below B**, or tied on the locator with B ahead on usability.
- Volume buys verbosity, not a better locator. This is the lesson's point and it should not be argued away.

**Honest findings the grader must accept (from the grader prompt):** "C cost the most and gave the worst locator" and "C gave the same locator as B, just wrapped in an essay" are both valid. The most likely real outcome, which I expect but have not observed, is that all three return the same role-based locator, so the cost ranking holds and the quality ranking changes because A or C returned the same locator as B. **[RUN CHECK]**

## Expected locator

`page.getByRole('button', { name: 'Sign in' })` (accept `getByTestId` only if the DOM had one, which it does not; accept `locator('button[type=submit]')` as "a locator" but a learner who calls it the best choice over a role-based locator should explain why). The grader judges the learner's reasoning about the locator, not the syntax.
