# Domain Entities and Value Objects — `exporter-scrape-reuse`

## Existing Domain Entities

| Entity | Use in this unit | Ownership / mutation |
|---|---|---|
| Project | Legacy authorization and project-to-farm resolution | Existing Django model; read only |
| Farm | Provides legacy/default host association | Existing Django model; read only |
| Host | Provides target hostname | Existing Django model; read only |
| Exporter | Supplies saved REST configuration and associated project/farm when applicable | Existing Django model; read only |

This refactor introduces no model, entity relationship, persistence, or migration.

## Internal Value Object

### `ScrapeResult` (proposed)
- `response`: Original HTTP response from `util.scrape`.
- `metric_count: int`: Parsed Prometheus metric-family count.
- `sample_count: int`: Total samples across parsed metric families.

The exact Python representation can be chosen during Code Planning. The logical fields and semantics are fixed by the approved Application Design.

## Existing Input and Output Values
- **Target URL**: String built by each caller using its existing formatting rules.
- **Request options**: Keyword arguments owned by caller policy; passed through unchanged to `util.scrape`.
- **Legacy output**: Existing JSON mapping from response URL (or current legacy error key) to counts/error details.
- **REST output**: Existing ordered per-host result list with aggregate status, sanitized errors, and existing HTTP response status.

No new externally visible entity or DTO is introduced.
