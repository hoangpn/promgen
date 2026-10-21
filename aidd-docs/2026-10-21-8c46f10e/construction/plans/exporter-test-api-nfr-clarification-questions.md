# NFR Requirements Clarification Questions — `exporter-test-api`

The answers to NFR Questions 1 and 2 used “No need to care,” which does not specify whether the endpoint should have defined capacity targets or additional abuse controls. NFR Questions 3 and 4 were left unanswered. Please resolve each item below.

## Clarification 1 — Workload and latency (NFR Question 1)
Does “No need to care” mean there are no additional workload or latency targets for this feature, and the existing host cap, worker limit, and scrape timeout are sufficient?

A) Yes. Set no additional workload or latency target; retain the approved 50-host default cap, 20 concurrent scrapes, and existing configured timeout.
B) No. Define a target for simultaneous API requests and/or response latency after `[Answer]:`.
X) Other (describe the requirement after the `[Answer]:` tag).

[Answer]:A

## Clarification 2 — Abuse controls (NFR Question 2)
Does “No need to care” mean no endpoint-specific rate or concurrency limit will be added, relying on authentication, the host cap, the scrape worker bound, and deployment-level controls?

A) Yes. Add no endpoint-specific limit beyond the approved host and scrape concurrency bounds.
B) No. Require a per-user rate limit; specify rate and window after `[Answer]:`.
C) No. Require a global endpoint concurrency or rate limit; specify it after `[Answer]:`.
X) Other (describe the required control after the `[Answer]:` tag).

[Answer]:A

## Clarification 3 — Redirects (NFR Question 3)
Choose the HTTP redirect policy for scrapes. Private and loopback targets are permitted by the approved Functional Design.

A) Do not follow redirects; treat the redirect response as a failed host result.
B) Follow redirects only when the destination remains the same host and port.
C) Follow redirects to any destination.
X) Other (describe the policy after the `[Answer]:` tag).

[Answer]:A

## Clarification 4 — Operational visibility (NFR Question 4)
Choose the visibility and logging scope. Per-host error details returned to API callers remain sanitized under the approved Functional Design.

A) API response and existing application request/error logs only; add no metrics or persistent records.
B) Add aggregate request count, duration, and success/failure metrics, without raw hostnames as labels.
C) Add aggregate metrics and structured per-host failure logs, with host values redacted or protected.
X) Other (describe metrics, logs, and retention after the `[Answer]:` tag).

[Answer]:A
