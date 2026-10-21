# Unit of Work — `exporter-scrape-reuse`

## Unit UOW-1: Shared Exporter Scrape Processing

### Goal
Remove duplicate per-target scrape execution and Prometheus metric parsing from `ExporterScrape` and `ExporterViewSet.test` while preserving both existing contracts.

### Responsibilities
- Add an internal shared processor that calls `promgen.util.scrape`, parses Prometheus exposition text, and returns the original response with metric-family and sample counts.
- Adapt the legacy view and v2 test action to call the same processor.
- Keep caller-owned policies at their current boundaries: authorization, config and host selection, URL formatting, request options, concurrency, timeout/deadline handling, status acceptance, exception translation, sanitization, ordering, and response serialization.
- Add or adjust focused tests for the shared primitive and both endpoint contracts.

### In Scope
- Shared internal application code in the existing `promgen` package.
- `promgen/views.py::ExporterScrape` and `promgen/rest_v2.py::ExporterViewSet.test` integrations.
- Focused regression tests demonstrating both call sites use the shared implementation and preserve behavior.

### Out of Scope
- New endpoints, public service interfaces, authentication or permission changes, host selection changes, output changes, configuration, persistence, migrations, dependencies, infrastructure, and unrelated cleanup.
- Normalizing endpoint differences. In particular, preserve legacy `raise_for_status()` behavior versus the API's 2xx-only success rule.

### Acceptance Criteria
1. Both entry points delegate common request execution and metric parsing/counting to one shared implementation.
2. Legacy URL construction, request defaults, permissions, farm target selection, timeout semantics, errors, and URL-keyed response remain unchanged.
3. API saved/temporary modes, validation and host cap, permissions, IPv6 URL formatting, disabled redirects, remaining timeout, sanitized ordered per-host results, aggregation, and HTTP status remain unchanged.
4. Each entry point retains its current 20-worker bound and its existing timeout/deadline behavior.
5. Tests cover the helper and both callers' compatibility behavior.
6. No unrelated application behavior or public contract changes.

### Traceability
Implements requirements FR-1 through FR-5 and acceptance criteria 1 through 6 in `inception/requirements/exporter-scrape-reuse-requirements.md`.
