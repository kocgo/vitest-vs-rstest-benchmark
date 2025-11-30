import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';

const environments = ['jsdom', 'happy-dom'] as const;

type Environment = (typeof environments)[number];
type Suite = {
  name: string;
  environment: Environment;
  runner: 'vitest' | 'rstest';
  command: string;
  args: string[];
};

const suites: Suite[] = environments.flatMap((environment) => [
  {
    name: `vitest (${environment})`,
    environment,
    runner: 'vitest',
    command: 'npx',
    args: [
      'vitest',
      'run',
      'tests/vitest/ag-grid.test.tsx',
      '--environment',
      environment,
      '--minWorkers',
      '4',
      '--maxWorkers',
      '4',
      '--maxConcurrency',
      '4'
    ]
  },
  {
    name: `rstest (${environment})`,
    environment,
    runner: 'rstest',
    command: 'npx',
    args: [
      'rstest',
      'run',
      '-c',
      'rstest.config.ts',
      '--include',
      'tests/rstest/ag-grid.test.tsx',
      '--testEnvironment',
      environment,
      '--globals',
      '--maxConcurrency',
      '4'
    ]
  }
]);

async function runSuite({ name, command, args }: Suite): Promise<number> {
  const start = performance.now();
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: false });
    child.on('close', (code) => {
      if (code === 0) {
        resolve(null);
      } else {
        reject(new Error(`${name} exited with code ${code}`));
      }
    });
  });
  return performance.now() - start;
}

async function main() {
  const results: Array<Suite & { duration: number }> = [];

  for (const suite of suites) {
    try {
      const duration = await runSuite(suite);
      results.push({ ...suite, duration });
      console.log(`\n${suite.name} finished in ${(duration / 1000).toFixed(2)}s`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`\n${suite.name} failed:`, message);
      process.exitCode = 1;
      return;
    }
  }

  console.log('\nSummary (ms):');
  for (const { runner, environment, duration } of results) {
    console.log(`${runner} | ${environment} -> ${duration.toFixed(1)}ms`);
  }
}

main();
