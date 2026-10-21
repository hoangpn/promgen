# Component Methods — `exporter-scrape-reuse`

Detailed business rules remain for Construction Functional Design. These signatures define only the proposed internal boundary and the existing caller responsibilities.

## Shared Exporter Scrape Processor

### `scrape_and_parse(target_url: str, **request_options) -> ScrapeResult`
- Calls the existing `promgen.util.scrape(target_url, **request_options)`.
- Parses the response text with `text_string_to_metric_families`.
- Returns the original HTTP response and counts of metric families and samples.
- Does not decide whether the HTTP status is successful; it returns the response for caller-specific policy.
- Does not catch or translate exceptions, allowing existing caller exception handling to remain effective.

### `ScrapeResult`
- `response`: Original response returned by `util.scrape`.
- `metric_count: int`: Number of parsed metric families.
- `sample_count: int`: Sum of sample counts across parsed families.

The concrete module path and exact representation (`NamedTuple`, dataclass, or equivalent) may be selected during Code Planning, without changing this interface or behavior boundary.

## Existing Entry Points (adaptation responsibilities)

### `ExporterScrape.post(request, pk) -> JsonResponse`
- Retains authentication, permission checks, farm selection, defaults, URL formatting, concurrency, executor timeout, status handling, exception mapping, and JSON output.
- Calls `scrape_and_parse` within the existing per-host worker and maps the result to the current URL-keyed payload.

### `ExporterViewSet.test(request, id) -> Response`
- Retains ID/configuration/host validation, object permissions, host limit, URL formatting including IPv6, deadline and pool handling, request options, strict 2xx policy, error sanitization, ordered aggregation, and serializer output.
- Calls `scrape_and_parse` within the existing per-host worker and maps the result to the current per-host payload.
