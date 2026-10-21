# Stage 6: Application Design — Completion Summary

## Key Decisions
- Keep the feature within the existing Django application; do not add a new service boundary.
- Add the REST v2 detail action to `NotifierViewSet` and reuse `Sender.test()` and `send_alert` for synchronous sample delivery.
- Apply existing Guardian REST object permissions to the notifier detail object before delivery.
- Return a stable `{success, message}` result for completed delivery attempts; keep authentication, authorization, and not-found errors on the standard REST path.
- Document safe failure summaries and the always-200 delivery result in the API schema.

## Generated Deliverables
| File | Overview |
|---|---|
| `inception/application-design/components.md` | Component responsibilities and boundary decision. |
| `inception/application-design/component-methods.md` | REST action, model/task interfaces, and result type. |
| `inception/application-design/services.md` | Synchronous orchestration and failure boundaries. |
| `inception/application-design/component-dependency.md` | Dependency matrix and request/data flow. |
| `inception/plans/application-design-plan.md` | Approved design approach and completed checklist. |

## Handoff Items for the Next Stage
- Decompose US-1 into implementation unit(s) using the existing REST viewset, notifier model/task path, permission policy, schema, and tests.
- Treat the API action as the public boundary; no inter-service boundary or separate deployable unit is needed.
- Preserve the difference between delivery exceptions and request-level REST errors.

## Numeric Summary
- 5 existing logical components/interfaces reused or affected.
- 1 REST action and 1 response result type specified.
