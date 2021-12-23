---
title: Getting Started with VMware Tanzu Application Platform Beta on KIND, part 1
linkTitle: Getting Started with VMware Tanzu Application Platform Beta on KIND, part 1
description: A guide for installing the VMware Tanzu Application Platform Beta locally,
  on KIND
weight: 83
tags:
- tanzu application platform
- kind
- CI-CD
- Kubernetes
team:
- Tony Vetter
date: '2021-09-14'
lastmod: '2021-09-14'
aliases:
- /guides/kubernetes/getting-started-with-vmware-tanzu-application-platform-beta-1-on-kind-part-2/
- /guides/kubernetes/gs-tap-on-kind-pt2/
- /guides/kubernetes/gs-tap-on-kind-pt1/
level1: Building a Kubernetes Runtime
level2: Building Your Kubernetes Platform
tanzu:
  label: tap
  featured: true
  featuredweight: 2
  gettingstarted: true
  gettingstartedweight: 2
---

{{% callout %}} 
This post is for getting started with Beta 1. On October 5th 2021, VMware Tanzu Application Platform Beta 2 was released. And since then, other Betas have been released. Get more information on Tanzu Application Platform [here](https://tanzu.vmware.com/application-platform). 
{{% /callout %}}

In my [previous post](/blog/getting-started-with-vmware-tanzu-application-platform-beta-1/) you were introduced to the individual parts that make up the VMware Tanzu Application Platform, and how they come together to build a powerful development platform. In this post, you will learn the install process that locally deploys this platform on [KIND](https://kind.sigs.k8s.io).

There are three caveats to know about before starting the install. 

  1. Remember that the Tanzu Application Platform is in Beta. There are many changes still to come. While  every effort will be made to keep this post up to date, it is likely that changes (including possible breaking changes) will be released before these updates are updated. Every effort will be made to call out exact versions of tools and applications that are being used so that you can be aware of where issues might arise. 

  2. While KIND is an awesome tool, especially for developers that need quick and repeatable access to a Kubernetes cluster, there are some necessary workarounds when it comes to deploying and using Tanzu Application Platform. These workarounds are called out in this guide. It is up to you to decide if you want to workaround these issues. 

     NOTE: This blog post provides one way to deploy the Tanzu Application Platform. Visit [supported platforms](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/0.1/tap-0-1/GUID-install.html) for blog posts that describe other ways to deploy the Tanzu Application platform. 

  3. This guide is a two part post. 
   
     * Part 1 (this post), shows you how to install all the necessary components of the Tanzu Application Platform onto a KIND Kubernetes Cluster. 
     * [Part 2](/guides/gs-tap-on-kind-final-pt2/), shows you how to access and utilize the Tanzu Application Platform to deploy a sample application.

This guide leverages from the official [install documentation](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/0.1/tap-0-1/GUID-install.html) for Tanzu Application Platform, but is heavily modified for the deployment on KIND. Refer to these documents for installation questions, or if you encounter any issues during the install process as they are the source of truth. 

Okay, with that out of the way, let's get going.

## Prerequisites

The following are installation prerequisites. **Read these prerequisites carefully**

NOTE: This guide does not provide installation instructions for  all  the supporting tools necessary to install Tanzu Application Platform. If you have specific product installation questions, refer to the corresponding product page for help  on how to install the product on various operating systems.

* [Install Docker Desktop](https://www.docker.com/products/docker-desktop): KIND, as the acronym implies, relies on Docker. In addition, the Tanzu Application Platform requires quite a bit of resources. You will need to configure Docker Desktop to have allocated the following minimum resources:
  * `cpu: 4` 
  * `memory: 16gb`
  * `disk size: 70gb` 

  It's a sizable platform as local installs go. If you have the space, and you want to try future betas, it might be worth allocating a bit more resources now. At the time of this writing, I am using Docker client version `20.10.8`.
 
  {{% callout %}} Ensure you have enough resources allocated to Docker to install Tanzu Application Platform {{% /callout %}}

* [Install KIND](https://kind.sigs.k8s.io/docs/user/quick-start/):  KIND is the tooling you use to create the Kubernetes cluster on which you will install the Tanzu Application Platform. At the time of this writing, I am using KIND version `0.11.1`. The current prerequisites in the Tanzu Application Platform install docs list a Kubernetes cluster of at least version `1.19`. Currently, the most current version that should be used for Tanzu Application Platform is `1.21`.
* [Install `kubectl`](https://kubernetes.io/docs/tasks/tools/): If you have ever worked with Kubernetes, you likely already have this prerequisite installed. At the time of this writing, I am using `kubectl` client version `1.22.1`.
* [A Tanzu Network Account](https://account.run.pivotal.io/z/uaa/sign-up): Tanzu Application Platform and some other components will be downloaded from the Tanzu Network. You will need a valid account, which you can sign up for free. 
* [Install the `pivnet` CLI tool](https://github.com/pivotal-cf/pivnet-cli): **This is optional**. In this guide, the `pivnet` CLI tool is used for downloading some components of the Tanzu Application Platform. At the time of this writing, I am using `pivnet` version `3.0.1`.
* [Install Carvel tooling](https://carvel.dev/#whole-suite): Most of the Carvel suite is used at one point or another in this guide, so it is probably best just to install it that way. `kapp` of at least version `0.37.0` is listed as a prerequisite in the install docs. At the time of this writing, I am using `kapp` version `0.39.0`.
* [Install the `tanzu` CLI tool](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/0.1/tap-0-1/GUID-install.html#install-the-tanzu-cli-and-package-plugin-4): Use this tool to install packages, and interact with your Tanzu Application Platform install. At the time of this writing, I am using `tanzu` version `1.4.0-rc.5`.
* [Create a Docker Hub account](https://hub.docker.com/signup): For the sake of having a freely available container repository, you will use Docker Hub throughout this guide. Other container repositories can be used in its place, but the commands will need to be modified. Ensure you are logged in via `docker login`.
* [Create a GitHub account](https://github.com/join): GitHub is going to be used in the next part of this blog post, where you are going to start an actual coding project. You are also going to need  to install the `git` CLI tool locally, and link it to your account. A good getting started tutorial for these activities can be found [here](https://docs.github.com/en/get-started/quickstart/set-up-git).
* [Install Visual Studio Code](https://code.visualstudio.com/download) -- **This is optional**. I use Visual Studio Code as my preferred text editor, and as such will include commands for opening files there. But really, you just need your preferred text editor. Just modify commands below so files open where you want them.
* Time: If this is your first time installing something like this, consider budgeting a few hours to get through the whole process. Although admittedly, a lot of that is waiting for uploads and downloads. 


## Setting Up The Environment

In this section, you will create a working directory, download some starter templates which you will edit later, and set some environment variables to make the rest of this guide easier to follow. 

1. Clone my GitHub repository with starter configurations already created. 
    ```
    git clone https://github.com/anthonyvetter/gs-tap-on-kind.git
    ```

2. Change directories so that this cloned repo becomes your working directory. All commands in this guide as your current working directory is as follows, unless otherwise stated. 
    ```
    cd gs-tap-on-kind
    ```

3. Set up local environment variables to make future commands in this guide easier to copy and paste. **NOTE**: These commands will add a plain text copy of your passwords to you shell's history file. You may want to rectify this after completing this guide.
    ```
    export TN_USERNAME=username@domain.com # your username for the Tanzu Network
    ```

    ```
    export TN_PASSWORD=******************* # your password for the Tanzu Network
    ```

    ```
    export DH_USERNAME=username # your username for Docker Hub
    ```

    ```
    export DH_PASSWORD=p@55w0rd! # your password for Docker Hub
    ```

4. Log the `docker` CLI in to the Tanzu Network at `registry.pivotal.io`.
    ```
    docker login registry.pivotal.io -u $TN_USERNAME -p $TN_PASSWORD
    ```

## Setting up the KIND Kubernetes cluster

Here, you will create your KIND cluster, and install some prerequisites.

1. Open `kind-cluster.yaml`. 
    ```
    code kind-cluster.yaml
    ```
    Note how your Kubernetes cluster is configured. You are creating a 2 node cluster called `tap-install` with a single worker node. You are also opening several ports which will be important later. 

2. Create the KIND cluster.
    ```
    kind create cluster --config kind-cluster.yaml
    ```
    Wait for this command to complete. In the background, KIND is spinning up Docker containers which will function as your Kubernetes cluster nodes.

3. Ensure that your `kubectl` context is set correctly. KIND will prepend `kind-` to your cluster name for its context.
    ```
    kubectl config use-context kind-tap-install
    ```

4. Install [`kapp-controller`](https://github.com/vmware-tanzu/carvel-kapp-controller) onto your KIND cluster. `kapp-controller` is the server-side counterpart to your client-side `kapp` CLI tool. You need it to perform future operations in this guide.
    ```
    kapp deploy -a kc -f https://github.com/vmware-tanzu/carvel-kapp-controller/releases/latest/download/release.yml -y
    ```

5. Create the `namespace` where you will install the Tanzu Application Platform components.
    ```
    kubectl create ns tap-install
    ```

6. Create a Kubernetes `secret` which will reference your credentials for the Tanzu Network, as discussed in the prerequisites section. 
    ```
    kubectl create secret docker-registry tap-registry \
    -n tap-install \
    --docker-server='registry.pivotal.io' \
    --docker-username=$TN_USERNAME \
    --docker-password=$TN_PASSWORD
    ```

7. Install the Tanzu Application Platform package repository onto your cluster. From here, we will dive down into each package, before we  install them. 
    ```
    kapp deploy -a tap-package-repo -n tap-install -f ./tap-package-repo.yaml -y
    ```

8. Verify the package repository was installed correctly. 
    ```
    tanzu package repository list -n tap-install
    ```
    output:
    ```
    Retrieving repositories...
    NAME                  REPOSITORY                                                         STATUS               DETAILS
    tanzu-tap-repository  registry.pivotal.io/tanzu-application-platform/tap-packages:0.1.0  Reconcile succeeded
    ```

## Installing Cloud Native Runtimes for VMware Tanzu

Now that the cluster is set up with all the tools it needs, it's time to install the individual components of the Tanzu Application Platform. You will start by installing Cloud Native Runtimes for VMware Tanzu. 

First, let's take a look at the package you are going to be installing, and use the `tanzu` CLI to dive in. 

1. List the packages available in the repository you installed in the previous section.
    ```
    tanzu package available list -n tap-install
    ```
    output:
    ```
    Retrieving available packages...
    NAME                               DISPLAY-NAME                              SHORT-DESCRIPTION
    accelerator.apps.tanzu.vmware.com  Application Accelerator for VMware Tanzu  Used to create new projects and configurations.
    appliveview.tanzu.vmware.com       Application Live View for VMware Tanzu    App for monitoring and troubleshooting running apps
    cnrs.tanzu.vmware.com              Cloud Native Runtimes                     Cloud Native Runtimes is a serverless runtime based on Knative
    ```
    Here you can see the Cloud Native Runtimes package listed, along with Application Accelerator and Application Live View.

2. List version details for the Cloud Native Runtimes package.
    ```
    tanzu package available list cnrs.tanzu.vmware.com -n tap-install
    ```
    output:
    ```
    Retrieving package versions for cnrs.tanzu.vmware.com...
    NAME                   VERSION  RELEASED-AT
    cnrs.tanzu.vmware.com  1.0.1    2021-07-30T15:18:46Z
    ```
    Look for  the version. You will use it in the next step.

    Most components you install on Kubernetes will have some method to configure them for your environment. A common way of doing this is with a `values.yaml` file. But what options are available for you to configure? Well, with the `tanzu` CLI, you can pull the `values-schema` from a package, and use that to define a values file.

3. Pull the `values-schema` here.
    ```
    tanzu package available get cnrs.tanzu.vmware.com/1.0.1 --values-schema -n tap-install
    ```
    output:
    ```
    | Retrieving package details for cnrs.tanzu.vmware.com/1.0.1...
    KEY                         DEFAULT  TYPE     DESCRIPTION
    ingress.external.namespace  <nil>    string   external namespace
    ingress.internal.namespace  <nil>    string   internal namespace
    ingress.reuse_crds          false    boolean  set true to reuse existing Contour instance
    local_dns.domain            <nil>    string   domain name
    local_dns.enable            false    boolean  specify true if local DNS needs to be enabled
    pdb.enable                  true     boolean  <nil>
    provider                    <nil>    string   Kubernetes cluster provider
    registry.username           <nil>    string   registry username
    registry.password           <nil>    string   registry password
    registry.server             <nil>    string   registry server
    ```
    This output gives you all of the configurable values for the package, their default setting, the type of value, and a brief description of what they do. You have already pulled down a starter values file for the `cnrs` package. It is what you will look at next.

4. Open `cnr-values.yaml`.
    ```
    code cnr-values.yaml
    ```
    This file is already defined for a local install on KIND, with the exception of your Tanzu Network credentials. Using this file and the `values-schema` output from the previous step, helps you to imagine a configuration necessary for other environments. The lines to be changed for this guide are commented `# change this`. Go ahead and add your credentials and save the file.

5. Install the `cnrs` package referencing the `cnr-values.yaml` file.
    ```
    tanzu package install cloud-native-runtimes -p cnrs.tanzu.vmware.com -v 1.0.1 -n tap-install -f cnr-values.yaml
    ```

## Install Application Accelerator for VMware Tanzu

Here you will install the Application Accelerator for VMware Tanzu component of Tanzu Application Platform. The process is similar to the one using the `tanzu` CLI and the package repository installed earlier, albeit with a couple more dependencies to install. 

1. Install flux.
    Application Accelerator for VMware Tanzu has a dependency on [`flux2`](https://github.com/fluxcd/flux2) for its CI/CD capabilities. You must install flux before you install the package. 
    ```
    kapp deploy -a flux -f https://github.com/fluxcd/flux2/releases/download/v0.15.0/install.yaml -y
    ```

2. Similar to what you did with the `cnrs` package, do the same series of steps for the `accelerator` package. First, list the available packages, just so the package name is in front of you.
    ```
    tanzu package available list -n tap-install
    ```
    output:
    ```
    Retrieving available packages...
    NAME                               DISPLAY-NAME                              SHORT-DESCRIPTION
    accelerator.apps.tanzu.vmware.com  Application Accelerator for VMware Tanzu  Used to create new projects and configurations.
    appliveview.tanzu.vmware.com       Application Live View for VMware Tanzu    App for monitoring and troubleshooting running apps
    cnrs.tanzu.vmware.com              Cloud Native Runtimes                     Cloud Native Runtimes is a serverless runtime based on Knative
    ```

3. Get the version number for the `accelerator` package.
    ```
    tanzu package available list accelerator.apps.tanzu.vmware.com -n tap-install
    ```
    output:
    ```
    \ Retrieving package versions for accelerator.apps.tanzu.vmware.com...
    NAME                               VERSION  RELEASED-AT
    accelerator.apps.tanzu.vmware.com  0.2.0    2021-08-25T00:00:00Z
    ```

4. Pull the `values-schema` for the package so that you can understand what you are changing in the values file.
    ```
    tanzu package available get accelerator.apps.tanzu.vmware.com/0.2.0 --values-schema -n tap-install
    ```
    output:
    ```
    | Retrieving package details for accelerator.apps.tanzu.vmware.com/0.2.0...
    KEY                           DEFAULT                                                             TYPE    DESCRIPTION
    engine.service_type           ClusterIP                                                           string  The service type for the Service of the engine.
    registry.server               registry.pivotal.io                                                 string  The hostname for the registry where the App-Accelerator images are located.
    registry.username                                                                                 string  The username to use for authenticating with the registry where the App-Accelerator images are located.
    registry.password                                                                                 string  The password to use for authenticating with the registry where the App-Accelerator images are located.
    server.service_type           LoadBalancer                                                        string  The service type for the acc-ui-server service.
    server.watched_namespace      default                                                             string  The namespace that the server watches for accelerator resources.
    server.engine_invocation_url  http://acc-engine.accelerator-system.svc.cluster.local/invocations  string  The URL the server uses for invoking the accelerator engine.
    ```

5. Open `app-accelerator-values.yaml`.
    ```
    code app-accelerator-values.yaml
    ```
    Again, most of this values file is predefined for a local install on KIND, with comments showing where values were changed from default. 

    Add your Tanzu Network credentials to this values file again where noted with comments `# change this`, and save the file.

5. Install the `accelerator` package referencing the `app-accelerator-values.yaml` file.
    ```
    tanzu package install app-accelerator -p accelerator.apps.tanzu.vmware.com -v 0.2.0 -n tap-install -f app-accelerator-values.yaml
    ```
    As discussed in my initial ["Getting Started with Tanzu Application Platform Beta 1"](/blog/getting-started-with-vmware-tanzu-application-platform-beta-1/) blog post, Application Accelerator for Tanzu is a system for storing and using starter code packages. So in order to get much value out of it as part of this guide, you need to add some of these starters. The Tanzu Application Platform team has created some samples for you already. Go ahead and add those next. 

6. First, Open the file `sample-accelerators-0-2.yaml` so you can see how the accelerators are defined and brought into the platform.
    ```
    code sample-accelerators-0-2.yaml
    ```
    Six sample accelerators are defined. As you can see, the definition of each is simple. The code is still stored in GitHub, but by providing these in the Application Accelerator for Tanzu interface, it makes using them as starter templates easier. 

7. Apply this file to your Kubernetes cluster. 
    ```
    k apply -f sample-accelerators-0-2.yaml
    ```

## Install Application Live View for VMware Tanzu

Application Live View for VMware Tanzu is a straightforward install using the `tanzu` cli. The values file does not have a lot to configure. Let's dive into that file next. 

1. Use the `tanzu` CLI to dive down into this package, understand what you are installing, and how. Start by listing the packages in the repository. 
    ```
    tanzu package available list -n tap-install
    ```
    output:
    ```
    Retrieving available packages...
    NAME                               DISPLAY-NAME                              SHORT-DESCRIPTION
    accelerator.apps.tanzu.vmware.com  Application Accelerator for VMware Tanzu  Used to create new projects and configurations.
    appliveview.tanzu.vmware.com       Application Live View for VMware Tanzu    App for monitoring and troubleshooting running apps
    cnrs.tanzu.vmware.com              Cloud Native Runtimes                     Cloud Native Runtimes is a serverless runtime based on Knative
    ```

2. Pull the version number for the `appliveview` package.
    ```
    tanzu package available list appliveview.tanzu.vmware.com -n tap-install
    ```
    output:
    ```
    \ Retrieving package versions for appliveview.tanzu.vmware.com...
    NAME                          VERSION  RELEASED-AT
    appliveview.tanzu.vmware.com  0.1.0    2021-09-01T00:00:00Z
    ```

3. Retrieve the `values-schema` for the `appliveview` package.
    ```
    tanzu package available get appliveview.tanzu.vmware.com/0.1.0 --values-schema -n tap-install
    ```
    output:
    ```
    / Retrieving package details for appliveview.tanzu.vmware.com/0.1.0...
    KEY                DEFAULT  TYPE    DESCRIPTION
    registry.password  <nil>    string  Image Registry Password
    registry.server    <nil>    string  Image Registry URL
    registry.username  <nil>    string  Image Registry Username
    ```
    This is a simple values schema, which is reflected in the values file.

4. Open `app-live-view-values.yaml`.
    ```
    code app-live-view-values.yaml
    ```
    Add your credentials to this file, the same as you have done for the previous two files. 

5. Install the `appliveview` package referencing the `app-live-view-values.yaml` file. 
    ```
    tanzu package install app-live-view -p appliveview.tanzu.vmware.com -v 0.1.0 -n tap-install -f app-live-view-values.yaml
    ```

## Install Tanzu Build Service

There is one more component to install. VMware Tanzu Build Service is a GA product that has its own install method. The official install documentation can be found [here](https://docs.pivotal.io/build-service/installing.html), and should be taken as the source of truth for installation guides. This guide leverages those docs heavily, although modified slightly for this use case. 

1. Create a Kubernetes `secret` for Tanzu Build Service to use to access your Docker Hub repository. Use the `kp` CLI tool.
    ```
    kp secret create tbs-secret --dockerhub $DH_USERNAME  -n tap-install
    ```

2. Create a Kubernetes `ServiceAccount` for your platform. To do this, first open the `tap-sa.yaml`.
    ```
    code tap-sa.yaml
    ```
    Here you see that you are about to create a `ServiceAccount` along with a `ClusterRole`, and a `ClusterRoleBinding`.

3. Apply `tap-sa.yaml` to your cluster.
    ```
    kubectl apply -f tap-sa.yaml
    ```

4. Patch your Tanzu Build Service secret to the `ServiceAccount` which you just created.
    ```
    kubectl patch serviceaccount default -p "{\"imagePullSecrets\": [{\"name\": \"tbs-secret\"}]}" -n tap-install
    ```

5. Relocate images from `registry.pivotal.io` to your Docker Hub repository so they can be pulled and installed. `imgpkg` is part of the Carvel suite of tools that should have been installed as part of the prerequisites.
    ```
    imgpkg copy -b "registry.pivotal.io/build-service/bundle:1.2.1" --to-repo $DH_USERNAME/tanzu-build-service
    ```

6. Pull a reference to those packages down locally to install Tanzu Build Service from a public container repository like Docker Hub . 

    Move them to `/tmp` once the install is complete. because you won't need them anymore.
    ```
    imgpkg pull -b "$DH_USERNAME/tanzu-build-service:1.2.1" -o /tmp/bundle
    ```

7. Install Tanzu Build Service onto your cluster. You will use the `ytt` CLI too, which is also included in the Carvel tool suite. 
    ```
    ytt -f /tmp/bundle/values.yaml \
    -f /tmp/bundle/config/ \
    -v docker_repository=$DH_USERNAME \
    -v docker_username=$DH_USERNAME \
    -v docker_password=$DH_PASSWORD \
    | kbld -f /tmp/bundle/.imgpkg/images.yml -f- \
    | kapp deploy -a tanzu-build-service -f- -y
    ```

8. Download the `kp` CLI tool. `kp` is the client tool for interacting with Tanzu Build Service, and will be necessary in the next step where you will bootstrap the system with all of the necessary dependencies. This is the command to download the package for Mac operating systems. If you need other options, go to the [Tanzu Build Service page](https://network.pivotal.io/products/build-service/) on the Tanzu Network.
    ```
    pivnet download-product-files --product-slug='build-service' --release-version='1.2.2' --product-file-id=1000628
    ```

9. Rename the package to `kp`.
    ```
    mv kp-darwin-0.3.1 kp
    ```

10. Make the binary executable.
    ```
    sudo chmod +x kp
    ```

11. Move `kp` into your `$PATH`.
    ```
    mv kp /usr/local/bin
    ```

12. Download the dependency bootstrap descriptor file from the Tanzu Network. Note that new descriptor files are uploaded all the time as vulnerabilities are patched. This is just the most current descriptor file at the time of this writing. 
    ```
    pivnet download-product-files --product-slug='tbs-dependencies' --release-version='100.0.167' --product-file-id=1041961
    ```

13. Use the `kp` CLI tool to upload these dependencies to your cluster. This is going to take  several hours to finish. Future updates generally only take minutes to complete. This is because changes are applied as patches when they become available.     
    ```
    kp import -f descriptor-100.0.167.yaml
    ```

## Verify the Installs

Congratulations! You now (probably) have a full install of Tanzu Application Platform Beta 1. Let's just verify that everything was installed correctly.

1. Verify all `tanzu` packages were installed correctly.
    ```
    tanzu package installed list -n tap-install
    ```
    output:
    ```
    / Retrieving installed packages...
    NAME                   PACKAGE-NAME                       PACKAGE-VERSION  STATUS
    app-accelerator        accelerator.apps.tanzu.vmware.com  0.2.0            Reconcile succeeded
    app-live-view          appliveview.tanzu.vmware.com       0.1.0            Reconcile succeeded
    cloud-native-runtimes  cnrs.tanzu.vmware.com              1.0.1            Reconcile succeeded
    ```

2. Verify Tanzu Build Service was installed correctly by listing out one type of uploaded dependencies.
    ```
    kp clusterstack list
    ```
    output:
    ```
    NAME       READY    ID
    base       True     io.buildpacks.stacks.bionic
    default    True     io.buildpacks.stacks.bionic
    full       True     io.buildpacks.stacks.bionic
    tiny       True     io.paketo.stacks.tiny
    ```

    If your outputs look the same, then you are ready to proceed to [part 2](/guides/gs-tap-on-kind-final-pt2/) of this series, where we will actually dive in and use the Tanzu Application Platform.

