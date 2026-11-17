# Poisoned fixtures — Stage 7, the adversarial swap

Read-only reference material. Nothing here is imported by the test suite.

Two fixtures, one point: **a gate that passes its own test suite is not a gate
that works.** Both files are built against the specific blind spots in the
reference implementations in `.instructor/solution/gates/`, not against generic
PII or generic bad JSON. Your gate will have the same holes if you wrote the
obvious regexes — which is the exercise.

| File | Gate it targets | Sprint |
|---|---|---|
| `poisoned-ticket.json` | `maskPII()` in `src/gates/security.ts` | 1 |
| `malformed-generation.json` | `validateOutput()` in `src/gates/schema.ts` | 2 |

Run each against **your own** gate. Both were verified against the instructor
reference, and the results below are what that reference actually does — not
what it was meant to do.

---

## Exercise 1 — `poisoned-ticket.json`

A `TicketData` object with three plants. It is self-contained (attachments are
inline `Attachment[]` objects, not filenames), so it loads without the fixture
adapter — which only knows `ticket.json` and id `TS-142` anyway:

```bash
npx tsx -e "
  import { maskPII } from './src/gates/security.ts';
  const fs = require('fs');
  const ticket = JSON.parse(fs.readFileSync('fixtures/poisoned/poisoned-ticket.json', 'utf-8'));
  const { masked, report } = maskPII(ticket);
  console.log(report);
  console.log(JSON.stringify(masked, null, 2));
"
```

Against the reference implementation the report reads:

```json
{ "fieldsScanned": 8, "fieldsMasked": 1,
  "byCategory": { "email": 1, "phone": 0, "payment": 0 } }
```

Those two zeroes are the lesson. Two of the three plants are still in the text.

**Plant A — phone split across a sentence.** `555, then 019, then 2837`, in the
description. The phone rule is `/\+?\(?\d[\d\s().-]{5,}\d/` guarded by a
7-digit minimum, so it needs *one unbroken run* holding 7+ digits. A comma is
not in that character class, so each group is examined alone: 3, 3 and 4
digits. Nothing reaches the floor. **Leaks in full.**

**Plant B — email buried in an acceptance criterion.** `m.declerck@...` in a
full AC sentence. **Caught**, and deliberately so: it is the control that
proves the fixture is not uniformly evasive and your email rule is fine. If
Plant B ever stops being caught, you broke something.

**Plant C — payment fragment.** `4539/8123/4567/8912` in the attached CSV.
Payment wants 12-18 digits joined by space or hyphen only, so `/` breaks the
chain. **Leaks in full** — the entire 16-digit number.

Note which rule nearly saved you. A card written `...4539 8123` or
`4539/8123.4567 8912` gets masked — but by the **phone** rule, not the payment
rule, because `.` and space are both inside the phone class and the digits
clear the 7-digit floor. Slash-separating every group defeats both. Two rules
that look independent are actually covering for each other, and you cannot see
that from the passing test suite.

---

## Exercise 2 — `malformed-generation.json`

A `GenerationOutput` payload, identical to the `GOOD` payload in
`tests/schema.test.ts` apart from two changes. Against the reference
implementation `validateOutput()` returns **`{ valid: true, errors: [] }`** —
a clean pass.

```bash
npx tsx -e "
  import { validateOutput } from './src/gates/schema.ts';
  const fs = require('fs');
  const payload = JSON.parse(fs.readFileSync('fixtures/poisoned/malformed-generation.json', 'utf-8'));
  console.log(validateOutput(payload));
"
```

**Evasion 1 — path traversal.** `pageObject.path` is
`pages/../../../etc/evil.ts`. The schema's `pattern` is
`^[A-Za-z0-9._/-]+\.ts$`, a character allowlist: dots and slashes are both on
it, and there is no rule anywhere about `..` segments. The path is structurally
valid and ends in `.ts`, so Ajv is satisfied. **Lands.**

**Evasion 2 — runtime-assembled locator.** The page object builds the hashed
class instead of writing it:

```ts
const cls = 'css-' + '1a2b3c4';
return this.page.locator('.' + cls);
```

`FORBIDDEN_LOCATOR_PATTERNS` looks for the literal string `.css-`, which never
appears — the dot and the prefix are in separate string literals joined at
runtime. Every other pattern in the list (BEM, `[class*=`, framework
attributes) misses too. **Lands.**

### The trap in evasion 2 — worth reading before you "fix" the fixture

The obvious way to write this is to swap the `getByTestId('place-order-btn')`
call for the dynamic locator and leave `testIds` alone. **That version is
caught** — not by any locator rule, but by the cross-check, which notices
`place-order-btn` is declared and no longer appears in the code:

```
testIds: "place-order-btn" is declared but never used in the generated code
```

An accidental save, from a rule written for a completely different purpose.
The fixture as shipped drops `place-order-btn` from `testIds`, which is exactly
what a model covering its tracks would do — and then the cross-check has
nothing to say. Keep that in mind before adding an id back.

### How far the traversal actually gets

Sandbox this. Run it from `workshop-2/`, and use a **deep** output directory so
`../../../` lands inside the sandbox instead of somewhere real:

```bash
mkdir -p .sandbox/a/b .sandbox/etc
echo "decoy - pretend this is something you care about" > .sandbox/etc/evil.ts

npx tsx -e "
  import { readExisting, writeFiles } from './src/writeFiles.ts';
  const fs = require('fs'), path = require('path');
  const p = JSON.parse(fs.readFileSync('fixtures/poisoned/malformed-generation.json', 'utf-8'));
  const files = [p.pageObject, p.spec];
  const outDir = '.sandbox/a/b';
  console.log('resolves to:', path.resolve(outDir, p.pageObject.path));
  const attempt = (label, fn) =>
    fn().then(
      (r) => console.log(label, 'NO THROW ->', JSON.stringify(r)),
      (err) => console.log(label, 'blocked:', err.message),
    );
  attempt('readExisting:', () => readExisting(files, outDir))
    .then(() => attempt('writeFiles:  ', () => writeFiles(files, outDir)));
"
rm -rf .sandbox
```

Both calls now refuse it:

- **`writeFiles()` blocks it.** It resolves the path and checks
  `full.startsWith(root + path.sep)`, so the write throws
  `Refusing to write outside …`. Nothing lands on disk.
- **`readExisting()` blocks it too**, with `Refusing to read outside …`.

That second guard is new, and the reason it exists is the more interesting
half of this exercise. `readExisting()` originally had no check at all: it
resolved the model's path against the output directory and read whatever was
there. The traversal was stopped at the *write*, one step after it had already
succeeded at the *read* — so the escape was blocked only once it was too late
to matter.

`readExisting()` feeds the sprint-3 HITL diff. An unguarded read meant a
poisoned path pulled an arbitrary readable file into the diff a human was
about to approve, rendered under a filename that looked like it belonged to
the project. Nothing was written, nothing was leaked off the machine, and the
report showed no error — the failure was entirely in what the human was shown.

Note also *why* it throws rather than quietly returning "no existing file".
A silent miss would render the escape as a clean `(new file)` diff, which is
the same misleading picture with none of the noise.

The schema gate is the layer that looks like it should have caught this, and a
character-class `pattern` cannot: rejecting `..` is a semantic rule, not a
spelling rule. Containment belongs where the path is turned into a real
filesystem operation — which is why the guard lives in `src/writeFiles.ts` and
is applied identically on both sides.

`.sandbox/` is not in `.gitignore` — delete it when you are done, as the
snippet above does.
