# Code Structure

## Build System
- **Type**: Python setuptools using `pyproject.toml`.
- **Configuration**: `pyproject.toml`, `Dockerfile`, `docker-compose.yml`, and GitHub Actions under `.github/workflows/`.

## Key Modules
- `promgen/models.py` — Django domain models; `Sender` represents notifier configuration and exposes `test()` to enqueue a sample alert.
- `promgen/rest_v2.py` — DRF v2 viewsets; `NotifierViewSet` exposes notifier list/update/delete and filter actions.
- `promgen/serializers.py` — API serialization, including notifier serializers.
- `promgen/urls.py` — UI, legacy REST, REST v2, proxy, and configuration routes.
- `promgen/views.py` — UI and legacy view behavior; `NotifierTest` is an existing POST UI handler.
- `promgen/tasks.py` — Asynchronous alert dispatch and related tasks.
- `promgen/notification/` — Notification driver interface and provider implementations.
- `promgen/permissions.py` — Permission policies and accessible-object queries.
- `promgen/tests/` — Django tests and JSON/CSV fixtures.

## Existing Files Inventory (feature-adjacent)
- `promgen/models.py` — Sender model, `Sender.test()` loads sample Alertmanager data and calls `tasks.send_alert`.
- `promgen/rest_v2.py` — `NotifierViewSet`; currently no test action in the inspected class.
- `promgen/serializers.py` — `NotifierSerializer` and `UpdateNotifierSerializer`.
- `promgen/urls.py` — registers v2 notifiers at `/rest/v2/notifiers`; legacy UI route `/notifier/<id>/test`.
- `promgen/views.py` — `NotifierTest` handles POST and redirects with success/error flash messages.
- `promgen/tests/cases/test_rest_notifier.csv` — REST v2 notifier permission/list/filter cases.
- `promgen/tests/test_rest.py` — API test harness and endpoint tests.
- `promgen/tests/notification/` — notification driver tests.

## Design Patterns
### Django model/view/serializer separation
- **Location**: `promgen/models.py`, `promgen/rest_v2.py`, `promgen/serializers.py`.
- **Purpose**: Separate persistence, request handling, and API representation.
- **Implementation**: DRF viewsets select serializers by action and use shared model querysets.
### Plugin registry
- **Location**: `promgen/plugins.py`, `pyproject.toml`, `promgen/notification/`.
- **Purpose**: Allow notification providers to be discovered as extensions.
- **Implementation**: Python package entry points register driver implementations.

## Critical Dependencies
- **Django** — pinned to 4.2.26; web framework and ORM.
- **Django REST Framework** — API routing, authentication, serialization, and viewsets.
- **django-guardian** — object-level authorization.
- **Celery** — task dispatch for alert notification delivery.
- **drf-spectacular** — OpenAPI schema generation for REST APIs.
