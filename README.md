# Vitest vs RSTest benchmark

This repository provides a tiny React component surface area and two parallel test harnesses so you can compare how Vitest and the official Rspack Rstest runner behave as projects scale. Rstest is published as `@rstest/core` and documented at [rstest.rs](https://rstest.rs).

## What is included
- Shared React components in `src/components` used by both suites.
- Vitest setup in `vitest.config.ts` with tests in `tests/vitest`.
- RSTest setup in `rstest.config.ts` with tests in `tests/rstest`.
- A `scripts/benchmark.js` helper that runs both suites sequentially and prints their wall-clock timings.
- A TypeScript benchmark catalog in `benchmarks/` that enumerates every combination of runner, environment, subject, and test count.

## Getting started
1. Install dependencies (Node 18+ recommended):
   ```bash
   npm install
   ```
2. Run each suite individually:
   ```bash
   npm run test:vitest
   npm run test:rstest
   ```
3. Or run both suites back-to-back to capture simple timing numbers:
   ```bash
   npm run bench
   ```
4. Compare ag-grid performance across DOM environments:
   ```bash
   npm run bench:ag-grid-dom
   ```

> Note: If you want more realistic scaling behavior, duplicate the test cases or introduce more complex components while keeping the harnesses consistent.

## File map
- `src/components/Counter.tsx` and `src/components/Greeting.tsx`: shared UI for both suites.
- `tests/vitest/*`: Vitest specs.
- `tests/rstest/*`: RSTest specs using the Rspack runner.
- `vitest.config.ts`, `vitest.setup.ts`: Vitest configuration.
- `rstest.config.ts`, `rstest.setup.ts`: RSTest configuration tuned for React Testing Library.
- `scripts/benchmark.js`: sequential runner that reports elapsed time for each suite.
- `benchmarks/`: matrix of benchmark case definitions and a central `benchmarkCases` export.

## Benchmark case catalog
Benchmark definitions live in `benchmarks/cases`, one file per combination. Each file exports a `BenchmarkCase` that captures the runner, DOM environment, subject, test count, and a default concurrency of 5. `benchmarks/index.ts` aggregates the cases for any tooling that wants to load them programmatically.

## Latest benchmark results
All benchmark results now live in this README. Populate the runtime column as new measurements become available.

| Framework | Environment | Test subject | Test count | Concurrency | Runtime (s) |
| --- | --- | --- | --- | --- | --- |
| vitest | jsdom | pure function | 100 | 5 | 6.58 |
| vitest | jsdom | pure function | 1000 | 5 | 8.19 |
| vitest | jsdom | pure function | 10000 | 5 | 56.36 |
| vitest | jsdom | react component | 100 | 5 | — |
| vitest | jsdom | react component | 1000 | 5 | — |
| vitest | jsdom | react component | 10000 | 5 | — |
| vitest | jsdom | ag-grid | 100 | 5 | 5.96 |
| vitest | jsdom | ag-grid | 1000 | 5 | 3.46 |
| vitest | jsdom | ag-grid | 10000 | 5 | 7.16 |
| vitest | jsdom | ag-grid | 100000 | 5 | 19.72 |
| vitest | happydom | pure function | 100 | 5 | — |
| vitest | happydom | pure function | 1000 | 5 | — |
| vitest | happydom | pure function | 10000 | 5 | — |
| vitest | happydom | react component | 100 | 5 | — |
| vitest | happydom | react component | 1000 | 5 | — |
| vitest | happydom | react component | 10000 | 5 | — |
| vitest | happydom | ag-grid | 100 | 5 | — |
| vitest | happydom | ag-grid | 1000 | 5 | — |
| vitest | happydom | ag-grid | 10000 | 5 | — |
| vitest | happydom | ag-grid | 100000 | 5 | 6.63 |
| vitest | node | pure function | 100 | 5 | 5.55 |
| vitest | node | pure function | 1000 | 5 | 6.80 |
| vitest | node | pure function | 10000 | 5 | 55.26 |
| vitest | node | react component | 100 | 5 | — |
| vitest | node | react component | 1000 | 5 | — |
| vitest | node | react component | 10000 | 5 | — |
| vitest | node | ag-grid | 100 | 5 | — |
| vitest | node | ag-grid | 1000 | 5 | — |
| vitest | node | ag-grid | 10000 | 5 | — |
| rstest | jsdom | pure function | 100 | 5 | 6.02 |
| rstest | jsdom | pure function | 1000 | 5 | 7.06 |
| rstest | jsdom | pure function | 10000 | 5 | 13.96 |
| rstest | jsdom | react component | 100 | 5 | — |
| rstest | jsdom | react component | 1000 | 5 | — |
| rstest | jsdom | react component | 10000 | 5 | — |
| rstest | jsdom | ag-grid | 100 | 5 | 6.01 |
| rstest | jsdom | ag-grid | 1000 | 5 | 5.85 |
| rstest | jsdom | ag-grid | 10000 | 5 | 11.69 |
| rstest | jsdom | ag-grid | 100000 | 5 | 411.05 |
| rstest | happydom | pure function | 100 | 5 | — |
| rstest | happydom | pure function | 1000 | 5 | — |
| rstest | happydom | pure function | 10000 | 5 | — |
| rstest | happydom | react component | 100 | 5 | — |
| rstest | happydom | react component | 1000 | 5 | — |
| rstest | happydom | react component | 10000 | 5 | — |
| rstest | happydom | ag-grid | 100 | 5 | — |
| rstest | happydom | ag-grid | 1000 | 5 | — |
| rstest | happydom | ag-grid | 10000 | 5 | — |
| rstest | happydom | ag-grid | 100000 | 5 | 9.59 |
| rstest | node | pure function | 100 | 5 | 3.55 |
| rstest | node | pure function | 1000 | 5 | 4.39 |
| rstest | node | pure function | 10000 | 5 | 11.64 |
| rstest | node | react component | 100 | 5 | — |
| rstest | node | react component | 1000 | 5 | — |
| rstest | node | react component | 10000 | 5 | — |
| rstest | node | ag-grid | 100 | 5 | — |
| rstest | node | ag-grid | 1000 | 5 | — |
| rstest | node | ag-grid | 10000 | 5 | — |

> The populated numbers come from the synthetic pure-function matrix runner. Happy DOM and the React component/ag-grid variants still need dedicated harnesses before they can be benchmarked.

