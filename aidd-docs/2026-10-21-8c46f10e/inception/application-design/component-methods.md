# Component Methods — PROMGENDEV-275

The signatures below describe the proposed design boundary. Names may be adjusted during Functional Design while preserving the approved API contract.

## Exporter v2 API

### `ExporterViewSet.test(self, request, id: str) -> Response`
- **Purpose**: Handle the test operation at `/rest/v2/exporters/{id}/test`.
- **Inputs**: Authenticated DRF request and exporter ID path value.
- **Behavior boundary**: For a persisted ID, resolve the object from the queryset without the generic unsafe-method object-role gate, then apply saved-exporter authorization including viewer access. For ID `0`, avoid model lookup and validate temporary settings and explicit hosts without object-level project/service permission checks.
- **Output**: HTTP 200 with aggregate and per-host results after execution; standard REST 4xx response for pre-execution validation, missing-resource, or access failures.

## Request Validation

### `ExporterTestRequestSerializer.validate(attrs) -> dict`
- **Purpose**: Validate test-only request data according to saved or temporary mode.
- **Inputs**: Request fields, including optional/required host list and temporary scrape settings.
- **Output**: Validated test inputs; it does not call `save()` or mutate an exporter.

### `validate_test_hosts(hosts: list[str], maximum: int) -> list[str]`
- **Purpose**: Validate a host list and enforce the configured maximum.
- **Inputs**: Host names/IP strings and configured maximum.
- **Output**: Validated host list or a validation error. Farm membership is not checked.

## Authorization

### `check_exporter_test_access(user, exporter: Exporter) -> None`
- **Purpose**: Enforce the saved exporter access policy.
- **Inputs**: Authenticated user and persisted exporter.
- **Output**: Returns when project/service viewer, editor, or admin access exists; otherwise raises the established permission exception.
- **Note**: Temporary ID `0` does not call this object-level check. The endpoint still requires API authentication.

## Target Resolution and Scraping

### `resolve_exporter_test(exporter_id: str, request_data: dict) -> tuple[ExporterConfig, list[str]]`
- **Purpose**: Resolve the effective scrape settings and target list without persisting test data.
- **Inputs**: Path ID and validated request data.
- **Output**: Effective settings and host list; saved settings take precedence for persisted exporters.
- **Pre-scrape validation**: If saved mode has no explicit hosts and the resolved farm host list is empty, reject with HTTP 400 asking for an explicit, non-empty host list. Do not pass an empty list to the scrape utility.

### `scrape_exporter_hosts(config: ExporterConfig, hosts: list[str]) -> list[HostTestResult]`
- **Purpose**: Execute bounded HTTP scrapes using existing timeout/concurrency protections and parse results.
- **Inputs**: Effective settings and selected hosts.
- **Output**: One result per host with scrape status and metric details or error information.

## Conceptual Data Types

- **`ExporterConfig`**: Effective scheme, port, and path used to construct scrape URLs. For saved exporters, values come from the persisted object; for ID `0`, values come from validated request data, with `/metrics` as the path default.
- **`HostTestResult`**: A per-host result containing the host, success/failure status, HTTP or metric summary details on success, and error detail on failure. Exact response field names remain an API contract detail for Functional Design.

## Result Construction

### `build_exporter_test_response(results: list[HostTestResult]) -> dict`
- **Purpose**: Build the response body for a completed test.
- **Output**: Overall status is success only if all host results succeed; includes the list of per-host results.

## API Schema

### Exporter test action schema
- **Purpose**: Document method, path parameter, mode-specific request fields, HTTP 200 meaning, structured response, and pre-execution 4xx errors.
- **Output**: OpenAPI schema generated through the existing `drf-spectacular` integration.
