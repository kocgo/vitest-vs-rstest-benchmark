import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';

type Suite = {
  name: string;
  command: string;
  args: string[];
  cwd: string;
};

const suites: Suite[] = [
  { name: 'vitest', command: 'npm', args: ['run', 'test:vitest'], cwd: process.cwd() },
  { name: 'rstest', command: 'npm', args: ['run', 'test:rstest'], cwd: process.cwd() }
];

async function runSuite({ name, command, args, cwd }: Suite): Promise<number> {
  const start = performance.now();
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit', shell: false });
    child.on('close', (code) => {
      if (code === 0) {
        resolve(null);
      } else {
        reject(new Error(`${name} exited with ${code}`));
      }
    });
  });
  return performance.now() - start;
}

async function main() {
  for (const suite of suites) {
    try {
      const duration = await runSuite(suite);
      const seconds = (duration / 1000).toFixed(2);
      console.log(`\n${suite.name} finished in ${seconds}s`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`\n${suite.name} failed:`, message);
      process.exitCode = 1;
      return;
    }
  }
}

main();
