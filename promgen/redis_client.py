import prometheus_client
import redis
from prometheus_client.core import HistogramMetricFamily

from promgen import settings, validators

redis_client = redis.Redis.from_url(settings.CELERY_BROKER_URL)


def store_counter(key: str, label_values: list[str]):
    validators.metric_key(key)
    metric_prefix = "promgen_metrics:counter"
    label_values_key = ":".join(label_values)
    key_full = f"{metric_prefix}:{key}:{label_values_key}"
    redis_client.incr(key_full)


def fetch_counter(
    key: str, docs: str, labels: list[str]
) -> prometheus_client.core.CounterMetricFamily:
    validators.metric_key(key)
    metric_prefix = "promgen_metrics:counter"
    key_full = f"{metric_prefix}:{key}:*"
    counter = prometheus_client.core.CounterMetricFamily(
        name=key,
        documentation=docs,
        labels=labels,
    )

    keys = redis_client.keys(key_full)
    for k in keys:
        parts = k.decode().split(":")
        counter.add_metric(
            labels=parts[3:],
            value=int(redis_client.get(k)),
        )

    return counter


def store_histogram(key: str, duration: float, label_values: list[str]):
    validators.metric_key(key)
    metric_prefix = "promgen_metrics:histogram"
    label_values_key = ":".join(label_values)
    key_bucket = f"{metric_prefix}:{key}:bucket:{label_values_key}"
    key_sum = f"{metric_prefix}:{key}:sum:{label_values_key}"
    key_count = f"{metric_prefix}:{key}:count:{label_values_key}"

    for bucket in prometheus_client.Histogram.DEFAULT_BUCKETS:
        if duration <= bucket:
            redis_client.incr(f"{key_bucket}:{bucket}")
    redis_client.incrbyfloat(key_sum, duration)
    redis_client.incr(key_count)


def fetch_histogram(key: str, docs: str, labels: list[str]) -> HistogramMetricFamily:
    validators.metric_key(key)
    metric_prefix = "promgen_metrics:histogram"
    key_bucket = f"{metric_prefix}:{key}:bucket:*"
    key_sum = f"{metric_prefix}:{key}:sum:*"
    key_count = f"{metric_prefix}:{key}:count:*"
    histogram = HistogramMetricFamily(
        name=key,
        documentation=docs,
        labels=labels,
    )

    keys = redis_client.keys(key_bucket)
    for k in keys:
        parts = k.decode().split(":")
        labels_dict = {}
        for i, label in enumerate(labels):
            labels_dict[label] = parts[4 + i]
        labels_dict["le"] = parts[-1]
        histogram.add_sample(f"{key}_bucket", value=int(redis_client.get(k)), labels=labels_dict)

    keys = redis_client.keys(key_sum)
    for k in keys:
        parts = k.decode().split(":")
        histogram.add_sample(
            f"{key}_sum",
            value=float(redis_client.get(k)),
            labels={label: parts[i + 4] for i, label in enumerate(labels)},
        )

    keys = redis_client.keys(key_count)
    for k in keys:
        parts = k.decode().split(":")
        histogram.add_sample(
            f"{key}_count",
            value=int(redis_client.get(k)),
            labels={label: parts[i + 4] for i, label in enumerate(labels)},
        )

    return histogram
