# Build Instructions

## Prerequisites
- **Build tools**: Python 3.9+; project virtual environment at `.venv`; Django management entry point `.venv/bin/promgen`; Ruff available on PATH or installed in the environment.
- **Dependencies**: Project dependencies from `pyproject.toml`; see `make pip` for the repository's install target.
- **Environment variables**: `SECRET_KEY` must be set for Django settings. Use a development/test-only value locally; never reuse a production secret in a test environment.
- **System requirements**: A supported Python environment and the configured test database backend. No new system dependency is introduced by UOW-1.

## Build and Validation Steps

### 1. Install Dependencies
```sh
make pip
```

### 2. Configure the Environment
Set a development/test-only `SECRET_KEY` in the local shell or test environment. Promgen's other settings may be supplied through the environment according to `promgen/settings.py`.

### 3. Run Django Checks
```sh
SECRET_KEY=local-test-key ./.venv/bin/promgen check
SECRET_KEY=local-test-key ./.venv/bin/promgen makemigrations --check
```

### 4. Run Static Checks
```sh
ruff check promgen
ruff format --check promgen
```

### 5. Verify Build Success
- **Expected output**: Django checks and Ruff report no errors; migration check reports no model changes; tests report `OK`.
- **Build artifacts**: No generated runtime artifact is required for this feature.
- **Common warnings**: In restricted local environments, `promgen.W002` may report that `/etc/prometheus` is not writable. Test instrumentation may also report SQLite metric-write lock warnings; determine success from command exit status and test result summary.

## Troubleshooting
- If Django reports a missing `SECRET_KEY`, set a temporary development/test value before invoking the command.
- If dependencies are missing, install the project requirements using the repository's documented `make pip` target.
- If Prometheus directory warnings appear, they concern local filesystem configuration; they are not part of the notifier API change.
