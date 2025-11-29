import { defineConfig } from '@rstest/core';

export default defineConfig({
  root: __dirname,
  include: ['tests/rstest/ag-grid.test.tsx'],
  setupFiles: ['./rstest.setup.ts'],
  testEnvironment: 'jsdom',
  globals: true,
});
