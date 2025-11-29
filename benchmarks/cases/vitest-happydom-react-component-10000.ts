import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'vitest-happydom-react-component-10000',
  framework: 'vitest',
  environment: 'happydom',
  subject: 'react-component',
  testCount: 10000,
  concurrency: 5
};

export default benchmarkCase;
