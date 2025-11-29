import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';

const suites = [
  {
    name: 'vitest ag-grid',
    command: 'npx',
    args: ['vitest', 'run', 'tests/vitest/ag-grid.test.tsx']
  },
  {
    name: 'rstest ag-grid',
    command: 'npm',
    args: ['run', 'test:rstest', '--', '--testNamePattern', 'SalesGrid', '--testEnvironment', 'jsdom', '--globals']
  }
];

async function runSuite({ name, command, args }) {
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
      console.error(`\n${suite.name} failed:`, error.message);
      process.exitCode = 1;
      break;
    }
  }
}

main();
