---
title: "Getting Started with VMware Tanzu Application Platform dev Profile"
description: This guide will walk you through setting up a basic VMware Tanzu Kubernetes Grid workload cluster. This cluster will be useful for setting up an inner loop development workflow using Tanzu tooling. 
date: 2021-12-10
lastmod: 2021-12-10
level1: Building Kubernetes Runtime
level2: Application Platform on Kubernetes
tags:
- Tanzu
- Tanzu Kubernetes Grid
# Author(s)
team:
- Tony Vetter
---

{{% callout %}} 
This guide was written for Tanzu Application Platform `Beta 3`. This guide also assumes a MacOS v12.0. This guide will be updated regularly, but updates might not be timed exactly to new releases of these products or platforms. You may need to modify commands. 
{{% /callout %}}

{{% callout %}} 
This guide heavily leverages the [official documentation for Tanzu Application Platform](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/0.3/tap-0-3/GUID-overview.html). For any questions or further details, please refer to that documentation.
{{% /callout %}} 

Tanzu Application Platform is a powerful layer built on top of Kubernetes. Utilizing native Kubernetes primitives, Tanzu Application Platform provides developers with an easier way to build, deploy, and manage application on top of Kubernetes. All while still exposing the powerful features that make Kubernetes so desirable. 

In this guide, you will deploy Tanzu Application Platform using the `dev` profile. Tanzu Application Platform uses profile-based installations to install only the components necessary to complete tasks associated with certain roles. The `dev` profile is meant for developers building applications, and using an inner-loop development workflow for rapid iteration and testing. 

Using the `dev` profile, you will be able to quickly and easily test and deploy your applications to your development Kubernetes cluster. You will receive rapid feedback from live code updates, as well as get a view for how your application is performing on a cluster that closely mimics the production environment. 

You will do so quick prep work to get your Kubernetes cluster ready for the install. Then you will use a simple deployment YAML template and a single CLI command to kick off the install. And once installed, you can start exploring your test environment. 

## Prerequisites

* **You have read through and completed the previous guides in this series.**
  * [Getting Started with the VMware Tanzu Network](/guides/tanzu-network-gs) - This guide walks you through setting up your account on the Tanzu Network, as well as installing the `pivnet` CLI tool.
  * [Getting Started with the VMware tanzu CLI tool](/guides/tanzu-cli-gs) - This guide walks you through downloading, installing, and using the `tanzu` CLI tool. 
  * [Getting Started with VMware Tanzu Kubernetes Grid](/guides/tanzu-kubernetes-grid-gs) - This guide walks you through installing a Tanzu Kubernetes Grid management cluster, as well as a workload cluster. 
* **Probably More** (TODO)

## Optional: Set up the environment

In order to make some commands easier to run, you should define some local environment variables. These will include sensitive information such as passwords. This information will be stored in your shell history file. Be aware of this before proceeding, and consider this section optional. 

1. Define you Tanzu Network credentials.

    ```sh
    export TANZU_NET_USER=your-tanzu-network-username
    ```

    ```sh
    export TANZU_NET_PASS=your-tanzu-network-password
    ```

## Setting up your Kubernetes Clusters

There are a couple quick steps necessary to perform against your Tanzu Kubernetes Grid management and workload clusters before we get started with the Tanzu Application Platform install. Tanzu Application Platform is still in beta at the time of this writing, and integration with other Tanzu products, while existent, still requires some manual setup. 

1. Switch `kubectl` contexts to your management cluster.

    ```sh
    kubectl config use-context test-management-cluster-admin@test-management-cluster
    ```

2. Patch the **kapp-controller** app so that it won't try to reconcile changes made on the workload cluster.

    ```sh
    kubectl patch app/test-workload-cluster-kapp-controller -n default -p '{"spec":{"paused":true}}' --type=merge
    ```

    This is part of those integration steps mentioned previously. You need to deploy a different version of `kapp-controller` on the workload cluster in order to install Tanzu Application Platform. If you do that without patching the management cluster, the management cluster will just change the version back to the expected version. 

    This is a powerful feature of Tanzu Kubernetes Grid management clusters. But one which we need to bypass to complete this task. 


3. Switch `kubectl` context to your workload cluster.
    
    ```sh
    kubectl config use-context test-workload-cluster-admin@test-workload-cluster
    ```

4. Delete the `kapp-controller` deployment on your workload cluster.
   
    ```sh
    kubectl delete deployment kapp-controller -n tkg-system
    ```

5. Install `kapp-controller v0.29.0`.

    ```sh
    kubectl apply -f https://github.com/vmware-tanzu/carvel-kapp-controller/releases/download/v0.29.0/release.yml
    ```

6. Scale the number of worker nodes on your workload cluster. Since we turned off auto scaling when setting up the workload cluster, you will need to scale the cluster manually.

    ```sh
    tanzu cluster scale test-workload-cluster --worker-machine-count 4
    ```

    This command will execute quickly, but in the background will still be provisioning machines. This process will take around 10 minutes to complete, but you can move on to the next steps as it is finishing. Use `tanzu cluster list` or `tanzu cluster get test-workload-cluster` to get the status of this provisioning. 

7. Create a namespace to install Tanzu Application platform to.

    ```sh
    kubectl create ns tap-install
    ```

You scaled your workload cluster with enough resources to run Tanzu Application Platform, deployed the supported version of `kapp-controller`, and setup a namespace in which to install. Your clusters are now ready.

