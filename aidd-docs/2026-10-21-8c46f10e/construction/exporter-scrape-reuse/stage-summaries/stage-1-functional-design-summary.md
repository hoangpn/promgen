# Stage 1: Functional Design — `exporter-scrape-reuse`

## Key Decisions
- A shared per-target processor invokes `util.scrape`, parses Prometheus exposition text, and returns the original response with metric and sample counts.
- Status policy and exceptions remain caller-owned; no shared success/failure normalization is introduced.
- Legacy and REST differences remain intact, including `raise_for_status()` versus 2xx-only, redirects, timeout handling, IPv6 URL formatting, error mapping, ordering, and serialization.
- No new persistent entity, migration, public interface, or UI behavior.
- User approved the Functional Design on 2026-10-21.

## Generated Deliverables
| File | Overview |
|---|---|
| `construction/exporter-scrape-reuse/functional-design/business-logic-model.md` | Per-target flow and caller responsibilities. |
| `construction/exporter-scrape-reuse/functional-design/business-rules.md` | Shared and endpoint-specific behavior-preservation rules. |
| `construction/exporter-scrape-reuse/functional-design/domain-entities.md` | Existing read-only models and proposed internal result value. |
| `construction/plans/exporter-scrape-reuse-functional-design-plan.md` | Scope, completed design steps, and no-UI rationale. |

## Handoff Items for Code Planning
- Modify existing `ExporterScrape` and `ExporterViewSet.test` in place.
- Select a non-conflicting internal module path and concrete result representation during Code Planning.
- Add tests for the shared processor and both caller contracts; do not run tests before Build and Test.
- NFR Requirements, NFR Design, and Infrastructure Design remain skipped per the approved execution plan.

## Numeric Summary
- Functional business rules: 17 across shared and endpoint-specific behavior.
- New persistent domain entities: 0.
- Endpoint contracts changed: 0.
