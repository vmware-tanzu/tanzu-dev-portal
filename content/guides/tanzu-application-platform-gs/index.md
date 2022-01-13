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

Tanzu Application Platform is a powerful layer built on top of Kubernetes. Utilizing native Kubernetes primitives, Tanzu Application Platform provides developers with an easier way to build, deploy, and manage application on top of Kubernetes. All while still exposing the powerful features that make Kubernetes so desirable. 

In this guide, you will deploy Tanzu Application Platform using the `light` profile. Tanzu Application Platform uses profile-based installations to install only the components necessary to complete tasks associated with certain roles. The `light` profile is meant for developers building applications, and using an inner-loop development workflow for rapid iteration and testing. 

Using the `light` profile, you will be able to quickly and easily test and deploy your applications to your development Kubernetes cluster. You will receive rapid feedback from live code updates, as well as get a view for how your application is performing on a cluster that closely mimics the production environment. 

You will do so quick prep work to get your Kubernetes cluster ready for the install. Then you will use a simple deployment YAML template and a single CLI command to kick off the install. And once installed, you can start exploring your test environment. 

## Assumptions

* This guide was written for [Tanzu Application Platform `v1.0`](https://docs.vmware.com/en/Tanzu-Application-Platform/1.0/tap/GUID-overview.html). 
* This guide assumes you are running MacOS. Specifically, `v12.0`. 
* This guide will be updated regularly, but updates might not be timed exactly to new releases of these products or platforms. You may need to modify commands. 
* This guide heavily leverages the [official documentation for Tanzu Application Platform](https://docs.vmware.com/en/Tanzu-Application-Platform/1.0/tap/GUID-install-intro.html). For any questions or further details, please refer to that documentation.

## Prerequisites

* [**You have a Tanzu Network account with pivnet installed**](/guides/tanzu-network-gs) - This guide walks you through setting up your account on the Tanzu Network, as well as installing the `pivnet` CLI tool.
* [**You have the tanzu CLI installed and configured**](/guides/tanzu-cli-gs) - This guide walks you through downloading, installing, and using the `tanzu` CLI tool. 
* **You have a Kubernetes cluster created and ready** - In this guide you will use a [GKE](https://cloud.google.com/kubernetes-engine) cluster, but most major Kubernetes cluster providers should work. Make sure you `kubectl` context is pointed to this cluster. Cluster and resource requirements can be found [here](https://docs.vmware.com/en/Tanzu-Application-Platform/1.0/tap/GUID-install-general.html).
* [A Docker Hub account](https://hub.docker.com/signup) - Other repositories are supported, but for ease of use and configuration, this guide uses Docker Hub.
* **Optional: A custom domain you can use to access your install** - In this guide you will just use your `/etc/hosts` file to handle routing. However, you may decide you want to set up DNS routing and records to access your install. More on this [later](#accessing-the-tanzu-application-platform-ui) in this guide.

## Set up the environment

In order to make some commands easier to run, you should define some local environment variables. These will include sensitive information such as passwords. This information will be stored in your shell history file. Be aware of this before proceeding, and consider this section optional. 

1. Define your Tanzu Network credentials.

    ```sh
    export INSTALL_REGISTRY_USERNAME=your-tanzu-network-username
    ```

    ```sh
    export INSTALL_REGISTRY_PASSWORD=your-tanzu-network-password
    ```

2. Define your Docker Hub credentials.

    ```sh
    export DOCKER_HUB_USERNAME=your-docker-hub-username
    ```

    ```sh
    export DOCKER_HUB_PASSWORD=your-docker-hub-password
    ```

3. Define your GitHub credentials.

    ```sh
    export GITHUB_USERNAME=your-github-username
    ```

4. Define your custom domain name.

    ```sh
    export CUSTOM_DOMAIN=example.com
    ```

5. Define other miscellaneous environment variables. 

    ```sh
    export INSTALL_BUNDLE=registry.tanzu.vmware.com/tanzu-cluster-essentials/cluster-essentials-bundle@sha256:82dfaf70656b54dcba0d4def85ccae1578ff27054e7533d08320244af7fb0343
    ```

    ```sh
    export INSTALL_REGISTRY_HOSTNAME=registry.tanzu.vmware.com
    ```


## Setting up your Kubernetes Clusters

There are a couple quick steps necessary to perform against your Kubernetes cluster before we get started with the Tanzu Application Platform install. In this section, you will install Cluster Essentials for VMware Tanzu. 

1. Download the bundle for Cluster Essentials for VMware Tanzu. For bundles for platforms other than MacOS, go [here](https://network.pivotal.io/products/tanzu-cluster-essentials/).

    ```sh
    pivnet download-product-files --product-slug='tanzu-cluster-essentials' --release-version='1.0.0' --product-file-id=1105820
    ```

2. Create a local directory for Tanzu Cluster Essentials. This will be where the install scripts and other packages are placed.
   
    ```sh
    mkdir ~/tanzu-cluster-essentials
    ```

3. Unpack the `tar` file into this directory. 

    ```sh
    tar -xvf tanzu-cluster-essentials-darwin-amd64-1.0.0.tgz -C ~/tanzu-cluster-essentials
    ```

4. Change directories to the `tanzu-cluster-essentials` directory.
    ```sh
    cd ~/tanzu-cluster-essentials
    ```

5. Run the install script. 

    ```sh
    ./install.sh
    ```

6. Copy `kapp` to your `$PATH`.

    ```sh
    sudo cp ~/tanzu-cluster-essentials/kapp /usr/local/bin/kapp
    ```

7.  Create a namespace to install Tanzu Application platform to.

    ```sh
    kubectl create ns tap-install
    ```

Your cluster is now ready to start the install of Tanzu Application Platform. You will do that in the next section.


## Setting up the `tanzu` CLI

As explained in the [tanzu CLI guide](/guides/tanzu-cli-gs), the `tanzu` CLI is plugin and package based. These packages come from separate repositories. In this section, you will set up these additional repositories to gain access to the Tanzu Application Platform packages. 

1. Create a secret which the `tanzu` CLI will use to access packages in the Tanzu Network. This requires your user name and password for the Tanzu Network, set up in the [prerequisites section](#prerequisites).

    ```sh
    tanzu secret registry add tap-registry \
    --username ${INSTALL_REGISTRY_USERNAME} --password ${INSTALL_REGISTRY_PASSWORD} \
    --server ${INSTALL_REGISTRY_HOSTNAME} \
    --export-to-all-namespaces --yes --namespace tap-install
    ```

2. Add the package repository to your cluster to be accessed by the `tanzu` CLI. 

    ```sh
    tanzu package repository add tanzu-tap-repository \
    --url registry.tanzu.vmware.com/tanzu-application-platform/tap-packages:1.0.0 \
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
    VERSION:       6984
    REPOSITORY:    registry.tanzu.vmware.com/tanzu-application-platform/tap-packages
    TAG:           1.0.0
    STATUS:        Reconcile succeeded
    REASON:
    ```

## Setting up an empty Application Accelerator catalog

Application Accelerator is a component of Tanzu Application Platform where code starters are stored. This gives developers access to starter applications which already include any necessary security and compliance frameworks which may be required by tour organization. 

If you are deploying Tanzu Application Platform in an environment where this catalog already exists, you can skip this section and simply note the URL for the `catalog-info.yaml` file. If you do not have access to an accelerator catalog yet, this section will walk you through deploying a blank one. 

1. Download the blank starter template.
    ```sh
    pivnet download-product-files --product-slug='tanzu-application-platform' --release-version='1.0.0' --product-file-id=1099786
    ```

2. Extract the file contents.

    ```sh
    tar xvf tap-gui-blank-catalog.tgz
    ```

3. Change directories to the extracted directory.

    ```sh
    cd blank
    ```

4. Follow your preferred method for pushing the files in this directory to your Git Hub account. [Here](https://docs.github.com/en/get-started/quickstart/create-a-repo) are the GitHub docs for creating a new repository. Call it `blank-catalog`.

You now have a repository deployed which you will later add as a reference for your deployment of Tanzu Application Platform.

## Build out the `light` profile and install

Tanzu Application Platform installs by use of profiles. These profiles take into account the user's role in an organization, and only install the portions of the Tanzu Application Platform which that users is likely to need. 

In this section, you will explore the different packages installed in the `light` profile. A profile yaml file will be provided for you, but you will be given all the tools and understanding necessary to find these settings, learn what they do, and what values are available for each.

You can find a list of the packages installed in each profile [here](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/0.4/tap/GUID-install.html#about-tanzu-application-platform-package-profiles-1).

1. Create the `tap-values.yml` file.

    ```sh
    cat << EOF > tap-values-test.yaml
    profile: light
    ceip_policy_disclosed: true 

    buildservice:
    kp_default_repository: "$DOCKER_HUB_USERNAME/build-service"
    kp_default_repository_username: "$DOCKER_HUB_USERNAME"
    kp_default_repository_password: "$DOCKER_HUB_PASSWORD"
    tanzunet_username: "$INSTALL_REGISTRY_USERNAME"
    tanzunet_password: "$INSTALL_REGISTRY_PASSWORD"

    supply_chain: basic

    ootb_supply_chain_basic:
    registry:
        server: "index.docker.io"
        repository: "$DOCKER_HUB_USERNAME"

    tap_gui:
    service_type: ClusterIP
    ingressEnabled: "true"
    ingressDomain: "$CUSTOM_DOMAIN"
    app_config:
        app:
        baseUrl: http://tap-gui.$CUSTOM_DOMAIN
        catalog:
        locations:
            - type: url
            target: https://github.com/$GITHUB_USERNAME/blank-catalog/blob/main/catalog-info.yaml
        backend:
        baseUrl: http://tap-gui.$CUSTOM_DOMAIN
        cors:
            origin: http://tap-gui.$CUSTOM_DOMAIN

    contour:
    envoy:
        service:
        type: LoadBalancer

    EOF
    ```

2. Install Tanzu Application Platform `light` profile.

    ```sh
    tanzu package install tap -p tap.tanzu.vmware.com -v 1.0.0 --values-file tap-values.yml -n tap-install
    ```

{{% callout %}}
Each time I have tried this, the command returns a deployment failure. Something similar to `Error: resource reconciliation failed`. This does not necessarily mean your deployment has failed, however. You can get a more useful error message by running `tanzu package installed get tap -n tap-install`. Likely, it will tell you that there was a timeout in the API response time. 

You can run `watch kubectl get pods -A` to watch the progress of the install. In any case, this install can take up to 30 minutes for all pods to start and reconcile.
{{% /callout %}}

## Accessing the Tanzu Application Platform UI

As discussed in the [prerequisites](#prerequisites) section, there are a couple different methods for accessing your Tanzu Application Platform UI. In this guide, for simplicity of following along and not introducing too many variables, you will just use your `/etc/hosts` file. 

If you are comfortable with setting up DNS and records with your custom domain, that is a supported and recommended workflow. Refer to the [official install documentation](https://docs.vmware.com/en/Tanzu-Application-Platform/1.0/tap/GUID-install.html) for more information on this process.

1. Get the IP address of your envoy ingress pod.

    ```sh
    kubectl get svc envoy -n tanzu-system-ingress
    ```

    Example output:

    ```sh
    NAME    TYPE           CLUSTER-IP   EXTERNAL-IP      PORT(S)                      AGE
    envoy   LoadBalancer   10.24.9.37   34.121.244.203   80:32569/TCP,443:30160/TCP   22h
    ```

2. Save the `EXTERNAL-IP` into another environment variable.

    ```sh
    export ENVOY_EXTERNAL_IP=34.121.244.203   #change the IP address for your output of the above command
    ```

3. Append this IP address mapping to your configured domain name to `/etc/hosts`. You can use a text editor or other methods to add this line as well. This command is provided for simplicity.

    ```sh
    sudo echo "$ENVOY_EXTERNAL_IP  tap-gui.$CUSTOM_DOMAIN" | sudo tee -a /etc/hosts
    ```

4. Open the Tanzu Application Platform UI in your web browser. This may not work in the Safari browser since the connection is not secure. 

    ```sh
    open http://tap-gui.$CUSTOM_DOMAIN
    ```

5. Start to familiarize yourself with the Tanzu Application Platform interface. 

In later guides, you will use Tanzu Application Platform to deploy a workload. And with this interface up, you can follow along with other Tanzu Application Platform content. 

## Next steps

Now you have your own instance of Tanzu Application Platform to use for your development projects. Continue following along to other guides to deploy a workload, and see how your development workflow might change in a Tanzu environment. 

* Deploying a workload to Tanzu Application Platform **Coming Soon** - In this guide, you will use the `tanzu` CLI and Tanzu Application Platform to create a starter application, and access the web UI. 