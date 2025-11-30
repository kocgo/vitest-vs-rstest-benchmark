import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';

import { updateBenchmarkResultsInReadme } from './update-readme-table.js';

const testCounts = [100, 1000, 10000] as const;
const environments = ['jsdom', 'happy-dom', 'node'] as const;

type Environment = (typeof environments)[number];
type MatrixRunner = {
  name: 'vitest' | 'rstest';
  buildContent: (count: number) => string;
  commandArgs: (env: Environment, file: string) => string[];
};

const runners: MatrixRunner[] = [
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

function createTempDir(): string {
  return mkdtempSync(join(process.cwd(), 'tmp-bench-'));
}

function createTestFile(dir: string, runner: MatrixRunner, count: number): string {
  const filePath = join(dir, `${runner.name}.synthetic.test.ts`);
  writeFileSync(filePath, runner.buildContent(count), 'utf8');
  return filePath;
}

async function runCommand(command: string, args: string[], cwd: string): Promise<number> {
  const start = performance.now();
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', cwd, shell: false });
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
  return performance.now() - start;
}

type BenchmarkResult = {
  runner: MatrixRunner['name'];
  environment: Environment;
  count: number;
  durationMs: number;
};

async function runMatrix(): Promise<BenchmarkResult[]> {
  const tempDir = createTempDir();
  const results: BenchmarkResult[] = [];

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

function formatResults(results: BenchmarkResult[]): void {
  const sorted = results.sort((a, b) => a.count - b.count || a.runner.localeCompare(b.runner));
  console.log('\nSummary (ms):');
  for (const row of sorted) {
    console.log(`${row.runner} | ${row.environment} | ${row.count} tests -> ${row.durationMs.toFixed(1)}ms`);
  }
}

function updateReadme(results: BenchmarkResult[]): void {
  const updates = results.map((row) => ({
    framework: row.runner,
    environment: row.environment,
    subject: 'pure-function',
    testCount: row.count,
    runtimeSeconds: row.durationMs / 1000
  }));

  updateBenchmarkResultsInReadme(updates);
}

runMatrix()
  .then((results) => {
    updateReadme(results);
    formatResults(results);
  })
  .catch((error) => {
  console.error('Benchmark failed:', error);
  process.exitCode = 1;
});
