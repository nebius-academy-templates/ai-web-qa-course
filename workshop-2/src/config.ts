/**
 * Startup configuration. Everything that can be wrong about the environment
 * is discovered here, loudly, before a single token is spent.
 */
import type { TicketSource } from './types.js';

const SOURCES: readonly TicketSource[] = ['fixture', 'linear', 'jira'];

export interface Config {
  source: TicketSource;
  apiKey: string;
  model: string;
  outputDir: string;
}

export function resolveSource(raw = process.env.TICKET_SOURCE): TicketSource {
  // The ★ tier must work with zero setup, so an unset variable is not an error.
  const value = (raw ?? 'fixture').trim().toLowerCase();
  if (!SOURCES.includes(value as TicketSource)) {
    throw new Error(
      `TICKET_SOURCE="${raw}" is not valid. Use one of: ${SOURCES.join(', ')}.`,
    );
  }
  return value as TicketSource;
}

/**
 * Reads ANTHROPIC_API_KEY and refuses to continue without it.
 *
 * Never soften this into a warning: a pipeline that silently skips the
 * generation call still writes files, and nobody notices they are empty.
 */
export function requireApiKey(env = process.env): string {
  const key = env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    throw new Error(
      [
        'ANTHROPIC_API_KEY is not set.',
        '',
        'The pipeline calls the Claude API and will not run without it:',
        '  export ANTHROPIC_API_KEY=sk-ant-...',
        '',
        'Everything except the generation step works without a key —',
        'run `npm test` and `npm run smoke` to check your setup.',
      ].join('\n'),
    );
  }
  return key;
}

export function loadConfig(env = process.env): Config {
  return {
    source: resolveSource(env.TICKET_SOURCE),
    apiKey: requireApiKey(env),
    model: env.ANTHROPIC_MODEL?.trim() || 'claude-opus-5',
    outputDir: env.OUTPUT_DIR?.trim() || 'output',
  };
}
