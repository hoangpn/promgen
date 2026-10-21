# Saved Notifier Request Body Implementation Plan

> **For agentic workers:** Implement this plan task-by-task in the current workspace. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lock down and document that request-body values are ignored when testing a persisted notifier; `sender` and `value` configure only ID `0`.

**Architecture:** Preserve `NotifierViewSet.test()` behavior. Add a focused API regression test proving a body with conflicting notifier configuration cannot replace the persisted `Sender`, then update the OpenAPI description and API documentation.

**Tech Stack:** Django REST Framework, `unittest.mock`, drf-spectacular OpenAPI schema, Markdown.

---

## Files

- Modify `promgen/tests/test_rest.py`: add the persisted-notifier request-body regression test and assert the generated OpenAPI description is explicit.
- Modify `promgen/rest_v2.py`: clarify the existing detail action description; no runtime logic changes.
- Modify `aidd-docs/2026-10-21-9bd7b2f9/inception/reverse-engineering/api-documentation.md` and the five synchronized requirements/design documents: document that request-body values are ignored for saved IDs and used only for ID `0`.

## Task 1: Add the regression test

**Files:** `promgen/tests/test_rest.py`

- [x] Add `test_saved_notifier_ignores_request_body_configuration` to `NotifierTestAPITest`:

```python
    @mock.patch.object(models.Sender, "test", autospec=True)
    def test_saved_notifier_ignores_request_body_configuration(self, send_test):
        response = self.client.post(
            self.url,
            {"sender": "unknown.driver", "value": "caller@example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["success"], True)
        send_test.assert_called_once_with(self.notifier)
        self.assertEqual(self.notifier.sender, "promgen.notification.email")
        self.assertEqual(self.notifier.value, "notifier-test@example.com")
```

- [x] Run `SECRET_KEY=local-test-key ./.venv/bin/promgen test promgen.tests.test_rest.NotifierTestAPITest.test_saved_notifier_ignores_request_body_configuration --verbosity 2`; it passed. The current implementation already ignores `request.data` on the persisted-ID branch, so this characterization test guards against future regressions.

## Task 2: Clarify the OpenAPI description

**Files:** `promgen/rest_v2.py`, `promgen/tests/test_rest.py`

- [x] Update the `NotifierViewSet.test` description to state request-body fields are ignored for existing notifier IDs.
- [x] Extend `test_openapi_describes_both_delivery_outcomes_as_http_200` to assert the schema description says request-body fields are ignored.
- [x] Run the focused OpenAPI schema test; it passed and describes both request modes.

## Task 3: Update API documentation and verify the focused class

**Files:** `aidd-docs/2026-10-21-9bd7b2f9/inception/reverse-engineering/api-documentation.md`

- [x] Clarify in API, requirements, application design, and functional design documents that supplied body fields are ignored for saved IDs and `sender` plus `value` are used only for ID `0`.
- [x] Run `SECRET_KEY=local-test-key ./.venv/bin/promgen test promgen.tests.test_rest.NotifierTestAPITest --verbosity 1`; all 12 tests passed, including saved/temporary notifier behavior, permissions, and schema coverage.
- [x] Run `git diff --check` and inspect the changed-file list; no unrelated tracked files are included.

## TDD Note

The runtime behavior already conforms to the approved design. The first test therefore characterizes current behavior and should pass on the current implementation; no production logic change is planned unless execution reveals that the inspected behavior is incorrect. If it does, stop and revise the plan rather than silently changing runtime semantics.

## Documentation Sync

The user selected Sync all for five documents found during the aidd-docs-sync dry run. All five now state that saved notifier body fields are ignored and persisted configuration is used. A spot check of `inception/requirements/requirements.md` confirmed the minimal FR-2 clarification; no TODO comments were needed.
