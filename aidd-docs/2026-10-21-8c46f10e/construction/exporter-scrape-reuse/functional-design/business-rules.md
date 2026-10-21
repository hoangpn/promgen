# Business Rules — `exporter-scrape-reuse`

## Shared Processing Rules
1. Each caller constructs and supplies its own target URL.
2. The processor passes URL and request options to existing `util.scrape` without changing caller options.
3. Parse the response body with Prometheus `text_string_to_metric_families`.
4. `metric_count` is the number of parsed metric families.
5. `sample_count` is the sum of `samples` across parsed families.
6. Return the original response and counts; do not convert status codes into success/failure inside the helper.
7. Propagate exceptions so each caller's existing mapping remains effective.

## Legacy View Rules to Preserve
- Continue requiring session authentication and the current project/service viewer, editor, or admin permission logic.
- Continue selecting hosts from the project's farm and applying the existing `/metrics` path default.
- Continue using legacy URL construction, `util.scrape` defaults, at most 20 workers, and the configured executor wait timeout.
- Continue to call `raise_for_status()`: its existing semantics, including treating 3xx responses without an HTTP error, must remain intact.
- Preserve current parse, connection, request, unknown-exception, and timeout messages and the URL-keyed JSON result.

## REST API Rules to Preserve
- Continue parsing saved and temporary exporter IDs/configurations as currently implemented; retain serializer validation, explicit/default host handling, and configured host cap.
- Continue using API-specific URL formatting, including brackets around IPv6 literals.
- Continue passing the remaining deadline as request timeout and `allow_redirects=False`.
- Treat only 2xx responses as success. A 3xx response remains a failure even though the legacy caller handles it differently.
- Preserve API deadline and pool completion behavior, cancellation, input result order, sanitized errors, aggregate status, and HTTP 200 response semantics after execution.

## Compatibility Guardrails
- Do not merge or normalize caller authorization, host selection, URL formatting, scheduling, timeouts, status checks, exception handling, or serialization.
- Preserve concurrency at no more than 20 workers per entry point.
- Do not change `util.scrape` defaults, public routes, configuration, models, or dependencies.

## Traceability
These rules implement requirements FR-1–FR-5, constraints NFR-1–NFR-5, and acceptance criteria 1–6 in the approved requirements and Unit of Work documents.
