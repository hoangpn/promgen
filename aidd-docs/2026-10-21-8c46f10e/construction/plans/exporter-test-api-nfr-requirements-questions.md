# NFR Requirements Questions — `exporter-test-api`

## Question 1 — Expected load and latency
What workload and response-time target should guide this endpoint? A request may scrape up to the configured host maximum, defaults to 50 hosts, and runs at most 20 requests concurrently.

A) Low interactive use: up to 5 simultaneous endpoint requests; no separate latency target beyond existing scrape timeout behavior.
B) Moderate use: up to 20 simultaneous endpoint requests; aim to complete within the existing 25-second scrape timeout plus API overhead.
C) High or automated use: more than 20 simultaneous endpoint requests or a defined stricter latency target; describe the expected rate/target after `[Answer]:`.
X) Other (describe the expected rate and latency target after the `[Answer]:` tag).

[Answer]:X. No need to care. Clarified in `exporter-test-api-nfr-clarification-questions.md`, Clarification 1: A — no additional workload or latency target.

## Question 2 — Abuse controls
Temporary tests require authentication but intentionally have no project/service object permission check, and may target private or loopback addresses. Should this endpoint have an additional request-rate or concurrency limit beyond the existing 50-host cap and 20-scrape-worker limit?

A) No additional endpoint-specific limit; rely on existing API authentication and deployment-level controls.
B) Apply a per-user request rate limit; describe the desired rate/window after `[Answer]:`.
C) Apply a global endpoint concurrency/rate limit; describe the desired limit after `[Answer]:`.
X) Other (describe the required abuse control after the `[Answer]:` tag).

[Answer]:X. No need to care. Clarified in `exporter-test-api-nfr-clarification-questions.md`, Clarification 2: A — no endpoint-specific rate or concurrency limit.

## Question 3 — Redirects from explicit targets
Should a scrape follow HTTP redirects returned by an explicitly selected target? Redirects can send the server to a different host, including a private or loopback address; direct private and loopback targets are already allowed by the approved Functional Design.

A) Do not follow redirects; report the redirect response as a failed host result.
B) Follow redirects only when the destination remains the same host and port.
C) Follow redirects to any destination, consistent with the approved ability to scrape private and loopback targets.
X) Other (describe the redirect policy after the `[Answer]:` tag).

[Answer]: Clarified in `exporter-test-api-nfr-clarification-questions.md`, Clarification 3: A — do not follow redirects.

## Question 4 — Operational visibility and error details
What visibility should accompany this endpoint? The functional contract returns sanitized per-host error details to the caller and does not persist results.

A) Keep visibility limited to the API response and existing application request/error logs; do not add metrics or persistent records.
B) Add aggregate application metrics for request count, duration, and success/failure; do not label metrics with raw hostnames.
C) Add aggregate metrics and structured logs for per-host failures, with host values redacted or otherwise protected.
X) Other (describe the required logging/metrics and retention expectations after the `[Answer]:` tag).

[Answer]: Clarified in `exporter-test-api-nfr-clarification-questions.md`, Clarification 4: A — API response and existing application logs only; no new metrics or persistent records.
