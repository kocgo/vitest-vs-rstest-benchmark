import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'vitest-jsdom-ag-grid-1000',
  framework: 'vitest',
  environment: 'jsdom',
  subject: 'ag-grid',
  testCount: 1000,
  concurrency: 5
};

export default benchmarkCase;
