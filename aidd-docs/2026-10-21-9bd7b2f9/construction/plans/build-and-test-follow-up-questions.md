# Build and Test Follow-up Decision

Build and Test reproduced three failures unrelated to the notifier API. Choose the follow-up scope before code changes:

## Question 1: How should the unrelated full-suite failures be handled?

- A. Prepare a follow-up plan to make the full suite pass: align the two rule-order expectations with the intended API contract and address the SQLite `host-detail` query failure, then rerun the full suite.
- B. Prepare a follow-up plan for the SQLite `host-detail` failure only; keep the rule-order failures documented as existing expectation mismatches.
- C. Record these as accepted baseline failures and stop before Operations; do not change code or tests.

**[Answer]:**C
