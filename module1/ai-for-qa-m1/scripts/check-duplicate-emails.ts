// Lists every email address that appears more than once across the given files
// (Markdown tables, CSV, JSON, plain text). Used for the 1.2.5 parallel-increment before/after captures.
//   node scripts/check-duplicate-emails.ts transcripts/1-2-5-parallel-before.md [more files...]
// Exit code: 0 no duplicates, 2 duplicates found, 1 usage error.
import { readFileSync } from 'node:fs';

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('usage: node scripts/check-duplicate-emails.ts <file> [more files...]');
  process.exit(1);
}
const EMAIL = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b/g;
const seen = new Map<string, { file: string; line: number }[]>();

for (const file of files) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(EMAIL)) {
      const key = m[0].toLowerCase();
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key)!.push({ file, line: i + 1 });
    }
  });
}
const dupes = [...seen.entries()].filter(([, where]) => where.length > 1);
const total = [...seen.values()].reduce((n, w) => n + w.length, 0);
console.log(`${total} email occurrences, ${seen.size} distinct, ${dupes.length} repeated`);
for (const [email, where] of dupes) console.log(`  ${email}: ${where.map((w) => `${w.file}:${w.line}`).join(', ')}`);
process.exit(dupes.length ? 2 : 0);
