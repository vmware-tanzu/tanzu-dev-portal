---
date: '2021-07-13'
lastmod: '2021-07-13'
layout: single
team:
  - Mark Schweighardt
  - Niran Even-Chen
  - Andrew Huffman
title: "Tanzu Service Mesh: SLO-based Measurement & Monitoring of Applications"
weight: 103
---

## Overview

TSM Service level objectives (SLOs) provide a formalized way for Application Operators, Application Owners, and Application Developers to describe, measure, and monitor the performance, quality, and reliability of microservice applications in an automated way.  

SLOs provide a shared quality benchmark for application teams to reference for gauging service level agreement (SLA) compliance, to make informed decisions around which parts of the application have performance issues and need to be optimized as a part of continuous improvement, and to help ensure a high-quality user experience for application end users.  

To achieve these benefits, application teams must be able to measure latencies, error rate, and other metrics. Tanzu Service Mesh provides important application and infrastructure metrics, without needing additional plugins or code changes. Tanzu Service Mesh also displays SLO and SLI measurements in real time through its Console.  

An SLO describes the high-level objective for acceptable operation and health of a service or application over a length of time (for example, a week or a month). Teams can specify which performance characteristics and thresholds are important to the health of their applications.  

Multiple SLOs can be defined for a single service, reflecting the reality of Quality of Service (QoS) contracts between different classes of application end users.  

An SLO consists of one or multiple service level indicators (SLIs). SLOs defined using a combination of SLIs allow teams to describe service or application health in a more precise and relevant way.  

SLIs capture important low-level performance characteristics for a particular service. SLI metrics are frequently captured and aggregated over a short time window, such as every 15 seconds. Examples of SLIs would be:
  *	99 percent of successful requests respond with latencies faster than 350 ms (99th percentile latency < 350 ms)
  * The service responds with error codes for fewer than 0.1 percent of requests (error rate < 0.1%)

![Tanzu Service Mesh Service SLO view](/images/outcomes/app-observability/tsm-service-slo-view.png)


## Use Cases

Tanzu Service Mesh provides an interface where you can configure SLO targets and select the SLIs that determine whether the targets are met. Metric levels are displayed in real-time graphs in the Tanzu Service Mesh Console user interface.  

1. **Apply SLO to Services** - You can group services with common characteristics or that are part of one or more related applications in a namespace to form a service group in Tanzu Service Mesh. You can configure and set service groups to automatically track against the same SLO definition. [more](https://docs.vmware.com/en/VMware-Tanzu-Service-Mesh/services/slos-with-tsm/GUID-A13A6444-D48B-40D1-BF52-6151A44D6CEA.html)

1. **View SLO and SLI Violations** - After you define SLO configurations, you can view and track violations of SLIs and SLOs in real time in the Tanzu Service Mesh Console user interface. [more](https://docs.vmware.com/en/VMware-Tanzu-Service-Mesh/services/slos-with-tsm/GUID-F114FF5C-E632-4711-9D5F-B25FD980C5EF.html)

1. **Track “Error Budgets”** - Based on SLOs, teams can track “error budgets,” that is, a length of time over which performance can be outside the desired SLIs without violating the SLO. [more](https://docs.vmware.com/en/VMware-Tanzu-Service-Mesh/services/slos-with-tsm/GUID-9C1D70D7-1C0C-4F72-A39C-42EDCDBB5D9E.html)

1. **Track Autoscaling Impact on Services** - Developers and operators can use the Service Level Objective (SLO) graph to see how Tanzu Service Mesh Service Autoscaler impacts the stated microservice objectives. [more](https://docs.vmware.com/en/VMware-Tanzu-Service-Mesh/services/service-autoscaling-with-tsm-user-guide/GUID-E5684E2C-8D32-4422-BA3B-822606D01E6C.html)


## Best Practices

1. **Set High-Level Objectives for Production Environments** – A common measure of the health of a service are latency percentile values. Of the three latency percentiles available to use with Tanzu Service Mesh SLOs, the p99 latency is the most appropriate service level indicator (SLI) for production environments because this metric most fully covers the experience of the users of a service. [more](https://docs.vmware.com/en/VMware-Tanzu-Service-Mesh/services/slos-with-tsm/GUID-2651936B-E8C7-41C3-AE76-5163611970C3.html)

1. **Use the P90 Latency for SLI Development** – We suggested using the p99 latency to define an SLI. Development environments do not need to have service qualities as high as that of production environments and so can use the p90 latencies for an SLI measurement. [more](https://docs.vmware.com/en/VMware-Tanzu-Service-Mesh/services/slos-with-tsm/GUID-20F1B2A2-7789-44DE-B193-352F8C4BAE23.html)

1. **Use p50 Response Times for the Least Critical Environments** – For environments where the response times are the least critical, the p50 latency SLI might be the most appropriate to use. [more](https://docs.vmware.com/en/VMware-Tanzu-Service-Mesh/services/slos-with-tsm/GUID-87766712-DCFC-433B-95F3-61CB00E6AF68.html)

1. **Do Not Set p99 Latencies Lower than p50 or p90 Latencies** - You can set high performance standards, for example, an SLI using a p99 latency of 110 ms, but don’t set the p90 and p50 latencies values to be higher than the p99 latency threshold. Set those latencies to lower values (e.g., 262 ms) so that they won’t become irrelevant when being measured. [more](https://docs.vmware.com/en/VMware-Tanzu-Service-Mesh/services/slos-with-tsm/GUID-4CC20BEE-D6DC-4CAE-9C04-F3C7BC4117A2.html)


## Sample Flow

### Step 1
To apply an SLO to a service or a service group, first set up an SLO. Select the SLIs that indicate the service quality level and what thresholds are expected to be met:  
![Tanzu Service Mesh new SLO screen](/images/outcomes/app-observability/tsm-new-slo-screen.png)


### Step 2

Apply the SLOs to single services or service groups based on rules:

*To individual services:*
![Tanzu Service Mesh new SLO service selection screen](/images/outcomes/app-observability/tsm-new-slo-single-service-selection-screen.png)

*To service groups:*
![Tanzu Service Mesh new SLO service group selection screen](/images/outcomes/app-observability/tsm-new-slo-service-group-selection-screen.png)


### Step 3

Track violations of SLIs and SLOs in real time in the Tanzu Service Mesh Console.  
![Tanzu Service Mesh track SLI and SLO violations in real-time](/images/outcomes/app-observability/tsm-track-slo-sli-violations-realtime.png)


### Step 4

Track the Error Budget. Based on SLOs, teams can track “error budgets,” that is, a length of time over which performance can be outside the desired SLIs without violating the SLO. For example, an SLO of 99.9 percent permits a service to be “unhealthy” for 0.1 percent of the time.  
![Tanzu Service Mesh track the error budget](/images/outcomes/app-observability/tsm-track-error-budget.png)