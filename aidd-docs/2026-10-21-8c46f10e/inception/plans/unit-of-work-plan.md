# Unit of Work Plan — PROMGENDEV-275

## Decomposition Context
- **Project type**: Brownfield Django application.
- **Application boundary**: One Promgen application package and one v2 API feature.
- **User story**: US-1, one end-to-end exporter test workflow with saved and temporary modes.
- **Application design**: Existing `ExporterViewSet`, request validation, permission helper, ORM models, scrape utilities, API schema tooling, and tests.

## Proposed Decomposition
Create one logical Unit of Work: **`exporter-test-api`**.

The unit owns the new API operation's request coordination and response contract within the existing Promgen application. It includes saved/temporary mode validation, host selection limits, access behavior, scrape result aggregation, API documentation, and tests. It does not own or change exporter, project, farm, or host persistence; those remain in existing domain models.

## Planning Decisions
- **Unit count**: One. The single story, one application package, and one endpoint do not form independent deployable or separately owned modules.
- **Story grouping**: Assign all of US-1 and its saved/temporary scenarios to `exporter-test-api`.
- **Dependencies**: Existing Promgen models, permission helpers, scrape utilities, settings, and REST schema components. No new inter-unit dependency is introduced.
- **Context map**: Show the one unit, its existing application data dependencies, API consumer, and outbound exporter targets. External callers/targets are not additional Units of Work.
- **Interface definitions**: Define the external REST API contract for the endpoint. Record that there are no inter-unit interfaces in this decomposition.
- **Team ownership**: Not specified; no team-level split is needed for a single unit.
- **Repository structure**: Existing brownfield structure remains; no base repository plan is applicable.

## Context-Appropriate Questions
No stakeholder questions are required for this decomposition. The approved story and application design define one API goal in one existing application package; there are no ambiguous unit boundaries, ownership splits, or inter-unit communication choices.

## Generation Checklist
- [x] Define `exporter-test-api` and its responsibilities in `application-design/unit-of-work.md`.
- [x] Document its dependencies in `application-design/unit-of-work-dependency.md`.
- [x] Map US-1 and all acceptance scenarios to the unit in `application-design/unit-of-work-story-map.md`.
- [x] Create `application-design/context-map.md` with unit ownership, relationships, text alternative, and verification checklist.
- [x] Define the REST API contract in `application-design/unit-interfaces.md`; state that no inter-unit interface exists.
- [x] Verify unit boundaries, dependencies, story coverage, and interface consistency.
- [x] Present the context map for review before finalizing interface definitions.
- [ ] Present all Unit of Work deliverables for review and approval.

## Required Deliverables
- `aidd-docs/inception/application-design/unit-of-work.md`
- `aidd-docs/inception/application-design/unit-of-work-dependency.md`
- `aidd-docs/inception/application-design/unit-of-work-story-map.md`
- `aidd-docs/inception/application-design/context-map.md`
- `aidd-docs/inception/application-design/unit-interfaces.md`

**Not applicable**: Greenfield code-organization strategy and base repository plan. This is an existing brownfield project.

## Approval Gate
The Unit of Work plan is complete. Review this plan before generation. Generation begins after explicit approval.
