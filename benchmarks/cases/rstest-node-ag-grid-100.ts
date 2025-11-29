import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'rstest-node-ag-grid-100',
  framework: 'rstest',
  environment: 'node',
  subject: 'ag-grid',
  testCount: 100,
  concurrency: 5
};

export default benchmarkCase;
