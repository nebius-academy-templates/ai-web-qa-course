// Shared types for the PII scanner / masker.

/** The three categories taught in lesson 1.2.3. */
export type Category = 'direct identifier' | 'indirect identifier' | 'sensitive attribute';

export type Kind =
  | 'email'
  | 'phone'
  | 'uuid'
  | 'ip'
  | 'national-id'
  | 'card'
  | 'api-key'
  | 'customer-id'
  | 'order-number'
  | 'session-id'
  | 'name'
  | 'address'
  | 'address-line-2'
  | 'city'
  | 'postcode'
  | 'dob'
  | 'account-number'
  | 'id'
  | 'amount'
  | 'health-keyword'
  | 'url-credentials'
  | 'internal-host';

/**
 * Category of each kind. Choices follow the lesson tables (1.2.1 and 1.2.3):
 * date of birth is a direct identifier there, account number is an indirect identifier.
 * Credentials and card numbers go under "sensitive attribute" because the lesson's three
 * categories have no separate credentials bucket (the README says so).
 */
export const CATEGORY_OF: Record<Kind, Category> = {
  email: 'direct identifier',
  phone: 'direct identifier',
  'national-id': 'direct identifier',
  name: 'direct identifier',
  address: 'direct identifier',
  'address-line-2': 'direct identifier',
  dob: 'direct identifier',
  uuid: 'indirect identifier',
  ip: 'indirect identifier',
  'customer-id': 'indirect identifier',
  'order-number': 'indirect identifier',
  'session-id': 'indirect identifier',
  city: 'indirect identifier',
  postcode: 'indirect identifier',
  'account-number': 'indirect identifier',
  id: 'indirect identifier',
  card: 'sensitive attribute',
  'api-key': 'sensitive attribute',
  amount: 'sensitive attribute',
  'health-keyword': 'sensitive attribute',
  'url-credentials': 'sensitive attribute',
  'internal-host': 'sensitive attribute',
};

export interface Finding {
  /** Where it was found: a JSON path, "row 12", or "line 5". Never contains the value itself. */
  location: string;
  /** Field / column name when the input is structured. */
  field?: string;
  kind: Kind;
  category: Category;
  /** "field" = decided by the field name, "pattern" = decided by a regex over the text. */
  source: 'field' | 'pattern';
  /** False for review-only findings that the tool cannot safely replace. */
  masked: boolean;
  note?: string;
}

export interface Match {
  start: number;
  end: number;
  kind: Kind;
  value: string;
}
