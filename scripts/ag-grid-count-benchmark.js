import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';

const testCounts = [100, 1_000, 10_000];

const runners = [
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

  for (let i = 0; i < ${count}; i++) {
    it('reads displayed rows ' + i, () => {
      expect(gridApi.isDestroyed()).toBe(false);
      expect(gridApi.getDisplayedRowCount()).toBe(rows.length);
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
      'jsdom',
      '--reporter',
      'basic',
      '--silent',
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

  for (let i = 0; i < ${count}; i++) {
    it('reads displayed rows ' + i, () => {
      expect(gridApi.isDestroyed()).toBe(false);
      expect(gridApi.getDisplayedRowCount()).toBe(rows.length);
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
      'jsdom',
      '--globals',
      '--hideSkippedTests'
    ]
  }
];

function createTempDir() {
  return mkdtempSync(join(process.cwd(), 'tests', 'rstest', 'tmp-ag-grid-count-'));
}

function createTestFile(dir, runner, count) {
  const filePath = join(dir, `${runner.name}.ag-grid.count.test.tsx`);
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

async function runBenchmarks() {
  const tempDir = createTempDir();
  const results = [];

  try {
    for (const runner of runners) {
      for (const count of testCounts) {
        const file = createTestFile(tempDir, runner, count);
        const relativeFile = relative(process.cwd(), file);
        const args = runner.commandArgs(relativeFile);
        const duration = await runCommand('npx', args, process.cwd());
        results.push({ runner: runner.name, count, durationMs: duration });
        console.log(`\n${runner.name} | ${count} tests -> ${(duration / 1000).toFixed(2)}s`);
      }
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }

  return results;
}

function printSummary(results) {
  console.log('\nSummary (ms):');
  for (const row of results.sort((a, b) => a.count - b.count || a.runner.localeCompare(b.runner))) {
    console.log(`${row.runner} | ${row.count} tests -> ${row.durationMs.toFixed(1)}ms`);
  }
}

runBenchmarks().then(printSummary).catch((error) => {
  console.error('Benchmark failed:', error);
  process.exitCode = 1;
});
