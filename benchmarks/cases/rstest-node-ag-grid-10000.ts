import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'rstest-node-ag-grid-10000',
  framework: 'rstest',
  environment: 'node',
  subject: 'ag-grid',
  testCount: 10000,
  concurrency: 5
};

export default benchmarkCase;
