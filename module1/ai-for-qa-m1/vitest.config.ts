import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // `npm test` runs tests/ (the finished tools); `npm run test:starter` runs starter/ (fails until the TODOs are done).
    include: ['tests/**/*.test.ts', 'starter/**/*.test.ts'],
    environment: 'node',
    reporters: ['default'],
  },
});
