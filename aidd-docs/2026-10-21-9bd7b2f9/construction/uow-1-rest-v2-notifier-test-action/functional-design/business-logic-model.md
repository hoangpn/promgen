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
  H -- No --> J[Redact common credential assignments from exception message]
  J --> K[HTTP 200; success=false; exception detail without traceback]
```

## Functional Inputs
- **Path input**: Notifier identifier.
- **Request body**: Empty for a persisted notifier. For ID `0`, `sender` and `value` configure a temporary in-memory notifier; no caller-provided alert is accepted or used.
- **Context inputs**: Authenticated caller; either a persisted notifier and owner or temporary sender/destination configuration; existing sample alert definition; delivery driver/provider result.

## Functional Outputs
- **Completed delivery succeeds**: HTTP 200, `success: true`, human-readable success message.
- **Completed delivery fails**: HTTP 200, `success: false`, human-readable exception message with common credential assignments redacted and no traceback.
- **Request cannot start**: Standard REST authentication, authorization, not-found, or temporary-configuration validation response. No delivery occurs.

## Domain Events / State
The operation does not create persistent domain state. It performs a synchronous external side effect and returns its outcome to the caller. It does not enqueue a follow-up operation or expose a task identifier.
