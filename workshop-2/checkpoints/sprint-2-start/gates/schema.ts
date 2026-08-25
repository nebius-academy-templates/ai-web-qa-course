/**
 * SPRINT 2 — Schema gate.
 *
 * The model answers with JSON. "Usually valid JSON" is not a contract. This
 * gate is the last point where a malformed answer is cheap to reject — after
 * it, writeFiles() puts whatever it was handed onto disk.
 *
 * DONE WHEN: a well-formed payload returns { valid: true, errors: [] }, and a
 * payload with a missing spec or a hashed CSS locator returns valid: false
 * with an error naming the problem.
 *
 * Check yourself with: npm test -- schema
 */
import type { ValidationResult } from '../types.js';

/**
 * The shape the generation call must answer with.
 *
 * Feed this to Ajv as-is. It is also pasted into the prompt in src/generate.ts,
 * so if you change it here, change it there — a schema the model never saw is
 * a gate that only ever rejects.
 */
export const OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['pageObject', 'spec', 'testIds'],
  properties: {
    pageObject: { $ref: '#/$defs/file' },
    spec: { $ref: '#/$defs/file' },
    testIds: {
      type: 'array',
      minItems: 1,
      items: { type: 'string', minLength: 1 },
    },
  },
  $defs: {
    file: {
      type: 'object',
      additionalProperties: false,
      required: ['path', 'contents'],
      properties: {
        path: { type: 'string', pattern: '^[A-Za-z0-9._/-]+\\.ts$' },
        contents: { type: 'string', minLength: 1 },
      },
    },
  },
} as const;

/**
 * Locators that cannot exist in the target app.
 *
 * TechShop is hand-written HTML with no build step: there is no CSS-module
 * hashing, no styled-components, no framework-generated attributes. If the
 * model emits one of these it hallucinated a React app, and the test will fail
 * on the first run against a page that never had that class.
 */
export const FORBIDDEN_LOCATOR_PATTERNS: readonly RegExp[] = [
  /\.css-[a-z0-9]{4,}/i,          // emotion / styled-components
  /\.[\w-]*__[\w-]*--[\w-]*/,      // BEM-ish CSS-module output
  /\[class\*?=/,                   // class-substring selectors
  /data-reactid|data-svelte|_ngcontent|ng-reflect/i, // framework attributes
];

/**
 * Validates one generation payload against OUTPUT_SCHEMA and the locator rules.
 *
 * @param raw whatever came back from the model, already JSON.parse'd.
 *            It is `unknown` on purpose — do not trust it enough to type it.
 * @returns { valid: true, errors: [] } or { valid: false, errors: [...] } with
 *          one readable line per problem. Never throws: a bad payload is an
 *          expected outcome, not an exception.
 */
export function validateOutput(raw: unknown): ValidationResult {
  // TODO (sprint 2): validate `raw` and return a ValidationResult.
  //
  // 1. Structure — compile OUTPUT_SCHEMA with Ajv and run it:
  //
  //      import { Ajv } from 'ajv';   // <- named import; the default import
  //                                  //    trips ESM/CJS interop under tsx
  //      const ajv = new Ajv({ allErrors: true, strict: false });
  //      const validate = ajv.compile(OUTPUT_SCHEMA as object);
  //      if (!validate(raw)) { /* map validate.errors into strings */ }
  //
  //    Turn each Ajv error into something a human can act on, e.g.
  //      `spec: must have required property 'contents'`
  //    Keep the property name in the message — the tests look for it.
  //
  // 2. Locators — scan pageObject.contents and spec.contents against
  //    FORBIDDEN_LOCATOR_PATTERNS. On a hit, push an error that mentions
  //    "data-testid", because that is the fix the reader needs, e.g.
  //      `pageObject: uses a hashed CSS class; TechShop locators must use data-testid`
  //
  // 3. Cross-check — every id in testIds should actually appear in the spec or
  //    the page object. An id nobody uses means the model invented a selector
  //    it then forgot to reference.
  //
  // Collect ALL problems before returning. Reporting the first one only means
  // three round-trips where one would have done.
  throw new Error('Not implemented — sprint 2');
}
