# Business Rules — UOW-1

## Request and Authorization
1. The operation is `POST /rest/v2/notifiers/{id}/test` and accepts no alert payload.
2. Authentication and notifier lookup follow established REST behavior.
3. The caller must have the existing edit-level object permission for the notifier's owning service or project.
4. Authentication, authorization, or lookup failure ends the request before any notification is sent and preserves the normal REST error status/body.

## Delivery
5. The endpoint uses the existing built-in sample alert and the selected notifier's configured driver and destination.
6. The send attempt is synchronous; the request waits until the attempt returns or fails.
7. The sample test operation must not be treated as successful if preparation, driver loading, or provider delivery fails.

## Completed Result
8. A completed attempt returns HTTP 200 regardless of its delivery outcome.
9. Successful delivery returns `success: true` and a human-readable success message.
10. Failed delivery returns `success: false` and a human-readable failure message.
11. Failure text may include only a safely classified, user-actionable summary. If it cannot be classified safely, use a generic fallback.
12. Never return raw exception text, credentials, secrets, or stack traces. Log/diagnostic handling remains governed by existing server-side behavior and is outside the public response contract.
13. The API endpoint description states that both completed delivery outcomes return HTTP 200 and clients must inspect `success`.

## Outcome Boundary
- Delivery success/failure is represented by the HTTP 200 result body.
- Request-level authentication, authorization, and not-found conditions remain ordinary REST errors and are not represented as a completed delivery result.
- Any response other than the defined completed-attempt result must not claim that a notification was sent.

## Traceability
| Rule | Source |
|---|---|
| 1, 5, 6 | FR-1, FR-2, FR-3; US-1 AC-1 |
| 2–4 | FR-5, FR-6; US-1 AC-4 |
| 8–10 | FR-4; US-1 AC-2 and AC-3 |
| 11–12 | Approved FR-4 security constraint; US-1 AC-3 |
| 13 | FR-4; US-1 AC-5 |
