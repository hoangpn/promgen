# Unit of Work Story Map

| Story | Acceptance criteria | Assigned unit | Coverage |
|---|---|---|---|
| [x] US-1: Test a configured notifier | AC-1: Authorized synchronous sample send; no custom payload | UOW-1 | Endpoint orchestration and reuse of `Sender.test()`. |
| [x] US-1: Test a configured notifier | AC-2: HTTP 200 and `success: true` on delivery success | UOW-1 | Success result contract. |
| [x] US-1: Test a configured notifier | AC-3: HTTP 200 and safe `success: false` on delivery failure | UOW-1 | Failure handling and response safety. |
| [x] US-1: Test a configured notifier | AC-4: Standard auth, permission, and not-found errors; no send | UOW-1 | Request-level REST behavior and permission ordering. |
| [x] US-1: Test a configured notifier | AC-5: Schema describes both HTTP 200 outcomes and `success` | UOW-1 | API schema and endpoint description. |

All acceptance criteria for US-1 are assigned to UOW-1.
