# Stage 7: Units Generation — `exporter-scrape-reuse`

## Key Decisions
- One cohesive unit covers the shared processor, both entry-point integrations, and regression tests.
- No user stories were generated; requirements and acceptance criteria map directly to the unit.
- Existing endpoint-specific policies remain with their current callers.
- The unit is an in-process brownfield change; there are no inter-unit dependencies, new data ownership, or public interfaces.
- User approved the decomposition and generated deliverables on 2026-10-21.

## Generated Deliverables
| File | Overview |
|---|---|
| `inception/application-design/exporter-scrape-reuse/unit-of-work.md` | Scope, responsibilities, exclusions, and acceptance criteria. |
| `inception/application-design/exporter-scrape-reuse/unit-of-work-dependency.md` | Single-unit dependencies and implementation sequence. |
| `inception/application-design/exporter-scrape-reuse/unit-of-work-story-map.md` | FR/AC mapping; no story IDs apply. |
| `inception/application-design/exporter-scrape-reuse/context-map.md` | One-unit boundaries and existing model ownership. |
| `inception/application-design/exporter-scrape-reuse/unit-interfaces.md` | Shared internal function contract and caller policies. |
| `inception/plans/exporter-scrape-reuse-unit-of-work-plan.md` | Approved decomposition and completed checklist. |

## Handoff Items for Construction
- Construction unit: `exporter-scrape-reuse`.
- Functional Design: execute.
- NFR Requirements, NFR Design, Infrastructure Design: skip per approved execution plan.
- Code Planning, Code Generation, Build and Test: execute.
- Preserve legacy/API differences, particularly status rules, redirects, timeout handling, IPv6 URL formatting, ordering, and error mapping.

## Numeric Summary
- Units: 1.
- Requirements mapped: 5 functional requirements plus applicable NFR constraints.
- New inter-unit interfaces: 0.
