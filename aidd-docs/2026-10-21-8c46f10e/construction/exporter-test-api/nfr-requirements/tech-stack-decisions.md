# Tech-Stack Decisions — `exporter-test-api`

## Decision summary

| Area | Decision | Rationale |
|---|---|---|
| API framework | Use the existing Django REST Framework `ExporterViewSet` action | The feature extends the existing v2 API and authentication/permission conventions. |
| HTTP client | Use the existing `requests`-based `promgen.util.scrape` wrapper | It already supplies Prometheus scrape headers and is used by Promgen scrape flows. |
| Concurrency | Retain the existing maximum of 20 worker threads for scrape fan-out | This is the established bound and is approved in Functional Design. |
| Scrape collection timeout | Retain `PROMGEN_EXPORTER_SCRAPE_TIMEOUT`, currently defaulting to 25 seconds | Reuses the existing operational setting; no separate timeout policy is required. |
| Host limit | Add/use a configurable host maximum with default 50 | Bounds outbound fan-out per request and is fixed by the approved Functional Design. |
| Redirect behavior | Do not follow redirects | Clarification selected redirect responses as failed target outcomes. |
| Request throttling | Add no endpoint-specific rate or concurrency limiter | Clarification selected existing authentication, host and worker bounds, and deployment-level controls. |
| Metrics/logging/storage | Add no feature-specific metrics, per-host logs, or persistent results | Clarification selected API results and existing application logs only; domain behavior is read-only. |
| New dependencies or infrastructure | None | Existing stack and deployment are sufficient for the approved scope; Infrastructure Design is skipped. |

## Existing stack constraints

- The application is Python/Django with Django REST Framework.
- `promgen.util.scrape` delegates to `requests.get` and sets Prometheus-compatible headers, including an explicit `Host` header.
- Existing web scraping uses a 20-worker executor and applies `PROMGEN_EXPORTER_SCRAPE_TIMEOUT` to collection of futures. This is the existing wait/collection behavior and does not by itself guarantee that an underlying socket request is immediately cancelled at timeout.
- The current timeout default is 25 seconds. Deployments may configure the existing setting.

## Implementation implications

- The new action should call the existing scrape utility with redirect following explicitly disabled, so behavior does not depend on the HTTP client's default.
- Keep the host maximum configurable through the existing project settings conventions and default it to 50.
- Do not add a dependency, model, background worker, or migration for this feature.
- Preserve response-level sanitized per-host failures and avoid adding raw hostnames as metrics labels or new log fields.
