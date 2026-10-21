# Focused Reverse Engineering — Exporter Scrape Reuse

## Scope
Compare the legacy UI scrape view, `ExporterScrape`, with the v2 exporter test action to identify duplicated internal behavior and contract differences relevant to a behavior-preserving refactor.

## Current Components
- `promgen/views.py::ExporterScrape.post` serves `POST /project/<project-id>/scrape`. It authenticates through `LoginRequiredMixin`, checks project/service view-or-higher access, selects the project's farm hosts, applies form defaults, schedules up to 20 futures, parses Prometheus metrics, and returns JSON keyed by scrape URL.
- `promgen/rest_v2.py::ExporterViewSet.test` serves `POST /rest/v2/exporters/{exporter_id}/test`. It supports saved and temporary exporters, validates and bounds selected hosts, applies saved-object permissions, schedules up to 20 futures, parses Prometheus metrics, and returns ordered per-host results.
- Both flows use `promgen.util.scrape` and `prometheus_client`'s `text_string_to_metric_families` parser.

## Duplicated Responsibilities
- Construct a scrape URL from scheme, host, port, and path.
- Execute one HTTP scrape and inspect the response.
- Parse Prometheus exposition text and count metric families and samples.
- Schedule per-host work through a bounded thread pool and enforce the existing overall timeout setting.

## Existing Differences to Preserve
| Concern | `ExporterScrape` | v2 exporter test API |
|---|---|---|
| Inputs and target selection | Form data; all hosts in project farm | Saved or temporary config; explicit or farm-default hosts, capped by `PROMGEN_EXPORTER_TEST_MAX_HOSTS` |
| Access checks | Session login and project/service viewer, editor, or admin | REST authentication; saved exporters require project/service viewer, editor, or admin; temporary ID `0` has no object-level check |
| Redirects and request timeout | Current `util.scrape` defaults; executor wait uses configured timeout | Redirects disabled; per-request remaining timeout and executor wait use configured timeout |
| Result contract | JSON mapping scrape URL to metric counts or legacy error text | HTTP 200 after execution with ordered host results, sanitized errors, and aggregate status |

## Reverse-Engineering Conclusion
The two entry points duplicate lower-level scrape execution and metric parsing while intentionally differing in selection, authorization, redirect/timeout options, error handling, and response shape. A shared internal primitive can reduce duplication if those entry-point policies and output adapters remain explicit.
