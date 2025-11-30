import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';

import { updateBenchmarkResultsInReadme } from './update-readme-table.js';

const selectedCounts = process.env.AG_GRID_COUNTS
  ? process.env.AG_GRID_COUNTS.split(',').map((value) => Number.parseInt(value, 10))
  : undefined;

const testCounts = selectedCounts?.filter((count) => Number.isFinite(count) && count > 0) ?? [
  100,
  1_000,
  10_000,
  100_000
];

const testEnvironment = (process.env.AG_GRID_ENV ?? 'jsdom') as 'jsdom' | 'happy-dom' | 'node';
const batchSizeEnv = process.env.AG_GRID_BATCH_SIZE;
const parsedBatchSize = Number.parseInt(batchSizeEnv ?? '', 10);
const batchSize = Number.isFinite(parsedBatchSize) ? Math.max(1, parsedBatchSize) : 1;

type Runner = {
  name: 'vitest' | 'rstest';
  buildContent: (count: number) => string;
  commandArgs: (file: string) => string[];
};

const runners: Runner[] = [
  {
    name: 'vitest',
    buildContent: (count) => `import { describe, it, expect, beforeAll, afterAll } from "vitest";
import "@testing-library/react/dont-cleanup-after-each";
import { render, waitFor } from "@testing-library/react";
import { SalesGrid } from "../../../src/components/SalesGrid";
import { buildSalesRecords } from "../../../tests/agGridFixtures";
import type { GridApi } from "ag-grid-community";

const rows = buildSalesRecords(50);
let gridApi: GridApi;
let resetGrid: (() => void) | null = null;

async function renderGrid() {
  let api: GridApi | null = null;
  const result = render(
    <SalesGrid
      rows={rows}
      quickFilterText=""
      suppressRowVirtualisation={true}
      onGridReady={(gridApi) => {
        api = gridApi;
      }}
    />
  );

  await waitFor(() => expect(api).not.toBeNull());
  return { api: api!, ...result };
}

describe('ag-grid synthetic load', () => {
  beforeAll(async () => {
    const { api, unmount } = await renderGrid();
    gridApi = api;
    resetGrid = unmount;
  });

  afterAll(() => {
    resetGrid?.();
  });

  const total = ${count};
  const batchSize = ${batchSize};

  for (let start = 0; start < total; start += batchSize) {
    const end = Math.min(start + batchSize, total);
    it('reads displayed rows ' + start + '-' + (end - 1), () => {
      for (let i = start; i < end; i++) {
        expect(gridApi.isDestroyed()).toBe(false);
        expect(gridApi.getDisplayedRowCount()).toBe(rows.length);
      }
    });
  }
});
`,
    commandArgs: (file) => [
      'vitest',
      'run',
      '--config',
      'vitest.config.ts',
      '--environment',
      testEnvironment,
      '--reporter',
      'basic',
      '--silent',
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
    buildContent: (count) => `import { describe, it, expect, beforeAll, afterAll } from "@rstest/core";
import "@testing-library/react/dont-cleanup-after-each";
import { render, waitFor } from "@testing-library/react";
import { SalesGrid } from "../../../src/components/SalesGrid";
import { buildSalesRecords } from "../../../tests/agGridFixtures";
import type { GridApi } from "ag-grid-community";

const rows = buildSalesRecords(50);
let gridApi: GridApi;
let resetGrid: (() => void) | null = null;

async function renderGrid() {
  let api: GridApi | null = null;
  const result = render(
    <SalesGrid
      rows={rows}
      quickFilterText=""
      suppressRowVirtualisation={true}
      onGridReady={(gridApi) => {
        api = gridApi;
      }}
    />
  );

  await waitFor(() => expect(api).not.toBeNull());
  return { api: api!, ...result };
}

describe('ag-grid synthetic load', () => {
  beforeAll(async () => {
    const { api, unmount } = await renderGrid();
    gridApi = api;
    resetGrid = unmount;
  });

  afterAll(() => {
    resetGrid?.();
  });

  const total = ${count};
  const batchSize = ${batchSize};

  for (let start = 0; start < total; start += batchSize) {
    const end = Math.min(start + batchSize, total);
    it('reads displayed rows ' + start + '-' + (end - 1), () => {
      for (let i = start; i < end; i++) {
        expect(gridApi.isDestroyed()).toBe(false);
        expect(gridApi.getDisplayedRowCount()).toBe(rows.length);
      }
    });
  }
});
`,
    commandArgs: (file) => [
      'rstest',
      'run',
      '-c',
      join(process.cwd(), 'rstest.config.ts'),
      '--root',
      process.cwd(),
      '--include',
      file,
      '--testEnvironment',
      testEnvironment,
      '--globals',
      '--maxConcurrency',
      '4',
      '--hideSkippedTests'
    ]
  }
];

function createTempDir(): string {
  return mkdtempSync(join(process.cwd(), 'tests', 'rstest', 'tmp-ag-grid-count-'));
}

function createTestFile(dir: string, runner: Runner, count: number): string {
  const filePath = join(dir, `${runner.name}.ag-grid.count.test.tsx`);
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
  runner: Runner['name'];
  environment: typeof testEnvironment;
  count: number;
  durationMs: number;
};

async function runBenchmarks(): Promise<BenchmarkResult[]> {
  const tempDir = createTempDir();
  const results: BenchmarkResult[] = [];

  try {
    for (const runner of runners) {
      for (const count of testCounts) {
        const file = createTestFile(tempDir, runner, count);
        const relativeFile = relative(process.cwd(), file);
        const args = runner.commandArgs(relativeFile);
        const duration = await runCommand('npx', args, process.cwd());
        results.push({ runner: runner.name, environment: testEnvironment, count, durationMs: duration });
        console.log(`\n${runner.name} | ${testEnvironment} | ${count} tests -> ${(duration / 1000).toFixed(2)}s`);
      }
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }

  return results;
}

function printSummary(results: BenchmarkResult[]): void {
  console.log('\nSummary (ms):');
  for (const row of results.sort((a, b) => a.count - b.count || a.runner.localeCompare(b.runner))) {
    console.log(`${row.runner} | ${row.environment} | ${row.count} tests -> ${row.durationMs.toFixed(1)}ms`);
  }
}

function updateReadme(results: BenchmarkResult[]): void {
  const updates = results.map((row) => ({
    framework: row.runner,
    environment: row.environment,
    subject: 'ag-grid',
    testCount: row.count,
    runtimeSeconds: row.durationMs / 1000
  }));

  updateBenchmarkResultsInReadme(updates);
}

runBenchmarks()
  .then((results) => {
    updateReadme(results);
    printSummary(results);
  })
  .catch((error) => {
    console.error('Benchmark failed:', error);
    process.exitCode = 1;
  });
