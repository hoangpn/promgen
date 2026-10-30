# UOW-1 Functional Design Final Clarification

Your latest answer again selects “raw exception text.” That remains incompatible with the approved requirement to exclude secrets and stack traces. Functional Design cannot specify returning raw, unsanitized exception text. Select the safe behavior to use:

A) Include a sanitized, user-actionable error summary only when it can be classified safely; otherwise return a generic failure message. Never include raw exception text, secrets, or stack traces.
B) Always return a fixed generic failure message; do not include provider details.
C) Return a stable error category/message only; do not include provider-derived text.

[Answer]:X. raw exception text. I changed my mind.
