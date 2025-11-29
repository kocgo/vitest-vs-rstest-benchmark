# Benchmark results

The synthetic benchmark script (`npm run bench:matrix`) generates temporary suites with 100, 1,000, and 10,000 trivial assertions for both Vitest and Rstest across `jsdom` and `node` environments. Runtimes are taken from the latest run and rounded to two decimals. "Build/overhead" represents total runtime minus the runner-reported test execution time.

| Runner | Environment | Test count | Build/overhead (s) | Test runtime (s) | Total runtime (s) |
| --- | --- | --- | --- | --- | --- |
| Vitest | jsdom | 100 | 3.48 | 0.02 | 3.50 |
| Vitest | jsdom | 1,000 | 3.65 | 0.15 | 3.80 |
| Vitest | jsdom | 10,000 | 30.95 | 0.79 | 31.74 |
| Vitest | node | 100 | 2.75 | 0.02 | 2.77 |
| Vitest | node | 1,000 | 2.96 | 0.22 | 3.18 |
| Vitest | node | 10,000 | 28.61 | 0.82 | 29.43 |
| Rstest | jsdom | 100 | 1.83 | 1.00 | 2.83 |
| Rstest | jsdom | 1,000 | 1.54 | 1.71 | 3.25 |
| Rstest | jsdom | 10,000 | 1.49 | 4.60 | 6.09 |
| Rstest | node | 100 | 1.24 | 0.31 | 1.55 |
| Rstest | node | 1,000 | 1.27 | 0.66 | 1.93 |
| Rstest | node | 10,000 | 1.29 | 4.08 | 5.37 |

## ag-Grid component suite

The count-focused ag-Grid benchmark (`npm run bench:ag-grid-count`) spins up a single SalesGrid instance and runs 100, 1,000, and 10,000 lightweight assertions against it to compare runner overhead while keeping the component in play.

| Runner | 100 tests (s) | 1,000 tests (s) | 10,000 tests (s) |
| --- | --- | --- | --- |
| Vitest | 4.51 | 4.92 | 6.77 |
| Rstest | 8.04 | 8.23 | 10.96 |
