## Purpose

This file gives focused, actionable guidance for AI coding agents working on the Income Tax Calculator project.

## Quick Setup
- Install: `npm install`
- Dev server: `npm run dev` (Vite — usually at http://localhost:5173)
- Build: `npm run build` (outputs `dist/`)
- Tests: `npm run test` or `npm run test:run` (Vitest)
- Lint: `npm run lint`

- Pre-commit: this repo uses `pre-commit` with hooks defined in `.pre-commit-config.yaml` (spellcheck, gitleaks, biome/knip, JSON/TOML/YAML checks). Install and run locally before committing.

  Install and run:
  ```bash
  pip install pre-commit        # or use your system package manager
  pre-commit install            # install git hook
  pre-commit run --all-files    # run all hooks locally
  ```

## Big-picture architecture
- Single-page React app (React 19 + Vite). Entry: `src/main.jsx`, top component: `src/App.jsx`.
- UI components live in `src/components/` (form, charts, comparison table).
- Core business logic (tax rules and calculations) is separated under `src/utils/` and `src/constants/`:
  - `src/utils/taxCalculator.js` — canonical source of tax logic (slabs, surcharge, cess, RSU handling, monthly breakdowns).
  - `src/constants/taxRules.js` — authoritative slabs, constants, deduction limits and time constants.

Why this matters: Changes to tax behaviour should almost always start in `taxRules.js` (policy) or `taxCalculator.js` (algorithms) and then be surfaced to the UI components.

## Key files and conventions
- `src/constants/taxRules.js`: slabs are arrays of `{ min, max, rate }`. `max` may be `Infinity`.
- `calculateTaxBySlabs(taxableIncome, slabs)` expects slab objects above; it iterates slabs in order and applies each slab only to income within the slab.
- `src/utils/taxCalculator.js` exposes named functions used by components and tests (e.g. `calculateAnnualSummary`, `calculateMonthlyBreakdown`, `calculateRSUDetails`). Prefer updating/adding functions here rather than duplicating logic in components.
- UI form component: `src/components/SalaryInputForm.jsx` — the single place that collects input shape expected by `taxCalculator` functions. Keep the input shape aligned with `salaryData` usage in `taxCalculator`.

## Project-specific patterns & gotchas
- RSU handling: RSUs are expected per-quarter and converted to INR when `rsuCurrency === "USD"` using `rsuExchangeRate`; withholding is applied (default 22%) before inclusion in gross/net salary. See `calculateRSUDetails` for exact calculations.
- HRA exemption: implemented in `calculateHRAExemption(hraReceived, basicSalary, rentPaid, isMetroCity)` and depends on `FORM_CONSTANTS.RENT_DEDUCTION_PERCENTAGE` and metro percentages. Tests assume this exact formula — keep changes backward-compatible or update tests.
- DTAA credit: tax credit logic is approximated by limiting US withholding credit to Indian tax on RSU portion; this is implemented in `calculateDTAACredit`. Modifying global DTAA behaviour requires coordinated updates to `taxCalculator` and tests.
- Slab boundaries: slabs use integer `min`/`max` values and `calculateTaxBySlabs` treats amounts above `slab.min` up to `slab.max` (note the implementation uses `slabUpperLimit = slab.max === Infinity ? taxableIncome : Math.min(slab.max, taxableIncome)`). Review tests in `src/test/` when changing slab logic.

## Tests & CI
- Tests are in `src/test/` and use Vitest. Run `npm run test:run` for CI-style execution.
- Existing tests exercise both financial edge cases and unit-level math in `taxCalculator.js`. Update or add tests whenever tax logic changes.

- Pre-commit hooks: The repository's `.pre-commit-config.yaml` runs several checks including `gitleaks`, `codespell`, `biome` formatting, and a local `knip` hook that executes `npx knip`. Ensure Node and Python environments are available when running hooks in CI or locally.

  If CI fails on pre-commit hooks, run the same commands locally (`pre-commit run --all-files`) and fix reported issues (spelling, secrets, formatting, unused deps) before pushing.

## Developer workflow notes
- To change tax policy (slabs, limits, standard deductions): update `src/constants/taxRules.js`, then run tests and spot-check UI.
- To change calculation logic (rounding, distribution, RSU handling): update `src/utils/taxCalculator.js` and add unit tests under `src/test/` that mirror the existing style.
- Keep UI components stateless with respect to tax calculations — components should call exported calculator functions and render results.

## Searchable examples (use these to anchor edits)
- HRA logic: `src/utils/taxCalculator.js` — `calculateHRAExemption`
- RSU logic: `src/utils/taxCalculator.js` — `calculateRSUDetails`
- Slabs/constants: `src/constants/taxRules.js`
- Tests demonstrating expected outputs: `src/test/taxCalculator.test.js`

## When to ask the human
- Any change to tax policy (slabs, deduction limits) — confirm effective FY and acceptance criteria.
- Changes that alter rounding or distribution of monthly tax — these affect user-facing numbers and require sign-off.

If anything important is missing or unclear, tell me which area you want expanded and I'll iterate.
