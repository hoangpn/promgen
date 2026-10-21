# Unit Test Instructions

## Run the UOW-1 API Tests
```sh
SECRET_KEY=local-test-key ./.venv/bin/promgen test promgen.tests.test_rest.NotifierTestAPITest --verbosity 2
```

The tests use Django's test client and mock `Sender.test()` so they do not contact a real notification provider. They cover authorized success, safe delivery failure, unauthenticated and unauthorized access, missing notifier, and the OpenAPI result description.

## Run All Project Tests
```sh
SECRET_KEY=local-test-key ./.venv/bin/promgen test --verbosity 2 --buffer
```

## Results and Coverage
- Check the command exit status and final `Ran ... tests` / `OK` or failure summary.
- No project-wide coverage target is configured in this workflow; report coverage only if collected by a separately configured tool.
- If a failure occurs, reproduce the failing test, inspect its traceback and related logs, fix the cause, and rerun the targeted test followed by the full suite.
