---
date: '2021-02-16'
lastmod: '2021-02-26'
subsection: Packaging
team:
- John Harris
title: Packaging
topics:
- Kubernetes
weight: 52
oldPath: "/content/guides/kubernetes/packaging.md"
aliases:
- "/guides/kubernetes/packaging"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

In Kubernetes, the desired state of the system is declared via resources sent to the API Server.
Resources are stored as JSON or YAML files called *manifests*.
The management of manifests can be cumbersome but there are many tools which can help.
To inform tooling choices it is helpful to define the nature of the problems commonly encountered and identify the approaches that each tool takes to address them.

## Challenges

### Value Duplication

Managing manifests as flat data files (YAML) violates the [DRY principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).
For example, a service port defined in one resource needs to be defined in multiple other resources.

### Resource Duplication

Resource variants must be accounted for.
The number of environments manifests are applied to may be bounded (dev, stage, prod) or unbounded (per developer).
Manifests may be defined inside of an organization (SaaS app) or by a third party (Wordpress).

#### Differences in Application Configuration

A. Logging level as defined by env variable `LOG_LEVEL` (staging: Debug / production: Info)

B. Access token for accessing an external API located at `/secrets/credentials.json` (staging/prod access separate accounts)

Kubernetes accounts for these differences via resource references.
Maintaining and applying different ConfigMap and Secret manifests for each environment allows for a common Deployment definition to be used across environments.

#### Differences in Application Operation

Example: Deployment replica count (staging: 3 / production: 12)

These types of differences cannot be accounted for by native resource references.

## Techniques

### 1. Configuration Language

#### 1.A. Variable Substitution

Value duplication can be solved by elevating the level of abstraction at which resources are specified: using a language in place of data files.
A configuration language can be as simple as an interpolator or it can expose features such as expressions (`appName + ":" + appPort`) and conditionals (`if appPort != "80"`).

Some languages suffer from readability issues through introducing interpolation symbols (for example: `foo: {{ .myBarVar }}` vs `foo: bar`).
Language features also bring complexity and complexity brings bugs.
Both of these issues are more prominent in languages that lack support for the underlying data structures and formats.
Generic text templating languages fall into this category.
On the opposite end of the spectrum, languages that output structured data can help avoid bugs through data validation.

#### 1.B. Parameterization

Most configuration languages allow for grouping manifests into modules.
Resource variants are accounted for by exposing module input parameters.
Any value that needs to vary across environments is exposed outside of the module.

The pitfall of this approach is that encapsulation tends to break down over time.
As the use-cases increase, the number of exposed parameter trends towards the total of the configurable options in the underlying resources.

You end up with an API contract that is defined by your module.
This is different from (and not as well documented) as the API of the underlying resources that live in your module, yet similar in surface-area after enough time has passed.

### 2. Patching

Some tools allow for patches (partial resource definitions) to be applied to resources before they are sent to the API Server.
Patches are defined as YAML manifests that contain enough information to identify the resource they are intended to patch (for instance: `kind`, `name`, `namespace`) as well as target fields they are going to update/insert (for example: `replicas`).

While useful, patches introduce a layer of complexity.
Looking at a single file no longer represents the full resource that will be applied.
In addition, ordering must be accounted for: applying patch A before B can result in a different outcome as applying B before A.

### 3. Branching

It is best practice to store manifests in version control.
Tools like git can be used to maintain branches for each environment.
This allows for native VCS tools to be used for viewing diffs across environments.
Pull Requests targeting separate branches, as opposed to separate directories can be utilized as a means of promoting changes across environments.

### 4. Convention

Favoring convention over configuration can help mitigate repeated values.
Establishing conventions for standard ports (for example: 80 or 443 for REST APIs) can reduce required configuration as most libraries default to these values.
This can be done by taking advantage of the IP-per-pod networking model, where every pod gets a unique IP so port conflict concerns are a non-issue.
In addition, utilizing namespaces in lieu of prefixing/suffixing names (`namespace: staging, name: my-app` as opposed to `name: my-app-staging`) can help with keeping resource references constant.

## Popular Tooling & Approaches

### Helm

