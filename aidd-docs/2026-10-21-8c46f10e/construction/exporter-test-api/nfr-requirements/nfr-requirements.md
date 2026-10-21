# NFR Requirements — `exporter-test-api`

## Scope and assumptions

This endpoint is an authenticated, synchronous API action that makes outbound HTTP requests to user-selected or farm-selected exporter targets. It reuses the existing Promgen Django REST Framework application and scrape utility. No infrastructure changes are planned.

The user selected no additional workload/latency target, no endpoint-specific rate limit, no redirect following, and no additional metrics or persistent logging for this feature.

## Scalability and capacity

1. The selected target count must be validated before any outbound request. The configurable maximum defaults to 50 hosts per request. Saved-mode default farm selection must be rejected when it exceeds this maximum; selection is never silently truncated.
2. At most 20 scrape requests may run concurrently for an endpoint invocation, preserving the existing executor bound.
3. No explicit request-rate, aggregate endpoint-concurrency, or throughput target is added by this feature. Authentication, the host cap, the worker bound, and deployment-level controls remain the available controls.
4. No horizontal scaling, queueing, or asynchronous job requirement is introduced.

## Performance and latency

1. Retain the existing `PROMGEN_EXPORTER_SCRAPE_TIMEOUT` behavior for scrape collection; its current default is 25 seconds. Do not describe this as a hard socket-level cancellation guarantee unless the implementation explicitly provides one.
2. No separate API response-time SLA or maximum simultaneous endpoint-request target is defined.
3. A completed scrape operation returns one result per selected host. Once execution begins, target failures do not change the operation's HTTP 200 response semantics.

## Availability and reliability

1. A failure, timeout, unacceptable HTTP response, or exposition parse error for one target must be represented in that host's result and must not discard other completed host outcomes.
2. A whole-operation timeout must result in failure results for unfinished hosts while retaining completed results.
3. HTTP redirects are not followed. A redirect response is treated as a non-success target response and reported as a failed host result.
4. No new availability target, retry policy, failover mechanism, or persistent result store is required.

## Security and privacy

1. Both saved and temporary modes require existing API authentication. Saved mode must enforce the approved project/service viewer, editor, or admin authorization. Temporary mode has no project/service object check, as approved.
2. Explicit syntactically valid hostnames and IP addresses may include private and loopback addresses. Host-count limits and authority-safe host parsing are required; this NFR stage does not introduce an address-range restriction.
3. Target values must not alter URL authority or inject a path/query component. Redirects are disabled so the scrape does not follow a target-provided destination.
4. Error details returned to the caller must not expose sensitive credentials from request/exception text.
5. No endpoint-specific rate limit is added. This decision relies on authentication and the existing host/concurrency bounds; no additional control is specified for authenticated callers repeatedly invoking the endpoint.

## Observability and data handling

1. Per-host execution outcomes and sanitized errors are returned in the API response.
2. The feature adds no metrics, structured per-host logs, or persistent scrape/test records. Existing application request/error logging remains in effect.
3. Promgen database models remain read-only during the operation; temporary configuration and results are not persisted.

## Maintainability and compatibility

1. Keep implementation within the current Django REST Framework API and existing scrape/parser stack.
2. Preserve existing saved exporter behavior and API routes. The endpoint is an additive API operation.
3. API schema documentation must describe authentication, saved/temporary behavior, limits, and completion-versus-target-health status semantics.

## Verification requirements

- Verify that over-limit requests and oversized/empty implicit farm selections are rejected before outbound requests.
- Verify no more than 20 scrapes execute concurrently and that the configured scrape timeout is used.
- Verify redirect responses are reported as failures without following the `Location` destination.
- Verify authentication/authorization behavior and that sensitive exception content is sanitized.
- Verify successful and failed target results are returned without database writes.
