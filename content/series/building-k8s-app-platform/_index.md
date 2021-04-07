---
title: Building a Kubernetes Application Platform
description: Learn to make informed decisions when building Kubernetes-based application platforms.
structure:
  - title: Storage Integration
    source: "/guides/kubernetes/storage-integration"
    weight: 1
  - title: Container Networking
    source: "/guides/kubernetes/container-networking"
    weight: 2
    pages:
      - title: Calico Reference Architecture
        source: "/guides/kubernetes/container-networking-calico-refarch"
        weight: 1
      - title: Network Policy Implementation
        source: "/guides/kubernetes/container-networking-network-policy"
        weight: 2
  - title: Service Routing
    source: "/guides/kubernetes/service-routing"
    weight: 3
    pages:
      - title: Contour Reference Architecture
        source: "/guides/kubernetes/service-routing-contour-refarch"
        weight: 1
      - title: Istio Reference Architecture
        source: "/guides/kubernetes/service-routing-istio-refarch"
        weight: 2
  - title: Platform Observability
    source: "/guides/kubernetes/observability"
    weight: 4
    pages:
      - title: Prometheus and Grafana
        source: "/guides/kubernetes/observability-prometheus-grafana-p1"
        weight: 1
      - title: Kubernetes Monitoring Checklist
        source: "/guides/kubernetes/observability-k8s-monitoring-checklist"
        weight: 2
      - title: Kubernetes Platform Monitoring
        source: "/guides/kubernetes/observability-k8s-platform-monitoring"
        weight: 3
      - title: Showback Reference Architecture
        source: "/guides/kubernetes/observability-showback-refarch"
        weight: 4
  - title: Platform Security
    source: "/guides/kubernetes/platform-security"
    weight: 5
    pages:
      - title: Admission Control Reference Architecture
        source: "/guides/kubernetes/platform-security-admission-control"
        weight: 1
      - title: Secrets and Service Accounts
        source: "/guides/kubernetes/platform-security-secrets-sa-what-is"
        weight: 2
      - title: Secret Management Reference Architecture
        source: "/guides/kubernetes/platform-security-secret-management"
        weight: 3
      - title: Workload Identity
        source: "/guides/kubernetes/platform-security-workload-identity"
        weight: 4
      - title: Developing OPA Policies
        source: "/guides/kubernetes/platform-security-opa"
        weight: 5
  - title: Identity and Access Control
    source: "/guides/kubernetes/identity"
    weight: 6
    pages:
      - title: Configuring Dex
        source: "/guides/kubernetes/identity-dex"
        weight: 1
  - title: Workload Tenancy
    source: "/guides/kubernetes/workload-tenancy"
    weight: 7
    pages:
      - title: Platform Readiness Checklist
        source: "/guides/kubernetes/workload-tenancy-platform-checklist"
        weight: 1
      - title: Cluster Acceptance Testing
        source: "/guides/kubernetes/workload-tenancy-conformance-test"
        weight: 2
      - title: Autoscaling Reference Architecture
        source: "/guides/kubernetes/workload-tenancy-autoscaling-refarch"
        weight: 3
      - title: Cluster Tuning Guide
        source: "/guides/kubernetes/workload-tenancy-cluster-tuning"
        weight: 4
      - title: Pod Priority and Preemption
        source: "/guides/kubernetes/workload-tenancy-priority-preemption"
        weight: 5
---

## Building a Kubernetes Application Platform

Kubernetes is a primitive for building platforms at most organizations. Some organizations prefer a turn-key solution such as PAS that can abstract the underlying orchestrator, while others prefer to compose their platform based on cloud native technologies that fit their business needs. The CNFE team's customers typically fall in the latter category. For our customers, this journey includes the following concerns.

![Building a Kubernetes Application Platform](/images/series/building-k8s-app-platform/platform.png)

Historically, CNFE helped customers bootstrap and manage the lifecycle of their Kubernetes clusters. This was before cluster-api and projects such as VMware's Tanzu TKG and Pacific. With CNR (in cyan), we focus on the high-level platform components that make the platform production ready for our customers. The cyan categories seen above are arguably the most challenging for our customers. With CNR and our CNFE team, we help them make informed decisions and implementations based on best practices.