[Helm](https://helm.sh/) is the dominant player in the world of Kubernetes
templating. Helm manifests are organized into modules called *charts*. Charts
expose parameters that can be used to customize deployments. Customization of
the underlying resources is accomplished by using Golang text templates as a
DSL. Helm also incorporates the concept of a package registry to facilitate easy
consumption of third-party charts. It's recommended to avoid the use of Helm for
managing internal projects (a business specific API, a website deployment, etc).

**Pros:**

* Large ecosystem of charts
* Third-party software is usually available via Helm charts
  (a message queue, a database, etc)
* Deploying applications and their associated objects is done in one command
* Parameterizing values makes it easier to adjust configurations per environment
  (a values file for dev, test, prod)

**Cons:**

* Charts trend towards becoming a 1:1 mapping of parameters into Kubernetes
  resource definition fields
* Instead of configuring a well-documented Kubernetes API resource, users end up
  configuring a less well known and under-documented helm chart API (as in the
  exposed chart input parameters).
* The Go text templating language is not aware that it is outputting schemas
  defined by OpenAPI or even that it is being used to format data at all. Helm
  is not able to validate that `replicas: "three"` is an invalid Deployment
  field.
* YAML's sensitivity to indention along with conditionally defined template
  blocks often results in unforeseen issues when input parameters are changed.
  Even when indentation is accounted for correctly, the result is often hard to
  read.

### Kustomize

As of [Kubernetes
1.14](https://kubernetes.io/blog/2019/03/25/kubernetes-1-14-release-announcement/),
the [Kustomize](https://kustomize.io/) tool is a part of the native toolchain
via `kubectl apply -k`. Kustomize does not use templates. Instead, it relies on
patching. This attribute allows Kustomize to modify vanilla manifests. Kustomize
also provides *Kubernetes aware* functionality such as applying a prefix to all
managed resource names. Behavior is controlled by a `kustomization.yaml` file.

The main negative to using Kustomize is the inability to encapsulate Kubernetes
resource implementation aspects. Because patching operates at the resource
level, updating implementation details (Deployment vs StatefulSet) almost always
results in breaking changes to downstream users. The gravity of this downside
varies greatly based on the use-case. For a team that manages 3 separate
environments, encapsulation is less of a concern. On the other hand an
open-source MySQL implementation might have thousands of consumers, each with
relatively little knowledge of internal implementation details.

**Pros:**

* Part of the native `kubectl` toolchain
* Able to modify vanilla manifests.

**Cons:**

* Main negative to using Kustomize is the inability to encapsulate Kubernetes
  resource implementation aspects
* Because patching operates at the resource level, updating implementation
  details (Deployment vs StatefulSet) almost always results in breaking changes
  to downstream users.

### Operators

[Operators](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) are
composed of CustomResourceDefinitions (CRDs) and a control loop that is running
on a cluster. Open source projects such as [Prometheus now have
operators](https://github.com/coreos/prometheus-operator). Operators use CRDs to
create a domain-specific API for a specialized application. Similar in concept
to templating tools, this approach uses a programming language (the controller,
usually written in Go) to translate parameters (the CRD) into a set of manifests
(the created resources).

As the name suggests, operators are responsible for *operating* applications.
This means a sufficiently sophisticated operator probably has the ability to
perform application-specific steps required to upgrade to a new app version.
This is done in response to the user (human operator) making a declarative
version update. Because they have an active reconciliation loop running on the
cluster, operators also naturally address config-drift.

Operators can be seen as tools that move edge-case imperative operations towards
the ideal declarative approach that Kubernetes promises. For internally
developed applications, operators should be considered when there are advanced
lifecycle concerns (for example: stateful or legacy apps).

**Pros:**

* Naturally address configuration drift
* When running complex third party applications, sufficiently mature operators
  should be favored over basic templating tools.
* Mature operators can act like cloud services, making it more simple to install
  and update Kubernetes applications

**Cons:**

* Kubernetes API pollution, creating additional cognitive load on cluster users
* Rogue operators can be hard to debug
* Building an operator involves a large amount of effort
* Most cloud native workloads do not warrant the development of an operator