# Domain Entities — UOW-1

## Existing Domain Entity: Notifier (`Sender`)
- **Identity**: Existing notifier identifier used in the REST path.
- **Relevant attributes**: Configured driver, destination, and owning service/project.
- **Role in this operation**: Supplies the configuration and owner used for permission checks and sample delivery.
- **Persistence change**: None.

## Existing Actor: Authenticated Caller
- **Identity**: User established by the existing REST authentication mechanism.
- **Relevant relationship**: Must hold the established edit-level object permission for the notifier's owning service or project.
- **Role**: Requests the test operation.

## Value Object: Test Notifier Result
| Field | Type | Meaning |
|---|---|---|
| `success` | Boolean | Whether the completed sample delivery succeeded. |
| `message` | String | Human-readable success message or safely classified failure summary with generic fallback. |

The result is transient and returned in the HTTP response; it is not persisted. It excludes raw exception text, secrets, and stack traces.

## External Concept: Delivery Attempt
- **Inputs**: Built-in sample alert, notifier driver, and configured destination.
- **Outcome**: Completed success or failure from the synchronous driver path.
- **Persistence change**: None introduced by this feature.

## Relationships
- A caller requests a test for one notifier.
- The notifier belongs to an owning service or project whose edit-level permission governs the action.
- A permitted test creates one synchronous delivery attempt using the built-in sample.
- The attempt maps to one transient `Test Notifier Result` returned to the caller.
