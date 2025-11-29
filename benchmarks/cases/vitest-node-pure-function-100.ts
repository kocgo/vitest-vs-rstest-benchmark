import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'vitest-node-pure-function-100',
  framework: 'vitest',
  environment: 'node',
  subject: 'pure-function',
  testCount: 100,
  concurrency: 5
};

export default benchmarkCase;
