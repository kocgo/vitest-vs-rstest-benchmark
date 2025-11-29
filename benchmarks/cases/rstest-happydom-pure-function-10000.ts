import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'rstest-happydom-pure-function-10000',
  framework: 'rstest',
  environment: 'happydom',
  subject: 'pure-function',
  testCount: 10000,
  concurrency: 5
};

export default benchmarkCase;
