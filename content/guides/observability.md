---
date: '2021-02-24'
lastmod: '2021-02-26'
subsection: Platform Observability
team:
- Alexander Brand
title: Platform Observability
weight: 57
oldPath: "/content/guides/kubernetes/observability.md"
aliases:
- "/guides/kubernetes/observability"
level1: Managing and Operating Kubernetes
level2: Monitoring and Observing Kubernetes
tags:
- Kubernetes
---

Observability is crucial for successfully operating a complex software system
such as Kubernetes. With this in mind, Kubernetes offers multiple facilities
that enable operators to observe the system at runtime. With that said, the onus
is on the platform operator to consume, evaluate, and act on the information
exposed by Kubernetes.

Kubernetes has multiple sources of information that operators can use to observe
the platform's behavior. These include component logs, audit logs, events, and
metrics.

## Component Logs

Kubernetes is a distributed system composed of multiple processes that run
across multiple hosts. Each component writes logs to stdout and stderr to
provide visibility into what is happening in the process. These logs are one of
the most important troubleshooting tools available to platform operators when
there is an issue with the system.

## Audit Logs

The Kubernetes API server records every interaction with an audit log. The audit
logging capability is configurable using a policy file that controls which
events should be recorded and what data they should include. Typically, each log
entry contains what happened, when it happened, and who was involved in the
action. The API server supports multiple audit backends for persisting the audit
log: a file on disk, a statically-configured webhook, and a
dynamically-configured webhook.

## Events

In addition to logs, Kubernetes components emit events that track what is
happening in the system. Examples of events include the Kubelet pulling a
container image, or the Scheduler assigning a pod to a node. Events are
first-class resources in the Kubernetes API, and thus are stored in the
Kubernetes API server. Because they are stored in the API, there is a retention
policy that controls the length of time the events are stored. To persist events
for historical analysis, platform operators should implement a solution that
ships the events to an external system.

## Metrics

Each Kubernetes component exposes a set of metrics that track the component's
state. These metrics are available through an HTTP endpoint at `/metrics` and
are exposed using the Prometheus data format. The API server, for example,
exposes metrics such as `apiserver_current_inflight_requests` and
`apiserver_watch_events_total`. To take advantage of these metrics, platform
operators should use a monitoring system that can scrape Prometheus metrics and
generate alerts on those metrics.

