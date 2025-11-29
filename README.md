# Vitest vs RSTest benchmark

This repository provides a tiny React component surface area and two parallel test harnesses so you can compare how Vitest and the official Rspack Rstest runner behave as projects scale. Rstest is published as `@rstest/core` and documented at [rstest.rs](https://rstest.rs).

## What is included
- Shared React components in `src/components` used by both suites.
- Vitest setup in `vitest.config.ts` with tests in `tests/vitest`.
- RSTest setup in `rstest.config.ts` with tests in `tests/rstest`.
- A `scripts/benchmark.js` helper that runs both suites sequentially and prints their wall-clock timings.

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

## Latest benchmark results

Synthetic suite (`npm run bench:matrix`):

| Runner | Environment | Test count | Total runtime (s) |
| --- | --- | --- | --- |
| Vitest | jsdom | 100 | 5.57 |
| Vitest | jsdom | 1,000 | 6.10 |
| Vitest | jsdom | 10,000 | 29.67 |
| Vitest | node | 100 | 4.41 |
| Vitest | node | 1,000 | 5.27 |
| Vitest | node | 10,000 | 30.21 |
| Rstest | jsdom | 100 | 4.59 |
| Rstest | jsdom | 1,000 | 5.27 |
| Rstest | jsdom | 10,000 | 10.34 |
| Rstest | node | 100 | 2.53 |
| Rstest | node | 1,000 | 3.30 |
| Rstest | node | 10,000 | 8.94 |

ag-Grid suite:

- `npm run bench:ag-grid` (jsdom): Vitest **10.40s**, Rstest **10.35s**
- `npm run bench:ag-grid-dom`: jsdom — Vitest **10.34s**, Rstest **9.91s**; happy-dom — Vitest **9.59s**, Rstest **9.19s**

Count-focused ag-Grid run (`npm run bench:ag-grid-count`):

| Runner | 100 tests (s) | 1,000 tests (s) | 10,000 tests (s) |
| --- | --- | --- | --- |
| Vitest | 7.85 | 8.30 | 11.12 |
| Rstest | 12.33 | 12.88 | 17.44 |
