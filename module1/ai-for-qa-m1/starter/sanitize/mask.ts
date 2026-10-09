// STARTER: format-preserving masking (lesson 1.2.4: the test still needs a valid email, an ORD- number, a number amount).
// Run: npm run test:starter

/** Replace an email with a fictional one that is still a valid email. Same input must give the same output. */
export function maskEmail(email: string): string {
  // TODO: e.g. testuser_<n>@example.com where <n> comes from a hash of the input (not Math.random)
  throw new Error('TODO: maskEmail');
}

/** Replace the digits of an order number such as ORD-905512, keeping the "ORD-" prefix and the digit count. */
export function maskOrderNumber(order: string): string {
  // TODO
  throw new Error('TODO: maskOrderNumber');
}
