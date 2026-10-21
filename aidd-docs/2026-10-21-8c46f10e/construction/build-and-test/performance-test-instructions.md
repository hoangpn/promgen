# Performance Test Instructions

No standalone performance/load suite or latency target is defined for this endpoint. Performance behavior is checked at the unit/API level by asserting the configured scrape timeout and a maximum of 20 concurrent scrape workers. Run `SECRET_KEY=1 .venv/bin/promgen test promgen.tests.test_rest -v 2 --buffer`.

Do not interpret this concurrency assertion as a production throughput benchmark. A load test requires an agreed workload and an isolated environment with representative Prometheus targets.
