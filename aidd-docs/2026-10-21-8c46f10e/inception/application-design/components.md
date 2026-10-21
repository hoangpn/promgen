# Application Components — PROMGENDEV-275

## Design Overview
The feature adds one test action to the existing Promgen v2 exporter API. It reuses existing models, permission mapping, scrape utilities, and DRF response/schema tooling. It does not require a new deployable component, database table, or persistence path.

## Components

### 1. Exporter v2 API (`ExporterViewSet`)
- **Purpose**: Expose exporter operations to authenticated API clients.
- **Responsibilities**: Route the test request; distinguish saved exporter IDs from temporary ID `0`; coordinate request validation, authorization, target resolution, scrape execution, and response creation.
- **Interface**: `POST /rest/v2/exporters/{exporter_id}/test`.
- **Type**: Existing application/API component, extended for this feature.

### 2. Exporter Test Request Validation
- **Purpose**: Validate test-only inputs without updating an exporter record.
- **Responsibilities**: Validate host list shape and configured maximum; validate temporary exporter scheme, port, and path; apply `/metrics` as the temporary path default; avoid applying saved exporter attributes from the request.
- **Interface**: Request serializer used by the test action. Saved and temporary modes may use mode-specific validation within one serializer or separate serializers.
- **Type**: New logical API component within `promgen/serializers.py`.

### 3. Test Authorization
- **Purpose**: Enforce the approved authentication and saved-exporter access policy.
- **Responsibilities**: Require authenticated API access; check project/service viewer, editor, or admin permission for a saved exporter; skip project/service object permission checks for temporary ID `0`.
- **Interface**: The test action uses the authenticated request gate, resolves saved objects without applying the generic unsafe-method object-role check, then calls the existing permission helper with the approved project/service viewer/editor/admin roles. The temporary ID `0` branch performs no object-role check.
- **Type**: Existing permission layer with action-specific behavior.

### 4. Exporter and Farm Data Access
- **Purpose**: Provide saved exporter configuration and default target hosts.
- **Responsibilities**: Load the saved exporter; read its project/farm/hosts when no host list is supplied; never persist temporary test settings.
- **Interface**: Existing `Exporter`, `Project`, `Farm`, and `Host` ORM models.
- **Type**: Existing domain/model component.

### 5. Scrape Execution
- **Purpose**: Request and parse Prometheus metrics from selected targets.
- **Responsibilities**: Build target URLs from the selected exporter settings, run bounded host scrapes using existing concurrency/timeout protections, and return per-host scrape and metric outcomes.
- **Interface**: Existing HTTP scrape utility and Prometheus exposition parser.
- **Type**: Existing integration/utilities component.

### 6. Test Result and API Schema
- **Purpose**: Return a stable result contract and explain endpoint semantics to clients.
- **Responsibilities**: Aggregate overall success only when all host results succeed; include per-host status and metric/error details; document that HTTP 200 means the test ran.
- **Interface**: DRF `Response` payload and `drf-spectacular` endpoint schema.
- **Type**: Existing API response/documentation tooling, extended for this feature.

## Component Boundary
All components remain within the existing `promgen` Django package. The test action is the orchestration boundary; no separate service class is required by the current scope.
