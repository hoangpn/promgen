# Business Rules — UOW-1

## Request and Authorization
1. The operation is `POST /rest/v2/notifiers/{id}/test`; it never accepts a caller-provided alert payload.
2. For a persisted notifier ID, the request body is optional and authentication, notifier lookup, and object permission follow established REST behavior.
3. The caller must have the existing edit-level object permission for a persisted notifier's owning service or project.
4. For ID `0`, the caller must provide an installed `sender` driver and non-empty `value`; the endpoint constructs an unsaved notifier and requires authentication but has no object-level permission target.
5. Authentication, authorization, lookup, or temporary-configuration validation failure ends the request before delivery and preserves the normal REST error status/body.

## Delivery
6. The endpoint uses the existing built-in sample alert and the selected notifier's configured driver and destination.
7. The send attempt is synchronous; the request waits until the attempt returns or fails.
8. The sample test operation must not be treated as successful if preparation, driver loading, or provider delivery fails.

## Completed Result
9. A completed attempt returns HTTP 200 regardless of its delivery outcome.
10. Successful delivery returns `success: true` and a human-readable success message.
11. Failed delivery returns `success: false` and a human-readable failure message.
12. Failure text includes the exception message to help diagnose delivery failures; common credential assignments (token, password, secret, API key, and authorization) are redacted before returning it.
13. Never return a stack trace. Server-side log/diagnostic handling remains governed by existing behavior and is outside the public response contract.
14. The API endpoint description states that both completed delivery outcomes return HTTP 200 and clients must inspect `success`.

## Outcome Boundary
- Delivery success/failure is represented by the HTTP 200 result body.
- Request-level authentication, authorization, not-found, and temporary-configuration validation conditions remain ordinary REST errors and are not represented as a completed delivery result.
- Any response other than the defined completed-attempt result must not claim that a notification was sent.

## Traceability
| Rule | Source |
|---|---|
| 1, 2, 6, 7 | FR-1, FR-2, FR-3; US-1 AC-1 |
| 3–5 | FR-5, FR-6, FR-7; US-1 AC-4 and AC-9 |
| 9–11 | FR-4; US-1 AC-2 and AC-3 |
| 12–13 | Approved FR-4 security constraint; US-1 AC-3 |
| 14 | FR-4; US-1 AC-5 |
