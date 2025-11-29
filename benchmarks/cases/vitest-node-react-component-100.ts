import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'vitest-node-react-component-100',
  framework: 'vitest',
  environment: 'node',
  subject: 'react-component',
  testCount: 100,
  concurrency: 5
};

export default benchmarkCase;
