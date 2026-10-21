# Unit Test Instructions

## Commands
- Run the new endpoint tests: `SECRET_KEY=1 .venv/bin/promgen test promgen.tests.test_rest -v 2 --buffer`.
- Run the full project test suite: `SECRET_KEY=1 make promgen-test` (includes `collectstatic --noinput` and Django's test runner).
- Run all standard checks: `SECRET_KEY=1 make check` (Django checks, migrations check, full tests, Ruff lint, and Ruff format diff).

## Results and Coverage
Django prints the number of tests run and any failures/errors. No coverage threshold is configured in the repository, so coverage is not reported as a pass criterion.

## Failure Handling
Inspect the first failing test and traceback, reproduce with the focused command, fix the cause, then rerun the focused tests and full check target. Do not treat skipped tests as failures without inspecting the skip reason.
