/**
 * Startup configuration. Everything that can be wrong about the environment
 * is discovered here, loudly, before a single token is spent.
 */
import type { TicketSource } from './types.js';

const SOURCES: readonly TicketSource[] = ['fixture', 'linear', 'jira'];

export interface Config {
  source: TicketSource;
  /** Undefined in offline mode, which is the workshop's default. */
  apiKey?: string;
  model: string;
  outputDir: string;
  /** True when a real generation call will be made. */
  live: boolean;
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
 * Reads ANTHROPIC_API_KEY if there is one.
 *
 * Absence is not an error. The workshop runs offline by design: with no key,
 * generate() serves fixtures/canned-generation.json instead of calling the
 * API, so every gate and every stage still runs end to end.
 *
 * The hazard the old hard failure guarded against — a pipeline that quietly
 * skips generation and writes empty files — does not apply, because the
 * canned path returns a real, schema-valid payload and says so on stdout.
 */
export function readApiKey(env = process.env): string | undefined {
  return env.ANTHROPIC_API_KEY?.trim() || undefined;
}

export function loadConfig(env = process.env): Config {
  const apiKey = readApiKey(env);
  return {
    source: resolveSource(env.TICKET_SOURCE),
    apiKey,
    model: env.ANTHROPIC_MODEL?.trim() || 'claude-opus-5',
    outputDir: env.OUTPUT_DIR?.trim() || 'output',
    live: apiKey !== undefined,
  };
}
