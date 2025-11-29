import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'rstest-jsdom-pure-function-10000',
  framework: 'rstest',
  environment: 'jsdom',
  subject: 'pure-function',
  testCount: 10000,
  concurrency: 5
};

export default benchmarkCase;
