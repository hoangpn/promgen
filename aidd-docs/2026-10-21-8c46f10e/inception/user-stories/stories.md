# User Stories — PROMGENDEV-275

## Story US-1: Test an Exporter and Inspect Per-Host Outcomes

**As an** authenticated Promgen API consumer,  
**I want** to test a saved or temporary exporter against selected hosts and receive structured results for each host,  
**so that** I can diagnose scrape behavior without changing saved exporter configuration.

### Acceptance Criteria

#### Scenario 1: Test a saved exporter using its stored configuration

**Given** an exporter is saved and the caller has viewer, editor, or admin access to its project or service  
**When** the caller posts to `/rest/v2/exporters/{exporter_id}/test`  
**Then** Promgen uses the saved exporter configuration  
**And** request data does not override or modify the saved exporter attributes.

#### Scenario 2: Use all farm hosts when the saved exporter's farm has hosts within the configured limit

**Given** the saved exporter's project farm has at least one host and no more than the configured host limit
**And** the request does not include a host list  
**When** the caller runs the test  
**Then** Promgen tests all hosts in that farm.

#### Scenario 3: Require explicit selection when the saved exporter's farm exceeds the configured limit

**Given** the saved exporter's project farm has more hosts than the configured limit  
**And** the request does not include a host list  
**When** the caller runs the test  
**Then** Promgen returns HTTP 400  
**And** the response explains that the caller must provide a host list within the limit.

#### Scenario 4: Test an explicit host list

**Given** the caller supplies a host list no larger than the configured limit  
**When** the caller runs the test for a saved exporter  
**Then** Promgen tests the supplied host names  
**And** it does not reject a host solely because it is outside the exporter's farm  
**And** valid hostnames and IP addresses, including private and loopback addresses, are accepted.

#### Scenario 5: Reject a host list over the configured limit

**Given** the caller supplies more hosts than the configured limit  
**When** the caller runs the test  
**Then** Promgen returns HTTP 400  
**And** the response explains the host limit.

#### Scenario 6: Test a temporary exporter

**Given** the caller is authenticated  
**And** the request uses exporter ID `0`, a non-empty host list, and temporary scheme, port, and path settings  
**When** the caller runs the test  
**Then** Promgen uses those temporary settings for the scrape  
**And** an omitted path defaults to `/metrics`  
**And** Promgen does not persist the temporary exporter  
**And** no project/service object-level permission check is required.

#### Scenario 7: Reject a temporary exporter request without hosts

**Given** the caller requests a temporary exporter test without a non-empty host list  
**When** the request is validated  
**Then** Promgen returns HTTP 400  
**And** the response identifies the missing host selection.

#### Scenario 8: Return structured successful scrape results

**Given** a test runs and every host scrape succeeds  
**When** Promgen returns the response  
**Then** the HTTP status is 200  
**And** the response contains an overall success status  
**And** it contains per-host success details, including metric details.

#### Scenario 9: Return structured failed scrape results

**Given** a test runs and one or more host scrapes fail  
**When** Promgen returns the response  
**Then** the HTTP status is 200  
**And** the overall test status is failure unless every host succeeds  
**And** each host result includes its scrape status and relevant error details.

#### Scenario 10: Enforce authentication and saved-exporter permissions

**Given** a caller is unauthenticated  
**When** the caller requests any exporter test  
**Then** Promgen returns the standard authentication error response.

**Given** an authenticated caller lacks viewer, editor, or admin access to the saved exporter's project and service  
**When** the caller tests that saved exporter  
**Then** Promgen returns the standard authorization error response.

#### Scenario 11: Document the meaning of HTTP 200

**Given** a caller reads the API endpoint description  
**When** the caller reviews its response semantics  
**Then** the documentation explains that HTTP 200 means the test ran  
**And** scrape outcomes are reported in the response body.

#### Scenario 12: Return a client error when a saved exporter does not exist

**Given** the request identifies a persisted exporter ID that does not exist  
**When** the caller runs the test  
**Then** Promgen returns a suitable 4xx response  
**And** no scrape is run.

#### Scenario 13: Preserve existing scrape execution bounds

**Given** a test has a valid set of hosts within the configured request limit  
**When** Promgen runs the scrape operation  
**Then** it preserves the existing maximum of 20 concurrent host scrapes  
**And** it applies the configured scrape timeout.

#### Scenario 14: Reject an omitted host list when the saved exporter's farm is empty

**Given** the saved exporter's project farm has no hosts

**And** the request does not include a host list

**When** the caller runs the test

**Then** Promgen returns HTTP 400

**And** the response asks the caller to provide an explicit, non-empty host list

**And** Promgen does not run a scrape.

### Requirement Traceability

| Story / scenario | Requirements |
|---|---|
| US-1, Scenarios 1–2 | FR-1, FR-3, FR-5, FR-12 |
| US-1, Scenarios 3, 5 | FR-7, FR-8, FR-15; NFR-1 |
| US-1, Scenario 4 | FR-6, FR-10; NFR-4 |
| US-1, Scenarios 6–7 | FR-2, FR-4, FR-9, FR-11, FR-13; NFR-2, NFR-5 |
| US-1, Scenarios 8–9 | FR-14, FR-16, FR-17 |
| US-1, Scenario 10 | FR-11, FR-12, FR-13; NFR-2 |
| US-1, Scenario 11 | FR-18 |
| US-1, Scenario 12 | FR-15 |
| US-1, Scenario 13 | NFR-3 |
| US-1, Scenario 14 | FR-19 |

## INVEST Review

- **Independent**: The story represents a single API consumer workflow and can be delivered independently of exporter CRUD changes.
- **Negotiable**: It defines the caller's goal and observable response behavior; it leaves exact JSON field names to API design.
- **Valuable**: It lets an API consumer diagnose exporter targets without changing persisted configuration.
- **Estimable**: Scope is one endpoint action with two exporter modes, host selection limits, authorization, and result reporting.
- **Small**: It is one endpoint and one consumer goal. Saved and temporary behavior are represented as scenarios as requested; no separate stories are introduced for implementation layers.
- **Testable**: Each acceptance criterion uses observable request, response, authorization, or persistence outcomes.
