# Unit of Work — PROMGENDEV-275

## Unit: `exporter-test-api`

**Type:** Logical feature unit within the existing brownfield Promgen Django application. It is not an independently deployable service.

**Purpose:** Let an authenticated API consumer run a saved or temporary exporter against selected hosts and inspect structured per-host scrape outcomes without changing saved configuration.

### Responsibilities

- Add `POST /rest/v2/exporters/{exporter_id}/test` to the existing exporter API.
- Validate saved and temporary request modes, including host selection and the configured maximum.
- Apply authentication to both modes and the approved project/service viewer, editor, or admin access check to saved exporters.
- Resolve saved exporter settings and default farm hosts, or use temporary request settings without persistence.
- Execute bounded scrapes using the existing concurrency and timeout protections, aggregate per-host results, and expose API documentation.
- Add and maintain endpoint-level verification for the approved acceptance scenarios.

### Ownership and boundaries

This unit owns the feature's endpoint orchestration, request/response contract, and related tests. Existing Promgen domain models remain the source of truth for exporter, project, farm, and host data. Existing permission helpers, settings, scrape utilities, and metric parsing remain shared application capabilities; this unit consumes them and does not take ownership of their underlying data or general behavior.

The unit does not add persistence, a deployable service, or infrastructure. Temporary exporter settings and test results are request-scoped and are not persisted.

### Code organization

Brownfield implementation stays in the existing `promgen` package and follows its current API, serializer, utility, schema, and test organization. No new repository structure is proposed.
