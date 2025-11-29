import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'rstest-node-pure-function-10000',
  framework: 'rstest',
  environment: 'node',
  subject: 'pure-function',
  testCount: 10000,
  concurrency: 5
};

export default benchmarkCase;
