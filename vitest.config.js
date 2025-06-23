import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: [
      '**/node_modules/**',
      '**/tests/manual-*.test.js', // Exclude manual tests that require running server
      '**/tests/integration.test.js', // Exclude integration tests that require running server
    ],
  },
});