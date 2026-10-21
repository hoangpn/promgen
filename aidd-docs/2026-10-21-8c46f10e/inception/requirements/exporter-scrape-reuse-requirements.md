# Requirements — Reuse Exporter Scrape Logic

## Intent Analysis
- **User Request**: `$aidd-inception refactor to reuse duplicate parts between ExporterScrape view and ExporterTest API`
- **Request Type**: Refactoring.
- **Scope Estimate**: Multiple components within the existing Promgen Django application: the legacy `ExporterScrape` view and the v2 exporter test action, with a shared internal scrape component and tests.
- **Complexity Estimate**: Moderate, because the entry points share scrape mechanics but have different input, permission, timeout, redirect, error, and response contracts.
- **Requirements Depth**: Standard.

## Goal
Reduce duplicate scrape-processing code between `ExporterScrape` and the v2 exporter test API while preserving both entry points' current externally observable behavior.

## Functional Requirements
- **FR-1 — Shared scrape processing**: Move genuinely common lower-level scrape execution and Prometheus metric parsing into a shared internal component that both entry points use.
- **FR-2 — Preserve legacy view contract**: Keep the legacy URL, form inputs/defaults, session authentication and permission behavior, farm-host selection, JSON response shape, error behavior, and HTTP status behavior unchanged.
- **FR-3 — Preserve v2 API contract**: Keep the v2 URL, saved and temporary exporter modes, request validation, host limit, REST authentication/permissions, redirect policy, timeout behavior, sanitized per-host results, ordering, aggregation, and HTTP status semantics unchanged.
- **FR-4 — Keep policy at the entry points**: Preserve differences in target selection, request options, error mapping, and response serialization through explicit entry-point options/adapters rather than silently normalizing behavior.
- **FR-5 — Both entry points use shared logic**: Scrape and metric parsing work for each entry point must flow through the shared component; avoid parallel duplicate implementations.

## Non-Functional Requirements and Constraints
- **NFR-1 — Behavior preservation**: This refactor introduces no intended API, UI, authentication, persistence, or configuration changes.
- **NFR-2 — Execution bounds**: Preserve the existing concurrency bound of 20 and `PROMGEN_EXPORTER_SCRAPE_TIMEOUT` semantics for each caller.
- **NFR-3 — Compatibility**: Keep `util.scrape`'s existing HTTP headers and URL behavior unless a change is separately approved.
- **NFR-4 — Scope**: No new dependency, database migration, infrastructure, or public service is required.
- **NFR-5 — Verification**: Cover the shared primitive directly and verify both entry points retain their existing contract through focused tests.

## Acceptance Criteria
1. Both `ExporterScrape` and the v2 exporter test action delegate common scrape execution and metric parsing to the same internal component.
2. The legacy view's URL, inputs, permissions, result shape, and status behavior remain unchanged.
3. The v2 API's selection, validation, limits, permissions, redirect/timeout handling, sanitized ordered response, and status semantics remain unchanged.
4. Each entry point continues to use at most 20 concurrent scrapes and its existing timeout behavior.
5. Tests demonstrate both entry points call the shared implementation and preserve their current behavior.
6. No unrelated files, configuration, dependencies, models, or public contracts are changed.

## Assumptions
- “Refactor” means behavior-preserving; the differences documented in `inception/reverse-engineering/exporter-scrape-reuse-analysis.md` are intentional compatibility constraints.
- The shared boundary should centralize common mechanics, not merge authentication, target selection, or response-format policy.
- The earlier repository-wide test failures remain documented separately; this work will still run its focused verification and report any existing failures distinctly.
