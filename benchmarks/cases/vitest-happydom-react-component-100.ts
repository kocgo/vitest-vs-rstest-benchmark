import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'vitest-happydom-react-component-100',
  framework: 'vitest',
  environment: 'happydom',
  subject: 'react-component',
  testCount: 100,
  concurrency: 5
};

export default benchmarkCase;
