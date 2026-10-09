# Manifest: flaky-test-prompt (practice 1.1.4)

Sizes of the four practice files. Token figures use two methods so learners can see the spread:

- **Lesson rule:** words / 0.75 (what the practice asks learners to do).
- **Characters / 4:** a cross-check; code and logs tokenize more densely than prose, so this runs higher.

| File | Words | Characters | Tokens (lesson rule) | Tokens (chars / 4) |
| --- | ---: | ---: | ---: | ---: |
| jira-ticket.md | 310 | 1858 | 413 | 465 |
| dom-snippet.html | 136 | 1434 | 181 | 359 |
| ci-log.txt | 258 | 2816 | 344 | 704 |
| unrelated-suite.spec.ts | 1067 | 9679 | 1423 | 2420 |
| **Ticket + DOM + log (the three that belong in context)** | 704 | 6108 | 938 | 1528 |
| **All four files** | 1771 | 15787 | 2361 | 3948 |

## Accepted range for the grader

- Three included files, files only: **840 to 1680 tokens**.
- Plus the learner's own system prompt and user message (typically 60 to 150 tokens): **about 900 to 1830 tokens in total**.
- Verdict for the three-file prompt: **comfortable** (a small fraction of any current context window).
- Including the suite adds roughly 1423 to 2420 tokens of noise, more than the other three files combined, and nothing in it touches the cart.

Note: no tokenizer was available when these were produced. Both columns are estimates, not exact counts.
