# Service and Orchestration Design — Test a Notifier

## Orchestration
No separate application service is introduced. The REST viewset coordinates the request using existing components:

1. DRF authenticates the request and resolves the notifier detail object.
2. The existing object permission policy checks the caller's edit-level permission for the owning project or service. Failure ends the request before delivery.
3. For a persisted notifier, the action invokes `Sender.test()` synchronously with no request body. For notifier ID 0, it validates `sender` and `value`, builds an unsaved Sender, and invokes the same sample operation.
4. `Sender.test()` builds the built-in sample and calls `promgen.tasks.send_alert` with the notifier's configured driver and target.
5. A normal return produces HTTP 200 with `success: true` and a human-readable message.
6. A delivery exception is caught at the API boundary and produces HTTP 200 with `success: false` and a safe human-readable summary. The summary must not include exception text unless it has been safely reduced; it must not include credentials, secrets, or a traceback.
7. The endpoint schema documents that clients inspect `success` because both completed delivery outcomes use HTTP 200.

## Failure Boundaries
- Authentication, permission, and object lookup failures remain standard REST errors and do not enter delivery orchestration.
- Exceptions raised during sample preparation, plugin loading, or delivery are delivery-attempt failures when the attempt was initiated; convert them to the stable result body.
- Do not swallow process-level failures outside the expected delivery exception boundary.

## External Effects
The action makes a synchronous call to an existing notification driver, which may contact an external provider. No new queue, retry policy, persistence, audit event, rate limit, or monitoring behavior is introduced by this design.
