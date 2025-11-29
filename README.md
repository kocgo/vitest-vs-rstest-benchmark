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

> Note: If you want more realistic scaling behavior, duplicate the test cases or introduce more complex components while keeping the harnesses consistent.

## File map
- `src/components/Counter.tsx` and `src/components/Greeting.tsx`: shared UI for both suites.
- `tests/vitest/*`: Vitest specs.
- `tests/rstest/*`: RSTest specs using the Rspack runner.
- `vitest.config.ts`, `vitest.setup.ts`: Vitest configuration.
- `rstest.config.ts`, `rstest.setup.ts`: RSTest configuration tuned for React Testing Library.
- `scripts/benchmark.js`: sequential runner that reports elapsed time for each suite.
