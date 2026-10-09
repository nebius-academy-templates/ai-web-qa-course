// Computes size figures for the MANIFEST.md files from the committed data, so the numbers
// in the manifests can always be reproduced. Run: node scripts/make-manifests.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const ruleTokens = (w: number) => Math.round(w / 0.75); // the lesson's rule: tokens = words / 0.75
const charTokens = (c: number) => Math.round(c / 4); // cross-check for code-heavy text: ~4 chars per token
const round10 = (n: number) => Math.round(n / 10) * 10;

function stats(path: string) {
  const text = readFileSync(join(root, path), 'utf8');
  const w = words(text);
  const c = text.length;
  return { w, c, rule: ruleTokens(w), chars: charTokens(c) };
}

// ---- 1.1.4 flaky-test-prompt -------------------------------------------------
const files114 = ['jira-ticket.md', 'dom-snippet.html', 'ci-log.txt', 'unrelated-suite.spec.ts'];
const rows114 = files114.map((f) => ({ f, ...stats(`flaky-test-prompt/${f}`) }));
const included = rows114.filter((r) => r.f !== 'unrelated-suite.spec.ts');
const sum = (rs: typeof rows114, k: 'w' | 'c' | 'rule' | 'chars') => rs.reduce((a, r) => a + r[k], 0);

const m114 = `# Manifest: flaky-test-prompt (practice 1.1.4)

Sizes of the four practice files. Token figures use two methods so learners can see the spread:

- **Lesson rule:** words / 0.75 (what the practice asks learners to do).
- **Characters / 4:** a cross-check; code and logs tokenize more densely than prose, so this runs higher.

| File | Words | Characters | Tokens (lesson rule) | Tokens (chars / 4) |
| --- | ---: | ---: | ---: | ---: |
${rows114.map((r) => `| ${r.f} | ${r.w} | ${r.c} | ${r.rule} | ${r.chars} |`).join('\n')}
| **Ticket + DOM + log (the three that belong in context)** | ${sum(included, 'w')} | ${sum(included, 'c')} | ${sum(included, 'rule')} | ${sum(included, 'chars')} |
| **All four files** | ${sum(rows114, 'w')} | ${sum(rows114, 'c')} | ${sum(rows114, 'rule')} | ${sum(rows114, 'chars')} |

## Accepted range for the grader

- Three included files, files only: **${round10(sum(included, 'rule') * 0.9)} to ${round10(sum(included, 'chars') * 1.1)} tokens**.
- Plus the learner's own system prompt and user message (typically 60 to 150 tokens): **about ${round10(sum(included, 'rule') * 0.9 + 60)} to ${round10(sum(included, 'chars') * 1.1 + 150)} tokens in total**.
- Verdict for the three-file prompt: **comfortable** (a small fraction of any current context window).
- Including the suite adds roughly ${sum([rows114[3]], 'rule')} to ${sum([rows114[3]], 'chars')} tokens of noise, more than the other three files combined, and nothing in it touches the cart.

Note: no tokenizer was available when these were produced. Both columns are estimates, not exact counts.
`;
writeFileSync(join(root, 'flaky-test-prompt', 'MANIFEST.md'), m114);

// ---- 1.3.2 token-cost-estimate -----------------------------------------------
const prompts = ['a', 'b', 'c'].map((k) => ({ k: k.toUpperCase(), ...stats(`token-cost-estimate/prompt-${k}.txt`) }));
const out: Record<string, [number, number]> = { A: [40, 150], B: [10, 25], C: [500, 1000] };
const outNote: Record<string, string> = {
  A: 'Unscoped: a locator plus usually two alternatives and a short paragraph.',
  B: '"Return only the locator, no explanation": one line of code.',
  C: 'Asked for every strategy, pros and cons, ranking and a justified recommendation: an essay.',
};
const m132 = `# Manifest: token-cost-estimate (practice 1.3.2)

Input figures are computed from the three prompt files. Output figures are accepted ranges
for the response size each prompt asks for.

| Prompt | Words | Characters | Input tokens (lesson rule, words / 0.75) | Input tokens (chars / 4) | Accepted input range | Accepted output range (tokens) |
| --- | ---: | ---: | ---: | ---: | --- | --- |
${prompts
  .map((p) => {
    const lo = Math.round(Math.min(p.rule, p.chars) * 0.9);
    const hi = Math.round(Math.max(p.rule, p.chars) * 1.1);
    return `| ${p.k} | ${p.w} | ${p.c} | ${p.rule} | ${p.chars} | ${lo} to ${hi} | ${out[p.k][0]} to ${out[p.k][1]} |`;
  })
  .join('\n')}

Why the output ranges:

${prompts.map((p) => `- **${p.k}:** ${outNote[p.k]}`).join('\n')}

## Actual tokenizer counts

| Prompt | Actual input tokens | Source |
| --- | --- | --- |
| A | NOT YET CAPTURED | run \`npm run tokens -- <file>\` with ANTHROPIC_API_KEY set, or a model tokenizer |
| B | NOT YET CAPTURED | same |
| C | NOT YET CAPTURED | same |

The actual counts could not be produced when this manifest was written (no tokenizer or API key
in the build environment). Fill them in before the grader goes live; the accepted ranges above
are wide enough to bracket realistic tokenizer results.

## Orderings the grader should expect

- Cost, lowest to highest: A, B, C (SME CHECK: A and B are close; A has trivial input but unscoped output, B has more input but near-zero output).
- Quality, lowest to highest: A, C, B (SME CHECK).
`;
writeFileSync(join(root, 'token-cost-estimate', 'MANIFEST.md'), m132);

console.log(m114.split('\n').slice(8, 16).join('\n'));
console.log(prompts);
