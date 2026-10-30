# Integration Test Instructions

## Scope
Promgen is a single Django application and UOW-1 adds no inter-service boundary. The REST API test suite verifies integration among routing, DRF viewset dispatch, object permissions, notifier model behavior, response serialization, and OpenAPI generation.

## Scenarios
- Authorized editor invokes the notifier test action and receives the success response.
- Delivery exception produces HTTP 200 and a safe failure body.
- Unauthenticated and unauthorized requests do not invoke the send method.
- Missing notifier returns not-found and does not invoke the send method.
- Generated schema documents the completed-delivery HTTP 200 result and `success` field.

## Environment and Command
Use the local Django test database and a development/test-only `SECRET_KEY`:
```sh
SECRET_KEY=local-test-key ./.venv/bin/promgen test promgen.tests.test_rest.NotifierTestAPITest --verbosity 2
```

The test suite mocks the delivery method, so no external provider setup is needed. Django creates and removes the test database automatically.
