import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'vitest-jsdom-pure-function-1000',
  framework: 'vitest',
  environment: 'jsdom',
  subject: 'pure-function',
  testCount: 1000,
  concurrency: 5
};

export default benchmarkCase;
