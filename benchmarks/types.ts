export type Framework = 'rstest' | 'vitest';
export type Environment = 'jsdom' | 'happydom' | 'node';
export type TestSubject = 'pure-function' | 'react-component' | 'ag-grid';
export type TestCount = 100 | 1000 | 10000;

export interface BenchmarkCase {
  id: string;
  framework: Framework;
  environment: Environment;
  subject: TestSubject;
  testCount: TestCount;
  concurrency: number;
}
