# User Personas — PROMGENDEV-275

## Persona: Authenticated Promgen API Consumer

- **Role**: An authenticated user or system client that calls Promgen's REST API to diagnose exporter scrape behavior.
- **Goals**:
  - Verify that an exporter can be scraped from one or more hosts.
  - Identify host-specific scrape failures and metric parsing outcomes from the response.
  - Test temporary exporter settings without saving them as a persistent exporter.
- **Access context**:
  - For a persisted exporter, the consumer has viewer, editor, or admin permission on its project or service.
  - For temporary exporter ID `0`, the consumer is authenticated but does not need project/service object-level permission.
- **Needs**:
  - A clear distinction between request execution status and scrape success.
  - Protection from accidentally changing persisted exporter configuration while testing.
  - A bounded way to select hosts when a farm is large.

## Persona-to-Story Mapping

| Persona | Related story | Goal served |
|---|---|---|
| Authenticated Promgen API Consumer | US-1: Test an exporter and inspect per-host outcomes | Diagnose a saved or temporary exporter through one API workflow. |
