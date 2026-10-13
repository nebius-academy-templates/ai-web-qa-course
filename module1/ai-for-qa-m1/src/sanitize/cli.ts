// PII scanner / masker.
//   node src/sanitize/cli.ts <input> [--out file] [--report file] [--json file] [--check] [--salt text]
//
// Exit codes: 0 clean or fully masked, 1 error, 2 findings present (--check), 3 unmasked findings remain.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import { detectFormat, residualOriginals, scan } from './scan.ts';
import { buildReport, exitCode, formatReport } from './report.ts';

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
}

function main(argv: string[]): number {
  const valueFlags = ['--out', '--report', '--json', '--salt'];
  const input = argv.find((a, i) => !a.startsWith('--') && !valueFlags.includes(argv[i - 1] ?? ''));
  if (!input) {
    console.error('usage: node src/sanitize/cli.ts <input> [--out file] [--report file] [--json file] [--check] [--salt text]');
    return 1;
  }
  const check = argv.includes('--check');
  const text = readFileSync(input, 'utf8');
  const result = scan(text, detectFormat(input), flag(argv, 'salt'));
  const residual = check ? [] : residualOriginals(result.masked, result.originals, result.produced);
  const report = buildReport(input, result.format, result.findings, residual.length, check);

  if (!check) {
    const ext = extname(input);
    const out = flag(argv, 'out') ?? join('out', `${basename(input, ext)}.masked${ext}`);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, result.masked);
    console.error(`masked copy written to ${out}`);
  }
  const reportPath = flag(argv, 'report');
  if (reportPath) {
    mkdirSync(dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, formatReport(report));
  }
  const jsonPath = flag(argv, 'json');
  if (jsonPath) {
    mkdirSync(dirname(jsonPath), { recursive: true });
    writeFileSync(jsonPath, JSON.stringify(report, null, 2) + '\n');
  }
  process.stdout.write(formatReport(report));
  return exitCode(report);
}

try {
  process.exit(main(process.argv.slice(2)));
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
