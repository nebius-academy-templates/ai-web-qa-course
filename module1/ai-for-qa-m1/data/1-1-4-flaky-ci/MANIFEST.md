# Manifest: 1-1-4-flaky-ci (practice 1.1.4)

Sizes of the four practice files. Token figures use two methods so learners can see the spread:

- **Lesson rule:** words / 0.75 (what the practice asks learners to do).
- **Characters / 4:** a cross-check; code and logs tokenize more densely than prose, so this runs higher.

| File | Words | Characters | Tokens (lesson rule) | Tokens (chars / 4) |
| --- | ---: | ---: | ---: | ---: |
| jira-ticket.md | 310 | 1858 | 413 | 465 |
| dom-snippet.html | 136 | 1434 | 181 | 359 |
| ci-log.txt | 258 | 2816 | 344 | 704 |
| unrelated-suite.spec.ts | 17447 | 161858 | 23263 | 40465 |
| **Ticket + DOM + log (the three that belong in context)** | 704 | 6108 | 938 | 1528 |
| **All four files** | 18151 | 167966 | 24201 | 41993 |

## Accepted range for the grader

- Three included files, files only: **840 to 1680 tokens**.
- Plus the learner's own system prompt and user message (typically 60 to 150 tokens): **about 900 to 1830 tokens in total**.
- Verdict for the three-file prompt: **comfortable** (a small fraction of any current context window).
- Including the suite adds roughly 23263 to 40465 tokens of noise, about 25 times the other three files combined, and nothing in it touches the cart. The size is deliberate: the token count alone should make leaving it out obvious.

Note: no tokenizer was available when these were produced. Both columns are estimates, not exact counts.
