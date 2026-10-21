# Build and Test Summary — `exporter-test-api`

## Build Status
- **Build tool**: Django management commands and the repository Makefile.
- **Build status**: Django system checks and migration checks completed. `collectstatic` completed with its output redirected to `/private/tmp/promgen-static`.
- **Build artifacts**: 191 static files copied and 545 post-processed. No Docker image was built.
- **Warnings**: Django reported three existing `promgen.W002` warnings because `/etc/prometheus` is not writable in this environment.

## Test Execution Summary

### Unit and API Tests
- **Focused REST module**: 37 tests passed, 0 failures/errors.
- **Full project suite**: 100 tests run; 2 failed, 1 errored, and 2 skipped (95 passed).
- **Coverage**: No project coverage threshold is configured.
- **Status**: Fail.

The full suite has two failures outside the changed endpoint: `promgen.tests.test_alert_rules.RuleTest.test_write_new` and `promgen.tests.test_renderers.RendererTests.test_global_rule`, both involving rule ordering. `promgen.tests.test_web.WebTests.test_routes` errored on `/host/example.com` with SQLite `OperationalError: parser stack overflow`. These three outcomes reproduced when those tests were run in isolation; they were not verified against the pre-change revision.

### Integration Tests
- The endpoint tests exercise routing, authentication/authorization, serializers, ORM reads, and mocked scrape calls together. No separate cross-service integration suite applies.
- **Status**: Endpoint coverage passed; separate suite N/A.

### Performance Tests
- **Status**: Structural checks passed in endpoint tests for the 20-worker cap and configured timeout. No load benchmark or agreed throughput target exists.

### Additional Tests
- **Contract tests**: N/A (no separate service contract suite).
- **Security tests**: Endpoint authentication, authorization, validation, redirect, and error-sanitization tests passed within the focused REST module.
- **E2E tests**: N/A (no UI or external service workflow for this unit).
- **Ruff**: `ruff check promgen` passed; `ruff format --diff promgen` reported all 81 files already formatted.
- **Migration check**: `makemigrations --check` reported no changes.

## Overall Status
- **Build**: Django checks and static collection succeeded, with the warnings above.
- **All tests**: Fail because the full suite has 2 failures and 1 error.
- **Ready for Operations**: No.

## Next Steps
Investigate the rule-order assumptions and SQLite parser-stack failure before marking the repository-wide suite green or proceeding to deployment planning.
