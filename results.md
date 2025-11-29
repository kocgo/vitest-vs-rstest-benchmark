# Benchmark results

## Synthetic suite (npm run bench:matrix)

Each run generates temporary suites with 100, 1,000, and 10,000 trivial assertions for both Vitest and Rstest across `jsdom` and `node` environments. Runtimes come from the latest benchmark run and are rounded to two decimals.

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

## ag-Grid component suite

### Full suite timings (npm run bench:ag-grid)

| Runner | Environment | Total runtime (s) |
| --- | --- | --- |
| Vitest | jsdom | 10.40 |
| Rstest | jsdom | 10.35 |

### Environment comparison (npm run bench:ag-grid-dom)

| Runner | Environment | Total runtime (s) |
| --- | --- | --- |
| Vitest | jsdom | 10.34 |
| Vitest | happy-dom | 9.59 |
| Rstest | jsdom | 9.91 |
| Rstest | happy-dom | 9.19 |

### Count-focused run (npm run bench:ag-grid-count)

The count-focused ag-Grid benchmark spins up a single SalesGrid instance and runs 100, 1,000, and 10,000 lightweight assertions against it to compare runner overhead while keeping the component in play.

| Runner | 100 tests (s) | 1,000 tests (s) | 10,000 tests (s) |
| --- | --- | --- | --- |
| Vitest | 7.85 | 8.30 | 11.12 |
| Rstest | 12.33 | 12.88 | 17.44 |
