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

The count-focused ag-Grid benchmark (`npm run bench:ag-grid-count`) spins up a single SalesGrid instance and runs 100, 1,000, and 10,000 lightweight assertions against it to compare runner overhead while keeping the component in play.

| Runner | 100 tests (s) | 1,000 tests (s) | 10,000 tests (s) |
| --- | --- | --- | --- |
| Vitest | 7.17 | 7.78 | 11.46 |
| Rstest | 13.67 | 14.52 | 19.48 |
