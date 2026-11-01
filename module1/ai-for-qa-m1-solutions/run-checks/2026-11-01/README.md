# Run checks, 2026-11-01

Raw captures that closed the `[RUN CHECK]` markers in `solutions/`. Grader-only: some of these runs give away the planted causes, so do not copy them into the learner repo.

**STATUS: CAPTURED via subagent runs on 2026-11-01, not typed into claude.ai.** This is the same method as the 2026-10-09 transcripts. Each run was a separate, fresh Claude instance given the prompt file's text as a user's first message, with an instruction to reply as in a chat, without tools. The 1.1.7 chains were one instance each, given the five prompts one at a time. Output is unedited. Model: `claude-opus-5-5` (configured; the serving model was not verified). For 1.1.4 "with system prompt", the system prompt was supplied in the message as a labelled block that the model was told to follow, not as a true API system prompt. Re-run in real chats before go-live if exact fidelity matters.

| Files | Solution file | Runs | Prompt |
| --- | --- | --- | --- |
| `112-original-r1..r3.md` | 1-1-2 | 3 | `prompts/112-original.txt` (original prompt 4) |
| `112-rewrite-r1..r2.md` | 1-1-2 | 2 | `prompts/112-rewrite.txt` (reference rewrite) |
| `114-with-system-r1..r2.md` | 1-1-4 | 2 | `prompts/114-with-system.txt` (system prompt, user message, three in-context files) |
| `114-no-system-r1..r2.md` | 1-1-4 | 2 | `prompts/114-no-system.txt` |
| `117-chainA-p0..p4.md`, `117-chainB-p0..p4.md` | 1-1-7 | 2 chains | `prompts/117-chain-prompts.txt` |
| `117-oneshot-r1..r2.md` | 1-1-7 | 2 | `prompts/117-oneshot.txt` |
| `122-classify-r1..r2.md` | 1-2-2 | 2 | `prompts/122-classify.txt` (the five samples pasted in) |
| `124-mask-r1..r2.md` | 1-2-4 | 2 | `prompts/124-mask.txt` |
| `127-generate-r1..r3.md` | 1-2-7 | 3 | `prompts/127-generate.txt` (Part B reference prompt) |

Note: the 1.2.2 and 1.2.4 prompt wordings were written for this capture from the practice task. The lesson's exact learner wording was not available in the repo. Check them against the practice text, and re-run if the wording differs much.
