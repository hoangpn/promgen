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

### Potential REST test endpoint (not yet specified)
- **Method/Path/Request/Response**: Not defined in Jira. Existing API conventions suggest a detail action under `/rest/v2/notifiers/{id}/...`, but the path and contract require confirmation.

## Internal APIs
### `models.Sender.test()`
- **Parameters**: None.
- **Behavior**: Loads `promgen/tests/examples/alertmanager.json`, adjusts labels based on the owning object when available, then invokes `tasks.send_alert(sender, value, data)`.
- **Return Type**: No explicit return value; dispatch errors may be raised to the caller.

### `rest_v2.NotifierViewSet`
- **Methods**: DRF list/update/partial update/destroy; `add_filter`; `delete_filter`.
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
