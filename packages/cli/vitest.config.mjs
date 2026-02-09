import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 600_000, // 10 minutes for integration tests
    hookTimeout: 600_000,
    teardownTimeout: 30_000,
  },
});
