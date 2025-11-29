import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'vitest-jsdom-ag-grid-10000',
  framework: 'vitest',
  environment: 'jsdom',
  subject: 'ag-grid',
  testCount: 10000,
  concurrency: 5
};

export default benchmarkCase;
