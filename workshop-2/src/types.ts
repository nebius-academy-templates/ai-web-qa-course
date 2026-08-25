/**
 * Shared types for the ticket -> Playwright pipeline.
 *
 * The three gate stubs in src/gates/ are typed against these. Do not change
 * the shapes during the workshop — the tests in tests/ assert against them.
 */

export type TicketSource = 'fixture' | 'linear' | 'jira';

export interface Attachment {
  /** File name as it appears on the ticket. */
  name: string;
  /** MIME type, e.g. 'text/csv'. */
  contentType: string;
  /** Inline text content. Binary attachments are not supported in this workshop. */
  content: string;
}

/** What every adapter must return, whatever the upstream tracker is. */
export interface TicketData {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  attachments: Attachment[];
}

export interface MaskingReport {
  /** How many string fields the gate walked (title + description + each AC + each attachment). */
  fieldsScanned: number;
  /** How many of those fields had at least one substitution applied. */
  fieldsMasked: number;
  /** Substitution counts per category, e.g. { email: 3, phone: 1, payment: 0 }. */
  byCategory: Record<string, number>;
}

export interface MaskingResult {
  masked: TicketData;
  report: MaskingReport;
}

/** A synthetic person, safe to put in a prompt or a generated fixture. */
export interface SyntheticUser {
  name: string;
  email: string;
  phone: string;
  city: string;
  zip: string;
}

/** One file the model asked us to write. */
export interface GeneratedFile {
  /** Path relative to the output directory, e.g. 'pages/CheckoutPage.ts'. */
  path: string;
  contents: string;
}

/** The JSON contract the model must answer with. Validated by the schema gate. */
export interface GenerationOutput {
  pageObject: GeneratedFile;
  spec: GeneratedFile;
  /** Every data-testid the generated code depends on. */
  testIds: string[];
}

export interface ValidationResult {
  valid: boolean;
  /** Human-readable, one line per problem. Empty when valid. */
  errors: string[];
}

export interface HitlDecision {
  approved: boolean;
  /** Raw answer the human typed, lowercased and trimmed. */
  answer: string;
  linesAdded: number;
  linesRemoved: number;
}

export interface HitlOptions {
  /**
   * Files already on disk, keyed by the same relative path the model used.
   * A path missing from this map is a brand-new file.
   */
  existing?: Record<string, string>;
  /** Where the diff is rendered. Defaults to stdout. Injected by the tests. */
  write?: (chunk: string) => void;
  /** How the human is asked. Defaults to a readline y/N prompt. Injected by the tests. */
  ask?: (question: string) => Promise<string>;
}
