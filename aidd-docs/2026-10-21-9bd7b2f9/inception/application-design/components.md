# Application Components — Test a Notifier

## Scope
The change adds a REST v2 action inside the existing Promgen Django application. It does not introduce a new deployable component, database entity, or external integration.

## Components

### Notifier REST API (`promgen.rest_v2.NotifierViewSet`)
- **Purpose**: Expose operations on notifier records through REST v2.
- **Responsibilities for US-1**: Resolve the notifier detail resource, rely on the existing Guardian REST object-permission policy for unsafe methods, call the notifier's existing sample-test operation synchronously, convert delivery completion into a stable HTTP 200 result, and describe that contract in the API schema.
- **Interface**: `POST /rest/v2/notifiers/{id}/test`; request body is empty; result contains `success: boolean` and `message: string`.

### Notifier Model (`promgen.models.Sender`)
- **Purpose**: Represent a configured notification destination and driver.
- **Responsibilities for US-1**: Provide the selected notifier's configured driver and destination to the established test operation; build the existing sample alert through `Sender.test()`.
- **Interface**: Existing synchronous `Sender.test() -> None`; delivery exceptions propagate to the caller for result handling.

### Notification Task and Driver Integration (`promgen.tasks.send_alert`, `promgen.notification`)
- **Purpose**: Invoke a selected notification driver for a target and alert data.
- **Responsibilities for US-1**: Deliver the sample alert to the configured target; propagate exceptions from plugin loading or delivery.
- **Interface**: Existing `send_alert(sender, target, data)` call path, invoked synchronously by `Sender.test()`.

### Permission Policy (`promgen.permissions.PromgenGuardianRestPermission`)
- **Purpose**: Apply authentication and object-level permissions to REST v2 viewsets.
- **Responsibilities for US-1**: Require an authenticated user and an edit-level permission on the notifier's owning project or service before the action runs.
- **Interface**: Existing DRF permission hooks; the detail action must load the notifier and use the normal object-permission check.

### API Result Schema
- **Purpose**: Describe the result payload for API clients and generated schema.
- **Responsibilities for US-1**: Define the boolean `success` and human-readable `message` fields, and state that completed delivery attempts return HTTP 200 for both outcomes.
- **Interface**: Response schema associated with the detail action; no caller-supplied alert request schema.

## Component Boundary Decision
Keep orchestration in `NotifierViewSet` and use `Sender.test()` as the shared sample-send operation. No new service boundary is warranted for one synchronous action in the existing monolith.
