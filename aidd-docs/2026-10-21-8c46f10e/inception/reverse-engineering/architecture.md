# System Architecture

## System Overview
Promgen is a Python/Django web application. Django views and Django REST Framework viewsets expose the UI and APIs; ORM models persist monitoring entities. The application generates Prometheus configuration and performs outbound scrape/query requests. Celery supports asynchronous work and notification/configuration tasks.

## Architecture Diagram
```mermaid
graph TD
  Client[Browser / API client] --> Django[Django URL routing and views]
  Django --> REST[DRF v1 and v2 APIs]
  Django --> Domain[Promgen models, permissions, serializers]
  REST --> Domain
  Domain --> DB[(Configured relational database)]
  Django --> Hosts[Exporter hosts / external Prometheus endpoints]
  Django --> Prometheus[Prometheus query API]
  Django --> Broker[(Celery broker)]
  Broker --> Worker[Celery worker]
  Worker --> Integrations[Prometheus files and notification providers]
```

## Component Descriptions
### `promgen` Django application
- **Purpose**: Central web application and domain model.
- **Responsibilities**: UI, API, persistence, permissions, config rendering and integrations.
- **Dependencies**: Django, DRF, django-filter, django-guardian, Celery, requests, prometheus-client.
- **Type**: Application.
### `promgen/tests`
- **Purpose**: Unit and integration-level application tests.
- **Responsibilities**: Verify models, views, routes, API behavior, renderers, and notifications.
- **Dependencies**: Django test framework and project dependencies.
- **Type**: Test.
### Docker/deployment configuration
- **Purpose**: Build and run web and worker processes.
- **Responsibilities**: Container packaging and local stack configuration.
- **Type**: Infrastructure/Operations.

## Data Flow
```mermaid
sequenceDiagram
  participant U as Operator/API client
  participant W as Django view/API
  participant P as Permission layer
  participant D as Database
  participant H as Exporter host
  U->>W: Submit exporter test request
  W->>P: Check project/service access
  P-->>W: Allow or deny
  W->>D: Resolve project, farm, hosts, exporter configuration
  W->>H: HTTP scrape per selected host
  H-->>W: HTTP response / scrape error
  W-->>U: Per-host scrape details
```

## Integration Points
- **External APIs**: Prometheus query endpoints; HTTP exporter scrape endpoints; configured notification providers.
- **Databases**: Django-configured relational database for application data.
- **Third-party Services**: Celery broker and configured discovery/notification plugins.

## Infrastructure Components
- **CDK/Terraform**: None found in the repository scan.
- **Deployment Model**: Docker image; compose configuration; separate web and Celery worker processes.
- **Networking**: Web process reaches configured exporter hosts and Prometheus; deployment networking is environment-configured.
