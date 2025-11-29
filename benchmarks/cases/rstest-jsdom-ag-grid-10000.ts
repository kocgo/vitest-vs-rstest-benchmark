import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'rstest-jsdom-ag-grid-10000',
  framework: 'rstest',
  environment: 'jsdom',
  subject: 'ag-grid',
  testCount: 10000,
  concurrency: 5
};

export default benchmarkCase;
