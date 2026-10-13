// Optional: ask the provider for the real token count of a prompt.
// Needs ANTHROPIC_API_KEY (and TOKEN_COUNT_MODEL) in the environment or a .env file.
// Returns null when no key is configured, so the calculator still works offline.
// NOTE: this path needs network access to the provider and was not exercised in the build environment.
import { existsSync } from 'node:fs';

export function loadEnvIfPresent(path = '.env'): void {
  if (existsSync(path) && typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(path);
  }
}

export async function actualInputTokens(text: string): Promise<number | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  const model = process.env.TOKEN_COUNT_MODEL;
  if (!key || !model) return null;

  const res = await fetch('https://api.anthropic.com/v1/messages/count_tokens', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model, messages: [{ role: 'user', content: text }] }),
  });
  if (!res.ok) throw new Error(`token count request failed: ${res.status} ${res.statusText}`);
  const body = (await res.json()) as { input_tokens?: number };
  return typeof body.input_tokens === 'number' ? body.input_tokens : null;
}
