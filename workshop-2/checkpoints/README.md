# Checkpoints

A checkpoint is a **folder of working gate files**, not a git branch.

That is deliberate. This workshop directory lives inside the course repo you
have been working in all week. `git checkout sprint-2-start` would swing the
*whole* tree — your course edits, your Playwright snapshots, everything — and
hand it back to you in an unfamiliar state ten minutes before sprint 2 starts.
Copying three files does not.

## Restore one

```bash
npm run checkpoint 2    # sprint 1 solved for you — start sprint 2
npm run checkpoint 3    # sprints 1 and 2 solved for you — start sprint 3
```

Or by hand, which is all the script does:

```bash
cp checkpoints/sprint-2-start/gates/*.ts src/gates/
```

Then confirm where you are:

```bash
npm test
```

| After            | Expected                    |
|------------------|-----------------------------|
| `checkpoint 2`   | 2 failing (schema, hitl)    |
| `checkpoint 3`   | 1 failing (hitl)            |

## Read this before you run it

**It overwrites `src/gates/*.ts`.** Anything you wrote there is gone, including
a half-finished sprint you were 90 seconds from passing. If you want to keep
it, move it first:

```bash
cp src/gates/security.ts /tmp/my-security.ts
```

## What is in each folder

```
sprint-2-start/gates/
  security.ts   ✅ solved
  schema.ts     ⬜ stub — this is sprint 2
  hitl.ts       ⬜ stub

sprint-3-start/gates/
  security.ts   ✅ solved
  schema.ts     ✅ solved
  hitl.ts       ⬜ stub — this is sprint 3
```

There is no `sprint-4-start`: sprint 3 is the last one, and the point of the
last gate is that a human reads the diff. Nobody can hand you that.

## They are also worked solutions

If you finished a sprint your own way, diff yours against the checkpoint. The
interesting differences are usually in the *report*, not the regex —
`fieldsScanned` versus `fieldsMasked` versus per-category counts is the thing
a security reviewer actually reads.

```bash
diff -u checkpoints/sprint-3-start/gates/security.ts src/gates/security.ts
```

> The `.ts` files in here import from `'../types.js'` — the path that is
> correct once they land in `src/gates/`. They are excluded from `tsconfig.json`
> and from the vitest run, so they do not resolve *in place*. That is expected.
