# Integration Test Instructions

The exporter test endpoint tests exercise Django REST Framework routing, authentication/permissions, serializers, ORM-backed saved-exporter behavior, and mocked outbound scrape requests together in the application test client. The focused command is `SECRET_KEY=1 .venv/bin/promgen test promgen.tests.test_rest -v 2 --buffer`.

There are no additional services or independently deployed units in this feature, so separate cross-service integration scenarios are not applicable. The test runner creates and cleans up its test database automatically; no manual cleanup is needed.
