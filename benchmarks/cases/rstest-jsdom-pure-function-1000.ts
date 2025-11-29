import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'rstest-jsdom-pure-function-1000',
  framework: 'rstest',
  environment: 'jsdom',
  subject: 'pure-function',
  testCount: 1000,
  concurrency: 5
};

export default benchmarkCase;
