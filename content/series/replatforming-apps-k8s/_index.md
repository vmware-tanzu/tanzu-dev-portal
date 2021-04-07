---
title: Replatforming Applications onto Kubernetes
description: Learn the various techniques for moving workloads to your Kubernetes platform.
structure:
  - title: Developer Workflow
    source: "/guides/kubernetes/dev-workflow"
    weight: 1
    pages:
      - title: Using Tilt
        source: "/guides/kubernetes/dev-workflow-tilt"
        weight: 1
      - title: Troubleshooting Applications
        weight: 2
        source: "/guides/kubernetes/dev-workflow-troubleshooting"
  - title: Application Enhancements
    source: "/guides/kubernetes/app-enhancements"
    weight: 2
    pages:
      - title: Externalizing Configuration
        source: "/guides/kubernetes/app-enhancements-externalizing-configuration"
        weight: 1
      - title: Application Readiness Checklist
        source: "/guides/kubernetes/app-enhancements-checklist"
        weight: 2
      - title: Graceful Shutdown
        source: "/guides/kubernetes/app-enhancements-graceful-shutdown"
        weight: 3
      - title: Label Best Practices
        source: "/guides/kubernetes/app-enhancements-label-design"
        weight: 4
      - title: Logging Best Practices
        source: "/guides/kubernetes/app-enhancements-logging-practices"
        weight: 5
      - title: Probing Application State
        source: "/guides/kubernetes/app-enhancements-probing-app-state"
        weight: 6
  - title: Packaging
    source: "/guides/kubernetes/packaging"
    weight: 3
  - title: Application Lifecycle
    source: "/guides/kubernetes/app-lifecycle"
    weight: 4
  - title: Application Observability
    source: "/guides/kubernetes/app-observability"
    weight: 5
    pages:
      - title: Exporting Metrics
        source: "/guides/kubernetes/app-observability-exporting-metrics"
        weight: 1
---

## Replatforming Applications onto Kubernetes

Kubernetes-based platforms are only as successful as the applications that run
atop them. Thus, for our customers (platform teams) to be successful we need to
ensure their customers (application teams) are successful. Kubernetes is not
free-to-play, however, replatforming applications can often be achieved with
small changes and enablement.

![Replatforming Applications onto Kubernetes](/images/series/replatforming-apps-k8s/apps.png)

Developer personas have as much (if not more) variance in their requirements as
operators when it comes to enabling their application to take advantage of
Kubernetes. For example, many workloads just need to be containerized and their
configuration externalized. While others need to build an operator to handle
complex stateful workloads. Similar to platform, CNR for apps contains decision
criteria, recipes, and reference implementations to help developers be
successful.
