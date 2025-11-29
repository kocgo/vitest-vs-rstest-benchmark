# Benchmark results

The synthetic benchmark script (`npm run bench:matrix`) generates temporary suites with 100, 1,000, and 10,000 trivial assertions for both Vitest and Rstest across `jsdom` and `node` environments. Runtimes are taken from the latest run and rounded to two decimals. "Build/overhead" represents total runtime minus the runner-reported test execution time.

| Runner | Environment | Test count | Build/overhead (s) | Test runtime (s) | Total runtime (s) |
| --- | --- | --- | --- | --- | --- |
| Vitest | jsdom | 100 | 1.89 | 0.01 | 1.90 |
| Vitest | jsdom | 1,000 | 2.06 | 0.10 | 2.15 |
| Vitest | jsdom | 10,000 | 10.86 | 0.52 | 11.39 |
| Vitest | node | 100 | 1.49 | 0.01 | 1.50 |
| Vitest | node | 1,000 | 1.57 | 0.11 | 1.68 |
| Vitest | node | 10,000 | 10.65 | 0.59 | 11.25 |
| Rstest | jsdom | 100 | 1.03 | 0.97 | 1.99 |
| Rstest | jsdom | 1,000 | 1.04 | 1.22 | 2.26 |
| Rstest | jsdom | 10,000 | 1.08 | 3.42 | 4.50 |
| Rstest | node | 100 | 0.91 | 0.24 | 1.15 |
| Rstest | node | 1,000 | 0.92 | 0.54 | 1.46 |
| Rstest | node | 10,000 | 0.94 | 2.88 | 3.82 |

## ag-Grid component suite

Targeted runs against the ag-Grid-heavy SalesGrid component using `npm run bench:ag-grid` measured the following totals:

| Runner | Tests executed | Total runtime (s) |
| --- | --- | --- |
| Vitest | `tests/vitest/ag-grid.test.tsx` | 5.21 |
| Rstest | `tests/rstest/ag-grid.test.tsx` plus dependent fixtures | 8.18 |
