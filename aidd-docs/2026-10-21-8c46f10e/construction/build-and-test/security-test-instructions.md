# Security Test Instructions

The endpoint test suite covers authentication, saved-exporter authorization, temporary-mode access, request validation, redirect handling, and sanitized error results. Run the focused suite with `SECRET_KEY=1 .venv/bin/promgen test promgen.tests.test_rest -v 2 --buffer`.

No separate vulnerability scanner or penetration-test configuration is present in the repository. No new external dependencies were introduced by this change.
