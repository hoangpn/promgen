# Component Methods — Test a Notifier

## REST API: `NotifierViewSet`

### `test(request, id) -> Response`
- **Purpose**: Execute the sample test for one notifier and return the delivery outcome.
- **Inputs**: Authenticated DRF request; notifier identifier resolved by the viewset. No alert payload is accepted.
- **Output**: HTTP 200 with `TestNotifierResult` after a completed delivery attempt.
- **Request-level errors**: Existing REST behavior for unauthenticated, unauthorized, and missing-notifier requests; these occur before delivery.
- **Permission behavior**: Retrieve the detail object through DRF's normal object lookup so `PromgenGuardianRestPermission.has_object_permission()` applies to the POST action.

## Notifier Model: `Sender`

### `test() -> None`
- **Purpose**: Build the existing built-in sample alert, adapt its labels to the notifier's owning object when supported, and invoke `promgen.tasks.send_alert` with the configured sender and target.
- **Input**: None; reads the sender, target, and content object from the model instance.
- **Output**: No result value; successful completion means the synchronous send path returned. Delivery exceptions propagate.

## Notification Integration

### `send_alert(sender: str, target: str, data: dict) -> None`
- **Purpose**: Load the selected notification driver and send the alert data to the target.
- **Output**: No result value; driver/plugin and provider exceptions propagate to the synchronous caller.

## API Result Type

### `TestNotifierResult`
- `success: bool` — whether the completed delivery attempt succeeded.
- `message: str` — human-readable result; failure details must be safe and omit secrets and stack traces.

The exact message wording remains an implementation detail. The public result fields and status behavior are fixed by the approved requirements.
