# UOW-1 Functional Design Clarification Questions

## Clarification of Question 1 — Raw exception text
Your answer “return raw exception text” conflicts with the approved requirement that response messages must not expose secrets or stack traces. Raw provider exception messages can contain sensitive values, so they cannot be returned without review and sanitization. Please clarify the safe response policy:

A) Return a sanitized, user-actionable summary when the error can be classified safely, with a generic fallback; never return raw exception text, secrets, or stack traces.
B) Return a fixed generic failure message and keep all provider details out of the response.
C) Return a stable error category/message only, without provider-derived text.
X) Other safe policy (describe exactly what can appear in `message`; raw exception text, secrets, and stack traces cannot be returned under the approved requirement).

[Answer]:X. raw exception text. I changed my mind.
