# Requirements and Acceptance Map — `exporter-scrape-reuse`

User Stories were skipped because this is a behavior-preserving internal refactor. Requirements and acceptance criteria map directly to the single unit below.

| Requirement / acceptance criterion | UOW-1 `exporter-scrape-reuse` | Coverage focus |
|---|---|---|
| FR-1 / AC-1: shared scrape execution and metric parsing | Yes | Shared processor returns response and family/sample counts |
| FR-2 / AC-2: preserve legacy view contract | Yes | Existing auth, selection, request defaults, status/error behavior, output shape |
| FR-3 / AC-3: preserve v2 API contract | Yes | Saved/temporary modes, validation, cap, auth, redirects/timeouts, error sanitization, order, aggregation |
| FR-4: caller-specific policies remain explicit | Yes | Caller options and response/error adapters remain local |
| FR-5: both entry points use shared code | Yes | Regression tests exercise both callers using the common processor |
| NFR-2 / AC-4: bounds and timeout semantics | Yes | Existing 20-worker and caller-specific timeout behavior |
| NFR-3: `util.scrape` compatibility | Yes | Preserve current legacy defaults and API-supplied options |
| AC-5: focused verification | Yes | Helper and endpoint tests |
| AC-6: no unrelated changes | Yes | Review changed-file scope and public surface |

**Assignment check**: All five functional requirements and all six acceptance criteria have one unit assignment. No user-story identifiers apply.
