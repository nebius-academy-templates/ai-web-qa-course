/**
 * Adapter selection. The rest of the pipeline imports getTicket from here and
 * never learns which tracker answered.
 */
import { resolveSource } from '../config.js';
import type { TicketData, TicketSource } from '../types.js';

import * as fixture from './fixture.js';
import * as linear from './linear.js';
import * as jira from './jira.js';

const ADAPTERS: Record<TicketSource, { getTicket(id: string): Promise<TicketData> }> = {
  fixture,
  linear,
  jira,
};

export function getAdapter(source: TicketSource = resolveSource()) {
  return ADAPTERS[source];
}

export async function getTicket(
  id: string,
  source: TicketSource = resolveSource(),
): Promise<TicketData> {
  return getAdapter(source).getTicket(id);
}
