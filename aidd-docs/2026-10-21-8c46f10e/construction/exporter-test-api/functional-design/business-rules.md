# Business Rules — `exporter-test-api`

## Mode and configuration rules

1. `exporter_id == 0` denotes a temporary exporter. Positive IDs identify persisted exporters; invalid/non-positive nonzero IDs are rejected.
2. A persisted exporter test uses its stored `scheme`, `port`, and `path_value`. Request body fields never replace persisted exporter configuration and the exporter is never saved.
3. A temporary test requires `hosts`, `scheme`, and `port`; `path` defaults to `/metrics`. Temporary values are not saved or associated with a project.
4. Scheme is restricted to supported HTTP schemes (`http`, `https`). Port must be in the valid TCP port range. Path is a path component, not a complete URL.

## Authorization rules

5. Both modes require an authenticated API user.
6. Saved mode is allowed when the user has any project or service `viewer`, `editor`, or `admin` role for the exporter's owning project/service. A missing permission in both scopes denies the request.
7. Temporary mode does not check project/service object permissions.
8. Authentication, missing resource, and permission failures stop processing before target resolution or outbound scraping.

## Host selection and work bounds

9. `hosts` is optional only for saved mode. When supplied, its entries are used as the exact test target selection and are not constrained to farm membership.
10. Valid host names and IP addresses are accepted, including private and loopback addresses. Host parsing must reject empty/malformed values and prevent the host value from changing the URL authority or injecting a path/query component.
11. Temporary mode requires at least one explicit host.
12. The maximum selected host count is configurable and defaults to 50. Explicit over-limit lists fail with HTTP 400.
13. If saved mode omits hosts and the associated farm contains more than the configured maximum, return HTTP 400 and require an explicit list within the limit. Do not truncate the selection.
14. If saved mode omits hosts and the associated farm contains zero hosts, return HTTP 400 and require an explicit non-empty host list. Do not start an empty scrape operation.
15. Enforce the host count before launching outbound requests.
16. At most 20 scrape requests run concurrently, and each uses the existing configured scrape timeout. No new fan-out or timeout policy is introduced here.

## Scrape and result rules

17. A target URL uses the effective scheme, selected host, effective port, and effective path.
18. A successful target must return an acceptable HTTP response and parse as Prometheus exposition data. Its result includes `host`, success status, HTTP status code, metric-family count, and sample count.
19. Connection errors, non-success HTTP status, parse errors, and timeout failures produce a failed host result with useful error detail. Sensitive credentials, if any appear in upstream exception text, must not be echoed.
20. Result ordering follows the explicit host list when possible; for implicit farm selection, use the farm's model ordering. Every selected host has exactly one result.
21. Overall result status is `success` if and only if every host result is successful; an empty result list is invalid and cannot produce success.
22. Once scrape execution begins and results are assembled, return HTTP 200 regardless of per-host outcomes. HTTP 200 describes execution completion, not target health.
23. Validation, host-limit, authentication, authorization, and missing-exporter failures use their suitable pre-execution 4xx responses.

## Persistence and documentation rules

24. The operation is read-only toward Promgen database models. No temporary exporter or test result is persisted.
25. Endpoint documentation describes saved and temporary request requirements, the configurable host cap, saved access policy, and HTTP 200 outcome semantics.
