---
date: '2021-02-24'
description: Using Sonobuoy for cluster conformance testing
keywords:
- Kubernetes
lastmod: '2021-02-24'
linkTitle: Cluster Acceptance Testing
parent: Workload Tenancy
title: Automated Cluster Acceptance Testing
weight: 1400
oldPath: "/content/guides/kubernetes/workload-tenancy-conformance-test.md"
aliases:
- "/guides/kubernetes/workload-tenancy-conformance-test"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

Conformance testing assists in determining whether software is in compliance
with standards or specifications. With such a wide array of Kubernetes
implementations available, conformance testing is an invaluable tool. It’s
important for clusters to be CNCF conformant. It helps to ensure that a
Kubernetes cluster meets a minimum set of requirements and functionality. There
is a subset of community maintained end-to-end (e2e) tests that should pass on
any Kubernetes cluster.

[Sonobuoy](https://sonobuoy.io/) is a tool for cluster owners to ensure their
cluster conforms to CNCF guidelines via these tests. It does the following:

- Integrated end-to-end (e2e) conformance testing
- Workload debugging
- Custom data collection via extensible plugins

The support for custom plugins means that you can write and integrate any logic
into the workflow that you need. For example:

- Ensuring your cluster meets regulatory and security requirements
- Checking availability and connectivity of private, custom resources
- Performing cluster benchmarking
- Testing custom objects and APIs

VMware Tanzu Labs recommends Sonobuoy to evaluate cluster conformance. Tests can
be selected based on the [SIG](https://github.com/kubernetes-sigs) or test type
at execution time.

A conformance-passing cluster provides the following guarantees:

- Recommended configuration: The Kubernetes cluster is properly configured
  following correct practices. This is useful to have confirmed, whether you are
  running a vendor maintained distribution of Kubernetes, or handling your own
  custom setup. _This does not imply your cluster is fully secured or fostering
  best-practices specific to your organization_.

- Predictability: The tested Kubernetes cluster behavior is consistent and
  performs as expected. Available features in the official Kubernetes
  documentation can be taken as a given. Unexpected bugs should be rare, because
  distribution-specific issues are weeded out during the conformance tests.

- Interoperability: Workloads from other conforming clusters can be ported into
  your cluster, or vice versa. This standardization of Kubernetes is a key
  advantage of open source software, and allows you to avoid vendor lock-in. It
  is recommended to review the requirements and assumptions for the [e2e
  conformance
  tests](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/conformance-tests.md).

`Sonobuoy` also has a plugin architecture that allows implementors to write
additional tests. These plugins include the `kube-hunter` project (and it’s
associated plugins from AquaSecurity) and the `kube-bench` project which is
based on [CIS benchmarks](https://www.cisecurity.org/benchmark/kubernetes/).
Users can also write tests specific to your own environments. `Sonobuoy`
provides a plugin mechanism to add additional tests. A plugin needs to follow
the documented API that provides a communication mechanism for `Sonobuoy` to
inform it of the plugin’s status including whether it is pending, running, or
complete.

`Sonobuoy` also documents the configuration of the cluster being tested. It
might be helpful to store these results in a data store or check them into a
version control system. This will allow you to track conformance and
configuration changes over time. configuration changes over time.

Example customer requirements might be to run automated acceptance tests based
on cluster lifecycle events.

Examples of these events might be:

- Whenever there are major changes to cluster software version, policies, or configuration.
- Whenever a new cluster is built and deployed.
- Whenever minor software or configuration changes.
- Whenever there are changes in the control plane.

The first phase in this effort would be manually running `sonobuoy` against test
clusters in certified-conformance mode. This will establish a baseline of
conformance in your base cluster configuration. From this point you can manually
adopt a strategy that follows the list of events above.

Some examples include:

- Major cluster change - Sonobuoy run in certified-conformance mode
- New cluster build - Sonobuoy run in non-disruptive-conformance mode
- Minor changes to conformant cluster - Sonobuoy run in quick mode
- Change in control plane - Sonobuoy run in non-disruptive-conformance mode on a deployed test cluster

## Options

There are several ways to proceed with automating the conformance tests. First,
they can be after bootstrapping Kubernetes via CI/CD and Helm. This would hard
code the tests into workflows. It isn’t perfect because it relies on the person
provisioning to pick and insert the right test into the provisioning flow. If
possible, you could have the user select the lifecycle event from a dropdown in
an interface, and then have that configure the correct tests.

Second, as you potentially move toward a GitOps-type workflow, it will be
possible to have the tests run automatically based on changes checked into a
Git repository. The issue would be tagging the change types in the workflow
so that the correct tests would be run, based on the type of event that occurs.
Tests can be selected based on the SIG or test type. This would potentially
allow a further refinement of the test run to the particular areas impacted by
changes (e.g., storage, network, security, etc.)

## Concerns

There are a couple of areas that need to be discussed and monitored. The first
is provisioning time. A full conformance test could take an hour or more, while
consuming significant resources during that time. We suggest considering the
possible impact to a running production cluster. This entails selecting the
lowest test level that meets the requirements for any given action.

Second, is that the tests are generally meant to be non-disruptive to other
resources. There have been instances in the past where disruption occurred.

## Installation

### Prerequisites

The [required prerequisites](https://github.com/vmware-tanzu/sonobuoy) for
Sonobuoy are:

- Access to a Kubernetes cluster. If you do not have a cluster, we recommend
  following the [AWS Quickstart for Kubernetes
  instructions](https://aws.amazon.com/quickstart/architecture/vmware-kubernetes/).
- An admin `kubeconfig` file.
- For some advanced workflows it may be required to have `kubectl` installed.
  See [installing via Homebrew
  (MacOS)](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-with-homebrew-on-macos)
  or [building the binary
  (Linux)](https://kubernetes.io/docs/tasks/tools/install-kubectl/#tabset-1).
- The `sonobuoy images` subcommand requires [Docker](https://www.docker.com/) to
  be installed.

### Installation Steps

First, Download the sonobuoy binaries to your local system and ensure it's added
to your `PATH`. The link to download `sonobuoy` binaries is
[https://github.com/vmware-tanzu/sonobuoy/tags](https://github.com/vmware-tanzu/sonobuoy/tags).
Ensure that you download the version closest to your version of Kubernetes. For
example, If you are running versions 1.17.3 of Kubernetes, then you should
download the most recent v0.17.x version of `Sonobuoy`. You can also execute `$ sonobuoy version` and it will return the maximum and minimum versions of
Kubernetes that it will support.

```
$ sonobuoy version
Sonobuoy Version: v0.17.2
MinimumKubeVersion: 1.15.0
MaximumKubeVersion: 1.17.99
GitSHA: eb9343dbd96ebc225d076630be5c348a57dfc430
```

#### Executing Sonobuoy

To run a quick sanity test and make sure your environment is working correctly
execute:

```
sonobuoy run --wait --mode quick
```

To run the standard conformance tests with `Sonobuoy` execute the command:

```
sonobuoy run --wait
```

You can also specify running just one module or plugin:

```
sonobuoy run --plugin e2e
```

```
sonobuoy run --plugin systemd-logs
```

During the execution you can monitor status with the following commands:

```
sonobuoy status
   PLUGIN     STATUS   RESULT   COUNT
      e2e   complete   passed       1

Sonobuoy has completed. Use `sonobuoy retrieve` to get results.
```

You can also view the raw logs from the running containers via:

```
sonobuoy logs
```

Note: Using --mode quick will significantly shorten the runtime of Sonobuoy. It
runs just a single test, helping to quickly validate your Sonobuoy and
Kubernetes configuration.

Get the results from the plugins (e.g. e2e test results):

```
results=$(sonobuoy retrieve)
```

To inspect results for test failures, the number of tests failed and their names
execute:

```
# sonobuoy results $results
Plugin: e2e
Status: passed
Total: 4814
Passed: 1
Failed: 0
Skipped: 4813
```

Sonobuoy output is a gzipped tarball, named in the following manner:
`YYYYmmDDHHMM_sonobuoy_<uuid>.tar.gz`

For example:

`202003061908_sonobuoy_2e9ee3d9-8505-46d1-8664-0b3536b49b0f.tar.gz`

`YYYYmmDDHHMM` is a timestamp containing the year, month, day, hour, and minute
of the run. The '<uuid>' string is an RFC4122 UUID, consisting of lowercase
hexadecimal characters and dashes (e.g.,
"dfe30ebc-f635-42f4-9608-8abcd6311916"). This UUID should match the UUID from
the snapshot's meta/config.json, stored at the root of the tarball.

The tar file contains the [output of the
tests](https://sonobuoy.io/docs/master/results/), and a [snapshot of the tested
cluster's running configuration](https://sonobuoy.io/docs/master/snapshot/).