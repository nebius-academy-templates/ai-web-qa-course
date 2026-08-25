# Workshop 2 — Secure Jira/Linear-to-Playwright Pipeline

A CLI that turns a ticket into Playwright tests, with three gates between the
ticket and the disk. You get it pre-built. You implement the gates.

```
ticket ID
  → adapter          getTicket(id) → { title, acceptanceCriteria, attachments }
  → SECURITY GATE    mask PII, scale with faker            ← sprint 1
  → Claude           generate a Page Object + a spec
  → SCHEMA GATE      validate the response                 ← sprint 2
  → HITL GATE        show the diff, ask a human            ← sprint 3
  → write files      output/
```

The three gates ship as stubs that throw. Three tests fail because of it.
Ninety minutes, three sprints, three tests going green.

> **Self-contained.** Everything lives in this directory: its own
> `package.json`, its own `node_modules`, its own tests. Nothing here touches
> the course material in the parent directory, and `npm test` at the repo root
> is unaffected by anything you do in here.

---

## Install

```bash
cd workshop-2
npm install
npm run smoke
```

`npm run smoke` makes **no API call and spends no tokens**. It checks that the
dependencies resolve, the fixture adapter returns a ticket, the three gates are
importable, and the checkpoints are where the restore script expects them.

Then:

```bash
npm test
```

You should see **3 failures, one per gate**. That is the starting line, not a
problem to fix before you begin.

### API key

