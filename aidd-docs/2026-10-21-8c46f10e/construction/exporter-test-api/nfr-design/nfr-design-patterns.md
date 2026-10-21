# NFR Design Patterns — `exporter-test-api`

## 1. Synchronous request orchestration

Keep the exporter test as a synchronous detail action on `ExporterViewSet`. The action coordinates authentication, saved-object authorization, request validation, target resolution, bounded scrape execution, and response aggregation. Reuse the existing application and scraper; do not add a background queue or new service boundary.

## 2. Preflight validation before outbound work

Use a request serializer and target-resolution step before creating any scrape tasks:

1. Resolve saved or temporary mode and apply its mode-specific authorization/configuration rules.
2. Resolve explicit targets or saved farm defaults.
3. Reject empty or malformed targets and enforce the configured host maximum before scheduling work.
4. Construct URLs from separately validated scheme, host, port, and path values. A supplied host must not be able to change URL authority or add path/query components.

The maximum host count is configurable and defaults to 50. An oversized implicit farm selection is rejected rather than truncated. Private and loopback targets remain permitted; no DNS/IP-range restriction is added.

## 3. Bounded parallel fan-out

Use one bounded executor for the selected hosts, with no more than 20 active scrape workers. Submit one task per validated host and retain a host-to-task association so every selected target can receive exactly one result. Do not create nested executors or expand parallelism based on request count.

Do not add request rate limiting or aggregate endpoint concurrency controls. This follows the approved requirements; authentication and the host/worker bounds remain the controls within this feature.

## 4. Existing timeout with explicit request bound

Continue using `PROMGEN_EXPORTER_SCRAPE_TIMEOUT` (default 25 seconds) as the scrape timeout configuration. Apply it to the HTTP request through the existing scrape utility and retain the established collection wait behavior. Treat timeouts as per-host failures and preserve results already completed.

The executor's collection timeout alone does not cancel a running `requests` socket operation. The implementation must not report a completed bounded response while worker requests are still unbounded; passing the existing configured timeout into each HTTP request provides a bound without adding a new setting or timeout policy.

## 5. Fail-closed redirects and per-host fault isolation

Invoke the HTTP scrape utility with redirects disabled. Treat 3xx responses as failed target outcomes and never follow `Location` destinations. Continue collecting other hosts when one host has a connection error, timeout, unacceptable status, or invalid exposition.

Return HTTP 200 after a scrape attempt has run, including partial or total target failure. Aggregate success is true only when every selected target succeeds.

## 6. Authorization and error privacy

- Require existing DRF authentication in both modes.
- For saved exporters, explicitly check the approved project/service viewer, editor, or admin permissions without relying on generic unsafe-method object permission behavior that excludes viewers.
- For temporary ID `0`, skip object-level project/service checks, as approved.
- Sanitize exception-derived error details before response serialization. Do not return credentials, URL user-info, or other sensitive request fragments.
- Keep database access read-only and keep target results request-scoped.

## 7. Observability and response pattern

Use the per-host response as the feature's execution record. Rely on existing application request/error logs; add no new feature metrics, raw-host labels, structured per-host logs, or persistent result records. Keep the response schema and API documentation explicit that HTTP 200 indicates execution completion, while the body communicates target health.

## Design-to-requirement mapping

| NFR | Design response |
|---|---|
| Max 50 selected hosts by default | Preflight configurable count check; reject rather than truncate |
| At most 20 concurrent scrapes | Single bounded executor with 20 workers maximum |
| Existing timeout setting | Pass configured timeout to HTTP calls and preserve collection wait behavior |
| No redirect following | Explicit `allow_redirects=False`; 3xx becomes host failure |
| Private/loopback targets permitted | Validate URL authority syntax but do not filter address ranges |
| Authentication and saved access control | DRF authentication plus explicit action-level project/service role check |
| Error privacy and read-only behavior | Sanitize exception details; request-scoped results; no ORM writes |
| No feature-specific telemetry | Reuse existing application logs and API response only |
