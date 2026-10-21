# API Documentation

## REST APIs
### Existing exporter scrape test (UI endpoint)
- **Method**: POST
- **Path**: `/project/<project-id>/scrape`
- **Purpose**: Scrape each host attached to the project's farm using submitted `scheme`, `port`, and `path` values.
- **Request**: Form data; defaults `path` to `/metrics`. The implementation does not load an Exporter record.
- **Response**: JSON keyed by scrape URL with status/metric/sample counts or per-host error text. Permission failure currently returns an error JSON response without an explicit non-200 status.

### v2 exporters API
- **Method**: GET/PATCH/PUT/DELETE via DRF router
- **Path**: `/rest/v2/exporters` and exporter detail paths (router configured without trailing slash)
- **Purpose**: List, retrieve, update, and delete persisted exporters.
- **Request/Response**: `ExporterRetrieveSerializer`; detailed fields were not traced in this pass.
- **Authentication/Authorization**: DRF authentication and `PromgenGuardianRestPermission`.

### API route base
- **Path**: `/rest/v2/`
- **Purpose**: DRF v2 router for exporters, projects, farms, services, and related resources.

## Internal APIs
### `ExporterScrape.post(request, pk)`
- **Parameters**: project primary key and POST form values.
- **Behavior**: Checks project/service viewer/editor/admin permission; schedules up to 20 concurrent host scrapes; uses `PROMGEN_EXPORTER_SCRAPE_TIMEOUT`; parses Prometheus metrics and returns per-host results.

## Data Models
### `Exporter`
- **Fields**: `job`, `port`, `path`, `scheme`, `enabled`, `project`.
- **Relationships**: Belongs to Project; Project may be associated with a Farm containing Hosts.
- **Validation**: Unique by job, port, path, scheme, and project; scheme choices are HTTP/HTTPS; empty path resolves to `/metrics`.
### `Farm` / `Host`
- **Fields**: Farm has hosts; Host has name and farm reference.
- **Relationships**: Farm is associated with a Project; each Host belongs to a Farm.
- **Validation**: Host name unique within its farm.
