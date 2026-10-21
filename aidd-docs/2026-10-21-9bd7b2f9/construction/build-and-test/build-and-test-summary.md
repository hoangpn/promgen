# Build and Test Summary

## Build Status
- **Build tool**: Django management command (`promgen`)
- **Build status**: Passed configuration checks; full suite did not pass
- **Build artifacts**: None required for this feature
- **Build time**: Full suite completed in 20.2 seconds on the recorded run

## Validation Results
- `SECRET_KEY=local-test-key ./.venv/bin/promgen check`: passed (exit 0); emitted three existing `promgen.W002` warnings because `/etc/prometheus` is not writable in this environment.
- `SECRET_KEY=local-test-key ./.venv/bin/promgen makemigrations --check`: passed (exit 0); no model changes detected; same `/etc/prometheus` warnings.
- `ruff check promgen`: passed.
- `ruff format --check promgen`: passed (81 files already formatted).
- Focused UOW-1 API tests: passed, 6/6 during Code Generation verification.

## Test Execution Summary

### Full Project Suite
- **Total tests**: 91
- **Passed**: 86
- **Failed**: 2
- **Errors**: 1
- **Skipped**: 2
- **Status**: Fail


### Triage follow-up (2026-10-21)
- Re-ran the three failing tests together and reran `WebTests.test_routes` alone; the failures reproduced.
- Both rule-output tests produce the same reversed rule order: the database/model order returns `Site Rule` before `example-rule`, while their expected YAML fixtures put `example-rule` first. `Rule.Meta.ordering` is `content_type`, `object_id`, `name`; this is an ordering expectation mismatch, not a notifier-path failure.
- The route error occurs while evaluating the nested `Rule.objects.filter(...)` queryset in `HostDetail.get()` (`promgen/views.py:278`). SQLite rejects the generated query with `parser stack overflow`; the failure is specific to the SQLite test database path and occurs outside the notifier endpoint.
- These findings establish that the known suite failures do not exercise UOW-1, but they do not establish whether the stale ordering assertions should be changed or whether host-detail should be made SQLite-compatible. Both fixes would extend scope beyond the approved notifier UOW and need a separate implementation decision.
- Metric instrumentation continued to log SQLite table-lock warnings during the route test; requests otherwise completed through the host-detail request that triggered the parser error.

### Integration and Security Coverage
- **UOW-1 integration scenarios**: 6 focused API tests passed; delivery is mocked, with no live provider contact.
- **Security cases**: authentication, object permission, not-found handling, and safe failure body are covered by the focused tests.
- **Performance, contract, and E2E tests**: N/A for this localized change.

## Overall Status
- **Django checks and Ruff**: Pass
- **Full project tests**: Fail (2 failures, 1 error, 2 skipped)
- **UOW-1 focused API tests**: Pass (6/6)
- **Ready for Operations**: No; the full suite failures need triage before the phase can be considered clear.

## Next Steps
User selected option C in `construction/plans/build-and-test-follow-up-questions.md`: accept the three unrelated failures as baseline for this run and stop before Operations. No application code or tests were changed during triage. The notifier API change itself passed its focused tests; the full suite remains failing.
