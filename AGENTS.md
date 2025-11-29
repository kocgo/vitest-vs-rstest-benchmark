# AGENT Guidelines

This repository benchmarks Vitest vs Rstest across different environments and subjects.

## Scope
- This file applies to the entire repository.

## Working notes
- Benchmarks live under `benchmarks/`; each file represents a case defined by framework, environment, subject, and test count.
- Keep README.md as the single place to report benchmark results; do not recreate a separate results file.
- When adding benchmark cases or results, ensure the matrix remains complete and documented.
- Prefer TypeScript for benchmark definitions and keep naming consistent with existing cases (e.g., `framework-environment-subject-count.ts`).

## Process reminders
- Run relevant benchmark commands before updating results tables.
- Keep commit history clean and include a concise summary of changes and tests in PRs.
