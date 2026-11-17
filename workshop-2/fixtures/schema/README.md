# Schema reference — Sprint 2

Read-only reference material for the schema gate. **These are not test
fixtures.** The real fixtures stay inline in `tests/schema.test.ts`; nothing in
this folder is imported by the test suite, and deleting it would not change a
single test result.

The point of these files is that you can read the contract before you open
`src/gates/schema.ts` — no TypeScript import, no vitest run, just three JSON
files you can open in any editor.

| File | What it is |
|---|---|
| `output-schema.json` | The contract, byte-for-byte the same JSON Schema as `OUTPUT_SCHEMA` in `src/gates/schema.ts` |
| `good-sample.json` | A payload that validates cleanly — the same `GOOD` payload `tests/schema.test.ts` asserts against |
| `malformed-sample.json` | One payload carrying all three failure modes at once |

`output-schema.json` is a straight dump of the exported `OUTPUT_SCHEMA` object,
with no extra keys — not even a `$schema` declaration — so it stays a literal
mirror of the source. `OUTPUT_SCHEMA` in `src/gates/schema.ts` remains the
single definition; this file is a copy for reading, and if you change the gate,
regenerate this rather than hand-editing it.

## The three failure modes

`malformed-sample.json` is `good-sample.json` with exactly three things done to
it, matching the three checks the stub's doc comment asks you to implement:

1. **Missing `spec`** — the whole key is gone. Structural check, caught by Ajv.
2. **Hashed locator** — `pageObject.contents` uses
   `this.page.locator('.css-1a2b3c4')` where the good sample used
   `getByTestId('place-order-btn')`. TechShop is hand-written HTML with no build
   step, so a hashed CSS class cannot exist there.
3. **Orphaned test id** — `testIds` declares `checkout-express-lane`, which
   appears nowhere in the generated code.

Its `testIds` is `["input-phone", "checkout-express-lane"]` and not the good
sample's full three-id list. That is deliberate: with `spec` deleted,
`place-order-btn` and `order-success` would also become unused, and each would
add its own error line — burying the three you are meant to see under five.

## Checking your gate against them

Once Sprint 2 is implemented:

```bash
npx tsx -e "
  import { validateOutput } from './src/gates/schema.ts';
  const fs = require('fs');
  const good = JSON.parse(fs.readFileSync('fixtures/schema/good-sample.json', 'utf-8'));
  const bad  = JSON.parse(fs.readFileSync('fixtures/schema/malformed-sample.json', 'utf-8'));
  console.log('good:', validateOutput(good));
  console.log('bad:', validateOutput(bad));
"
```

Run it from the `workshop-2/` directory. Note the import ends in `.ts`, not
`.js`: inside `tsx -e` the extension is not rewritten the way it is in a real
module, and `./src/gates/schema.js` fails with `MODULE_NOT_FOUND`. Everywhere
else in this codebase — including `src/` and `tests/` — you still import
`.js`, per normal ESM.

Before you start the sprint this prints `Error: Not implemented — sprint 2`.
That is the stub telling you it is your turn, not a broken setup.

## DONE WHEN

Per the doc comment on `validateOutput` in `src/gates/schema.ts`:

- `good-sample.json` returns exactly `{ valid: true, errors: [] }`
- `malformed-sample.json` returns `valid: false` with **three** error lines —
  one naming `spec`, one naming `data-testid`, one naming
  `checkout-express-lane`

All three at once matters. Reporting only the first problem means three
round-trips where one would have done, which is why the tests assert
`errors.length >= 2` on a payload with two faults.

The exact wording is yours to choose — the tests match on those substrings, not
on whole sentences. For reference, the reference implementation produces:

```
1. payload: must have required property 'spec'
2. pageObject: uses ".css-1a2b3c4", which cannot exist in TechShop's hand-written HTML — TechShop locators must use data-testid
3. testIds: "checkout-express-lane" is declared but never used in the generated code
```
