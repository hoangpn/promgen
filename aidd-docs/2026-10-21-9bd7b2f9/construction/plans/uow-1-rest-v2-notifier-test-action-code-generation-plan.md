# UOW-1 Code Generation Plan

## Unit Context
- **Unit**: UOW-1 — REST v2 Notifier Test Action.
- **Project**: Brownfield Python/Django monolith; application code belongs at the workspace root.
- **Story**: US-1, covering the authorized synchronous sample send and observable outcome.
- **Dependencies**: Existing `Sender.test()`, `promgen.tasks.send_alert`, Guardian REST object permissions, DRF routing, and drf-spectacular schema generation.
- **Owned data**: No database entities or schema changes. The unit owns only the REST action and transient result contract.
- **External contract**: `POST /rest/v2/notifiers/{id}/test`, no request payload, `{success: boolean, message: string}` for completed delivery attempts.

## Target Files
- `promgen/rest_v2.py` — add the detail action, authorization-aware object lookup, synchronous send invocation, safe outcome mapping, and endpoint schema description.
- `promgen/serializers.py` — add a small response serializer for `success` and `message` to document the result contract.
- `promgen/tests/test_rest.py` — add REST API coverage using the existing test harness and mocks; avoid live provider calls.
- No changes planned for `promgen/models.py`, `promgen/urls.py`, migrations, configuration, dependencies, or deployment files. The existing router registers viewset detail actions automatically.

## Generation Steps
1. [x] Confirm the target files and current `NotifierViewSet`, serializer, and test conventions. Story mapping: US-1 AC-1, AC-4.
2. [x] Add a response serializer with required boolean `success` and string `message`. Story mapping: US-1 AC-2, AC-3.
3. [x] Add the `POST` notifier detail action and schema description; call `get_object()` before delivery so the established object permission check runs. Story mapping: US-1 AC-1, AC-4, AC-5.
4. [x] Call `Sender.test()` synchronously and return HTTP 200 for successful and failed delivery attempts. Use fixed, safely classified messages with a generic fallback; never interpolate raw exception text. Story mapping: US-1 AC-1, AC-2, AC-3.
5. [x] Add API tests for successful delivery, failed delivery with sensitive exception content excluded, unauthorized/unauthenticated access, nonexistent notifier, no caller payload, and schema description. Mock the send path so no external notification is sent. Story mapping: US-1 AC-1 through AC-5.
6. [x] Review the final diff for scope, response safety, permission ordering, route naming, and absence of duplicate files or unrelated changes.
7. [x] Write a concise implementation summary to `construction/uow-1-rest-v2-notifier-test-action/code/code-generation-summary.md` and mark US-1 implemented after the feature and focused coverage are in place.

## Business Logic and Safety Constraints
- No notification occurs before notifier lookup and edit-level object authorization succeed.
- The request body is ignored/rejected according to existing DRF conventions; no custom alert data is used.
- Delivery success/failure both return HTTP 200 with `success` and `message`.
- Request-level authentication, authorization, and not-found failures use established REST behavior.
- Failure messages use fixed safe categories/generic fallback. Raw exception text, secrets, and stack traces are never returned.
- No persistence, new dependency, retry, queue, rate limit, or infrastructure artifact is added.

## Story Traceability
| Story | Acceptance criteria covered | Plan steps |
|---|---|---|
| US-1 | AC-1 authorized synchronous sample, no caller alert | 1, 3, 4, 5 |
| US-1 | AC-2 success result | 2, 4, 5 |
| US-1 | AC-3 failure result and safe message | 2, 4, 5 |
| US-1 | AC-4 auth/permission/not-found behavior without delivery | 1, 3, 5 |
| US-1 | AC-5 documented always-200 contract | 3, 5 |

## Execution Notes
- This plan is the single source of truth for Code Generation.
- No UI, repository, database migration, or deployment-artifact step applies.
- Test execution is deferred to the approved Build and Test stage.
