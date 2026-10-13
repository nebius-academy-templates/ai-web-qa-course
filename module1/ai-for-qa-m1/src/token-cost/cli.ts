// Token & ROI calculator.
//   node src/token-cost/cli.ts estimate <file|-> [--actual]
//   node src/token-cost/cli.ts cost --in 300 --out 40 --tier mid --calls 60 [--rates path]
//   node src/token-cost/cli.ts roi <scenario.json> [--rates path]
import { readFileSync } from 'node:fs';
import { estimateText } from './estimate.ts';
import { actualInputTokens, loadEnvIfPresent } from './actual.ts';
import { loadRates, projectCost } from './cost.ts';
import { computeRoi, type RoiInput } from './roi.ts';

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
}
function need(args: string[], name: string): number {
  const v = flag(args, name);
  if (v === undefined || Number.isNaN(Number(v))) throw new Error(`--${name} is required and must be a number`);
  return Number(v);
}
const usage = `usage:
  estimate <file|-> [--actual]
  cost --in <tokens> --out <tokens> --tier <light|mid|flagship> --calls <per sprint> [--rates file]
  roi <scenario.json> [--rates file]`;

async function main(argv: string[]): Promise<number> {
  const [cmd, ...args] = argv;

  if (cmd === 'estimate') {
    const target = args.find((a) => !a.startsWith('--'));
    if (!target) throw new Error(usage);
    const text = readFileSync(target === '-' ? 0 : target, 'utf8');
    const est = estimateText(text, loadRates(flag(args, 'rates')).wordsPerToken);
    console.log(`words:                      ${est.words}`);
    console.log(`estimated tokens (w/0.75):  ${est.estimatedTokens}`);
    console.log(`cross-check (chars/4):      ${est.charsOver4Tokens}`);
    loadEnvIfPresent();
    const actual = await actualInputTokens(text).catch((e: Error) => {
      console.log(`actual tokens:              unavailable (${e.message})`);
      return undefined;
    });
    if (actual === null) console.log('actual tokens:              not configured (set ANTHROPIC_API_KEY and TOKEN_COUNT_MODEL in .env)');
    else if (actual !== undefined) {
      console.log(`actual tokens:              ${actual}`);
      console.log(`estimate error:             ${(((est.estimatedTokens - actual) / actual) * 100).toFixed(1)}%`);
    }
    return 0;
  }

  if (cmd === 'cost') {
    const rates = loadRates(flag(args, 'rates'));
    const r = projectCost(need(args, 'in'), need(args, 'out'), flag(args, 'tier') ?? 'mid', need(args, 'calls'), rates);
    console.log(`tier:            ${r.tier}`);
    console.log(`cost per call:   ${r.costPerCall.toFixed(5)} ${r.currency}`);
    console.log(`cost per sprint: ${r.costPerSprint.toFixed(3)} ${r.currency} (${r.callsPerSprint} calls)`);
    console.log('(rates are read from rates.json and are illustrative placeholders)');
    return 0;
  }

  if (cmd === 'roi') {
    const file = args.find((a) => !a.startsWith('--'));
    if (!file) throw new Error(usage);
    const input = JSON.parse(readFileSync(file, 'utf8')) as RoiInput;
    const r = computeRoi(input, loadRates(flag(args, 'rates')));
    // JSON has no Infinity; show "never" for payback / break-even that cannot be reached.
    console.log(JSON.stringify(r, (_k, v) => (v === Infinity ? 'never' : v), 2));
    return r.verdict === 'Negative' ? 2 : 0;
  }

  console.error(usage);
  return 1;
}

main(process.argv.slice(2)).then(
  (code) => process.exit(code),
  (err: Error) => {
    console.error(err.message);
    process.exit(1);
  },
);
