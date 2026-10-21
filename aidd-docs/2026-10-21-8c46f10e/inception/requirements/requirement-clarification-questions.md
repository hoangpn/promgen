# Follow-up Clarification Questions — PROMGENDEV-275

A few details in the answers affect how temporary exporter requests can be authorized and bounded. Please fill in each `[Answer]:` field.

## Question 1
For exporter ID `0`, should the `hosts` list be required? The endpoint has no saved exporter or project from which to derive a default farm host list.

A) Require a non-empty `hosts` list for ID `0`; do not default to all hosts.
B) Require a project ID and, when `hosts` is omitted, use all hosts from that project's farm (subject to the 50-host rule).
X) Other (specify the temporary exporter host selection and default behavior)

[Answer]:A

## Question 2
How should project/service permissions apply to exporter ID `0`? The selected endpoint identifies the exporter by ID, but ID `0` has no saved exporter whose project permissions can be checked.

A) Require a project ID for ID `0` and authorize against that project or its service using the existing viewer/editor/admin policy.
B) Allow any authenticated user to use ID `0`; keep the existing project/service permission policy for saved exporters.
C) Restrict ID `0` tests to superusers; keep the existing project/service permission policy for saved exporters.
X) Other (specify the authorization context for ID `0`)

[Answer]:X. If so, no need to check permission.

## Question 3
For supplied host names, you specified that farm membership need not be checked. Since the API makes outbound HTTP requests to these names, what host restrictions should apply?

A) Accept any syntactically valid hostname or IP address, including private and loopback addresses.
B) Accept DNS hostnames only; reject IP literals, localhost, and loopback/private address ranges.
C) Accept hostnames and IP addresses, but reject localhost, loopback, and private address ranges.
X) Other (specify the host validation or network restrictions)

[Answer]:A
