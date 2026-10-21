# Technology Stack

## Programming Languages
- Python — runtime requirement `>=3.9`; Django application and tests.
- HTML/CSS/JavaScript — Django-rendered interface assets/templates.

## Frameworks
- Django 4.2.26 — web framework and ORM.
- Django REST Framework — REST APIs.
- django-guardian — object-level permissions.
- Celery — asynchronous tasks.

## Infrastructure
- Docker / docker-compose — packaging and local/demo deployment.
- Prometheus and Alertmanager — monitoring and alerting systems integrated by Promgen.

## Build Tools
- setuptools with `pyproject.toml` — package metadata and dependency declarations.
- GitHub Actions — CI workflows.

## Testing Tools
- Django test framework / unittest — unit and integration tests.
- Ruff — lint and formatting configuration in `pyproject.toml`.
- Sphinx — documentation build workflow.
