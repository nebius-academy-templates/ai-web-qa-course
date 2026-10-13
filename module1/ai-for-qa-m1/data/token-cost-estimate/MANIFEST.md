# Manifest: token-cost-estimate (practice 1.3.2)

Input figures are computed from the three prompt files. Output figures are accepted ranges
for the response size each prompt asks for.

| Prompt | Words | Characters | Input tokens (lesson rule, words / 0.75) | Input tokens (chars / 4) | Accepted input range | Accepted output range (tokens) |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| A | 9 | 54 | 12 | 14 | 11 to 15 | 40 to 150 |
| B | 58 | 516 | 77 | 129 | 69 to 142 | 10 to 25 |
| C | 188 | 1804 | 251 | 451 | 226 to 496 | 500 to 1000 |

Why the output ranges:

- **A:** Unscoped: a locator plus usually two alternatives and a short paragraph.
- **B:** "Return only the locator, no explanation": one line of code.
- **C:** Asked for every strategy, pros and cons, ranking and a justified recommendation: an essay.

## Actual tokenizer counts

| Prompt | Actual input tokens | Source |
| --- | --- | --- |
| A | NOT YET CAPTURED | run `npm run tokens -- <file>` with ANTHROPIC_API_KEY set, or a model tokenizer |
| B | NOT YET CAPTURED | same |
| C | NOT YET CAPTURED | same |

The actual counts could not be produced when this manifest was written (no tokenizer or API key
in the build environment). Fill them in before the grader goes live; the accepted ranges above
are wide enough to bracket realistic tokenizer results.

## Orderings the grader should expect

- Cost, lowest to highest: A, B, C (SME CHECK: A and B are close; A has trivial input but unscoped output, B has more input but near-zero output).
- Quality, lowest to highest: A, C, B (SME CHECK).
