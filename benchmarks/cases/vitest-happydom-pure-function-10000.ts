import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'vitest-happydom-pure-function-10000',
  framework: 'vitest',
  environment: 'happydom',
  subject: 'pure-function',
  testCount: 10000,
  concurrency: 5
};

export default benchmarkCase;
