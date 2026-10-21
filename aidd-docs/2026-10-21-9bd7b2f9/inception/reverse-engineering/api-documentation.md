# API Documentation

## REST APIs
### REST v2 Notifiers
- **Method**: GET, PATCH, PUT, DELETE on item routes; GET on collection route; POST/DELETE filter actions.
- **Path**: `/rest/v2/notifiers` and `/rest/v2/notifiers/{id}` (router configured without trailing slashes).
- **Purpose**: List, update, delete, and manage filters for notification destinations.
- **Request**: `NotifierSerializer` fields for reads; update serializer permits `enabled` updates. Filter creation accepts `name` and `value`.
- **Response**: Paginated list and serialized notifier records; filter creation returns notifier representation.
- **Authorization**: Knox token or session authentication; object-level permissions through `PromgenGuardianRestPermission`.

### Existing notifier test UI route
- **Method**: POST.
- **Path**: `/notifier/{id}/test`.
- **Purpose**: Send a sample alert through a configured notifier.
- **Request**: Form POST; optional `next` URL.
- **Response**: Redirect plus success/error flash message.
- **Authorization**: Service/project admin or editor permissions.

### REST v2 notifier test action
- **Method**: POST.
- **Path**: `/rest/v2/notifiers/{id}/test` (router configured without trailing slashes).
- **Purpose**: Send the existing sample alert synchronously through a persisted notifier or a temporary destination supplied for ID `0`.
- **Request**: For saved notifier IDs, the request body is ignored and the persisted notifier's driver and destination are used. For ID `0`, provide `{ "sender": "<installed driver>", "value": "<destination>" }` to test a temporary notifier; both fields are required.
- **Response**: HTTP 200 for completed delivery attempts, with `{ "success": boolean, "message": string }`. Success returns `Test notification sent.`; delivery failure includes the exception message after redacting common credential assignments. Stack traces are excluded. OpenAPI documents that request-body fields apply only to ID `0` and are ignored for saved notifier IDs, along with the HTTP 200 result.
- **Authorization**: Existing edit-level object permission for persisted notifiers. ID `0` requires authentication but has no object permission target. Authentication, permission, not-found, and validation errors retain standard REST behavior and do not send a test notification.

## Internal APIs
### `models.Sender.test()`
- **Parameters**: None.
- **Behavior**: Loads `promgen/tests/examples/alertmanager.json`, adjusts labels based on the owning object when available, then invokes `tasks.send_alert(sender, value, data)`.
- **Return Type**: No explicit return value; dispatch errors may be raised to the caller.

### `rest_v2.NotifierViewSet`
- **Methods**: DRF list/update/partial update/destroy; `add_filter`; `delete_filter`; `test` (POST detail action, calls `Sender.test()` and serializes the delivery result).
- **Authorization**: Guardian REST permission; list queryset is limited to accessible projects/services and the current user's own notifier.

## Data Models
### `Sender` (Notifier)
- **Fields**: `sender` driver module path; `value` destination; `alias`; generic owner object (`content_type`, `object_id`); `owner`; `enabled`.
- **Relationships**: Generic foreign key to user, project, or service; one-to-many `Filter` records.
- **Validation**: `save()` invokes `full_clean()`; email drivers validate destination as an email.

### `Filter`
- **Fields**: `sender`, `name`, `value`.
- **Relationships**: Belongs to a notifier.
- **Validation**: Unique per notifier/name/value tuple.
