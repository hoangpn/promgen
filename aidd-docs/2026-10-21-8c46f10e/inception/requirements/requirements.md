# Requirements — PROMGENDEV-275: Add API for Testing an Exporter

## Intent Analysis
- **User Request**: `$aidd-inception https://jira.workers-hub.com/browse/PROMGENDEV-275`
- **Source**: Jira PROMGENDEV-275, “Add API for testing an Exporter”.
- **Request Type**: New feature.
- **Scope Estimate**: Multiple components — v2 API routing/action, request validation and scrape result handling, API schema documentation, and API tests. No data model change is currently indicated.
- **Complexity Estimate**: Moderate.
- **Requirements Depth**: Standard.

## Goal
Provide an authenticated v2 API operation that tests an exporter against one or more hosts, supports a persisted exporter or a temporary exporter (`ID=0`), limits the size of a test, and returns structured per-host outcomes.

## Functional Requirements

### Endpoint and exporter selection
- **FR-1**: Expose the test operation as `POST /rest/v2/exporters/{exporter_id}/test`.
- **FR-2**: Support a positive persisted exporter ID and the reserved ID `0` for a temporary exporter.
- **FR-3**: For a persisted exporter, load and use its saved configuration. Request data must not override or change the persisted exporter's attributes.
- **FR-4**: For a temporary exporter (`ID=0`), accept a non-empty list of host names and scrape configuration containing scheme, port, and path. Do not persist the temporary exporter. Default an omitted path to `/metrics`, consistent with the existing scrape behavior.

### Host selection and request limits
- **FR-5**: For a persisted exporter, an omitted host list means test all hosts in the exporter's project's farm, provided the total does not exceed the configured maximum.
- **FR-6**: An optional host list identifies targets by host name. Do not require a supplied host name to be a member of the exporter's farm.
- **FR-7**: Set the configurable maximum number of hosts per request to 50 by default. Reject a request with HTTP 400 if its explicit list exceeds the configured maximum.
- **FR-8**: If the persisted exporter's farm has more hosts than the configured maximum and the request omits the host list, reject with HTTP 400 and explain that the caller must provide an explicit host list within the limit.
- **FR-9**: For a temporary exporter, require an explicit, non-empty host list. The configured maximum applies.
- **FR-10**: Accept syntactically valid host names and IP addresses, including private and loopback addresses. Do not apply farm-membership validation to these targets.

### Authorization and request outcomes
- **FR-11**: Require API authentication using the existing REST authentication mechanisms.
- **FR-12**: For persisted exporters, allow callers with project or service viewer, editor, or admin access, matching the existing exporter scrape permission policy.
- **FR-13**: For temporary exporter ID `0`, do not require a project/service object-level permission check.
- **FR-14**: Return HTTP 200 once a scrape test has run, including when some or all target scrapes fail. HTTP 200 indicates that the test operation ran; it does not mean every target passed.
- **FR-15**: Return a suitable 4xx status for invalid input, a missing exporter/target, authentication or authorization failure, or exceeding the host limit. Use HTTP 400 for host-limit rejection. Use the existing REST conventions for other 4xx cases.

### Result representation and documentation
- **FR-16**: Return a structured response containing an overall test status and a list of per-host results. Each host result includes the host, scrape status, and metric details on success or error details on failure.
- **FR-17**: Set the overall test status to success only when every host result succeeds; otherwise set it to failure. A failed test still uses HTTP 200 if the scrape operation ran.
- **FR-18**: Document in the API endpoint description that HTTP 200 means the test operation ran and that scrape outcomes are reported in the response body.

## Non-Functional Requirements and Constraints
- **NFR-1 — Bounded work**: The default maximum is 50 hosts per request and is configurable through application settings.
- **NFR-2 — Authentication**: The endpoint uses the existing authenticated REST API mechanisms. Persisted exporters also enforce the existing project/service object permissions.
- **NFR-3 — Scrape execution**: No new timeout or concurrency requirement was requested. Preserve the existing scrape timeout setting and maximum of 20 concurrent host scrapes where the existing scrape execution path is used.
- **NFR-4 — Network targets**: Host names and IP addresses outside the exporter's farm are allowed, including private and loopback targets, as explicitly selected by the user. The endpoint must still require API authentication.
- **NFR-5 — Data integrity**: Testing a persisted exporter must not modify its saved configuration; a temporary exporter must not be stored.

## Acceptance Criteria
1. A caller can invoke the v2 test operation for a saved exporter and the scrape uses the saved exporter configuration even if conflicting exporter attributes are included in the request.
2. A caller can invoke the operation with ID `0`, an explicit host list, and temporary scrape settings; the temporary settings are not persisted.
3. The endpoint rejects a temporary request without hosts and rejects any explicit host list over the configured maximum with HTTP 400.
4. When a saved exporter's farm is within the configured limit, omitting hosts tests all farm hosts. When the farm exceeds the configured limit, omitting hosts returns HTTP 400 with guidance to provide a bounded host list.
5. Host names in an explicit list are not rejected solely because they are outside the exporter's farm. Valid private and loopback host targets are accepted.
6. Persisted exporter tests enforce project/service viewer, editor, or admin permissions. Temporary ID `0` tests require API authentication but do not perform a project/service object-level permission check.
7. A completed scrape attempt returns HTTP 200 and structured per-host outcomes, including when targets fail. The overall status is success only when all target results succeed.
8. Invalid input, missing resources, authentication/authorization failures, and host-limit violations return suitable 4xx responses.
9. The API schema explains the meaning of HTTP 200 and the response body outcomes.

## Assumptions and Open Implementation Details
- A persisted exporter’s default hosts come from its associated project farm.
- Host input is a list of names or IP addresses. Exact JSON field names and response field names are design details, provided the contract above is met.
- For authentication failures, use standard REST authentication responses; for object permission failure on a persisted exporter, use the established REST authorization response.
- Timeout and concurrency retain existing scrape protections; the configurable host cap (50 by default) is the newly specified request-level bound.

## Traceability
- Jira PROMGENDEV-275 defines v2 test support for saved and temporary exporters, no saved-attribute overrides, HTTP 200 for executed tests with body outcomes, optional host selection, and large-farm protection.
- Clarification answers set the route, host names, 50-host configurable maximum, HTTP 400 for host-limit rejection, structured results, all-success aggregation, saved-exporter permissions, temporary ID `0` object-permission behavior, and accepted private/loopback targets.
