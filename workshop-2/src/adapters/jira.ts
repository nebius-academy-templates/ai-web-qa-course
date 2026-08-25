/**
 * ★★★ tier — Jira adapter.
 *
 * Harder than Linear on purpose: Jira's description is Atlassian Document
 * Format (a nested JSON tree), not markdown, so you have to flatten it before
 * anything downstream can read it.
 */
import type { TicketData } from '../types.js';

export async function getTicket(id: string): Promise<TicketData> {
  // TODO (★★★): fetch the issue from Jira and map it onto TicketData.
  //
  // Recommended route — the Atlassian MCP server:
  //   claude mcp add --transport sse atlassian https://mcp.atlassian.com/v1/sse
  // then call its `getJiraIssue` tool with { issueIdOrKey: id }.
  //
  // Direct-API route: GET https://<site>.atlassian.net/rest/api/3/issue/<id>
  // with basic auth (email + JIRA_API_TOKEN, base64).
  //
  // Three things that bite people here:
  //   1. fields.description is ADF. Walk the node tree and concatenate every
  //      { type: 'text', text } leaf — do NOT JSON.stringify it into the prompt.
  //   2. Acceptance criteria are usually a custom field (customfield_1xxxx) or
  //      a bullet list inside the description. Find yours once, then hard-code it.
  //   3. fields.attachment gives you URLs, not content. Fetch each one with the
  //      same auth header and keep text/* only — a binary blob in a prompt is
  //      wasted tokens at best and a data leak at worst.
  //
  // Keep this function the ONLY place that knows about Jira.
  throw new Error(
    `Jira adapter not implemented (asked for "${id}"). ` +
      `Run with TICKET_SOURCE=fixture, or implement src/adapters/jira.ts (★★★ tier).`,
  );
}
