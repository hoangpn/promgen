# Application Design Plan — PROMGENDEV-275

## Design Scope
Design the exporter test endpoint inside the existing Promgen v2 API. Define its request/response responsibilities, permission handling, scrape orchestration, and dependencies. No new deployable component or data model is planned.

## Design Decisions from Approved Inputs
- Endpoint: `POST /rest/v2/exporters/{exporter_id}/test`.
- Keep the route on the existing `ExporterViewSet`; the existing Rule test action demonstrates the repository's detail-action pattern with reserved ID `0` for temporary data.
- Use an action-specific authenticated permission boundary. Saved exporters receive the approved project/service viewer, editor, or admin check. Temporary ID `0` skips project/service object permission checks.
- Use existing scrape utilities and execution protections. Add no independent scrape service unless implementation reveals a need.
- Provide a configurable host limit with default 50 and document the response contract in the API schema.

## Design Generation Checklist
- [x] Define components and high-level responsibilities in `application-design/components.md`.
- [x] Define proposed component method signatures and inputs/outputs in `application-design/component-methods.md`.
- [x] Define scrape orchestration and service boundaries in `application-design/services.md`.
- [x] Document component dependencies and the request/result data flow in `application-design/component-dependency.md`.
- [x] Verify design consistency with the approved requirements and story.
- [x] Present the design deliverables for user review and approval.

## Context-Appropriate Questions
No additional stakeholder decisions are currently needed. The endpoint path, saved and temporary modes, permission behavior, host rules, response semantics, and execution bounds are defined in the approved requirements. Existing DRF action conventions and scrape utilities provide the implementation context.

## Required Deliverables
- `aidd-docs/inception/application-design/components.md`
- `aidd-docs/inception/application-design/component-methods.md`
- `aidd-docs/inception/application-design/services.md`
- `aidd-docs/inception/application-design/component-dependency.md`
