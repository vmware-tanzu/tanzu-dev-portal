---
date: '2021-06-07'
lastmod: '2021-06-15'
layout: single
title: How a Container Registry Can Help
weight: 6
---

A container registry provides a single place to store and retrieve your container images. At a minimum, a container registry will support the [OCI Distribution Specification](https://github.com/opencontainers/distribution-spec), the API that both Docker and Kubernetes expect to be supported to pull container images. They may either be a publicly hosted such as [Docker Hub](https://hub.docker.com/) or [Google Container Registry](https://cloud.google.com/container-registry), or they may be hosted privately such as [Harbor](https://goharbor.io/).

## Automated Security Scans

A popular feature of container registry is the ability to automatically scan container images for known vulnerabilities. As a single container image can container many layers, including a base container image that you don't even maintain, it can be a huge challenge to stay on top of keeping your dependencies up to date. Because of this, you'll find many container registries offer the ability to scan your containers every time you upload one and report if there's a known vulnerability discovered. For example, Harbor relies on [Trivy](https://github.com/aquasecurity/trivy), an open-source solution that performs static analysis on container images. Of course, as new vulnerabilities are discovered, you can rerun these scans against your existing images. If an issue is found, you can configure your registry to block any requests to pull the image based on the severity.

![An automated scan in Harbor finding vulnerabilities in our container](/images/outcomes/secure-software-supply-chain/harbor-scan.png)

## Policy Enforcement

Being the central point for gathering and distributing container images, the container registry has a lot of say in _who_ can push or pull an image. Every major container registry -- public or private -- supports requiring the user to be authenticated to interact with it. As such, the registry can then manage a list of actions the user (or group of users) can perform. For example, suppose we create a group called "developers" and they have access to an image that contains a collections of services that the require to perform their job. We can configure the registry to allow them to pull down the image to their workstation, but prevent them from pushing up new versions of the container. 

This all contributes to one of the most fundamental ideas of security: the principle of least privilege. That is, the user should have access to only the actions and resources that they absolutely require.

Finally, if your pipeline relies on container images published or hosted by others, your own container registry can act as a proxy and a cache to those remote registries. For example, say a container that we're building relies on the `ubuntu:18.04` container as a base. By default, your pipeline can reach out to your container registry and ask for this image. If it already exists on your private registry, great! It gets pulled down just as it would normally. If it doesn't exist however, the registry can then proxy that request to Docker Hub where that container image lives, pull it down, and cache it in your private registry. Not only does this mean that deployments aren't relying on an external dependency, but it also allows you to ensure the version of a container image that you're using is exactly what you expect it to be.

## Using a Container Registry in an Air-Gapped Environment

In an air-gapped environment, your delivery pipeline may have no access to the internet at all. The good news is, you can still use a private container registry just as you would a public one. You can push and pull to it, manage permissions, even scan for vulnerabilities. Of course new security definitions and updates must be done manually, but this also means that your delivery pipeline is physically separated from public networks and the internet, giving an additional layer of protection for your process. 

## Additional Uses for a Registry

Some registries offer even more features that can really enhance your software delivery pipeline. Harbor for example can also act as a repository for [Helm charts](https://goharbor.io/docs/latest/working-with-projects/working-with-images/managing-helm-charts/). When you upload your Helm chart to Harbor, you can see all of the information about it right in the browser.

![Showing the values for a Helm chart in Harbor](/images/outcomes/secure-software-supply-chain/harbor-helm-values.png)

Another feature some repositories support is the ability to trigger webhooks based on different scenarios. For example, a common one may be that you want to trigger a new pipeline when a new version of your container image is uploaded, or you want to notify a group of people when a security scan fails. This makes is much simpler to integrate with your delivery pipeline no matter the technology used to back it.

![Various webhooks in Harbor](/images/outcomes/secure-software-supply-chain/harbor-hooks.png)