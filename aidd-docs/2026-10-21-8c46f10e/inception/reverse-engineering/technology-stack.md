# Technology Stack

## Programming Languages
- Python - project requires Python >=3.9; application and tests.
- JavaScript, HTML, CSS - browser UI assets and templates.

## Frameworks
- Django 4.2.26 - web framework and ORM.
- Django REST Framework - REST endpoints.
- drf-spectacular - API schema generation.
- Celery - background task processing.

## Infrastructure
- Docker and Docker Compose - packaging and local stack.
- Relational database and broker - selected through runtime configuration.

## Build Tools
- setuptools via `pyproject.toml`; Make; Docker.

## Testing Tools
- Django test framework; `unittest-xml-reporting` as optional dev dependency; Ruff and Codespell configuration in `pyproject.toml`.
