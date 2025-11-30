import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';

type Suite = {
  name: string;
  command: string;
  args: string[];
};

const suites: Suite[] = [
  {
    name: 'vitest ag-grid',
    command: 'npx',
    args: [
      'vitest',
      'run',
      'tests/vitest/ag-grid.test.tsx',
      '--minWorkers',
      '4',
      '--maxWorkers',
      '4',
      '--maxConcurrency',
      '4'
    ]
  },
  {
    name: 'rstest ag-grid',
    command: 'npx',
    args: [
      'rstest',
      'run',
      '-c',
      'rstest.ag-grid.config.ts',
      '--testEnvironment',
      'jsdom',
      '--globals',
      '--maxConcurrency',
      '4'
    ]
  }
];

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
  for (const suite of suites) {
    try {
      const duration = await runSuite(suite);
      console.log(`\n${suite.name} finished in ${(duration / 1000).toFixed(2)}s`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`\n${suite.name} failed:`, message);
      process.exitCode = 1;
      break;
    }
  }
}

main();
