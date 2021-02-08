---
title:  "Compliance Testing with Sonobuoy"
linkTitle: "Sonobuoy"
weight: 
topics:
- Kubernetes
- Containers
- Microservices
---

When a developer deploys an application on Kubernetes, how does he or she know that the APIs required by the application are supported by the cluster? Sonobuoy provides operators and developers a way to test a Kubernetes cluster to make sure it works properly. 

Sonobuoy lets you understand the state of a Kubernetes cluster by running a set of Kubernetes conformance tests in an accessible and non-destructive manner. Its diagnostics provide a customizable, extendable, and cluster-agnostic way to generate clear, informative reports about a cluster, regardless of your deployment details.
## Sonobuoy Use Cases

Sonobuoy's plugin model and elective data dumps of Kubernetes resource objects and cluster nodes let you address three use cases:

* Integrated end-to-end conformance testing of Kubernetes clusters
* Workload debugging
* Custom data collection using extensible plugins

## Sonobuoy Components

Sonobuoy has three main components:

* A command-line utility that you use to trigger conformance tests, check status, view activity logs, and retrieve and analyze test results.
* An aggregator that runs in a Kubernetes pod to start plugins and aggregate their test results.
* Plugins that execute in ephemeral namespaces with a Sonobuoy sidecar to run specific tests or conformance frameworks.

With a single Sonobuoy command, you can run the same tests that are used to qualify an upstream Kubernetes release. This ability provides strong levels of assurance that your cluster is configured correctly, and you can use this as a  tool to debug configuration problems.

## Native Extensibility Through Plugins
Sonobuoy provides several plugins out of the box, including a systemd log collector and the upstream end-to-end Kubernetes conformance test suite. Sonobuoy is a community standard tool for executing conformance tests on a Kubernetes cluster; however, its architecture is designed to accomplish much more.

The open plugin architecture equips a platform operator or system administrator with the means to develop custom conformance and validation tests for environments before they go into production.

A custom plugin can be developed by creating a plugin definition file that describes how the plugin is structured and the parameters the plugin requires. The plugin then needs to follow a documented API that provides a communication mechanism for Sonobuoy to inform it of the plugin’s status, including whether it is pending, running, or complete.

You can easily create a plugin from a Docker image and run it within Sonobuoy without manually editing any YAML files. You can also easily modify the environment variables of a plugin without editing a YAML file.

This enhanced support for custom plugins means that you can write and integrate any logic into the workflow that you need; for example, you can write logic that lets you do the following:

* Ensure your cluster fulfills your organization’s security requirements.
* Test whether your cluster complies with industry standards.
* Check availability and connectivity of private, custom resources.
* Perform in-cluster benchmarking.

## No Internet Access, No Problem
Running critical systems in air-gapped environments, where the system can’t reach out to the Internet, has long been a common practice to limit the attack surface. Although installing Kubernetes in air-gapped environments has been possible since before Kubernetes 1.6, testing those clusters for conformance was difficult. A recent version of Sonobuoy makes it possible to test air-gapped Kubernetes clusters. The end-to-end Kubernetes test suite can be run to validate your cluster’s state without internet connectivity or investment in a custom, ad hoc work around.

Sonobuoy is the underlying technology powering the [Certified Kubernetes Conformance Program](https://www.cncf.io/certification/software-conformance), which was created by the Cloud Native Computing Foundation \(CNCF\) and is used by every [Certified Kubernetes Service Provider](https://www.cncf.io/certification/kcsp/). As such it is a necessary component in every Kubernetes developer’s toolkit.

## Keep Learning
Visit the [Sonobuoy page](https://sonobuoy.io/) to see the latest documentation, read relevant blogs, and find out about new plugins.

The following VMware blogs explain how to:
* [Determine whether a cluster is properly configured and whether it is working as it should.](https://tanzu.vmware.com/content/blog/certifying-kubernetes-with-sonobuoy) 
* [Use Sonobuoy plugins for custom testing](https://tanzu.vmware.com/content/blog/fast-and-easy-sonobuoy-plugins-for-custom-testing-of-almost-anything) 
* [Modify environment variables for any plugin.](https://tanzu.vmware.com/content/blog/setting-environment-variables-for-plugins-on-the-fly-with-sonobuoy-0-15-0) 
* [Test air-gapped Kubernetes clusters.](https://tanzu.vmware.com/content/blog/isolated-to-conformant-testing-air-gapped-kubernetes-with-sonobuoy-0-14)







