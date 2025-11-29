import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'vitest-node-ag-grid-100',
  framework: 'vitest',
  environment: 'node',
  subject: 'ag-grid',
  testCount: 100,
  concurrency: 5
};

export default benchmarkCase;
