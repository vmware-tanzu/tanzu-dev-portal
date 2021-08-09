---
date: '2021-04-14'
lastmod: '2021-04-14'
subsection: Carvel
tags:
- Carvel
- kapp
- ytt
- kapp
- imgpkg
- kapp-controller
- vendir
team:
- Tiffany Jernigan
title: Carvel
topics:
- Kubernetes
weight: 27
oldPath: "/content/guides/kubernetes/carvel.md"
aliases:
- "/guides/kubernetes/carvel"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

[Carvel](https://carvel.dev/)[^1] is an open source suite of tools. Carvel provides a set of reliable, single-purpose, composable tools that aid in your application building, configuration, and deployment to Kubernetes.

It currently[^2] contains the following tools:
* **[ytt](https://carvel.dev/ytt/)**: Template and overlay Kubernetes configuration via YAML structures, not text documents. No more counting spaces, or manual quoting.
* **[kbld](https://carvel.dev/kbld/)**: Build or reference container images in Kubernetes configuration in an immutable way.
* **[kapp](https://carvel.dev/kapp/)**: Install, upgrade, and delete multiple Kubernetes resources as one "application". Be confident your application is fully reconciled.
* **[imgpkg](https://carvel.dev/imgpkg/)**: Bundle and relocate application configuration (with images) via Docker registries. Be assured app contents are immutable.
* **[kapp-controller](https://github.com/vmware-tanzu/carvel-kapp-controller)**: Capture application deployment workflow declaratively via App CRD. Reliable GitOps experience powered by kapp.
* **[vendir](https://carvel.dev/vendir/)**: Declaratively state what files should be in a directory.

## Learn more
[carvel.dev]((https://carvel.dev/))

**Guides**
* [Getting Started with kapp](/guides/kubernetes/kapp-gs/)

**Workshops**
* [Getting Started with Carvel](https://tanzu.vmware.com/developer/workshops/lab-getting-started-with-carvel/)

[^1]: Formerly k14s
[^2]: As of April 13, 2021