# Requirement Verification Questions — PROMGENDEV-275

Please fill in each `[Answer]:` field. Use `X` to provide another answer.

## Question 1
What should the v2 test endpoint path and target identifier be?

A) `POST /rest/v2/exporters/{exporter_id}/test`; use `0` as the temporary exporter ID.
B) `POST /rest/v2/projects/{project_id}/exporter-test`; pass an optional exporter ID in the body.
X) Other (specify the exact method, path, and identifier format)

[Answer]:A

## Question 2
For a temporary exporter (`ID=0`), what information must the request provide to determine its scrape configuration and host farm?

A) Project ID plus `job`, `port`, and optional `path`/`scheme` fields; use that project's farm.
B) Farm ID plus `job`, `port`, and optional `path`/`scheme` fields; no project ID is needed.
X) Other (list the required fields and how the target farm is resolved)

[Answer]:X. List of hosts. Plus scheme, port, path

## Question 3
How should the optional host selection field identify hosts, and how should invalid or out-of-scope hosts be handled?

A) Accept host database IDs; reject the request if any ID is not in the selected farm.
B) Accept host names; reject the request if any name is not in the selected farm.
X) Other (specify the field format and validation behavior)

[Answer]: X. Accept host names. No need to check if any name is not in the selected farm.

## Question 4
What is the maximum number of hosts that may be tested in one request, and should the limit be configurable?

A) Maximum 10 hosts, configurable through application settings.
B) Maximum 50 hosts, configurable through application settings.
C) Maximum 100 hosts, fixed in the API behavior.
X) Other (give the exact limit and whether/how it is configured)

[Answer]: B

## Question 5
When the farm has more than the threshold and the request omits the host list, the ticket says to reject the default all-host test. What should happen when a supplied host list itself exceeds the threshold, and what HTTP status should be used for that rejection?

A) Reject with HTTP 400 and require the client to split the test into smaller host lists.
B) Reject with HTTP 413 and require the client to split the test into smaller host lists.
X) Other (specify behavior and status code)

[Answer]: A

## Question 6
What response body contract should the API use for per-host results?

A) Preserve the current URL-keyed mapping and its success/error values from `ExporterScrape`.
B) Return a structured object with an overall test status and a list of host results, each with host, scrape status, and metrics/error details.
X) Other (provide a representative JSON response)

[Answer]: B. For overall test status, it only success when all are success.

## Question 7
The ticket requests HTTP 200 when a test runs even if the scrape fails. Which cases should still return a non-200 status?

A) Input validation, missing project/exporter/host, permission denial, and host-limit rejection return suitable 4xx responses; attempted scrapes return 200 with per-host results.
B) Only malformed input and permission denial return non-200; missing resources and host-limit rejection are represented in a 200 result body.
X) Other (list each case and its intended HTTP status/body behavior)

[Answer]:A

## Question 8
Which authorization policy should protect this endpoint?

A) Match the existing `ExporterScrape` policy: authenticated users with project or service viewer/editor/admin permission may test.
B) Require project or service editor/admin permission; viewers may not trigger outbound scrapes.
X) Other (specify authentication and permission requirements)

[Answer]:A

## Question 9
Should the v2 API reuse the existing scrape timeout and concurrency behavior?

A) Yes: use `PROMGEN_EXPORTER_SCRAPE_TIMEOUT` and at most 20 concurrent host scrapes per request.
B) Reuse the timeout setting but run host scrapes sequentially.
C) Define new timeout and concurrency settings (specify values after `[Answer]:`).
X) Other (specify timeout and concurrency behavior)

[Answer]:X. I think we don't need to care because we limit the hosts.
