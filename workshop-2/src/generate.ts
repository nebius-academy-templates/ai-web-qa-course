/**
 * The generation call. Everything reaching this function has already been
 * through the security gate — treat `ticket` as public text.
 */
import Anthropic from '@anthropic-ai/sdk';
import type { Config } from './config.js';
import { OUTPUT_SCHEMA } from './gates/schema.js';
import type { SyntheticUser, TicketData } from './types.js';

/**
 * What the target app actually is.
 *
 * TechShop is the static store in the parent directory: hand-written HTML,
 * plain JS, no bundler, no framework. Every interactive element carries a
 * data-testid. There are no hashed class names to select on because nothing
 * ever hashed them, so a model that reaches for `.css-1x2y3z` has invented an
 * app that does not exist. The examples below are real ids from that site.
 */
const APP_CONTEXT = `
TARGET APPLICATION — TechShop
- A static e-commerce demo: plain hand-written HTML + vanilla JS. No build
  step, no React/Vue/Svelte, no CSS modules, no styled-components.
- Pages: index.html, products.html, cart.html, checkout.html, login.html.
- Served at http://localhost:4300.

LOCATOR RULES (non-negotiable)
- Use page.getByTestId('...') for every element. Nothing else.
- NEVER use hashed CSS classes (.css-1a2b3c), BEM-module output
  (.Button__label--primary), class-substring selectors ([class*="btn"]), or
  framework attributes (data-reactid, _ngcontent). None of these can exist in
  a hand-written HTML file — a locator using one will never match.
- Text-based locators are a last resort and must be justified in a comment.

REAL data-testid VALUES AVAILABLE
- Every page: navbar, logo, nav-home, nav-products, nav-cart, cart-count
- index.html: hero, hero-title, hero-cta, featured-grid
- products.html: filter-bar, category-filter, sort-filter, product-grid,
  and per product: product-card-<id>, product-name-<id>, product-price-<id>,
  product-category-<id>, product-rating-<id>, product-badge-<id>,
  product-desc-<id>, product-emoji-<id>, add-to-cart-<id>
- cart.html: cart-items, cart-empty, cart-summary, subtotal, shipping, total,
  and per line item: cart-item-<id>, cart-name-<id>, cart-price-<id>,
  cart-total-<id>, qty-plus-<id>, qty-minus-<id>, qty-val-<id>, remove-btn-<id>
- checkout.html: checkout-form, input-name, input-email, input-phone,
  input-address, input-city, input-zip, input-country, place-order-btn,
  cart-summary, subtotal, shipping, total, order-success, back-home

If the ticket needs an element with no id in that list, still write
getByTestId('<the-id-you-would-add>') and list it in testIds — the reviewer
then knows exactly which attribute to add to the HTML.
`.trim();

const SYSTEM_PROMPT = `
You generate Playwright test code from a ticket. You return JSON and nothing else.

${APP_CONTEXT}

OUTPUT CONTRACT
Answer with a single JSON object matching this JSON Schema, with no prose and
no markdown fence around it:

${JSON.stringify(OUTPUT_SCHEMA, null, 2)}

- pageObject.path  e.g. "pages/CheckoutPage.ts" — a Page Object class holding
                   the locators and the actions, no assertions.
- spec.path        e.g. "specs/checkout.spec.ts" — @playwright/test specs that
                   drive the Page Object. One test per acceptance criterion.
- testIds          every data-testid the two files depend on.

Write TypeScript. Import from '@playwright/test'. Do not invent helpers that
are not in the files you are returning.
`.trim();

function renderTicket(ticket: TicketData, users: SyntheticUser[]): string {
  const criteria = ticket.acceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n');
  const attachments = ticket.attachments
    .map((a) => `--- ${a.name} (${a.contentType}) ---\n${a.content}`)
    .join('\n\n');

  return [
    `TICKET ${ticket.id}: ${ticket.title}`,
    '',
    ticket.description,
    '',
    'ACCEPTANCE CRITERIA',
    criteria || '(none listed)',
    attachments ? `\nATTACHMENTS\n${attachments}` : '',
    '',
    'SYNTHETIC TEST DATA — use these values in form fills. They are generated,',
    'not real; any personal data on the ticket has already been redacted.',
    JSON.stringify(users, null, 2),
    '',
    'Return the JSON object now.',
  ].join('\n');
}

/** Pulls the JSON object out of the response, tolerating a stray code fence. */
export function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = (fenced?.[1] ?? text).trim();
  const end = body.lastIndexOf('}');
  if (end === -1) {
    throw new Error(`No JSON object in the model response:\n${text.slice(0, 500)}`);
  }

  // Try each '{' left to right and keep the first that parses. The obvious
  // first-brace-to-last-brace slice breaks the moment the model prefaces bare
  // JSON with prose that itself contains braces ("use the {id} placeholder").
  let lastError: unknown;
  for (let start = body.indexOf('{'); start !== -1 && start < end; start = body.indexOf('{', start + 1)) {
    try {
      return JSON.parse(body.slice(start, end + 1));
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(
    `No parseable JSON object in the model response ` +
      `(${lastError instanceof Error ? lastError.message : 'no candidate found'}):\n` +
      text.slice(0, 500),
  );
}

/**
 * Calls Claude and returns the parsed — but NOT yet validated — payload.
 * Validation is the schema gate's job; keeping them apart is the point.
 */
export async function generate(
  ticket: TicketData,
  users: SyntheticUser[],
  config: Config,
): Promise<unknown> {
  const client = new Anthropic({ apiKey: config.apiKey });

  // Streaming, because a page object plus a spec runs long and a non-streamed
  // request that size flirts with the SDK's HTTP timeout.
  const stream = client.messages.stream({
    model: config.model,
    max_tokens: 64000,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: renderTicket(ticket, users) }],
  });

  const message = await stream.finalMessage();

  if (message.stop_reason === 'refusal') {
    throw new Error(
      `The model declined this request (${message.stop_details?.category ?? 'unknown'}). ` +
        `Check what the ticket text actually contains.`,
    );
  }

  const text = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');

  return extractJson(text);
}

export { APP_CONTEXT, SYSTEM_PROMPT };
