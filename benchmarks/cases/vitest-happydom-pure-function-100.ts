import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'vitest-happydom-pure-function-100',
  framework: 'vitest',
  environment: 'happydom',
  subject: 'pure-function',
  testCount: 100,
  concurrency: 5
};

export default benchmarkCase;
