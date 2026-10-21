# User Stories — Test a Notifier API

## US-1: Test a configured notifier

**As an** API integrator or Promgen administrator/editor authorized to edit the notifier's owning service or project,
**I want** to trigger a synchronous test notification through the notifier's configured destination,
**so that** I can verify its delivery and understand the result without sending a custom alert.

### Acceptance Criteria

1. **Authorized test**
   - Given an authenticated caller with the established edit-level object permission for the notifier's owning service or project, when the caller sends `POST /rest/v2/notifiers/{id}/test` without an alert payload, then Promgen sends its built-in sample alert synchronously through the selected notifier's configured driver and destination.
   - The request does not accept or use a caller-provided alert payload.

2. **Successful delivery**
   - Given the delivery attempt completes successfully, when the endpoint responds, then it returns HTTP 200 with `success: true` and a human-readable message.

3. **Failed delivery**
   - Given the delivery attempt completes with a failure, when the endpoint responds, then it returns HTTP 200 with `success: false` and a safe, human-readable failure summary.
   - The response contains no secrets or stack traces.

4. **Request-level errors**
   - Given the caller is unauthenticated or lacks the required permission, or the notifier does not exist, when the request is made, then Promgen returns the established REST authentication, authorization, or not-found response and does not send a notification.

5. **Documented result contract**
   - The endpoint description states that completed delivery attempts return HTTP 200 for both success and failure and that clients must inspect `success` to determine the delivery outcome.

### Requirement Traceability
| Criteria | Requirements |
|---|---|
| 1 | FR-1, FR-2, FR-3, FR-5; AC-1 |
| 2 | FR-4; AC-2 |
| 3 | FR-4; AC-3, AC-7 |
| 4 | FR-6; AC-5, AC-6 |
| 5 | FR-4; AC-4 |

### INVEST Review
- **Independent**: Delivers one coherent notifier-testing outcome.
- **Negotiable**: Describes the user outcome and observable contract without prescribing internal implementation beyond the approved reuse of the sample flow.
- **Valuable**: Lets authorized callers verify a configured notification destination through the API.
- **Estimable**: Scope is limited to one REST v2 notifier action and its result behavior.
- **Small**: Covers one endpoint and one cohesive user goal.
- **Testable**: Each criterion describes observable HTTP behavior, permission behavior, or delivery result.

## Persona Mapping
| Persona | Story |
|---|---|
| API Integrator | US-1 |
| Promgen Administrator or Service/Project Editor | US-1 |
