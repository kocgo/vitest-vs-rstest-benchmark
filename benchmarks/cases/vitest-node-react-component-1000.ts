import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'vitest-node-react-component-1000',
  framework: 'vitest',
  environment: 'node',
  subject: 'react-component',
  testCount: 1000,
  concurrency: 5
};

export default benchmarkCase;
