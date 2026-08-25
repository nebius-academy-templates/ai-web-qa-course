/**
 * ★★ tier — Linear adapter.
 *
 * Left as a stub on purpose: wiring a real tracker is the stretch goal, not
 * the workshop's critical path. The pipeline after this point does not care
 * where the ticket came from, so all you have to do is fill in getTicket().
 */
import type { TicketData } from '../types.js';

export async function getTicket(id: string): Promise<TicketData> {
  // TODO (★★): fetch the issue from Linear and map it onto TicketData.
  //
  // Recommended route — the Linear MCP server, so no API token lives in this
  // repo. Add it once with:
  //   claude mcp add --transport sse linear https://mcp.linear.app/sse
  // then call its `get_issue` tool with { id } and map the response:
  //   title              <- issue.title
  //   description        <- issue.description ?? ''
  //   acceptanceCriteria <- the checklist lines from the description body,
  //                         or issue.children if your team files AC as sub-issues
  //   attachments        <- issue.attachments, text content only
  //
  // Direct-API route if you would rather not use MCP: POST to
  // https://api.linear.app/graphql with an `Authorization: <LINEAR_API_KEY>`
  // header and the query `issue(id: "...") { title description }`.
  //
  // Keep this function the ONLY place that knows about Linear. Everything
  // downstream — the gates, the prompt, the writer — must stay tracker-agnostic.
  throw new Error(
    `Linear adapter not implemented (asked for "${id}"). ` +
      `Run with TICKET_SOURCE=fixture, or implement src/adapters/linear.ts (★★ tier).`,
  );
}
