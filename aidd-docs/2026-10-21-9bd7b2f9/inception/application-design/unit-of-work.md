# Unit of Work

## UOW-1: REST v2 Notifier Test Action

- **Owning application**: Existing Promgen Django monolith.
- **Mapped story**: US-1 — Test a configured notifier.
- **Goal**: Add a permission-protected synchronous REST v2 action that sends the built-in sample through the notifier's configured driver and target, then reports the delivery outcome safely.
- **Scope**:
  - Add `POST /rest/v2/notifiers/{id}/test` to `NotifierViewSet`.
  - Reuse `Sender.test()` and the existing synchronous `send_alert` path.
  - Apply existing edit-level object permission behavior before sending.
  - Return HTTP 200 with boolean `success` and human-readable `message` for completed delivery attempts, with safe failure details.
  - Preserve standard REST authentication, authorization, and not-found behavior.
  - Document the response semantics in the API schema.
  - Add focused automated coverage for delivery outcomes, authorization, not-found, and schema behavior.
- **Out of scope**: Caller-provided alert payloads, schema/database changes, new delivery drivers, asynchronous status endpoints, rate limiting, infrastructure changes, and new audit/monitoring behavior.
- **Completion conditions**: US-1 acceptance criteria are met; the public API contract matches `unit-interfaces.md`; no secrets or stack traces are returned.

## Unit Boundary
This is one logical unit in the existing application, not an independently deployable service. The unit owns the endpoint behavior and response contract; it uses existing notifier records, permission policy, task dispatch, and notification drivers without changing their data ownership.
