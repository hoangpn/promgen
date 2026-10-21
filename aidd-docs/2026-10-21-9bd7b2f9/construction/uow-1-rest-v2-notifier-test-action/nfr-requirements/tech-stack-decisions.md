# Technology Stack Decisions — UOW-1

## Decision
Reuse the existing Promgen technology stack. No new language, framework, runtime package, storage layer, queue, or infrastructure component is required.

## Relevant Existing Stack
| Concern | Existing technology | Decision |
|---|---|---|
| API application | Python and Django | Continue within the existing Django application. |
| REST interface | Django REST Framework | Implement the action using existing REST v2 viewset patterns. |
| Object permissions | django-guardian and Promgen permission helpers | Reuse established authentication and object-level edit permissions. |
| Notification execution | Existing Celery task integration and notification plugins | Reuse the synchronous `Sender.test()` path and configured driver. |
| API schema | drf-spectacular | Describe the action's request, result body, and always-200 delivery outcome using existing schema tooling. |
| Persistence | Existing relational database and Django models | No schema or data model change. |

## Rationale
- The requirement is a localized API capability in the current monolith.
- Existing components already provide notifier configuration, sample construction, synchronous sending, permissions, routing, and schema generation.
- No new NFR target or technical constraint justifies a dependency or architecture change.

## Constraints for Implementation
- Preserve the existing provider timeout and deployment configuration.
- Do not make the operation asynchronous or add a queue/status resource.
- Keep response failure details safe and stable; do not return raw exception content.
