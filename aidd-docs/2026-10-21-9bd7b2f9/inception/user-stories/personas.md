# User Personas

## API Integrator
- **Archetype**: Developer or service integrating with Promgen's REST API.
- **Goals**: Trigger a test notification for a configured notifier and determine whether delivery succeeded from a predictable response.
- **Needs**: A synchronous result, a stable `success` field, a useful human-readable message, and clear API documentation.
- **Constraints**: Must authenticate and have edit-level permission for the notifier's owning service or project. Must distinguish delivery outcomes from request-level errors.

## Promgen Administrator or Service/Project Editor
- **Archetype**: A Promgen user responsible for configuring or managing a notifier and authorized to edit its owning service or project.
- **Goals**: Verify that a configured notifier can deliver the built-in sample alert to its configured destination.
- **Needs**: A safe report of the outcome without exposing credentials, secrets, or stack traces.
- **Constraints**: The test uses the configured destination and built-in sample; it does not send a caller-supplied alert.

## Persona-to-Story Mapping
| Persona | Related story | Contribution |
|---|---|---|
| API Integrator | US-1 | Invokes the endpoint and interprets the delivery result or request error. |
| Promgen Administrator or Service/Project Editor | US-1 | Uses the API to validate a notifier they are authorized to edit. |
