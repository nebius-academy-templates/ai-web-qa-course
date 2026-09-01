# Instructor material — not part of the workshop

Everything in here is for the person **running** the session, not the people
attending it. Nothing outside this directory refers to it by path.

## `solution/gates/` — all three gates, working

The `checkpoints/` folders deliberately stop short: `sprint-3-start` solves
sprints 1 and 2 and leaves the HITL gate as a stub, because the point of the
last gate is that a human reads the diff and nobody can hand you that.

That is right for participants and inconvenient for you: **no checkpoint gives
you a pipeline that runs end to end**, so you cannot do a dry run without
writing the third gate yourself. This folder closes that hole.

```bash
npm run checkpoint solution    # all three gates working
npm test                       # 0 failures
npm start -- TS-142            # the whole pipeline, needs ANTHROPIC_API_KEY
```

To get back to the participant's starting state:

```bash
git checkout src/gates/
```

That restores the three stubs from git and `npm test` goes back to 3 failures.

## Before the session — do this once

The one thing unit tests cannot prove is that the generation half works, because
it needs a real API key. Run it:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npm run checkpoint solution
npm start -- TS-142
```

You should see all six stages, a diff, a `[y/N]` prompt, and two files landing
in `output/`. Then `git checkout src/gates/` and you are ready to teach.

If that run fails, it fails in front of the room otherwise.

## Keeping the solution honest

`solution/gates/security.ts` and `schema.ts` are copies of
`checkpoints/sprint-3-start/gates/`. If you change a checkpoint, change these
too — or delete them and re-copy:

```bash
cp checkpoints/sprint-3-start/gates/{security,schema}.ts .instructor/solution/gates/
```

`hitl.ts` exists only here. It is the reference answer for sprint 3.
