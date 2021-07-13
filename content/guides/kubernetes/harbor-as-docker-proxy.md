---
date: '2021-01-22'
lastmod: '2021-02-25'
linkTitle: Eliminate Docker Hub Rate Limits
parent: Harbor
patterns:
- Deployment
tags:
- Kubernetes
- Containers
team:
- Paul Czarkowski
title: How to use Harbor Registry to Eliminate Docker Hub Rate Limits
topics:
- Kubernetes
weight: 2
oldPath: "/content/guides/kubernetes/harbor-as-docker-proxy.md"
aliases:
- "/guides/kubernetes/harbor-as-docker-proxy"
level1: Managing and Operating Kubernetes
level2: Preparing and Deploying Kubernetes Workloads
---

{{< youtube id="KSH2Hzk-E7U" class="youtube-video-shortcode" >}}
<div align="center"><i><a href="https://www.youtube.com/watch?v=KSH2Hzk-E7U&feature=youtu.be">Watch Paul Walk through this guide on Tanzu.TV Shortcuts.</a></i></div>

On August 24 2020 [Docker](https://docker.com) announced they would be
implementing
[Rate Limits on the Docker Hub](https://www.docker.com/blog/scaling-docker-to-serve-millions-more-developers-network-egress/)
and they were
[implemented on November 2 2020](https://www.docker.com/blog/what-you-need-to-know-about-upcoming-docker-hub-rate-limiting/)
thus ending our free ride of unlimited Docker Image pulls.

Unless you're a paid customer of Docker or very lucky you've probably started to
see errors like this:

```
ERROR: toomanyrequests: Too Many Requests.
```

Or

```
You have reached your pull rate limit. You may increase
the limit by authenticating and upgrading:
https://www.docker.com/increase-rate-limits.
```

This can be very frustrating, especially in Kubernetes where it might not be
apparent why your new Pod is just sitting there in a `Pending` state. Imagine
this happening right as you need to scale your Deployments to serve a sudden
increase in traffic.

This would be where a troll on Reddit (You know the sort, the kind that will
"[What you guys are referring to as Linux, is in fact, GNU/Linux"](https://news.ycombinator.com/item?id=6277943)
at you would proclaim
"[You own your availability](https://www.whoownsmyavailability.com/)". He's not
wrong ... but also not helpful.

![that twitter troll](/images/guides/kubernetes/harbor-as-docker-proxy/tweet-who-owns-your-availability.png)

Thankfully the team developing the [Harbor Registry](https://goharbor.io/) have
been hard at work to ensure that you can access the images you need without
downloading the whole internet to your server.

There are actually two features in Harbor that will let us work around the rate
limits, Registry Replication, and Registry Proxy.

Registry Replication allows you to replicate images between registries, whereas
Proxy lets you keep a local copy of images on an as-requested basis.

In a production scenario you would probably look to Replication so that you can
be very specific about what Images to allow, however in a Development scenario
you might use Proxy-ing as you don't necessarily know ahead of time what Images
you might need access to. Further using Proxy-ing can be really useful for a
home lab to cut down on internet traffic as you pull images.

We'll explore both options below.

## Prerequisites

Before you get started, you'll need Harbor (ideally version 2.1.3 or newer)
installed somewhere. If you don't already have it installed, we've made it
incredibly easy for your with our [Getting Started with Harbor](../harbor-gs/)
Guide.

Once you have a Harbor registry installed, log into it's Web UI as an Admin user.

{{% aside type="info" title="Confirm Versions" %}}
Note: Docker has been rapidly changing both the Docker Hub and the Docker CLI,
this makes it difficult for Integrations such as Harbor's replication / proxy
features to keep pace. To ensure the best chance of functionality, ensure you're
using the versions stated in this document.
{{% /aside %}}

## Set up a Registry Endpoint

Whether doing replication or proxy, you need to configure Dockerhub as a
replication endpoint.

1. Go to **Administration** -> **Registries** and click the **+ New Endpoint** button.

1. Set the **Provider** and **Name** both to `Docker Hub`.

1. You can leave the rest of the settings as default, unless you want access to
   private images, in which case add in your **Access ID** and **Access
   Secret**.

![Create Endpoint](/images/guides/kubernetes/harbor-as-docker-proxy/create-endpoint.png)

1. Press the **Test Connection** button and an a successful test hit **OK** to save.

## Create a Dockerhub Proxy

For more information about how Proxy Projects work, see the
[official documentation](https://goharbor.io/docs/2.1.0/administration/configure-proxy-cache/).

1. Go to **Projects** and click the **+ New Project** button.

1. Set **Project Name** to `dockerhub-proxy`.

1. Set **Access Level** to `Public` (unless you intend to make it private and require login).

1. Leave **Storage Quota** at the default `-1 GB`.

1. Set **Proxy Cache** to `Docker Hub` (the Endpoint we created earlier).

   ![Create Proxy Project](/images/guides/kubernetes/harbor-as-docker-proxy/create-proxy-project.png)

1. Test the proxy is working with `docker pull`:  

```bash
$ docker pull <url-of-registry>/dockerhub-proxy/library/ubuntu:20.04
20.04: Pulling from dockerhub-proxy/library/ubuntu
83ee3a23efb7: Pull complete
db98fc6f11f0: Pull complete
f611acd52c6c: Pull complete
Digest: sha256:703218c0465075f4425e58fac086e09e1de5c340b12976ab9eb8ad26615c3715
Status: Downloaded newer image for harbor.aws.paulczar.wtf/dockerhub-proxy/library/ubuntu:20.04
harbor.aws.paulczar.wtf/dockerhub-proxy/library/ubuntu:20.04
```

{{% aside type="warning" title="Content-Type Error" %}}
If you receive error
`Error response from daemon: missing or empty Content-Type header`, you'll need
to upgrade Harbor to version 2.1.3 as some changes in Docker have had downstream
ripple effects. Older versions of Docker will still work.
{{% /aside %}}

## Configure Docker Hub Replication

### Create a Project to replicate to

With Proxy-ing enabled, let's now turn our eyes to Replication. This is where we
can surgically select which images we want to make available.

For more information about how Replication works, see the
[official documentation](https://goharbor.io/docs/2.1.0/administration/configuring-replication/).

1. Go to **Projects** and click the **+ New Project** button.

1. Set **Project Name** to `dockerhub-replica`.

1. Leave all other settings as their defaults.

![Create Replica Project](/images/guides/kubernetes/harbor-as-docker-proxy/create-replica-project.png)

### Create a Replication Rule

Next we create a Replication Rule to determine the specific Images we want to
replicate. In this case we want only the `library/python:3.8.2-slim` image. We
restrict this as Replication can quickly hit the Docker Hub rate limits.

The resource filters support basic pattern recognition, so you could use
`library/**` if you wanted to replicate all of the official images, however this
would quickly hit the rate limits.

1. Go to **Administration** -> **Replication** and click the **+ New Replication Rule** button.

1. Set **Name** to `dockerhub-python-slim`

1. Set **Replication mode** to `Pull-based`

1. Set **Source registry** to `Docker Hub`

1. Set **Source resource filter** -> **Name** to `library/python`

1. Set **Source resource filter** -> **Tag** to `3.8.2-slim`

1. Set **Destination namespace** to `dockerhub-replica/python`

1. Leave the rest as their defaults.

![Create Replica for Python](/images/guides/kubernetes/harbor-as-docker-proxy/create-replica-python.png)

### Test Replication

We chose manual replication (so that we don't overwhelm the rate limits) so we
need to actually perform the replication step, and then validate that it worked.

1. Go to **Administration** -> **Replication** and click the
   **dockerhub-python-slim** item then click the **Replicate** Button.

Harbor will kick off the replication and will show the attempt below in the
**Executions** section. You can click on it for more details or logs, but for
now we're just waiting for it to **finish**.

1. Go to **Projects** and select **dockerhub-replica** then click
   **Repositories**. You should see `dockerhub-replica/python/python` with at
   least one Artifact. *To avoid this accidental redundancy in the name we
   should have set **Destination namespace** to `dockerhub-replica` rather than
   `dockerhub-replica/python`.

![Successful replication](/images/guides/kubernetes/harbor-as-docker-proxy/replica-success.png)

## Summary

That's it! We've learned how to replicate Docker images from Docker Hub using
both Proxy-ing and Replication. This can be applied for Harbor to Harbor
replication as well. It's not uncommon to have one main Harbor registry as the
source of truth and then Replication to remote sites, and Proxy-ing to edge
sites.