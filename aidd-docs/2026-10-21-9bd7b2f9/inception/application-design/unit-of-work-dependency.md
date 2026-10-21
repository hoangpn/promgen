# Unit of Work Dependencies

## Dependency Matrix
| Unit | Depends on | Dependency type | Reason |
|---|---|---|---|
| UOW-1: REST v2 Notifier Test Action | Existing `NotifierViewSet` and REST router | In-process / routing | Expose the detail action at the documented REST v2 path. |
| UOW-1: REST v2 Notifier Test Action | Existing `Sender` model and `Sender.test()` | In-process method call | Load configured notifier and perform the built-in sample test. |
| UOW-1: REST v2 Notifier Test Action | Existing Guardian REST permission policy | In-process policy hook | Enforce authenticated edit-level access to the notifier's owning service or project. |
| UOW-1: REST v2 Notifier Test Action | Existing `send_alert` and notification plugins | Synchronous call / provider I/O | Deliver the sample and surface the completed attempt result. |
| UOW-1: REST v2 Notifier Test Action | Existing API schema tooling | Schema generation | Publish the result shape and always-200 delivery semantics. |
| UOW-1: REST v2 Notifier Test Action | Existing Promgen test package | Test-time dependency | Verify the endpoint contract and permission/error boundaries. |

## Ordering and Coordination
There is one unit and no unit-to-unit ordering. Within UOW-1, resolve the notifier and permission before delivery; then invoke the established sample path; finally translate its completion into the API result and schema.

## External Dependency
The configured notification provider is an external runtime dependency. The action waits synchronously for its attempt; tests should isolate it with controlled test doubles.
