# Unit of Work Story Map — PROMGENDEV-275

## Story assignment

| Story | Unit of Work | Coverage |
|---|---|---|
| US-1: Test an Exporter and Inspect Per-Host Outcomes | `exporter-test-api` | Scenarios 1–13: saved and temporary modes, host selection and limits, authentication and authorization, result aggregation, API semantics, missing exporter handling, and existing scrape bounds |

## Acceptance scenario mapping

| US-1 scenario | Capability within `exporter-test-api` |
|---|---|
| 1. Saved exporter configuration | Resolve and use stored settings; ignore request attempts to override them |
| 2. Default farm hosts within limit | Resolve all farm hosts when no explicit selection is provided |
| 3. Default farm exceeds limit | Reject before scraping with HTTP 400 and actionable detail |
| 4. Explicit host list | Validate count and accept hostname/IP targets regardless of farm membership |
| 5. Explicit list exceeds limit | Reject before scraping with HTTP 400 and the configured limit |
| 6. Temporary exporter | Validate request-supplied settings and hosts; apply `/metrics` default; do not persist or require object-level permission |
| 7. Temporary request has no hosts | Reject validation with HTTP 400 identifying the missing selection |
| 8. All scrapes succeed | Return HTTP 200 and overall/per-host success with metric details |
| 9. One or more scrapes fail | Return HTTP 200 with overall failure and per-host scrape/error details |
| 10. Authentication and saved permissions | Enforce authentication for both modes and approved saved-object access |
| 11. HTTP 200 meaning | Document that 200 means the test ran; outcomes are in the body |
| 12. Saved exporter missing | Return a suitable 4xx response without running scrapes |
| 13. Existing scrape bounds | Preserve maximum concurrency of 20 and configured scrape timeout |

## Coverage check

All defined stories and acceptance scenarios are assigned to `exporter-test-api`. No unassigned story remains.
