import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'vitest-jsdom-pure-function-10000',
  framework: 'vitest',
  environment: 'jsdom',
  subject: 'pure-function',
  testCount: 10000,
  concurrency: 5
};

export default benchmarkCase;
