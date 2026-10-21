# Business Logic Model — UOW-1

## Notifier Test Flow

```mermaid
flowchart TD
  A[Receive POST /notifiers/{id}/test] --> B{Authenticated?}
  B -- No --> E1[Return standard authentication error]
  B -- Yes --> C{Notifier exists?}
  C -- No --> E2[Return standard not-found error]
  C -- Yes --> D{Caller has edit-level permission?}
  D -- No --> E3[Return standard authorization error]
  D -- Yes --> F[Build built-in sample alert]
  F --> G[Send synchronously via configured driver and destination]
  G --> H{Attempt completes successfully?}
  H -- Yes --> I[HTTP 200; success=true; success message]
  H -- No --> J[Classify failure safely]
  J --> K[HTTP 200; success=false; safe summary or generic fallback]
```

## Functional Inputs
- **Path input**: Notifier identifier.
- **Request body**: Empty; no caller-provided alert is accepted or used.
- **Context inputs**: Authenticated caller, notifier configuration and owner, existing sample alert definition, delivery driver/provider result.

## Functional Outputs
- **Completed delivery succeeds**: HTTP 200, `success: true`, human-readable success message.
- **Completed delivery fails**: HTTP 200, `success: false`, safely classified, human-readable failure summary or generic fallback.
- **Request cannot start**: Standard REST authentication, authorization, or not-found response. No delivery occurs.

## Domain Events / State
The operation does not create persistent domain state. It performs a synchronous external side effect and returns its outcome to the caller. It does not enqueue a follow-up operation or expose a task identifier.
