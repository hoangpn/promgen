# Application Components — `exporter-scrape-reuse`

## Design Overview
This behavior-preserving refactor introduces one internal component for common per-target scrape execution and Prometheus metric parsing. The existing Django view and REST action remain the orchestration and policy boundaries. No public API, persistence, configuration, or deployment component is added.

## Components

### 1. Shared Exporter Scrape Processor
- **Purpose**: Centralize the common work performed after a caller has selected a target and constructed its URL.
- **Responsibilities**: Invoke the existing `promgen.util.scrape` with caller-supplied request options; parse the response body using `text_string_to_metric_families`; calculate metric-family and sample counts; return the original response with those counts.
- **Interface**: Internal Python function in a shared `promgen` module. It accepts a target URL and request keyword options and returns a structured result containing the HTTP response, metric count, and sample count. HTTP status policy remains with each caller.
- **Type**: New internal application component; not a public service.

### 2. Legacy `ExporterScrape` View
- **Purpose**: Preserve `POST /project/<project-id>/scrape` behavior.
- **Responsibilities**: Session authentication and project/service permissions; farm host selection; form defaults and legacy URL construction; 20-worker scheduling and executor timeout; legacy HTTP status handling (`raise_for_status`, including its current treatment of redirects); mapping exceptions to legacy JSON values; response serialization.
- **Interface**: Existing Django view and JSON response.
- **Type**: Existing UI entry point, adapted to call the shared processor for each target.

### 3. v2 `ExporterViewSet.test` Action
- **Purpose**: Preserve `POST /rest/v2/exporters/{exporter_id}/test` behavior.
- **Responsibilities**: REST authentication and saved-exporter permissions; request validation; saved/temporary configuration and host selection/limits; IPv6 URL bracketing; 20-worker scheduling and deadline handling; disabled redirects and remaining per-request timeout; 2xx-only success policy; sanitized per-host errors, input ordering, aggregation, and response serialization.
- **Interface**: Existing DRF action and structured response.
- **Type**: Existing REST entry point, adapted to call the shared processor for each target.

## Boundary
The shared processor handles only an individual request and metric parsing. It does not select hosts, build URLs, schedule tasks, enforce an endpoint-specific timeout or status policy, sanitize or translate errors, or serialize a response. Both callers use the same processor so the common parse/count implementation cannot drift.
