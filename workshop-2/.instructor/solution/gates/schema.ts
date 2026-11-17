/**
 * SPRINT 2 — Schema gate. ✅ SOLVED (instructor copy)
 *
 * DONE WHEN: a well-formed payload returns { valid: true, errors: [] }, and a
 * payload with a missing spec or a hashed CSS locator returns valid: false
 * with an error naming the problem.
 *
 * Check yourself with: npm test -- schema
 */
import { Ajv } from 'ajv';
import type { ValidationResult } from '../types.js';

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

export const FORBIDDEN_LOCATOR_PATTERNS: readonly RegExp[] = [
  /\.css-[a-z0-9]{4,}/i,
  /\.[\w-]*__[\w-]*--[\w-]*/,
  /\[class\*?=/,
  /data-reactid|data-svelte|_ngcontent|ng-reflect/i,
];

// Compiled once. Ajv is happy to be reused and compiling per call is wasteful.
const ajv = new Ajv({ allErrors: true, strict: false });
const validateSchema = ajv.compile(OUTPUT_SCHEMA as object);

/** Reads a string property off an untrusted object without trusting it. */
function contentsOf(raw: unknown, key: 'pageObject' | 'spec'): string | undefined {
  if (typeof raw !== 'object' || raw === null) return undefined;
  const file = (raw as Record<string, unknown>)[key];
  if (typeof file !== 'object' || file === null) return undefined;
  const contents = (file as Record<string, unknown>).contents;
  return typeof contents === 'string' ? contents : undefined;
}

export function validateOutput(raw: unknown): ValidationResult {
  const errors: string[] = [];

  // 1. Structure.
  if (!validateSchema(raw)) {
    for (const err of validateSchema.errors ?? []) {
      const where = err.instancePath ? err.instancePath.replace(/^\//, '').replace(/\//g, '.') : 'payload';
      errors.push(`${where}: ${err.message ?? 'is invalid'}`);
    }
  }

  // 2. Locator rules. Runs even when the structure failed — one round-trip
  //    should surface everything that is wrong, not the first thing.
  for (const key of ['pageObject', 'spec'] as const) {
    const contents = contentsOf(raw, key);
    if (contents === undefined) continue;
    for (const pattern of FORBIDDEN_LOCATOR_PATTERNS) {
      const hit = contents.match(pattern);
      if (hit) {
        errors.push(
          `${key}: uses "${hit[0]}", which cannot exist in TechShop's hand-written HTML — ` +
            `TechShop locators must use data-testid`,
        );
      }
    }
  }

  // 3. Cross-check: every declared id has to be used by the code.
  const declared = (raw as { testIds?: unknown })?.testIds;
  if (Array.isArray(declared)) {
    const code = [contentsOf(raw, 'pageObject') ?? '', contentsOf(raw, 'spec') ?? ''].join('\n');
    for (const id of declared) {
      if (typeof id === 'string' && !code.includes(id)) {
        errors.push(`testIds: "${id}" is declared but never used in the generated code`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
