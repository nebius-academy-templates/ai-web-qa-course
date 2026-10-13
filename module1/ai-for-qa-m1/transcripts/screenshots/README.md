# Tokenizer screenshots needed

Four views from a model tokenizer, saved here as PNG. Use the tokenizer for the model named in each lesson's example (or say which one you used in the caption).

| File to create | Text to paste into the tokenizer | Used in | Lesson claim to check |
| --- | --- | --- | --- |
| `tokenizer-error-line.png` | `Error: locator.click: Timeout 30000ms exceeded.` | 1.3.1 and 1.1.3 | The lesson says "roughly 28 tokens". |
| `tokenizer-one-line-prompt.png` | `Write a Playwright test for the login button.` | 1.3.1 | The lesson says 9 words, about 12 tokens. |
| `tokenizer-structured-prompt.png` | `Create a Playwright test for the checkout flow. Use role-based locators where possible. Include setup, the checkout action, and an assertion that the confirmation message is visible. Return only the test code.` | 1.3.1 | The lesson says 38 words, about 50 to 55 tokens. |
| `tokenizer-dom-snippet.png` | `<form id="checkout"> <label for="email">Email address</label> <input id="email" name="email" type="email"> <button type="submit">Place order</button> </form>` | 1.3.1 | The lesson says about 35 to 45 tokens. |

## Discrepancies found while preparing this list (check against the real tokenizer)

Counted with a plain word and character count, before any tokenizer:

| Text | Words | Characters | Lesson says | Rule words / 0.75 | Characters / 4 |
| --- | ---: | ---: | --- | ---: | ---: |
| Error line | 5 | 47 | about 28 tokens | 7 | 12 |
| One-line prompt | 8 | 45 | 9 words, about 12 tokens | 11 | 11 |
| Structured prompt | 32 | 209 | 38 words, about 50 to 55 tokens | 43 | 52 |
| DOM snippet | 13 | 157 | about 35 to 45 tokens | 17 | 39 |

- The error line is the one that looks wrong: 28 tokens is well above both estimates. A real tokenizer will settle it. If it comes back near 12 to 16, change the lesson.
- The one-line prompt is 8 words, not 9, and the structured prompt is 32 words, not 38. The token figures in the lesson are still roughly right (chars / 4), but the word counts printed next to them are not.
