import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'vitest-jsdom-ag-grid-100',
  framework: 'vitest',
  environment: 'jsdom',
  subject: 'ag-grid',
  testCount: 100,
  concurrency: 5
};

export default benchmarkCase;
