# Saved Notifier Test Request Body — Design

## Goal

Make the API contract explicit and regression-tested: testing a persisted notifier always uses that saved notifier's driver and destination. Request-body fields must not alter the persisted notifier test. The `sender` and `value` fields configure a temporary notifier only when the path ID is `0`.

## Current Behavior

`NotifierViewSet.test()` branches on the path ID. For ID `0`, it validates `request.data` and constructs an unsaved `Sender`. For any other ID, it calls `get_object()` and tests that persisted object without reading request data. The implementation already follows the requested behavior; the gap is explicit regression coverage and API documentation.

## Design

- Preserve the existing saved-notifier behavior and permissions.
- Add an API test that posts `sender` and `value` values that differ from the saved notifier, then verifies `Sender.test()` is called on the persisted notifier with its configured driver and destination.
- Clarify the endpoint description and API documentation: `sender` and `value` are used only for ID `0`; fields in a request body are ignored for saved notifier IDs.
- Keep the existing HTTP response and error behavior unchanged.

## Alternatives Considered

1. **Keep behavior and document/test it (selected):** minimal, preserves compatibility, and protects against accidental use of caller-supplied configuration.
2. **Reject nonempty bodies for saved notifier IDs:** stricter but changes the existing API behavior without being needed to prevent overrides.
3. **No changes:** runtime behavior is already correct, but the contract would remain less explicit and lack a direct regression test.

## Verification

- Run `promgen.tests.test_rest.NotifierTestAPITest` and confirm both saved and temporary notifier cases pass.
- Inspect generated OpenAPI text to confirm it states that request-body fields apply only to ID `0` and are ignored for saved IDs.

## Scope

No changes to notifier delivery, persistence, authorization, endpoint paths, or response schemas are planned.