The generation step needs one:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Without it, `npm start` refuses to run and says so — it never silently skips
the model call and writes empty files. **Sprints 1, 2 and 3 and the whole test
suite work fine without a key**; you only need one to run the pipeline
end-to-end at the end.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run smoke` | Verifies install + config. No API call. |
| `npm start -- <id>` | Runs the pipeline, e.g. `npm start -- TS-142` |
| `npm test` | All tests. 3 fail by design. |
| `npm test -- security` | Just one gate's test. Also `schema`, `hitl`. |
| `npm run checkpoint <n>` | Restores a checkpoint into `src/gates/` |
| `npm run typecheck` | `tsc --noEmit` |

---

## The three sprints

Each stub carries a TODO at the exact line the code goes, a doc comment saying
what "done" looks like, and a failing test that names the expected output. You
should never have to guess what is wanted.

### Sprint 1 — Security gate · `src/gates/security.ts`

A ticket is written by humans who paste production support threads into it.
The prompt is the leak.

- `maskPII(ticket)` → `{ masked, report }` — replaces emails, phone numbers and
  payment fragments with tokens, across the title, the description, every
  acceptance criterion, and every attachment.
- `scaleWithFaker(count, seed)` → synthetic users to put realistic shapes back
  into the prompt, deterministically.

> **DONE WHEN:** the masking report prints, and no email address or phone
> number appears anywhere in the outgoing prompt.

```bash
npm test -- security
```

### Sprint 2 — Schema gate · `src/gates/schema.ts`

The model answers with JSON. "Usually valid JSON" is not a contract. This is
the last point where a malformed answer is cheap to reject.

- `validateOutput(raw)` → `{ valid, errors }` — Ajv against `OUTPUT_SCHEMA`,
  plus the locator rules below, plus a cross-check that every declared test id
  is actually used. It collects *all* problems and never throws.

> **DONE WHEN:** a well-formed payload returns `{ valid: true, errors: [] }`,
> and a payload with a missing spec or a hashed CSS locator returns
> `valid: false` with an error naming the problem.

```bash
npm test -- schema
```

### Sprint 3 — Human-in-the-loop gate · `src/gates/hitl.ts`

Everything upstream is a machine checking a machine. This is the one place a
person sees what is about to be written and can say no.

- `showDiffAndConfirm(files, options)` → `{ approved, answer, linesAdded, linesRemoved }`
  — renders `+`/`-` lines, asks once for the whole batch, defaults to no.

> **DONE WHEN:** the diff prints with `+` / `-` markers and correct line
> counts, and anything other than an explicit yes returns `approved: false`.

```bash
npm test -- hitl
```

`write` and `ask` are injected through `options` so the gate stays testable
without a TTY. Reach for `process.stdout` or `readline` directly inside the
gate and the test suite will hang waiting for a key nobody presses.

---

## Tiers — how far you take the adapter

The pipeline after the adapter does not care where the ticket came from, so
you can take the tracker as far as you like without touching anything else.

| Tier | `TICKET_SOURCE` | File | Setup | What you do |
|:---:|---|---|---|---|
| ★ | `fixture` *(default)* | `src/adapters/fixture.ts` | none | Nothing — it works. Reads `fixtures/ticket.json`. |
| ★★ | `linear` | `src/adapters/linear.ts` | Linear MCP server or an API key | Implement `getTicket`. TODO block has the call and the field mapping. |
| ★★★ | `jira` | `src/adapters/jira.ts` | Atlassian MCP server or a site + API token | Same, plus flatten Atlassian Document Format and find your AC custom field. |

The default is `fixture` precisely so ★ needs zero setup. Do the three sprints
first; the adapter tiers are the stretch goal.

```bash
TICKET_SOURCE=linear npm start -- ENG-431
```

---

## The target app: TechShop

The generated tests run against **TechShop** — the demo store in the parent
directory. Plain hand-written HTML, vanilla JS, **no build step**: no React, no
CSS modules, no styled-components.

That has one hard consequence, and it is baked into the prompt in
`src/generate.ts` *and* enforced by the schema gate:

> **Every locator uses `data-testid`.**
> Hashed classes (`.css-1a2b3c`), BEM-module output (`.Button__label--primary`),
> class-substring selectors (`[class*="btn"]`) and framework attributes
> (`data-reactid`, `_ngcontent`) **cannot exist** in a hand-written HTML file.
> A model that emits one has invented an app that is not there, and the test
> will fail on its first run.

Real ids available on the site, passed to the model as context:

- everywhere — `navbar` `logo` `nav-home` `nav-products` `nav-cart` `cart-count`
- `products.html` — `product-grid` `category-filter` `sort-filter`, and per product `product-card-<id>` `product-name-<id>` `product-price-<id>` `add-to-cart-<id>`
- `cart.html` — `cart-items` `cart-empty` `subtotal` `shipping` `total`, and per line `qty-plus-<id>` `qty-minus-<id>` `remove-btn-<id>`
- `checkout.html` — `checkout-form` `input-name` `input-email` `input-phone` `input-address` `input-city` `input-zip` `place-order-btn` `order-success`

---

## Fell behind? Use a checkpoint

```bash
npm run checkpoint 2    # sprint 1 solved — start sprint 2
npm run checkpoint 3    # sprints 1+2 solved — start sprint 3
```

Checkpoints are **folders, not git branches**, on purpose: a branch switch
would swing this whole repo and take your course work with it. See
[`checkpoints/README.md`](checkpoints/README.md) — including the part where it
overwrites `src/gates/`.

---

## Layout

```
workshop-2/
├── src/
│   ├── cli.ts              entry point — the six pipeline stages
│   ├── config.ts           env handling; the loud ANTHROPIC_API_KEY guard
│   ├── types.ts            shapes the gates are typed against
│   ├── generate.ts         the Claude call + the TechShop prompt context
│   ├── writeFiles.ts       disk writer, runs only after HITL approves
│   ├── adapters/           fixture ★ · linear ★★ · jira ★★★
│   └── gates/              ← the three stubs you implement
├── tests/                  one failing test per gate
├── fixtures/               ticket.json + users.csv (all values invented)
├── checkpoints/            working solutions, per sprint
└── scripts/                smoke.ts, checkpoint.ts
```

`fixtures/users.csv` and the support thread in `fixtures/ticket.json` contain
**synthetic** names, emails, phone numbers and a card number. Nothing in there
belongs to a real person — they exist to give the security gate something to
find.

Output lands in `output/`, which is gitignored.
