# Services and Orchestration — PROMGENDEV-275

## Exporter Test Orchestration
- **Boundary**: `ExporterViewSet.test` action in `promgen/rest_v2.py`.
- **Purpose**: Coordinate authentication/authorization, saved versus temporary configuration, host validation, scrape execution, and response aggregation for one API call.
- **Interactions**:
  1. DRF authenticates the caller.
  2. The action distinguishes persisted exporter IDs from reserved ID `0`.
  3. Saved mode resolves the exporter and applies project/service viewer, editor, or admin access through the existing permission helper. The action avoids the generic unsafe-method object-role gate so viewer access remains possible. Temporary mode skips object-level project/service authorization.
  4. Request validation resolves explicit or default hosts and enforces the configurable maximum.
  5. Existing scrape utilities perform bounded HTTP requests and metric parsing.
  6. The action returns structured per-host outcomes and aggregate status.
- **Persistence**: Read-only for saved exporters; temporary settings and results are not stored.

## Service-Layer Decision
No new service class is proposed. The feature is one synchronous API operation in the existing application boundary and can reuse current scrape utilities. A dedicated service can be introduced during Functional Design only if code-level coupling or reuse needs justify it.

## Failure Handling
- Validation, missing saved exporter/target, and access failures occur before scrape execution and use established REST 4xx handling.
- Once scrape execution runs, host-level HTTP, parsing, connection, or timeout failures are represented in per-host results. The API returns HTTP 200, with aggregate status failure unless all hosts succeed.
