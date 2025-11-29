import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'rstest-node-react-component-100',
  framework: 'rstest',
  environment: 'node',
  subject: 'react-component',
  testCount: 100,
  concurrency: 5
};

export default benchmarkCase;
