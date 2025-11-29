import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'rstest-jsdom-ag-grid-100',
  framework: 'rstest',
  environment: 'jsdom',
  subject: 'ag-grid',
  testCount: 100,
  concurrency: 5
};

export default benchmarkCase;