Kubernetes also exposes node and pod-level resource consumption metrics through
the Metrics API. These metrics are accessible directly via the API, or more
easily, through the `kubectl top` command. To enable this API, operators must
deploy the [Kubernetes Metrics
server](https://kubernetes.io/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server),
which is not deployed by default.

## Distributed Tracing

Distributed Tracing is another important pillar of observability. As a platform
operator, consider deploying a tracing system to offer it as a platform service.
This will enable developers to perform distributed tracing in their
applications.

## Popular Tooling and Approaches

### Logging

#### Elasticsearch

Open source search and analytics database for all types of data that is commonly
utilized in the Kubernetes ecosystem for log storage.

It is the storage and search engine component of the ELK/EFK stack.

Its distributed, fast and scalable data ingestion nature make it a natural fit
for container log aggregation, search and analytics.

**Pros:**

- Built for scale
- Automated failover handling
- Distributed by design
- Widely tested
- Commonly used and known as part of the ELK/EFK stack

**Cons:**

- Geographic distribution of nodes not recommended
- Relatively large memory footprint
- The difficulty configuring and tuning it is considerable

It's worth considering buying and paying support for an alternative hosted
platform such as vRealize Log Insight.

#### Logstash

The data processing pipeline that aggregates and ships logs to the storage
engine utilized in the cluster. Commonly combined with Elasticsearch as
component of the ELK stack. It can ingest and process multiple sources
simultaneously, making it a good candidate to funnel container logs from a host,
process and forward them to the storage engine.

**Pros:**

- Commonly used
- Flexible

**Cons:**

- Performance and resource consumption can be problematic
- Written in JRuby (java runtime required)

#### Fluentd

Fluentd is another data collector/processing engine that is commonly combined
with Elasticsearch as a container logging platform. It can parse, analyze and
transform logs before sending them to the storage engine. Written in Ruby and C
for the speed-sensitive components, it has a lot of plugins provided by the Ruby
community.

Fluentd runs containerized in the cluster as a DaemonSet. Typically all nodes in
the platform will run a Fluentd Pod which is configured to read the standard
output of all containers running in the node and funnel them for storage in a
database. The database can live inside or outside of the cluster.

Typically, containerized log storage leverages Elasticsearch. Fluentd can ship
logs to external entities such as Splunk as well.

**Pros:**

- Part of CNCF
- Wide ecosystem of plugins out of the box provided
  by the Ruby community
- Excellent support for Elastic
- Written in CRuby (No java runtime required)

**Cons:**

- Partly written in Ruby make it slower than other options

#### Fluent Bit

Fluent Bit is Fluentd's smaller counterpart. It's part of the Fluentd ecosystem.
It's more suitable for containerized workloads given its smaller footprint. It's
fully written in C, but significantly fewer plugins are available for it.

**Pros:**

- Created with a highly distributed use case in mind
- Super light memory footprint
- Extensible
- Fully written in C, zero dependencies

**Cons:**

- Smaller number of plugins available compared to Fluentd

Fluent Bit should be your first choice for Kubernetes, unless you find a
specific need or missing plugin to consider Fluentd.

#### Loki

Loki is a horizontally-scalable, highly-available, multi-tenant log aggregation
system inspired by Prometheus. It is designed to be very cost effective and easy
to operate. It does not index the contents of the logs, but rather a set of
labels for each log stream.

Loki supports a number of database options for the indexes and can store logs on
disk or on any of the major object storage options such as S3, Minio, Google
Cloud Object Storage.

It is usually paired with [Grafana](#grafana) for visualization and
[Promtail](#promtail) for log ingestion.

**Pros:**

- Considerably easier to use and operate than Elasticsearch
- Offloads indexing and log storage to reliable external services
- Allows you to use Grafana for both logs and metrics

**Cons:**

- Less sophisticated search capabilities than Elasticsearch

#### Promtail

Promtail is the log shipping component built specifically for shipping logs to
Loki. It would not be used otherwise.

#### vRealize Log Insight

vRealize Log Insight (vRLI) is VMware's product offering that delivers
heterogeneous and highly scalable log management with intuitive, actionable
dashboards, sophisticated analytics and broad third-party extensibility.

**Pros:**

- A Fluentd plugin exists for vRLI
- Scalability. Supports up to 15,000 events / second by scaling out appliances
- Automatic visualizations based on existing data
- Integration with vRealize Operations Manager
- Accepts rsyslog, syslog-ng, log4j agents or through API ingestion

**Cons:**

- Requires a licenses to be purchased
  - The version that's bundled with NSX-T can only be used for NSX-T or vSphere
    logs.
- Must be deployed in a virtual environment through an appliance.

### Visualization

#### Kibana

Open source data discovery and visualization dashboard for accessing information
stored in Elasticsearch. It's the 'K' in the ELK/EFK stacks. It and provides
insight into the container logs aggregated from the cluster. With the stored
data in Elasticsearch it is possible to create colorful dashboards, charts and
reports, gaining immediate valuable insight into the state of the cluster and
the applications running in it.

**Pros:**

- Integrates seamlessly with Elasticsearch

#### Grafana

Grafana is an interactive visualization tool popularly used as a frontend for
metrics. It has native integration with Prometheus and Elasticsearch, making it
an easy choice to make for visualizing performance data of a running Kubernetes
cluster.

It's easy to install and expandable, making it appealing for visualizing
application performance data.

It's typically installed as an application in the cluster it will operate on.

**Pros:**

- Integrates seamlessly with Prometheus

### Monitoring

#### Prometheus

Prometheus is a CNCF project widely used for Kubernetes platform monitoring as
well as metrics collection and aggregation. Prometheus works by scraping data
from configured endpoints, parsing it and storing it in its internal time-series
database. This data can then be easily queried directly with PromQL, or
displayed using a visualization tool such as Grafana.

Prometheus has push-gateway facility as well, for instrumenting applications
with the available client libraries to push metrics when exposing an endpoint to
scrape is not suitable. Ephemeral jobs such as pipelines are a good example of
tasks in which pushing data to the metrics server make sense.

A [Prometheus Operator](https://github.com/coreos/prometheus-operator) exists to
install and manage the operation of your Prometheus cluster. We highly recommend
taking advantage of it when installing Prometheus.

**Pros:**

- Part of CNCF
- Easy installation
- Well documented

**Cons:**

- Long term storage is limited
- Often requires addon solutions

#### Datadog

System and application monitoring tool that runs as a DaemonSet in the cluster.
Allows you to get metrics and logs from services in real time to visualize
kubernetes states and get notified of failovers and events.

Additionally, it can be configured outside of the cluster and have it gather
Kubernetes metrics.

Alerting is also possible based on collected metrics from the platform or
the applications running in it.

Similarly to ELK, it provides log aggregation, live tail facility, log archiving
and custom visualizations.

**Pros:**

- Platform administrators have less to worry about

**Cons:**

- Agent is not open source
- Agent configuration not properly documented
- Cost $$$

If customers aren't price sensitive, this is a good option and offloads from the
platform administrator duties.

#### Tanzu Observability by Wavefront

Tanzu Observability by Wavefront is a Software as a Service solution from VMware
that collects and aggregates Kubernetes and Application metrics.

The Tanzu Observability by Wavefront service deploys daemon sets on Kubernetes
cluster nodes to collect metrics on clusters, nodes, pods, containers, and
control plane objects. These metrics are then pushed to the SaaS application
through a proxy.

Wavefront integrates with many different platforms and applications out of the
box and builds initial dashboards to quickly visualize the health of workloads
and clusters.

Wavefront integrates with many different platforms including:

- Kubernetes
- Pivotal Cloud Foundry
- VMware vSphere
- Amazon Web Services
- Microsoft Azure
- Google Cloud Platform

VMware Tanzu Kubernetes Grid Integrated has an integration built in to enable
the Wavefront functionality.

Wavefront also integrates with application services including:

- Apache HTTP
- Envoy
- Istio
- Elasticsearch
- NGINX
- WebSphere

Wavefront can also ingest data from other monitoring tools such as: Fluentd,
Logstash, Splunk, vROps, Jaeger, and Prometheus.

Alert notifications can be sent to a variety of solutions including: Slack,
PagerDuty, ServiceNow, or a Webhook for custom alerts.

**Pros:**

- Platform administrators have less to worry about
- Wavefront can scale to manage large numbers of clusters simultaneously
- Built in Integrations for platforms, applications, and alerts

**Cons:**

- Data is stored outside the customer's data center