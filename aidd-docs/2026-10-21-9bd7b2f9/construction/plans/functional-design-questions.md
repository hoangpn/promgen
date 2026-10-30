# UOW-1 Functional Design Questions

## Question 1 — Failure message policy
The approved requirements require a safe failure summary but do not define how much provider exception detail to expose. Choose the public message policy. Regardless of choice, secrets and stack traces must not be returned.

A) Return a fixed generic failure message (for example, “Test notification failed.”) and keep provider details out of the response.
B) Return a sanitized, user-actionable summary when the failure can be safely classified, with a generic fallback; never return raw exception text.
C) Return a stable failure category/message only (for example, “provider_unavailable”), without explanatory provider detail.
X) Other (describe the exact message policy after the `[Answer]:` tag).

[Answer]:X. return raw exception text. 
