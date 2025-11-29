import type { BenchmarkCase } from '../types';

export const benchmarkCase: BenchmarkCase = {
  id: 'rstest-happydom-react-component-100',
  framework: 'rstest',
  environment: 'happydom',
  subject: 'react-component',
  testCount: 100,
  concurrency: 5
};

export default benchmarkCase;
