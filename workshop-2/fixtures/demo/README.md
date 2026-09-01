# Stage 1 — the contrast demo

Two runs of the same pipeline against the same ticket (TS-142), differing in
exactly one thing: whether the security gate ran. Run them back to back and
the room sees the argument for the gate rather than hearing it.

```bash
npm run demo:gateless   # no gate — raw ticket goes to the model
npm run demo:gated      # real gate — maskPII + scaleWithFaker
npm run demo:compare    # the read-off-the-screen summary
```

> **Run `npm run demo:compare` before you put either `.txt` on a shared
> screen.** It tells you in advance whether the gated capture is actually
> clean. It should be — but verify before going live, not during.

## What to have on screen

**`demo:gateless`** — scroll to `########## USER MESSAGE ##########`. The
support thread is quoted verbatim, and under `ATTACHMENTS` the whole of
`users.csv` is inlined: three names, three email addresses, three phone
numbers. Point at the QA note near the bottom of the description —
"Everything the customers pasted above is production data — it must not leave
our systems" — sitting in the text that is about to leave your systems.

The `SYNTHETIC TEST DATA` block at the end is empty (`[]`). Without the gate
there is nothing to substitute in, so the model would have been driving its
form fills with the real customers' details.

**`demo:gated`** — two things. First the masking report:

```
fieldsScanned : 8
fieldsMasked  : 3
byCategory    :
  email    6
  phone    8
  payment  1
```

Then the same `USER MESSAGE` section, same structure, same length — with
`[EMAIL_REDACTED]`, `[PHONE_REDACTED]` and `[PAYMENT_REDACTED]` where the
values were, `users.csv` scrubbed row by row, and the synthetic block now
holding three generated people. The prose survives intact; masking is not
deletion, and the model still has everything it needs to write the tests.

**`demo:compare`** — reads both captures and prints the size delta, the list
of real values found in each, a generic email/phone sweep of the gated ticket
body, and a PASS/FAIL verdict. Expect nine real values in the gateless
capture and none in the gated one.

If anything real survives the gate, compare **exits non-zero** and says so.
It does not pass quietly. (Verified by injecting a real address back into the
gated capture: verdict FAIL, exit 1.)

## Notes on how it is built

`run-gateless.ts` and `run-gated.ts` share `_shared.ts`, so both captures are
assembled the same way and `diff` shows only what the gate changed. The prompt
text comes from the pipeline's own `renderTicket()` and `SYSTEM_PROMPT`, not a
copy — what you see is what would be sent.

`run-gated.ts` imports the gate from `.instructor/solution/gates/security.ts`,
because the participant-facing `src/gates/security.ts` is still a throwing
stub at this point in the workshop. Once Sprint 1 is done, switching that
import to `../../src/gates/security.js` runs the demo against the
participant's own implementation — a useful second act.

`compare.ts` derives the list of real values from `fixtures/ticket.json` and
`users.csv` at runtime rather than hardcoding them, so it stays honest if the
ticket changes. Its generic sweep deliberately stops at the `SYNTHETIC TEST
DATA` marker: faker's output is realistic by design and flagging it would be
crying wolf.

## The API call

Both run scripts build, print and capture the prompt with **no API key and no
tokens spent** — the contrast this demo exists to show is entirely in the
prompt, so the whole thing is rehearsable for free. If `ANTHROPIC_API_KEY` is
set they also make the real call and print what comes back; if it is not, they
say so and skip it.

```bash
export ANTHROPIC_API_KEY=sk-ant-...   # only needed for the live call
```

## `fixtures/demo/output/` must never be committed

The captures contain unmasked personal data by design — that is the entire
point of the gateless one — plus real API responses when the live call runs.

It is already in `workshop-2/.gitignore`:

```
# Demo prompt captures — contain unmasked PII by design. Never commit.
fixtures/demo/output/
```

If you move this directory, move that rule with it. Check with
`git status --short` before committing after a demo run; if either `.txt`
shows up as untracked, the ignore rule is not doing its job — stop and fix it
rather than committing around it.
