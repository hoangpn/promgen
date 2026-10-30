# Component Inventory

## Application Packages
- `promgen` — Django application, REST APIs, monitoring configuration, and alert processing.
- `promgen.notification` — built-in notification provider drivers.
- `promgen.discovery` — service discovery integrations.

## Infrastructure Packages
- Docker and docker-compose files — container packaging and local/demo orchestration; no separate infrastructure-as-code package found.

## Shared Packages
- `promgen` internal utilities, models, serializers, permissions, and plugin registry.

## Test Packages
- `promgen.tests` — Django unit and integration tests, fixtures, and provider tests.

## Total Count
- **Total Packages**: 4 logical packages (one application, two internal shared/integration packages, one test package; categories overlap with Python namespace nesting).
- **Application**: 1
- **Infrastructure**: 0 dedicated IaC packages
- **Shared**: 2
- **Test**: 1
