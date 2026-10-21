# Requirements — Test a Notifier API

## Intent Analysis
- **User Request**: Add an API for testing a configured notifier (Jira PROMGENDEV-276).
- **Request Type**: New feature / API enhancement.
- **Scope Estimate**: Single REST API component, integrated with the existing notifier model and delivery path.
- **Complexity Estimate**: Moderate. The implementation reuses an existing sample-send operation, while defining an explicit HTTP and result contract for a real external side effect.
- **Project Type**: Brownfield Promgen Django application.

## Context
Promgen already has `Sender.test()`, which prepares the built-in sample alert and calls the notification task synchronously. The UI exposes this operation through a permission-protected POST route. The REST v2 `NotifierViewSet` does not currently expose a test action.

## Functional Requirements

### FR-1: Test a notifier through REST v2
Expose a notifier detail action at `POST /rest/v2/notifiers/{id}/test`.

### FR-2: Use the configured destination and built-in sample
The endpoint must send the existing built-in sample alert using the selected notifier's configured driver and destination. It must not accept a caller-provided alert payload.

### FR-3: Perform the send attempt synchronously
The request must wait for the notification attempt to finish before returning its result. The endpoint should reuse the existing notifier test behavior (`Sender.test()` or an equivalent shared operation).

### FR-4: Return a stable result body
For a completed delivery attempt, return HTTP 200 whether delivery succeeds or fails. The response body must contain:

```json
{
  "success": true,
  "message": "Test notification sent."
}
```

`success` must be `false` when delivery fails. `message` must provide a human-readable result and, on failure, a safe error summary. The body must not expose stack traces or secrets. The API endpoint description must explain that HTTP 200 is used for both successful and failed delivery attempts and that clients should inspect `success`.

### FR-5: Enforce notifier edit permissions
Only callers with the existing edit-level object permission for the notifier's owning service or project may trigger the test. The endpoint must use Promgen's established authentication and object-level authorization behavior.

### FR-6: Handle request-level failures separately
The HTTP 200 rule applies to a completed notification attempt, including delivery failure. It does not convert request-level failures into successful test results: authentication/authorization failures and a missing notifier continue to use the established REST API error behavior and HTTP status codes. No notification should be sent when authorization fails or the notifier cannot be loaded.

## Non-Functional Requirements
- **Security**: Reuse existing REST authentication and object-level permissions. Do not return secrets or stack traces in the response.
- **Usability**: Document the always-200 delivery-result behavior in the API schema/endpoint description; clients distinguish outcomes using the `success` field.
- **Reliability**: A completed response accurately reflects whether the synchronous notifier delivery attempt succeeded or failed.
- **Operational constraints**: No additional rate limit, audit logging, or other operational constraint was requested.

## Acceptance Criteria
1. An authorized caller can POST to `/rest/v2/notifiers/{id}/test` without an alert payload and trigger the existing sample notification flow for that notifier.
2. On successful delivery, the API returns HTTP 200 with `success: true` and a human-readable message.
3. On delivery failure, the API returns HTTP 200 with `success: false` and a safe human-readable error summary.
4. The API endpoint description states that both delivery outcomes return HTTP 200 and clients must inspect `success`.
5. An unauthenticated or unauthorized caller cannot trigger delivery and receives the established REST authentication/permission error response.
6. A request for a nonexistent notifier does not trigger delivery and receives the established not-found response.
7. The response does not contain stack traces or secrets.

## Traceability
| Requirement | Source |
|---|---|
| FR-1 | User answer to Question 1; Jira title. |
| FR-2 | User answer to Question 2; existing `Sender.test()` behavior. |
| FR-3 | User answer to Question 3; existing synchronous test call path. |
| FR-4 | User's custom answer to Question 4 and answer to Follow-up Question 7. |
| FR-5 | User answer to Question 5; existing notifier edit/test authorization pattern. |
| FR-6 | Scope interpretation separating delivery outcome from request/authentication failures. |
| Operational constraints | User answer to Question 6: no additional constraints. |

## Assumptions to Confirm During Review
- “The test fails” means the notification delivery attempt fails. Missing notifier and authentication/authorization failures remain ordinary REST request errors.
- The `message` field is the API's human-readable test detail; provider-specific internals, stack traces, and secrets are not required in the response.
