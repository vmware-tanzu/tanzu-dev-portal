---
date: '2021-02-16'
lastmod: '2021-02-16'
parent: Application Observability
tags:
- Kubernetes
team:
- John Harris
title: Exporting Application Metrics
topics:
- Kubernetes
oldPath: "/content/guides/kubernetes/app-observability-exporting-metrics.md"
aliases:
- "/guides/kubernetes/app-observability-exporting-metrics"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

Exposing useful metrics is critical to understanding what is happening with your
software in production.  Without this quantifiable data, it is almost impossible
to manage and develop your application intelligently.  This guide covers how to
expose metrics from your app for collection by
[Prometheus](https://prometheus.io/).

## What Makes a Good Metric

A good metric provides quantifiable measurements on a time series that helps you
understand:

1. Application Performance
2. Resource Consumption

### Application Performance

This category is often expressed as "user experience" and encompasses
measurements that indicate if users or client apps are getting what they should
reasonably expect from the application.  This also includes metrics that can
affect the user experience indirectly and help identify the root cause of
problems.  Examples include:

- [Apdex](https://en.wikipedia.org/wiki/Apdex) score
- Total request count
- Jobs processed (for batch-type workloads)
- Queue length and wait times (for batch-type workloads)
- Request durations
- Count on number 2xx responses sent back to clients
- Count on number 5xx responses sent back to clients
- DNS query time
- Garbage collection frequency and duration
- Payloads processed and their size

### Resource Consumption

Resource consumption is important for two reasons:  Capacity planning and cost
management.  How utilized is my application?  In other words, how much more
traffic can my application handle without scaling vertically or horizontally?
How much infrastructure will need to be provisioned for increases in traffic or
availability?  How much does it cost the business to run a given workload?
These are questions that can be answered, at least in part, by metrics such as:

- CPU usage
- Memory consumption
- Disk I/O usage
- Network bandwidth usage
- Pod replica counts

## Implementing an Exporter

There are two methods to expose metrics from the software you run:

1. Third-Party Exporters: These are distinct workloads that collect metrics from
   your running application and expose them to Prometheus.  This is a good
   solution when leveraging open-source software such as nginx or redis as a part
   of your solution.  These can often be run as sidecar containers.
2. Instrumented Metrics: This option involves instrumenting your apps using the
   Prometheus [client libraries](https://prometheus.io/docs/instrumenting/clientlibs/)
   or [utilities](https://prometheus.io/docs/instrumenting/exporters/#other-third-party-utilities)
   so that exposing metrics is natively supported. This is a good solution if
   you are developing apps that are designed for and intended to run on Kubernetes.

The [Prometheus docs](https://prometheus.io/docs/instrumenting/exporters/) offer
an excellent source for finding third-party exporters as well as software that
natively exposes Prometheus metrics.

### Implementation in Java

Prometheus officially maintains a [JMX
exporter](https://github.com/prometheus/jmx_exporter) which can be run as a Java
Agent for JVM-based applications.

For instrumenting an application that runs on the JVM, the officially maintained
[client_java](https://github.com/prometheus/client_java) library offers four
types of metrics with clear [example
code](https://github.com/prometheus/client_java#instrumenting).

### Implementation in Python

If instrumenting a Python application, use the official
[client_python](https://github.com/prometheus/client_python) library.  It
supports the same four types of metrics and also provides clear
[examples](https://github.com/prometheus/client_python#instrumenting) for how
to use each.

If using the popular Django framework, consider the unofficial
[django-prometheus](https://github.com/korfuri/django-prometheus) python
library.

### Implementation in Go

For Go applications, the official
[client_golang](https://github.com/prometheus/client_golang) library is highly
recommended.  It's important to note that this project includes both an
instrumentation library as well as a client library for applications that need
to query metrics from a Prometheus server, which is a different concern.  The
repo includes
[examples](https://github.com/prometheus/client_golang/tree/master/examples) for
instrumenting but other excellent examples exist in
[etcd](https://github.com/etcd-io/etcd/blob/master/etcdserver/metrics.go) and in
[Kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging/src/k8s.io/component-base/metrics)


### Implementation in Node.js

There is not an official client library for node.js, however there is an
unofficial third-party [prom-client](https://github.com/siimon/prom-client)
project that has attracted considerable community participation.  It supports
each of the metric types addressed below, includes [clear
examples](https://github.com/siimon/prom-client/tree/master/example) and good
documentation.

## Types of Metrics

Prometheus client libraries generally use four [metric
types](https://prometheus.io/docs/concepts/metric_types/).  It is helpful to
understand how each is used when instrumenting an application to expose
Prometheus metrics.

### Counter

A counter is a metric that can only increase.  It is useful for things like
total number of requests, error counts or any accumulating events.

### Gauge

A gauge is used for numerical values that can increase and decrease.  Current
resource usage and pod replica counts are examples of where you would use gauges.

### Summary

Summaries track the size and number of events.  An example would be DNS queries
where the size would be the duration of the queries and the number would be
the count of DNS queries.  Another example would be for garbage collection where
size is the duration of garbage collection events and number would be the number of
times garbage collection occurred.

### Histogram

Histograms track the size and number of events and organize them into buckets.
An Apdex score, for example, could be based on a histogram using buckets of
request durations.  These request durations should be defined according to the
service level objectives (SLO) for the application.  Define what is desired and
tolerable, then use histograms to readily determine if your objectives are being
met.  It also provides convenient mechanisms upon which to alert if values
violate tolerable thresholds.

## Scraping Metrics With Prometheus

As an application developer, you will preferably have a Prometheus monitoring
system available as a part of the platform.  If so, when you deploy your
application, you will have to tell Prometheus where to scrape your app's metrics
from.

### Scrape Config

Prometheus will need a [scrape
config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)
to find your app's metrics.  Given this config Prometheus would scrape metrics
from https://samplehost:8000/metrics:

```yaml
# The job name assigned to scraped metrics by default.
job_name: sample-app

# List of statically configured targets where metrics will be scraped.
static_configs:
  targets:
  - "samplehost:8000"

# The HTTP resource path on which to fetch metrics from targets.
metrics_path: /metrics

# Default to scraping over https. If required, just disable this or change to `http`.
scheme: https

# Configures the scrape request's TLS settings.
tls_config:
  # CA certificate to validate API server certificate with.
  ca_file: /path/to/ca.crt
  # Certificate and key files for client cert authentication to the server.
  cert_file: /path/to/sample-app.crt
  key_file: /path/to/sample-app.key
```

### Service Monitor

While it's helpful to understand what the scrape config for Prometheus consists
of, in a Kubernetes environment, it is highly recommended that you use the
[Prometheus Operator](https://github.com/coreos/prometheus-operator)
to deploy the Prometheus instances and manage the scrape configs by way of the
ServiceMonitor resource.

You may not be responsible for deploying the Prometheus server, but it's helpful
to understand how it references the ServiceMonitor resource which will be used
by the operator to configure Prometheus on your behalf.  In the Prometheus
Operator's Prometheus resource, the `serviceMonitorSelector` is used to
associate Service Monitors with a Prometheus instance.

Consider this example of a Prometheus resource used to deploy a Prometheus
server:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prometheus
spec:
  serviceAccountName: prometheus
  serviceMonitorSelector:
    matchLabels:
      team: samples  # references ServiceMonitor's label
```

Here is an example of a ServiceMonitor resource manifest you could deploy along
with the other resources for your app to get the metrics scraped by the
Prometheus server.  The Service Monitor uses a label selector to identify
Services and the associated Endpoint objects.

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: sample-app
  labels:
    team: samples  # used by Prometheus resource to associate this ServiceMonitor
spec:
  namespeceSelector:
    matchNames:
    - sample-namespace
  selector:
    matchLabels:
      app: sample-app  # this label must be on sample-app's service
  endpoints:
  - port: web  # the named port on the Service from which to scrape
    path: /metrics
```