import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type BenchmarkUpdate = {
  framework: string;
  environment: string;
  subject: string;
  testCount: number | string;
  runtimeSeconds: number;
};

const SUBJECT_LABELS: Record<string, string> = {
  'pure-function': 'pure function',
  'react-component': 'react component',
  'ag-grid': 'ag-grid'
};

function getReadmePath() {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return join(currentDir, '..', 'README.md');
}

function normalizeEnvironment(environment: string): string {
  return environment === 'happy-dom' ? 'happydom' : environment;
}

function normalizeSubject(subject: string): string {
  return SUBJECT_LABELS[subject] ?? subject;
}

function buildUpdateKey({ framework, environment, subject, testCount }: BenchmarkUpdate): string {
  return [framework, environment, subject, String(testCount)].join('|');
}

export function updateBenchmarkResultsInReadme(updates: BenchmarkUpdate[]): boolean {
  const readmePath = getReadmePath();
  const content = readFileSync(readmePath, 'utf8');
  const lines = content.split('\n');

  const tableHeaderIndex = lines.findIndex((line) => line.trim().startsWith('| Framework |'));
  if (tableHeaderIndex === -1) {
    console.warn('README benchmark table not found; skipping update.');
    return false;
  }

  let tableEndIndex = lines.findIndex((line, index) => index > tableHeaderIndex && !line.trim().startsWith('|'));
  if (tableEndIndex === -1) {
    tableEndIndex = lines.length;
  }

  const normalizedUpdates: BenchmarkUpdate[] = updates.map((update) => ({
    framework: update.framework,
    environment: normalizeEnvironment(update.environment),
    subject: normalizeSubject(update.subject),
    testCount: update.testCount,
    runtimeSeconds: Number(update.runtimeSeconds)
  }));

  const updateMap = new Map(normalizedUpdates.map((update) => [buildUpdateKey(update), update]));
  let changed = false;

  for (let index = tableHeaderIndex + 2; index < tableEndIndex; index += 1) {
    const cells = lines[index].split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length !== 6) {
      continue;
    }

    const key = buildUpdateKey({
      framework: cells[0],
      environment: cells[1],
      subject: cells[2],
      testCount: cells[3],
      runtimeSeconds: Number.NaN
    });

    const update = updateMap.get(key);
    if (!update) {
      continue;
    }

    const runtime = Number.isFinite(update.runtimeSeconds)
      ? update.runtimeSeconds.toFixed(2)
      : String(update.runtimeSeconds);

    cells[5] = runtime;
    lines[index] = `| ${cells.join(' | ')} |`;
    changed = true;
  }

  if (changed) {
    writeFileSync(readmePath, lines.join('\n'), 'utf8');
    console.log('README benchmark table updated.');
  }

  return changed;
}
