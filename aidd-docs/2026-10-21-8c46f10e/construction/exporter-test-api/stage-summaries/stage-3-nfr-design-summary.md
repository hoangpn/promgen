# Stage 3: NFR Design — Completion Summary (`exporter-test-api`)

## Key Decisions
- Keep orchestration synchronous within `ExporterViewSet.test`; no new service or queue.
- Validate and bound target selection before outbound work; maximum defaults to 50 hosts and scrape concurrency remains at most 20.
- Use the existing timeout setting for HTTP calls and collection; do not rely on a future collection timeout alone to cancel sockets.
- Disable redirects, preserve private/loopback target support, and isolate target failures into sanitized per-host results.
- Keep saved exporter authorization explicit, temporary mode authenticated without object permission, and persistence read-only.
- Add no endpoint-specific rate limiter, telemetry, persistence, dependency, or infrastructure.

## Generated Deliverables
| File | Overview |
|---|---|
| `construction/exporter-test-api/nfr-design/nfr-design-patterns.md` | Patterns for preflight validation, bounded fan-out, timeout, redirects, authorization, error handling, and observability |
| `construction/exporter-test-api/nfr-design/logical-components.md` | Logical responsibilities, flow, trust boundaries, configuration, and failure containment |
| `construction/plans/exporter-test-api-nfr-design-plan.md` | Completed design assessment checklist |

## Handoff Items for the Next Stage
- Code Planning follows; Infrastructure Design remains skipped.
- Implementation must pass the configured timeout to individual HTTP requests and disable redirects explicitly.
- The approved API contract and Functional Design remain authoritative for request, response, permissions, and status codes.

## Numeric Summary
- Design patterns: 7
- Logical components: 8
- New infrastructure components: 0
