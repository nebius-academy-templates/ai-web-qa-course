import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Only this directory's tests. The course suite at the repo root is
    // Playwright and is never touched by `npm test` in here.
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    reporters: ['default'],
  },
});