## Setting up the `tanzu` CLI

As explained in the [tanzu CLI guide](/guides/tanzu-cli-gs), the `tanzu` CLI is plugin and package based. These packages come from separate repositories. In this section, you will set up these additional repositories to gain access to the Tanzu Application Platform packages. 

1. Create a secret which the `tanzu` CLI will use to access packages in the Tanzu Network. This requires your user name and password for the Tanzu Network, set up in the [prerequisites section](#prerequisites).

    ```sh
    tanzu secret registry add tap-registry \
    --username $TANZU_NET_USER --password $TANZU_NET_PASS \
    --server registry.tanzu.vmware.com \
    --export-to-all-namespaces --yes --namespace tap-install
    ```

2. Add the package repository to your cluster to be accessed by the `tanzu` CLI. 

    ```sh
    tanzu package repository add tanzu-tap-repository \
    --url registry.tanzu.vmware.com/tanzu-application-platform/tap-packages:0.4.0 \
    --namespace tap-install
    ```

3. Verify that the repository was added successfully. 

    ```sh
    tanzu package repository get tanzu-tap-repository --namespace tap-install
    ```
    
    Example output:
    
    ```sh
    / Retrieving repository tanzu-tap-repository...
    NAME:          tanzu-tap-repository
    VERSION:       5263
    REPOSITORY:    registry.tanzu.vmware.com/tanzu-application-platform/tap-packages
    TAG:           0.4.0
    STATUS:        Reconcile succeeded
    REASON:
    ```

## Build out the `dev` profile and install

Tanzu Application Platform installs by use of profiles. These profiles take into account the user's role in an organization, and only install the portions of the Tanzu Application Platform which that users is likely to need. 

In this section, you will explore the different packages installed in the `dev` profile. A profile yaml file will be provided for you, but you will be given all the tools and understanding necessary to find these settings, learn what they do, and what values are available for each.

You can find a list of the packages installed in each profile [here](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/0.4/tap/GUID-install.html#about-tanzu-application-platform-package-profiles-1).

1. List all packages in your configured repository. 

    ```sh
    tanzu package available list --namespace tap-install
    ```

    Example output:

    ```sh
    / Retrieving available packages...
    NAME                                                 DISPLAY-NAME                                                              SHORT-DESCRIPTION                                                                                                                                              LATEST-VERSION
    accelerator.apps.tanzu.vmware.com                    Application Accelerator for VMware Tanzu                                  Used to create new projects and configurations.                                                                                                                0.5.1
    api-portal.tanzu.vmware.com                          API portal                                                                A unified user interface to enable search, discovery and try-out of API endpoints at ease.                                                                     1.0.6
    build.appliveview.tanzu.vmware.com                   Application Live View Conventions for VMware Tanzu                        Application Live View convention server                                                                                                                        1.0.0
    buildservice.tanzu.vmware.com                        Tanzu Build Service                                                       Tanzu Build Service enables the building and automation of containerized software workflows securely and at scale.                                             1.4.0-build.1
    cartographer.tanzu.vmware.com                        Cartographer                                                              Kubernetes native Supply Chain Choreographer.                                                                                                                  0.0.8-rc.7
    [...]
    tap.tanzu.vmware.com                                 Tanzu Application Platform                                                Package to install a set of TAP components to get you started based on your use case.                                                                          0.4.0
    tekton.tanzu.vmware.com                              Tekton Pipelines                                                          Tekton Pipelines is a framework for creating CI/CD systems.                                                                                                    0.30.0
    workshops.learningcenter.tanzu.vmware.com            Workshop Building Tutorial                                                Workshop Building Tutorial                                                                                                                                     0.1.0-build.7
    ```

    This can be a bit of an overwhelming list of packages included in the Tanzu Application Platform repository. You don't need to worry too much about this, however. This is included in this guide for learning purposes. The `dev` profile will install a subset of these packages automatically.

2. Clone the sample `tap-values.yml` file.

    ```sh
    git clone https://gist.github.com/56f9bb6d00415e9ca169dddca11ce884.git
    ```

3. Open the sample `tap-values.yml` file. 

    ```sh
    code 56f9bb6d00415e9ca169dddca11ce884/tap-values.yml
    ```

    Areas to modify have been called out in the comments. 

4. Modify the `tap-values.yml` file. This values file makes the assumption that you will be using DockerHub for your container image repository. For other options, see the [official documentation](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/0.4/tap/GUID-install.html#dev-profile-4) for the `dev` profile.
   1. `dockerhub-user`: This is the username you use to sign into DockerHub.
   2. `dockerhub-pass`: This is the password you use to sign into DockerHub.
   3. `TANZU_NET_USER`: This is the same as the environment variable you set earlier. Use `echo $TANZU_NET_USER` to reveal it.
   4. `TANZU_NET_PASS`: This is the same as the environment variable you set earlier. Use `echo $TANZU_NET_PASS` to reveal it.

5. **Optional**: List all available values to modify for Tanzu Application Platform. This is just for learning purposes, or if you need to customize your values file for your environment. 

    ```sh
    tanzu package available get tap.tanzu.vmware.com/0.4.0 --values-schema --namespace tap-install
    ```

6. Install Tanzu Application Platform `dev` profile.

    ```sh
    tanzu package install tap -p tap.tanzu.vmware.com -v 0.4.0 --values-file tap-values.yml -n tap-install
    ```