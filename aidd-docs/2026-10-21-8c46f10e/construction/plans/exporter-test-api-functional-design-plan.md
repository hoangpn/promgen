# Functional Design Plan — `exporter-test-api`

## Scope

Define the detailed behavior of the approved exporter test endpoint for saved and temporary exporter modes. This is technology-aware enough to fit existing Promgen conventions while leaving code-level choices to Code Planning.

## Analysis and deliverables

- [x] Review the approved unit definition, US-1 mapping, application components, and endpoint contract.
- [x] Inspect existing exporter, farm, and host ownership and the existing scrape execution/result behavior.
- [x] Define the request-to-result flow and mode-specific branches.
- [x] Define authorization, host selection, validation, execution, and result business rules.
- [x] Define the conceptual entities and their relationships without adding persistence.
- [x] Resolve the saved-exporter case where the farm contains zero hosts (question file).
- [x] Incorporate the answer in the Functional Design drafts.
- [x] Present Functional Design deliverables for review and approval.

## Generated deliverables

- `construction/exporter-test-api/functional-design/business-logic-model.md`
- `construction/exporter-test-api/functional-design/business-rules.md`
- `construction/exporter-test-api/functional-design/domain-entities.md`

## Approval gate

The Functional Design artifacts require explicit user approval before the next Construction stage begins. The zero-host behavior is incorporated into the design and synchronized upstream.
