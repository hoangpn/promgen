# Unit Interfaces

## Inter-Unit Interfaces
There are no inter-unit interfaces: UOW-1 is the only Unit of Work and remains inside the existing Promgen Django application. Existing in-process calls to the notifier model, permission policy, and task layer are component interfaces documented in `component-methods.md` and `component-dependency.md`.

## Public Interface
| # | Providing Unit | Consuming Unit | Interface Name | Type | Contract Format | Summary |
|---|---|---|---|---|---|---|
| 1 | UOW-1 | REST API client | Test notifier | Synchronous REST | OpenAPI | Trigger built-in sample delivery and return a stable result for a completed attempt. |

### OpenAPI Contract Draft
```yaml
/rest/v2/notifiers/{id}/test:
  post:
    operationId: testNotifier
    summary: Test Notifier
    description: >-
      Sends the built-in sample alert synchronously through a configured notifier. For ID 0,
      provide sender and value to test a temporary notifier without saving it; the body is optional otherwise.
      A completed delivery attempt returns HTTP 200 whether delivery succeeds or fails.
      Inspect the success field to determine the delivery outcome. Authentication,
      authorization, and not-found errors use the standard REST error responses.
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: integer
    requestBody:
      required: false
      description: Required for ID 0; omit for a saved notifier.
      content:
        application/json:
          schema:
            type: object
            required: [sender, value]
            properties:
              sender:
                type: string
                description: Installed notification driver module path.
              value:
                type: string
                description: Destination for the temporary test notification.
    responses:
      '200':
        description: Completed delivery attempt; inspect success for the outcome.
        content:
          application/json:
            schema:
              type: object
              required: [success, message]
              properties:
                success:
                  type: boolean
                message:
                  type: string
      '401':
        description: Authentication required, using the established REST behavior.
      '403':
        description: Caller lacks edit-level permission, using the established REST behavior.
      '404':
        description: Notifier does not exist, using the established REST behavior.
```

## Verification
- [x] Every inter-unit boundary is accounted for; none exist because there is one unit.
- [x] The public boundary uses the existing REST/OpenAPI contract format.
- [x] Request and response shapes are consistent with approved requirements.
- [x] The endpoint is synchronous; no asynchronous event contract applies.
