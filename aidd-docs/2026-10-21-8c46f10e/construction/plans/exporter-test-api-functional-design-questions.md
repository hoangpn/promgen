# Functional Design Clarification Questions — `exporter-test-api`

Please answer each question in its `[Answer]:` field. These decisions affect the saved-exporter no-host outcome.

## Question 1: Saved exporter farm has no hosts

When a saved exporter test omits `hosts`, and its project farm contains zero hosts, what should the endpoint do?

A) Return HTTP 400 and ask the caller to provide a non-empty explicit host list.
B) Return HTTP 200 with overall failure and an empty `results` list, because the request completed without target results.
C) Return HTTP 200 with overall success and an empty `results` list.
X) Other (describe the desired behavior).

[Answer]:A
