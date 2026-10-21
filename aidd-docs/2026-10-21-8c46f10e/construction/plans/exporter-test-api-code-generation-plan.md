# Code Generation Plan — `exporter-test-api`

## Plan Status

Approved on 2026-10-21. This is the single source of truth for implementation order and scope.

## Unit Context

- **Unit**: `exporter-test-api`, one feature unit in the existing Promgen Django application.
- **Story**: US-1, “Test an Exporter and Inspect Per-Host Outcomes.”
- **Story coverage**: Scenarios 1–14, covering saved and temporary modes, hosts/limits, authorization, outcomes, status semantics, missing exporters, scrape bounds, and the empty-farm case.
- **Dependencies**: DRF authentication, existing permission helpers, `Exporter`/`Project`/`Farm`/`Host` ORM models, Django settings, `promgen.util.scrape`, Prometheus exposition parsing, and `drf-spectacular`.
- **External interface**: `POST /rest/v2/exporters/{exporter_id}/test`.
- **Persistence ownership**: No new database entities. Saved models are read-only; temporary configuration and results are not persisted.
- **Service boundary**: Extend `ExporterViewSet` orchestration. No new service class, queue, infrastructure, or frontend is required.

## Code Placement

This is a brownfield change. Modify existing files in place; do not create duplicate variants.

| Path | Planned change |
|---|---|
| `promgen/settings.py` | Define `PROMGEN_EXPORTER_TEST_MAX_HOSTS` from the existing environment/settings convention, default 50. Preserve `PROMGEN_EXPORTER_SCRAPE_TIMEOUT` (default 25). |
| `promgen/serializers.py` | Add request/result serializers and host validation for host syntax, URL-authority safety, mode-specific required fields, non-empty temporary targets, and configured count bounds. |
| `promgen/rest_v2.py` | Add the detail POST action to `ExporterViewSet`; implement saved/temporary mode orchestration, explicit saved permission check, default target resolution, bounded scrape execution, redirects disabled, timeout use, sanitized per-host result aggregation, and OpenAPI annotations. |
| `promgen/tests/test_rest.py` | Add endpoint-level API coverage consistent with existing DRF test patterns, including authentication/permissions, saved/temporary inputs, host boundaries, scrape outcomes, timeout/redirect behavior, and non-mutation. |

No URL registration change is planned: `promgen/urls.py` already registers the v2 exporter viewset. No model, migration, deployment, README, frontend, or dependency changes are planned.

## Numbered Generation Steps

1. [x] **Add host-limit configuration** — Update `promgen/settings.py` with configurable `PROMGEN_EXPORTER_TEST_MAX_HOSTS`, default 50; retain and use the existing scrape timeout setting. Story US-1 scenarios 2–7 and 13.
2. [x] **Implement request and response validation types** — Update `promgen/serializers.py` with temporary/saved request validation, authority-safe host parsing, host count enforcement, and stable per-host/aggregate response serialization. Reject invalid or over-limit input before scheduling outbound calls. Story US-1 scenarios 3–7 and 14.
3. [x] **Implement the v2 exporter test action** — Update `promgen/rest_v2.py` to add `POST /rest/v2/exporters/{id}/test`; enforce authentication and the saved project/service viewer/editor/admin permission policy; branch ID `0` without object-level checks; load saved configuration without mutation; resolve and bound targets; reject empty/oversized implicit farm selection; and return pre-execution 4xx errors. Story US-1 scenarios 1–7, 10, 12, and 14.
4. [x] **Implement bounded scrape execution and outcomes** — In the action and existing scrape utility boundary, use at most 20 workers; pass the configured timeout to each HTTP request; disable redirects explicitly; parse exposition data; isolate host errors; sanitize error detail; preserve selected-host result identity/order; and set aggregate success only if all selected hosts succeed. Return HTTP 200 after execution starts. Story US-1 scenarios 8, 9, and 13.
5. [x] **Document the API contract in OpenAPI** — Add `drf-spectacular` annotations in `promgen/rest_v2.py` for saved and temporary request modes, authentication/authorization, configurable host maximum, result schema, pre-execution errors, and HTTP 200 completion semantics. Story US-1 scenario 11 and all response scenarios.
6. [x] **Add endpoint verification coverage** — Update `promgen/tests/test_rest.py` using existing test conventions. Cover all 14 scenarios, including no outbound calls on pre-execution errors, redirects not followed, configured timeout passed to requests, no more than 20 active scrapes, sanitized errors, per-host/aggregate results, and no database writes. Story US-1 scenarios 1–14.
7. [x] **Review implementation against the approved contract** — Inspected modified files for saved-config non-mutation, mode-specific authorization, target count checks before network activity, no private/loopback filtering, response/schema alignment, and no unrelated infrastructure or model changes. Story US-1 scenarios 1–14.
8. [x] **Write the Code Generation summary** — Recorded changed files and story coverage under `aidd-docs/<session>/construction/exporter-test-api/code/`.

## Execution Constraints

- Execute steps in order and keep this plan as the implementation scope of record.
- Do not change the approved functional contract or add endpoint-specific rate limiting, telemetry, persistence, dependency, or infrastructure.
- Do not run tests during Code Generation; the approved Build and Test stage handles test execution.
- Never place application code under `aidd-docs/`.
