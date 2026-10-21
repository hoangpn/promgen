# Services and Orchestration — `exporter-scrape-reuse`

## Service Definitions

### Shared per-target scrape processing
The shared internal processor performs a single HTTP scrape through `util.scrape`, parses the response body as Prometheus exposition text, and computes metric-family and sample counts. It returns the raw response together with those counts and lets exceptions propagate. It does not own an application-wide service lifecycle or network scheduling.

### Legacy view orchestration
`ExporterScrape.post` remains responsible for session and object authorization, choosing farm hosts, applying form defaults, formatting URLs, submitting up to 20 workers, applying the legacy executor timeout, invoking `raise_for_status`, translating exceptions into the existing legacy JSON shape, and returning that shape.

### REST action orchestration
`ExporterViewSet.test` remains responsible for REST and saved-object authorization, request validation, choosing saved or temporary configuration, resolving and bounding hosts, formatting URLs (including IPv6 brackets), submitting up to 20 workers, applying its deadline and remaining request timeout, disabling redirects, accepting only 2xx responses, sanitizing errors, preserving input order, aggregating status, and serializing the existing response.

## Interaction Sequence
1. Each entry point applies its existing authorization, input/configuration, and host-selection rules.
2. Each entry point constructs the target URL using its current formatting behavior and submits work using its current bounded executor.
3. Its per-target worker calls the shared processor with the exact request options currently used by that entry point.
4. The processor invokes `util.scrape`, parses metrics, and returns the original response and counts; raised exceptions propagate to the caller's existing exception boundary.
5. The legacy worker applies `raise_for_status` and its existing exception/result mapping. The API worker applies its 2xx check and sanitized per-host result mapping.
6. Each entry point retains its current timeout completion handling and response construction.

## Compatibility Constraints
- The helper must not impose a common status-code policy: the legacy view's `raise_for_status()` and API 2xx-only check differ.
- The helper must pass through request options unchanged: API requests disable redirects and supply remaining timeout; legacy calls use current `util.scrape` defaults.
- URL construction, including the API's IPv6 bracketing, stays at each caller.
- Pool bounds, timeout/cancellation behavior, output ordering, exception translation, and response contracts stay at each caller.
