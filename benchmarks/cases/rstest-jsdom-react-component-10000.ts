import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'rstest-jsdom-react-component-10000',
  framework: 'rstest',
  environment: 'jsdom',
  subject: 'react-component',
  testCount: 10000,
  concurrency: 5
};

export default benchmarkCase;
