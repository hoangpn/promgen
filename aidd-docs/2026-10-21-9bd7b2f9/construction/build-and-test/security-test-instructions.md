# Security Test Instructions

## UOW-1 Security Coverage
Run the focused API tests:
```sh
SECRET_KEY=local-test-key ./.venv/bin/promgen test promgen.tests.test_rest.NotifierTestAPITest --verbosity 2
```

Verify that:
- Unauthenticated callers receive the existing authentication error and do not trigger delivery.
- Authenticated callers without edit-level object permission receive the existing authorization error and do not trigger delivery.
- A missing notifier returns the standard not-found response and does not trigger delivery.
- A delivery exception containing sentinel secret text does not expose that text or a traceback in the response.

No separate penetration test or vulnerability scan is defined for this localized API change. Do not send test notifications to a live provider during automated verification.
