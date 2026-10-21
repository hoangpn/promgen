# Stage 1: Functional Design — Completion Summary (`exporter-test-api`)

## Key Decisions
- Saved exporter tests use persisted scheme, port, and path; request data cannot override them.
- Temporary ID `0` requires authenticated access, explicit non-empty hosts, scheme, and port; path defaults to `/metrics`; no object permission check or persistence applies.
- Saved tests require project or service viewer, editor, or admin permission.
- Explicit targets may be outside the farm, including private and loopback addresses.
- Omitted hosts use farm hosts only when the default set is non-empty and within the configured limit. Empty or oversized default sets return HTTP 400 before scraping.
- Completed scrape runs return HTTP 200 with per-host results; overall success requires every host to succeed.
- Scrapes retain maximum concurrency of 20 and the existing configured timeout.
- No database entities or persistence paths are added.

## Generated Deliverables
| File | Overview |
|---|---|
| `functional-design/business-logic-model.md` | Main and failure flows for one exporter test request |
| `functional-design/business-rules.md` | Mode, authorization, host, result, and persistence rules |
| `functional-design/domain-entities.md` | Existing persisted models and request-scoped value objects |
| `construction/plans/exporter-test-api-functional-design-plan.md` | Approved Functional Design plan |
| `construction/plans/exporter-test-api-functional-design-questions.md` | Clarification answer for the empty-farm case |

## Handoff Items for the Next Stage
- NFR Requirements should assess bounded outbound fan-out, timeout behavior, authentication/authorization, and the explicitly permitted private and loopback target policy.
- Default maximum is 50 targets per request and remains configurable.
- Do not add new infrastructure; the approved execution plan skips Infrastructure Design.

## Numeric Summary
- Business rules: 25
- Existing persisted entities referenced: 6
- Request-scoped value objects: 4
- Acceptance scenarios: 14
