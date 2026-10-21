# Unit Interfaces — PROMGENDEV-275

## Interface inventory

| # | Providing Unit | Consuming Unit | Interface Name | Type | Contract Format | Summary |
|---|---|---|---|---|---|---|
| 1 | `exporter-test-api` | Authenticated Promgen API clients | Exporter test endpoint | Synchronous REST | OpenAPI | Run a saved or temporary exporter test and return aggregate and per-host results |

There is one Unit of Work, so no inter-unit interface exists. The endpoint below is the external interface of the unit.

## REST contract draft

### `POST /rest/v2/exporters/{exporter_id}/test`

- **Authentication:** Existing Promgen REST authentication is required.
- **Path parameter:** `exporter_id` is a positive persisted exporter ID or reserved value `0` for a temporary exporter.
- **Content type:** `application/json`.
- **Saved exporter authorization:** Requires viewer, editor, or admin access to the exporter's project or service.
- **Temporary exporter authorization:** Requires authentication; no project/service object-level permission check.
- **Success status:** `200 OK` after scrape execution, regardless of target-level success or failure. The body carries scrape outcomes.
- **Pre-execution errors:** Existing REST 4xx conventions for authentication, permission, missing exporter, and invalid input. Host-limit violations use `400 Bad Request`.

### Request schema

The `hosts` list is optional for a saved exporter and required and non-empty for exporter ID `0`. When omitted for a saved exporter, all hosts in its project farm are selected unless that set exceeds the configured limit. Explicit hosts need not belong to that farm. Names and IP addresses, including private and loopback addresses, are allowed.

```yaml
type: object
properties:
  hosts:
    type: array
    description: >-
      Optional for saved exporters; required for exporter_id 0. Explicit host
      names or IP addresses are not restricted to the exporter's farm.
    minItems: 1
    maxItems: 50
    items:
      type: string
      minLength: 1
  scheme:
    type: string
    description: Temporary exporter scheme; used only when exporter_id is 0.
  port:
    type: integer
    description: Temporary exporter port; used only when exporter_id is 0.
  path:
    type: string
    description: Temporary exporter path; defaults to /metrics when omitted.
required: []
additionalProperties: false
```

The documented maximum of 50 is the default and is configurable. Temporary mode requires `scheme` and `port`; saved mode always uses stored exporter attributes and ignores request fields that could override those attributes. The maximum is enforced using the configured value, not a fixed schema limit.

Example temporary request:

```json
{
  "hosts": ["192.0.2.10", "localhost"],
  "scheme": "http",
  "port": 9100,
  "path": "/metrics"
}
```

### Response schema

```yaml
type: object
required: [status, results]
properties:
  status:
    type: string
    enum: [success, failure]
    description: Success only if every host result succeeds.
  results:
    type: array
    items:
      type: object
      required: [host, status]
      properties:
        host:
          type: string
        status:
          type: string
          enum: [success, failure]
        metrics:
          type: object
          description: Metric details returned for a successful scrape.
        error:
          type: string
          description: Scrape or parsing error details for a failed result.
```

Example completed test response:

```json
{
  "status": "failure",
  "results": [
    {
      "host": "192.0.2.10",
      "status": "success",
      "metrics": {"families": 12, "samples": 47}
    },
    {
      "host": "localhost",
      "status": "failure",
      "error": "Connection refused"
    }
  ]
}
```

Metric detail fields may use the existing parser's useful summary, provided the response carries metric details for successful hosts and relevant error information for failed hosts. Field names above establish a proposed stable contract for Functional Design.

### Error behavior

| Condition | HTTP behavior |
|---|---|
| Unauthenticated caller | Standard REST authentication 4xx response |
| Saved exporter does not exist | Existing REST not-found 4xx response; no scrape occurs |
| Caller lacks saved project/service viewer, editor, or admin access | Standard REST permission 4xx response |
| Invalid temporary settings, missing temporary hosts, or malformed input | `400 Bad Request` with field-level validation details |
| Explicit host list exceeds configured maximum | `400 Bad Request` describing the configured limit |
| Saved farm exceeds configured maximum and hosts were omitted | `400 Bad Request` instructing caller to provide an explicit bounded list |
| Scrape or metric parsing fails after execution starts | `200 OK`; failure is represented in the host result and aggregate status |

## Boundary and execution constraints

- The endpoint reads saved exporter configuration and never changes it.
- Temporary configuration is request-scoped and is never persisted.
- Scrape execution retains existing maximum concurrency of 20 and configured timeout behavior.
- A test response is produced after execution; no asynchronous job interface is introduced.
- There are no internal inter-unit interfaces, events, or cross-unit data models in this decomposition.

## Verification checklist

- [x] The external endpoint has a method, path, authentication, request, response, and error contract.
- [x] There are no missing inter-unit interfaces; this decomposition has one unit.
- [x] Request and response models align with the approved saved/temporary modes and story map.
- [x] Overall success requires every per-host result to succeed.
- [x] HTTP 200 is documented as operation completion, including target failures.
- [x] Configured host limits, existing scrape bounds, and non-persistence constraints are stated.
