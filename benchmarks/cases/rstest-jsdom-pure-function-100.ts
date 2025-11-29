import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'rstest-jsdom-pure-function-100',
  framework: 'rstest',
  environment: 'jsdom',
  subject: 'pure-function',
  testCount: 100,
  concurrency: 5
};

export default benchmarkCase;
