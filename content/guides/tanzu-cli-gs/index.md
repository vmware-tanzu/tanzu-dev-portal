---
title: "Getting Started with the VMware `tanzu` CLI"
description: Working with the VMware Tanzu suite of tools starts with tooling to deploy and manage those products. Learn how to install the `tanzu` CLI, and explore some of the basic functionality.
date: 2021-12-10
lastmod: 2021-12-10
level1: Building Kubernetes Runtime
level2: Application Platform on Kubernetes
tags:
- Tanzu
- Tanzu CLI
# Author(s)
team:
- Tony Vetter
---

{{% callout %}} 
This guide was written for Tanzu CLI Core `v0.12.0` with a build date: of 2021-11-03. This guide also assumes a MacOS v12.0. Commands provided in this guide make these assumptions. This guide will be updated regularly, but updates might not be timed exactly to new releases of these products or platforms. You may need to modify commands. 
{{% /callout %}}

## What is the `tanzu` CLI?

The `tanzu` command line interface (CLI) is your local tool for interacting with the suite of VMware Tanzu products. This tool allows you to deploy and manage the life cycles of not only Kubernetes clusters, but also application workloads, continuous integration and continuous deployment (CI/CD) pipelines, various packages, as well as other development workflows that leverage Tanzu technologies running on those Kubernetes clusters.  

In this guide, you will learn how to install the `tanzu` CLI itself, and develop a basic understanding of how it works. You will explore some of the more common commands used within the `tanzu` CLI. And finally, you will be given some ideas for next steps, and what you can do with the `tanzu` CLI in your own environment. 

Finally, this guide leverages heavily the [official documentation](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.3/vmware-tanzu-kubernetes-grid-13/GUID-install-cli.html) for installing the `tanzu` CLI. This guide is meant to be a simple setup to get you started quickly. For more complicated or production setups, refer to the official documentation. 

## Prerequisites

There are a few things you need to do before getting started with the `tanzu` CLI:

