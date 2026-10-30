# UOW-1 Design Amendment — Test a Temporary Notifier

## Request
Allow `POST /rest/v2/notifiers/0/test` to send the built-in test notification through a temporary notifier when the caller supplies its driver and destination.

## Existing Behavior and Findings
- `NotifierTestRequestSerializer` already defines `sender` and `value`, with help text identifying them as required for notifier ID 0.
- `NotifierViewSet` currently has two detail actions mapped to the same `test` URL. The established `sender-test` route points to `NotifierViewSet.test`, which only loads persisted notifiers. The other action constructs an unsaved `Sender`, but the duplicate route makes it an unreliable entry point and its failure response does not follow the current exception-message handling.
- `Sender.test()` can use an unsaved `Sender(sender=..., value=...)`; it reads no database state unless a related content object exists. The temporary notifier is not saved.

## Proposed Contract
- For a positive notifier ID, preserve the existing behavior: load the persisted notifier through `get_object()` so REST object authorization runs before sending. An empty request body remains valid.
- For notifier ID `0`, validate a JSON body containing `sender` and `value` with `NotifierTestRequestSerializer`, construct an unsaved `Sender`, and call the same synchronous `Sender.test()` method.
- The sender must be one of the installed notification driver choices; `value` is required and non-empty. No alias, owner, object relation, or alert payload is needed for this one-off send.
- Temporary tests require authentication but have no object-level permission target. They do not create or update database records.
- Both paths return HTTP 200 with the existing `{success, message}` shape for completed attempts. Preserve the current exception message redaction and traceback exclusion.
- Missing/invalid data for ID 0 returns the standard DRF validation response and does not send. Authentication failure does not send. Positive IDs retain existing permission and not-found behavior.
- Consolidate the two same-path actions into one action so the URL has a single, predictable implementation. Document in OpenAPI that the body is required for ID 0 and optional for persisted IDs.

## Implementation Plan
1. [x] Update the existing `NotifierTestRequestSerializer` schema/help and the single `NotifierViewSet.test` action to branch on ID 0, validate the request, and build a transient `Sender` without saving it.
2. [x] Remove the duplicate `test_notifier` action and preserve the established endpoint name and exception-message behavior.
3. [x] Update API coverage for temporary success, delivery failure, invalid/missing required fields, no persistence, and authentication; retain the persisted notifier permission/not-found coverage. Tests have not been run.
4. [x] Synchronize the API requirements/design docs and code-generation summary; record the approved contract and results in `audit.md`.

## Review Gate
Approved by the user (“approve”). Implementation and documentation updates are complete; Build and Test verification remains pending.

## Approval Checkpoint
- User approval recorded in `audit.md`.
- Build and Test verification remains pending; test execution is not recorded as complete.
