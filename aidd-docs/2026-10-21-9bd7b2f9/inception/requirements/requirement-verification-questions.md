# Requirement Verification Questions

Jira PROMGENDEV-276 contains only the title “Add API for testing a Notifier.” Please fill in each `[Answer]:` field. If a proposed option is not right, choose X and describe the expected behavior.

## Question 1 — API route and version
Where should clients invoke the notifier test operation?

A) Add a detail action to the existing REST v2 API: `POST /rest/v2/notifiers/{id}/test` (recommended; keeps notifier operations together).
B) Add the operation to the legacy REST API.
C) Use a separate top-level API route.
X) Other (describe after the `[Answer]:` tag).

[Answer]:A

## Question 2 — Test notification content and side effect
What should the API send?

A) Send the existing built-in sample alert to the notifier’s configured destination; do not accept caller-provided alert content (recommended; matches `Sender.test()`).
B) Accept an alert payload in the request and send that payload.
C) Validate/render the notifier without sending an external notification.
X) Other (describe after the `[Answer]:` tag).

[Answer]:A

## Question 3 — Execution and success response
How should the API report a successful test send?

A) Wait for the send attempt to finish and return its result in the HTTP response.
B) Queue the send and return an accepted response with a task or operation identifier.
C) Queue the send and return a simple success/accepted response without an identifier.
X) Other (describe after the `[Answer]:` tag).

[Answer]:A

## Question 4 — Delivery failures
How should a send failure be surfaced?

A) Return a non-2xx response with a machine-readable error when the send attempt fails (recommended if execution is synchronous).
B) Return success once queued and record/report delivery failure asynchronously.
C) Return a generic error without exposing provider details.
X) Other (describe after the `[Answer]:` tag).

[Answer]:X. this API end point should return a 200 OK even if the test fails. And then include the details of the test in the response's body. It is probably a good idea to explain this behavior in the API endpoint's description.

## Question 5 — Authorization
Who may trigger the test operation?

A) Use the same object-level permissions as editing a notifier (service/project admin or editor), consistent with the current UI route (recommended).
B) Allow any authenticated user who can view the notifier.
C) Restrict it to superusers.
X) Other (describe after the `[Answer]:` tag).

[Answer]:A

## Question 6 — Operational constraints
Are there limits or additional requirements for sending test notifications (for example, rate limiting, audit logging, or masking destination details in responses)?

X) Describe the requirements after the `[Answer]:` tag. If there are none, write “No additional constraints.”

[Answer]:No additional constraints.

## Follow-up Question 7 — Response body details
The endpoint will return HTTP 200 whether delivery succeeds or fails. Which machine-readable body should describe the attempt?

A) Return `{"success": true|false, "message": "..."}` with a human-readable result; on failure, include a safe error summary without stack traces or secrets (recommended).
B) Return the full provider exception details in the response body.
C) Return provider-specific structured fields; specify the required fields.
X) Other (describe after the `[Answer]:` tag).

[Answer]:A
