---
date: '2021-02-16'
lastmod: '2021-02-24'
parent: Application Enhancements
tags:
- Kubernetes
team:
- John Harris
title: Label Best Practices
oldPath: "/content/guides/kubernetes/app-enhancements-label-design.md"
aliases:
- "/guides/kubernetes/app-enhancements-label-design"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

Labels are a means for describing and identifying components that make up an
application with arbitrary key/value pairs. Labels are attached to Kubernetes
API objects at time of creation or can also be added/modified/removed at a later
time. Labels are simple pieces of metadata that can help with organization and
administration of an application's lifecycle.

Labels are **_not always_** arbitrary, and are sometimes applied automatically to
some API objects by Kubernetes, typically via the
[`kubelet`](https://kubernetes.io/docs/reference/kubernetes-api/labels-annotations-taints/).

## Using Labels

### Label Example

Here's an example of some labels attached to a pod manifest:

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: my_app
  namespace: my_app
  labels:
    app: my_app
    version: 1.0.0
    component: frontend
spec:
  ...
```

### Labels with Selectors

Selectors enable you to select Kubernetes API objects based on the labels
applied to them. This is useful when defining what workloads should be routed
to or from a service and their underlying components, such as what pods should
be managed by a replica set. A selector achieves this by specifying which
key/value pairs to search for within API object metadata (typically, but not
limited to pod specifications) to be able to properly perform these tasks, and
is one of the main purposes for labels.

#### Selector Example

Here's an example of using a service to expose pods identified by their applied
labels.

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: myapp_db_svc
  namespace: my_app
  labels:
    app: my_app_db
    version: 1.0.0
    component: backend
spec:
  selector:
    app: my_app_db
    version: 1.0.0
    component: backend
  type: ClusterIP
  ports:
    - protocol: TCP
      port: 3306
      targetPort: 3306
```

### Identifying Application Components with Labels

The Kubernetes API can be queried with the `kubectl` client to list specific
components with specific labels. There are three operators that can be used to
perform these queries: `=`, `==`, and `!=`.

{{< table "table" >}}
| Operator | Description |
| -------- | ----------- |
| =        | equal to or is |
| ==       | equal to or is |
| !=       | not equal to or is not |
{{< table />}}
#### Label Query Examples

Find all components in Kubernetes that are related to running MySQL
(`app: mysql`) and not production (`environment: production`).

```bash
kubectl get all -l name==mysql,environment!=production -A
```

In the command above:

- `get`: lists the API objects
- `all`: is equivalent to all component/API object types
- `-l`: label(s) to query/filter on
- `name==mysql`: label with key `name` is/equals `mysql`
- `,`: comma separator for multiple label queries
- `environment!=production`: label with key `environment` is not/not equal to
  `production`
- `-A`: from all namespaces in Kubernetes.

### Considerations when Creating Labeling Standards

As you can see from the prior sections, labels have a fairly important place in
successful application deployment within Kubernetes. It is important
to standardize labels in every component within a Kubernetes environment.
These design decisions will make
locating and managing components easier in the long run.

Some recommended labels per the
[Kubernetes documentation](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/)
include:
{{< table "table" >}}
| Key | Description | Example |
| --- | --- | --- |
| name | The name of the application | mysql |
| instance | A unique name identifying the instance of an application | frontend-green |
| version | The current version of the application (e.g., a semantic version, revision hash, etc.) | 1.0.0 |
| component | The component within the architecture | database |
| part-of | The name of a parent application this application is part of | wordpress |
| managed-by | The tool being used to manage the operation of an application | app-manager |
{{< table />}}

VMware recommends you extend the above labels with the following, where relevant.

{{< table "table" >}}
| Key | Description | Example |
| --- | --- | --- |
| tier | The tier in the overall application architecture | frontend |
| environment | The environment in reference to the systems development lifecycle | dev |
| purpose | The purpose of this particular application component | queue |
| owner | The team or individual responsible for deploying or maintaining the application component | "John Doe" |
| owner-email | The email address of the responsible team or individual for deploying or maintaining the application component | "app-dev-team@company.com" |
| repository | A URL to the repository that contains this application's source code | "github.com/kubernetes/kubernetes" |
| managed-by | The tool being used to manage the operation of an application | helm |
| business-unit | The business unit who owns this application | "finance" |
{{< table />}}