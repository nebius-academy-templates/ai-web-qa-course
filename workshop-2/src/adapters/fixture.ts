/**
 * ★ tier — the fixture adapter. Zero external dependencies, zero setup.
 *
 * Reads fixtures/ticket.json and, if the ticket references an attachment we
 * ship locally, inlines that file's text so the rest of the pipeline sees a
 * ticket exactly like a real Jira/Linear one — attachments and all.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Attachment, TicketData } from '../types.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.resolve(here, '../../fixtures');

interface RawTicket {
  id: string;
  title: string;
  description?: string;
  acceptanceCriteria?: string[];
  /** File names resolved relative to fixtures/. */
  attachments?: string[];
}

function contentTypeFor(name: string): string {
  if (name.endsWith('.csv')) return 'text/csv';
  if (name.endsWith('.json')) return 'application/json';
  return 'text/plain';
}

async function loadAttachments(names: string[]): Promise<Attachment[]> {
  const loaded: Attachment[] = [];
  for (const name of names) {
    const full = path.resolve(fixturesDir, name);
    if (!full.startsWith(fixturesDir + path.sep)) {
      throw new Error(`Attachment "${name}" escapes fixtures/ — refusing to read it.`);
    }
    loaded.push({
      name,
      contentType: contentTypeFor(name),
      content: await readFile(full, 'utf8'),
    });
  }
  return loaded;
}

export async function getTicket(id: string): Promise<TicketData> {
  const file = path.join(fixturesDir, 'ticket.json');
  let raw: RawTicket;
  try {
    raw = JSON.parse(await readFile(file, 'utf8')) as RawTicket;
  } catch (err) {
    throw new Error(`Could not read ${file}: ${(err as Error).message}`);
  }

  if (raw.id !== id) {
    throw new Error(
      `The fixture adapter only knows ticket "${raw.id}", but "${id}" was requested.\n` +
        `Edit fixtures/ticket.json, or run against a real tracker with TICKET_SOURCE=linear|jira.`,
    );
  }

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? '',
    acceptanceCriteria: raw.acceptanceCriteria ?? [],
    attachments: await loadAttachments(raw.attachments ?? []),
  };
}
