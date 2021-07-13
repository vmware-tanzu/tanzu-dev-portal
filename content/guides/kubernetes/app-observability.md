---
date: '2021-02-16'
lastmod: '2021-02-26'
subsection: Application Observability
team:
- John Harris
title: Application Observability
topics:
- Kubernetes
weight: 22
oldPath: "/content/guides/kubernetes/app-observability.md"
aliases:
- "/guides/kubernetes/app-observability"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

The term "observability" in control theory states that the system is observable
if the internal states of the system and its behavior can be determined by only
looking at its inputs and outputs.

In software, observability means we can answer most questions about a system's
status and performance by looking from the outside. The system has been
instrumented to externalize and make available measurements useful to those
responsible for the platform's success and reliability.

Observability aims to provide highly granular insights into the behavior of
production systems along with rich context, perfect for debugging and
performance analysis.

## Health checks

Health checks (often custom HTTP endpoints) help orchestrators, like Kubernetes,
perform automated actions to maintain overall system health. These can be a
simple HTTP route that returns meaningful values, or a command that can be
executed from within the container.

## Metrics

Metrics are a numeric representation of data that is collected at intervals into
a time series. Numerical time series data is easy to store and query, which
helps when looking for historical trends. Over a longer period of time,
this numerical data can be compressed into less granular aggregates like daily
or weekly, for example. This allows for longer retention periods for
historic purposes.

## Logging

Log entries represent discrete events. Log entries are essential for debugging,
as they often include stack traces and other contextual information that can
help identify the root cause of observed failures.

Logging is used when the developer wants to explicitly output some message for
someone to see. It is coded directly into executable code, including passing
along values of relevant variables. When problems occur, the logs are useful for
debugging purposes, showing where a failure occurred, such as a stack trace for
an exception that got thrown.

## Distributed Tracing

Distributed, request, or end-to-end tracing captures the end-to-end flow of a
request through the system. Tracing essentially captures both relationships
between services (the services the request touched), and the structure of work
through the system (synchronous or asynchronous processing, child-of or
follows-from relationships). Tracing is something unique to the cloud-native
world, allowing developers and operators to track the exchanges between
different microservices.

In order to enable distributed tracing, an application needs to be "instrumented"
by adding and configuring distributed tracing client libraries. For example, you
can configure application to send trace records to an Open Tracing compliant
trace server whenever any JAX-RS annotated method is invoked. This way you have
an audit record of what got called when, by whom, and how long it took. By
adding Open Tracing annotations to traced methods you can also include
information about what private methods have been called in your code for
example.

## Popular Tooling & Approaches

### Health checks 

Kubernetes exposes the following health probes:

* Readiness -  whether application is considered 'Ready' to a cluster.
* Liveness - safety check to ensure that application hasn't halted operation unexpectedly.
* Startup - for applications that require a larger amount of time for their initial startup.

Use above health endpoints based on application's requirements.

For implementation details, see [the guide on Probing Application
State](../app-enhancements-probing-app-state).

### Metrics 

[Prometheus](https://prometheus.io/) is an open-source systems monitoring and
alerting toolkit. It works well for recording any purely numeric time series. It
fits both machine-centric monitoring as well as monitoring of highly dynamic
service-oriented architectures. In a world of microservices, its support for
multi-dimensional data collection and querying is a particular strength. We
recommend the [Prometheus
operator](https://github.com/coreos/prometheus-operator), which manages the
lifecycle of prometheus and comes with many sensible defaults.

Managing Prometheus could become challenging overtime:

* Data retention - ability to efficiently store data for longer periods of time.
* High-Cardinality Metrics - metrics with dimensions that have many different
  values can cause performance degradation.
* Dynamic service scraping - could cause performance degradation.

We recommend the reader to check with their platform team if any metrics
scraping services are available in the platform.

For more details on this concern, see [the opinion on Export Application
Metrics](../app-enhancements#export-application-metrics).

### Logging

In most Kubernetes deployments, all logging should happen to standard out and
standard error. Additionally, most platform teams will offer developers a log
shipping solution, so you should check with your platform team to understand
how this works.

Typical Logging Stack:

#### Log Aggregator

This component collects logs from pods running on different nodes and route them
to a central location.
[fluentd](https://www.fluentd.org/) has become a
popular log aggregator for Kubernetes deployments. It is small, efficient and
has a wide plugin ecosystem.

#### Log Collector/Storage/Search

This component stores the logs from log aggregators and provides an interface to
search logs efficiently. It should also provide storage management and archival
of logs. Ideally, this component should be resilient to node failures, so that
logging does not become unavailable in case of infrastructure failures.
[Elasticsearch](https://www.elastic.co/products/elasticsearch) is one of the
options, as it can ingest logs from fluentd, creates inverted indices on
structured log data making efficient search possible, and has multi-master
architecture with ability to shard data for high availability.

#### UI and Alerting

Visualizations are key for log analysis of distributed applications. A good UI
with query capabilities makes it easier to sift through application logs,
correlate and debug issues. Custom dashboards can provide high level overview of
the health of the distributed application.
[Kibana](https://www.elastic.co/products/kibana) from Elasticsearch can be used
as the UI for the log storage, and will be explored as an option here. Alerting
is typically an actionable event in the system. It can be set up in conjunction
with logging and monitoring.

For additional implementation details, see [the guide on Logging
Practices](../app-enhancements-logging-practices).

### Distributed Tracing

Consider using Distributed Tracing in complex multi-service architectures. It
can help with detection of cascading failures in service calls, optimization of
Database requests, latency problems etc.

We recommend to check with the platform team to see what tracing platform tools
pre-exist / are available.

Typical Distributed Tracing stack:

#### ZOP stack (Zipkin, OpenTracing, Prometheus)

* [Zipkin](https://zipkin.io/) - distributed tracing system. Applications need
  to be "instrumented" to report trace data to Zipkin. This usually means
  configuration of a [tracer or instrumentation
  library](https://zipkin.io/pages/tracers_instrumentation).
* [OpenTracing](https://opentracing.io/) - vendor-neutral APIs and
  instrumentation for distributed tracing.
* [Prometheus](https://prometheus.io/) - open-source systems monitoring and alerting toolkit. Before
  you can monitor your services, you need to add instrumentation to their code
  via one of the [client
  libraries](https://prometheus.io/docs/instrumenting/clientlibs/).
  
#### JOP stack (Jaeger, OpenTracing, Prometheus)

* [Jaeger](https://www.jaegertracing.io/) - distributed tracing system. It is
  used for monitoring and troubleshooting microservices-based distributed
  systems. Applications must be instrumented before they can send tracing data
  to Jaeger backend. Check the [Client
  Libraries](https://www.jaegertracing.io/docs/1.16/client-libraries/) section
  for information about how to use the OpenTracing API and how to initialize and
  configure Jaeger tracers.
* [OpenTracing](https://opentracing.io/) - vendor-neutral APIs and
  instrumentation for distributed tracing.
* [Prometheus](https://prometheus.io/) - open-source systems monitoring and alerting toolkit. Before
  you can monitor your services, you need to add instrumentation to their code
  via one of the [client
  libraries](https://prometheus.io/docs/instrumenting/clientlibs/).