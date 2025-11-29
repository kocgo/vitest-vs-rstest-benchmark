import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';

const testCounts = [100, 1000, 10000];
const environments = ['jsdom', 'happy-dom', 'node'];

const runners = [
  {
    name: 'vitest',
    buildContent: (count) => `import { describe, it, expect } from "vitest";

describe('synthetic vitest suite', () => {
  for (let i = 0; i < ${count}; i++) {
    it('adds numbers ' + i, () => {
      expect(1 + 1).toBe(2);
    });
  }
});
`,
    commandArgs: (env, file) => [
      'vitest',
      'run',
      '--config',
      'vitest.config.ts',
      '--environment',
      env,
      '--minWorkers',
      '4',
      '--maxWorkers',
      '4',
      '--maxConcurrency',
      '4',
      file
    ]
  },
  {
    name: 'rstest',
    buildContent: (count) => `import { describe, it, expect } from "@rstest/core";

describe('synthetic rstest suite', () => {
  for (let i = 0; i < ${count}; i++) {
    it('adds numbers ' + i, () => {
      expect(1 + 1).toBe(2);
    });
  }
});
`,
    commandArgs: (env, file) => [
      'rstest',
      'run',
      '-c',
      'rstest.config.ts',
      '--include',
      file,
      '--testEnvironment',
      env,
      '--globals',
      '--maxConcurrency',
      '4'
    ]
  }
];

function createTempDir() {
  return mkdtempSync(join(process.cwd(), 'tmp-bench-'));
}

function createTestFile(dir, runner, count) {
  const filePath = join(dir, `${runner.name}.synthetic.test.ts`);
  writeFileSync(filePath, runner.buildContent(count), 'utf8');
  return filePath;
}

async function runCommand(command, args, cwd) {
  const start = performance.now();
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', cwd, shell: false });
    child.on('close', (code) => {
      if (code === 0) {
        resolve(null);
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
  return performance.now() - start;
}

async function runMatrix() {
  const tempDir = createTempDir();
  const results = [];

  try {
    for (const environment of environments) {
      for (const runner of runners) {
        for (const count of testCounts) {
          const file = createTestFile(tempDir, runner, count);
          const args = runner.commandArgs(environment, file);
          const duration = await runCommand('npx', args, process.cwd());
          results.push({ runner: runner.name, environment, count, durationMs: duration });
          console.log(`\n${runner.name} | ${environment} | ${count} tests -> ${(duration / 1000).toFixed(2)}s`);
        }
      }
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }

  return results;
}

function formatResults(results) {
  const sorted = results.sort((a, b) => a.count - b.count || a.runner.localeCompare(b.runner));
  console.log('\nSummary (ms):');
  for (const row of sorted) {
    console.log(`${row.runner} | ${row.environment} | ${row.count} tests -> ${row.durationMs.toFixed(1)}ms`);
  }
}

runMatrix().then(formatResults).catch((error) => {
  console.error('Benchmark failed:', error);
  process.exitCode = 1;
});
