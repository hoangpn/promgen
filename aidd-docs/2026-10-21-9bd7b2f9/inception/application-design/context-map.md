# Context Map — Units of Work

## Context Diagram
```mermaid
flowchart LR
  Client[API Client] -->|POST /rest/v2/notifiers/{id}/test| UOW[UOW-1: REST v2 Notifier Test Action]
  UOW -->|read notifier| DB[(Existing Promgen data)]
  UOW -->|authorize owning service/project| Auth[Existing Guardian Permission Policy]
  UOW -->|Sender.test() / send_alert| Notify[Existing Notifier and Task Integration]
  Notify -->|configured driver and target| Provider[External Notification Provider]
  UOW -->|HTTP 200 result or standard REST error| Client
```

## Unit and Data Ownership
- **UOW-1 — REST v2 Notifier Test Action**: Owns the API operation and its `{success, message}` response contract. It does not own notifier configuration or authorization records.
- **Existing Promgen data/model context**: Owns notifier configuration, including driver, target, and owning service/project.
- **Existing permission context**: Owns object-level permissions for service/project resources.
- **Existing notification integration context**: Owns driver invocation and provider delivery behavior.

## Relationship Matrix
| Upstream | Downstream | Relationship | Data/contract crossing boundary |
|---|---|---|---|
| API client | UOW-1 | Open Host Service / Published Language | REST POST request and `{success, message}` or standard REST error response. |
| UOW-1 | Existing Promgen model and permission contexts | Conformist; direct in-process calls | Notifier identifier, model instance, owning object, authorization decision. |
| UOW-1 | Existing notification integration | Conformist; direct synchronous call | Configured sender, target, and built-in sample alert; completion or exception. |
| Notification integration | External provider | Provider integration | Provider-specific request and delivery result. |

## Text Alternative
There is one new Unit of Work, UOW-1, inside the existing Promgen Django application. It receives an authenticated REST request, uses existing model and permission data, invokes existing notification delivery code, and returns the public REST result. Existing components retain ownership of notifier configuration, permissions, and provider behavior. The API client and notification provider are outside the unit boundary. There are no peer Units of Work and therefore no inter-unit dependency or circular dependency.

## Verification
- [x] All units are included in the map.
- [x] Data ownership remains with existing model, permission, and notification contexts; UOW-1 owns only the API operation/contract.
- [x] There are no circular unit dependencies; only one unit exists.
- [x] Unit granularity matches the single endpoint story and existing monolith.
