import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'vitest-jsdom-pure-function-100',
  framework: 'vitest',
  environment: 'jsdom',
  subject: 'pure-function',
  testCount: 100,
  concurrency: 5
};

export default benchmarkCase;
