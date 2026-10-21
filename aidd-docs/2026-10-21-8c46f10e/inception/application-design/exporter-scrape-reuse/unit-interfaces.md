# Unit Interfaces — `exporter-scrape-reuse`

## Boundary Summary
The scope contains one Unit of Work and introduces no inter-unit API. The new boundary is an internal synchronous Python function used by both existing entry points.

| # | Providing Unit | Consuming Unit | Interface Name | Type | Contract Format | Summary |
|---|---|---|---|---|---|---|
| 1 | UOW-1 shared processor | UOW-1 legacy view worker | `scrape_and_parse` | Direct function call | Python signature and result fields | HTTP response plus Prometheus family/sample counts |
| 2 | UOW-1 shared processor | UOW-1 REST API worker | `scrape_and_parse` | Direct function call | Python signature and result fields | Same common result; caller applies API-specific status and error policy |

## Function Contract
```python
def scrape_and_parse(target_url: str, **request_options) -> ScrapeResult:
    """Execute one scrape and parse Prometheus metrics, propagating errors."""

class ScrapeResult:
    response: HTTPResponse
    metric_count: int
    sample_count: int
```

### Contract Conditions
- `target_url` is constructed by the caller and passed unchanged to `util.scrape`.
- `request_options` are passed through unchanged. The legacy caller supplies its current defaults; the API supplies its current remaining timeout and `allow_redirects=False`.
- `response` is the original response, allowing caller-specific URL and status handling.
- Counts describe the successfully parsed response body.
- HTTP status is not classified by the helper. The legacy caller applies `raise_for_status()`; the API accepts only 2xx.
- Exceptions propagate so each existing caller can preserve its own exception mapping and sanitization.
- No retry, fallback, or cross-unit transport is introduced.