* [Create a Tanzu Network account and install `pivnet`](/guides/tanzu-network-gs) - This is the previous guide in this series. The `pivnet` CLI tool is used to download packages from the Tanzu Network. This step is **optional**. If you choose not to install it, you will need to download the packages manually from the [Tanzu Network](https://network.pivotal.io).

## Installing `tanzu`

The `tanzu` CLI is hosted on the [Tanzu Network](https://network.pivotal.io). This is where many products in the Tanzu suite are also hosted. 

You will need to create the install directory, download the `tar` file from the Tanzu Network, extract it, and run the install binary. Let’s get started.

1. Create the install directory.
    ```sh
    mkdir ~/tanzu
    ```

2. Download the `tanzu` CLI package from the Tanzu Network. This download command can be found within the [`tanzu-cli`](https://network.pivotal.io/products/tanzu-application-platform/#/releases/992949/file_groups/5804) package of Tanzu Application Platform on the Tanzu Network. You may need to accept a EULA if this is your first time downloading this package. It can also be downloaded directly from the GUI as well.
    ```sh
    pivnet download-product-files --product-slug='tanzu-application-platform' --release-version='0.4.0' --product-file-id=1100107
    ```

3. Extract the `tar` file into the install directory created in the previous step.
    ```sh
    tar -xvf tanzu-framework-darwin-amd64.tar -C ~/tanzu
    ```

4. Change your working directory to the install directory.
    ```sh
    cd ~/tanzu
    ```

5. Run the install binary to complete the base installation.
    ```sh
    sudo install cli/core/v0.12.0/tanzu-core-darwin_amd64 /usr/local/bin/tanzu
    ```

6. Verify the installation.
    ```sh
    tanzu version
    ```
    Example output: 
    ```sh
    version: v0.12.0
    buildDate: 2021-11-25
    sha: ff02d464
    ```

7. Initialize the `tanzu` CLI.
    ```
    tanzu init
    ```
    Example output:
    ```sh
    tanzu init
    / initializing ✔  successfully initialized CLI
    ```

You now have a basic installation of `tanzu`. In the next section, you will explore some of the more common functionality used with this tool.

## Installing plugins

The `tar` file you downloaded and expanded earlier contains a manifest file within it. In `~/tanzu/cli/manifest.yaml` there is a reference to all of the default CLI plugins. In this section, you will install those. 

1. List your currently installed plugins.

    ```sh
    tanzu plugin list
    ```

    Example output:

    ```sh
    NAME                DESCRIPTION                                                        SCOPE       DISCOVERY  VERSION  STATUS
    login               Login to the platform                                              Standalone  default    v0.12.0  not installed
    management-cluster  Kubernetes management-cluster operations                           Standalone  default    v0.12.0  not installed
    package             Tanzu package management                                           Standalone  default    v0.12.0  not installed
    pinniped-auth       Pinniped authentication operations (usually not directly invoked)  Standalone  default    v0.12.0  not installed
    secret              Tanzu secret management                                            Standalone  default    v0.12.0  not installed
    ```

    Notice that these plugin are listed as `not installed`. This is a clean CLI install. You will install the plugins next. 

2. Disable the context-aware CLI feature. This will allow you to install these plugins from a local source.

    ```sh
    tanzu config set features.global.context-aware-cli-for-plugins false
    ```

3. Install the plugins using your local manifest file.

    ```sh
    tanzu plugin install --local cli all
    ```

4. List your plugins again. 

    ```sh
    tanzu plugin list
    ```

    Example output:

    ```sh
    NAME                LATEST VERSION  DESCRIPTION                                                        REPOSITORY  VERSION  STATUS
    accelerator                         Manage accelerators in a Kubernetes cluster                                    v0.5.0   installed
    apps                                Applications on Kubernetes                                                     v0.3.0   installed
    cluster             v0.13.0         Kubernetes cluster operations                                      core        v0.12.0  upgrade available
    kubernetes-release  v0.13.0         Kubernetes release operations                                      core        v0.12.0  upgrade available
    login               v0.13.0         Login to the platform                                              core        v0.12.0  upgrade available
    management-cluster  v0.13.0         Kubernetes management cluster operations                           core        v0.12.0  upgrade available
    package             v0.13.0         Tanzu package management                                           core        v0.12.0  upgrade available
    pinniped-auth       v0.13.0         Pinniped authentication operations (usually not directly invoked)  core        v0.12.0  upgrade available
    secret              v0.13.0         Tanzu secret management                                            core        v0.12.0  upgrade available
    services                            Discover Service Types and manage Service Instances (ALPHA)                    v0.1.0   installed    
    ```

    Notice here a few things. First that all of the previously listed plugins are now installed. Next, notice that you have some new plugins available too. These plugins are out side of the core plugins `tanzu` has configured, and are used for installing and managing Tanzu Application Platform. 
    
    Finally, see that many of these are listed as `upgrade available`. You can, if you want, run `tanzu plugin upgrade` to upgrade these. But this is outside of the scope of this guide and future commands will assume you are running at least these versions listed. 

## Optional: Using `tanzu`

This section is not meant to be a CLI reference guide. But if this is your first exposure to the `tanzu` CLI tool, this section should start to familiarize you with some of the more common functions used.

These functions include managing the `tanzu` tool itself, listing and describing Kubernetes packages, and of course creating and managing Tanzu Kubernetes clusters.

The rest of this guide will not be adding functionality. Instead, you will be familiarizing yourself with this tool. If this does not sound interesting to you, this section can be skipped and you can go in to [next steps](#next-steps).

### Managing the `tanzu` CLI

First things first, you need to make sure you are running the latest and greatest version of the tool. This may seem not intuitive since you just installed it, but check anyway. There can sometimes be updates available before they hit the Tanzu Network.

1. Update the `tanzu` CLI.
    ```sh
    tanzu update
    ```
    Example output:
    ```sh
    tanzu update
    ℹ  the following updates will take place:
    core v0.10.0 → v0.12.0
    
    ? would you like to continue? [y/n]
    ```

2. If there is an update available, go ahead and install it by typing a `y`.
	Example output:
    ```sh
    ✔  successfully updated CLI
    ```

3. Verify the update process.
	```sh
	tanzu version
    ```
    Example output: 
    ```sh
    version: v0.12.0
    buildDate: 2021-11-25
    sha: ff02d464
    ```

### Managing plug-ins

While with most CLI tools, the available commands are often thought of as built in, for the `tanzu` CLI, these commands are better thought of as plug-ins. 

Some of these plug-ins are built in. And for managing certain products, additional plug-ins can be added. This will become more clear in future guides where you will add additional plug-ins.

1. List the plug-ins currently available to you.
    ```sh
    tanzu plugin list
    ```
    Example output:
    ```sh
    tanzu plugin list
    NAME                DESCRIPTION                                                        SCOPE       DISCOVERY  VERSION  STATUS
    login               Login to the platform                                              Standalone  default    v0.12.0  installed
    management-cluster  Kubernetes management-cluster operations                           Standalone  default    v0.12.0  installed
    package             Tanzu package management                                           Standalone  default    v0.12.0  installed
    pinniped-auth       Pinniped authentication operations (usually not directly invoked)  Standalone  default    v0.12.0  installed
    secret              Tanzu secret management                                            Standalone  default    v0.12.0  installed
    ```

2. **Optional**: If your plug-ins are listed as `not installed`, this can sometimes happen after an upgrade, since the plug-ins and the `tanzu` CLI itself can have different release schedules. If this is the case, you can reinstall and upgrade each plug-in individually here.
    ```sh
    tanzu plugin install <package-name>
    ```

3. **Optional**: If your plug-ins are listed as `upgrade available`, again this can happen due to the separate release schedules and lifecycle management strategies of plug-ins versus the `tanzu` CLI itself. You can upgrade each plug-in individually here.
    ```sh
    tanzu plugin upgrade <plugin-name>
    ```

There are other useful commands for managing plug-ins as well. Use the `--help` flag at any time to get a list of available commands and their usage.

### Managing packages

Packages are different from plug-ins. While plug-ins function as commands available to the `tanzu` CLI, plug-ins are effectively installable applications, usually onto a Kubernetes cluster. 

Some packages are included by default. And like plug-ins, more can be added using a _repository_ model. As repositories are added to the `tanzu` CLI, additional packages provided from VMware become available to install and use. More on this in future guides.

1. List packages currently available to you. 
    ```sh
    tanzu package available list
    ```
    Example output:
    ```sh
    \ Retrieving available packages...
    NAME                           DISPLAY-NAME  SHORT-DESCRIPTION                                                                                           LATEST-VERSION
    cert-manager.tanzu.vmware.com  cert-manager  Certificate management                                                                                      1.5.3+vmware.2-tkg.1-tf-v0.11.0
    contour.tanzu.vmware.com       contour       An ingress controller                                                                                       1.18.2+vmware.1-tkg.1-tf-v0.11.0
    external-dns.tanzu.vmware.com  external-dns  This package provides DNS synchronization functionality.                                                    0.10.0+vmware.1-tkg.1-tf-v0.11.0
    fluent-bit.tanzu.vmware.com    fluent-bit    Fluent Bit is a fast Log Processor and Forwarder                                                            1.7.5+vmware.1-tkg.2-tf-v0.11.0
    grafana.tanzu.vmware.com       grafana       Visualization and analytics software                                                                        7.5.7+vmware.1-tkg.2-tf-v0.11.0
    harbor.tanzu.vmware.com        harbor        OCI Registry                                                                                                2.3.3+vmware.1-tkg.1-tf-v0.11.0
    multus-cni.tanzu.vmware.com    multus-cni    This package provides the ability for enabling attaching multiple network interfaces to pods in Kubernetes  3.7.1+vmware.2-tkg.2-tf-v0.11.0
    prometheus.tanzu.vmware.com    prometheus    A time series database for your metrics                                                                     2.27.0+vmware.1-tkg.2-tf-v0.11.0
    ```
    
    Here you can see the package name, the display name, a brief description of each package, and its version.

2. List repositories currently available to you. Since the only packages available are the ones built in, there won’t be any repositories added yet. 

    ```sh
    tanzu package repository list
    ```
    Example output:
    ```sh
    \ Retrieving repositories…
    NAME  REPOSITORY  TAG  STATUS  DETAILS
    ```

There are other useful commands for managing packages as well. Use the `--help` flag at any time to get a list of available commands and their usage.

### Managing clusters

You haven’t created any clusters yet, so this section won’t be that interesting. That project will come in a later guide series. But starting to look at some of the available commands will help you in the future.

1. List clusters currently connected to your `tanzu` CLI.
    ```sh
    tanzu cluster list
    ```
    Example output:
    ```sh
    NAME  NAMESPACE  STATUS  CONTROLPLANE  WORKERS  KUBERNETES  ROLES  PLAN
    ```

Take a look at how easy it is to create a new Kubernetes cluster using the `tanzu` CLI. You will create one in a future guide. 
    ```sh
    tanzu cluster create --help
    ```

There is a lot more to unpack with managing clusters, but since you don’t have one to manage yet, this is all you are going to do as part of this guide. 

Future guides will walk you through more of these powerful features for managing the Kubernetes cluster lifecycle. 

## Uninstalling the `tanzu` CLI

As a CLI tool, the `tanzu` CLI is meant to just get out of the way when you aren’t using it. However, there may be scenarios where you want to remove the tool. 

Since this tool uses a plug-in architecture, it is a little more involved than simply deleting the binary from your `$PATH`. Follow these instructions to completely remove the `tanzu` CLI from your system. 

{{% callout %}}
Before you delete the tool, make sure that any clusters you have created are deleted.
{{% /callout %}}

{{% callout %}}
Again, these instructions were written for MacOS. If you are running on another platform, these commands will need to be modified. 
{{% /callout %}}

1. Remove all of the created directories and the `tanzu` binary.
    ```sh
    sudo rm -rf \
      ~/tanzu/cli \
      ~/.config/tanzu \
      ~/.cache/tanzu \
      ~/Library/Application\ Support/tanzu-cli/* \
      /usr/local/bin/tanzu
    ```	
From here, you can go back through the install process above and reinstall if needed. 

## Next steps

If you have completed the [Tanzu Network guide](/guides/tanzu-network-gs) as well as this one, congratulations! You are now ready to really start playing with the power of the Tanzu ecosystem for developers.

For local, inner-loop development, using the Tanzu extensions for Visual Studio Code along with a local, minimal install of VMware Tanzu Application Platform will really enhance your workflow. 

* Getting started with the `dev-light` profile for VMware Tanzu Application Platform (coming soon!) - This will walk you through setting up a minimal install of Tanzu Application Platform, which you will use to create a powerful, local, inner-loop development flow.

* Getting started with VMware Tanzu Kubernetes Grid (coming soon!) - Learn about management and workload Kubernetes clusters with a hands-on guide, which will walk you through deploying each.
