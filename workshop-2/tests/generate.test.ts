import { describe, expect, it } from 'vitest';

import { loadConfig } from '../src/config.js';
import { generate } from '../src/generate.js';
import type { TicketData } from '../src/types.js';

const ticket = (id: string) => ({ id }) as TicketData;
const offline = loadConfig({} as NodeJS.ProcessEnv);

describe('offline generation (no ANTHROPIC_API_KEY)', () => {
  it('serves the canned output for TS-142', async () => {
    const out = (await generate(ticket('TS-142'), [], offline)) as { pageObject: { path: string } };
    expect(out.pageObject.path).toBe('pages/CheckoutPage.ts');
  });

  it('refuses any other ticket instead of serving the wrong tests', async () => {
    await expect(generate(ticket('TS-999'), [], offline)).rejects.toThrow(/only covers TS-142/);
  });
});
