import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'rstest-node-ag-grid-1000',
  framework: 'rstest',
  environment: 'node',
  subject: 'ag-grid',
  testCount: 1000,
  concurrency: 5
};

export default benchmarkCase;
