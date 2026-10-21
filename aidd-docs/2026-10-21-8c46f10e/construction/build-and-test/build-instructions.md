# Build Instructions

## Prerequisites
- **Build tools**: Python 3.9 or later, pip, and the repository Makefile; Docker is needed only for the container image build.
- **Dependencies**: Declared in `pyproject.toml` and `docker/requirements.txt`. The repository's `.venv` is available in this workspace.
- **Environment variables**: `SECRET_KEY=1` is sufficient for local Django checks and tests. Tests use the project's test settings/configuration; no external database or service should be required.
- **System requirements**: A supported Python environment with enough disk space for Python dependencies. Container build additionally requires Docker and network access to fetch base images/dependencies.

## Build Steps

### 1. Install Dependencies
For a fresh environment, run `make pip` (uses Python 3.9 by default and installs editable project, dev/MySQL extras, and Docker requirements). Existing environments can use `.venv/bin/pip install -e '.[dev]'`.

### 2. Configure the Environment
Run Django commands with `SECRET_KEY=1`. The automated tests use the project's test harness and do not require a configured production database.

### 3. Build All Units
Run `SECRET_KEY=1 make check` for Django system/migration checks, the complete Django test suite, and Ruff lint/format checks. To build the deployable container, run `make build` where Docker is available.

### 4. Verify Build Success
- **Expected output**: Django checks report no issues, tests finish with zero failures/errors, and Ruff checks exit successfully.
- **Build artifacts**: The Docker image `promgen:local` is produced only by `make build`; `make check` does not create a release artifact.
- **Common warnings**: Existing dependency deprecation notices may appear. Review any test skips and warnings in context.

## Troubleshooting
- If `.venv/bin/promgen` or dependencies are missing, run `make pip`.
- If test settings require a secret key, prefix commands with `SECRET_KEY=1`.
- If the Docker build cannot fetch images or packages, verify Docker/network access; the application checks and tests can still run locally.
