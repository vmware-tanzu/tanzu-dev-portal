---
title: "Getting Started with the VMware Tanzu CLI Core"
description: Working with the VMware Tanzu suite of tools starts with tooling to deploy and manage those products. Learn how to install the `tanzu` CLI, and explore some of the basic functionality.
date: 2022-01-23
lastmod: 2022-01-23
level1: Building Kubernetes Runtime
level2: Application Platform on Kubernetes
tags:
- Tanzu
- Tanzu CLI
tanzu:
  label: framework
# Author(s)
team:
- Tony Vetter
---

The `tanzu` command line interface (CLI) is your local tool for interacting with the suite of VMware Tanzu products. This tool allows you to deploy and manage the life cycles of not only Kubernetes clusters, but also application workloads, continuous integration and continuous deployment (CI/CD) pipelines, various packages, as well as other development workflows that leverage Tanzu technologies running on those Kubernetes clusters.  

In this guide, you will learn how to install the Tanzu CLI itself, and develop a basic understanding of how it works. You will explore some of the more common commands used within the `tanzu` CLI. And finally, you will be given some ideas for next steps, and what you can do with the `tanzu` CLI in your own environment.  

By the end of this guide, you will have the `tanzu` CLI installed, and be ready to use it to create, manage, and deploy workloads to your own Kubernetes cluster. 

## Assumptions

These are some assumptions you should be aware of before proceeding with this guide:

* This guide was written for Tanzu CLI Core `v0.10.0`.
* This guide assumes you are running MacOS. Specifically, the `v12.0` "Monterey" line. Commands provided in this guide make these assumptions.
* This guide will be updated regularly, but updates might not be timed exactly to new releases of these products or platforms. You may need to modify commands if versions do not line up.
* This guide leverages heavily the [official documentation](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.3/vmware-tanzu-kubernetes-grid-13/GUID-install-cli.html) for installing the `tanzu` CLI. This guide is meant to be a simple setup to get you started quickly. For more complicated or production setups, refer to the official documentation.

## Prerequisites

A list of things you may need to do before getting started with this guide:

* [A Tanzu Network account with `pivnet` installed](/guides/tanzu-network-gs) - This guide walks you through setting up your account on the Tanzu Network, as well as installing the `pivnet` CLI tool.

## Installing `tanzu`

The `tanzu` CLI is hosted on the [Tanzu Network](https://network.pivotal.io). This is where many products in the Tanzu suite are also hosted. 

You will need to create the install directory, download the `tar` file from the Tanzu Network, extract it, and run the install binary. Let’s get started.

1. Create the install directory.

    ```sh
    mkdir ~/tanzu
    ```

2. Download the `tanzu` CLI package from the Tanzu Network. This download command can be found within the [`tanzu-cli`](https://network.pivotal.io/products/tanzu-application-platform/#/releases/992949/file_groups/5804) package of Tanzu Application Platform on the Tanzu Network. You may need to accept a EULA if this is your first time downloading this package. It can also be downloaded directly from the GUI as well.

    ```sh
    pivnet download-product-files --product-slug='tanzu-application-platform' --release-version='1.1.0-build.17' --product-file-id=1190780
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
    sudo install cli/core/v0.10.0/tanzu-core-darwin_amd64  /usr/local/bin/tanzu
    ```

6. Verify the installation.

    ```sh
    tanzu version
    ```
	
    Example output: 
	
    ```sh
    tanzu version
    version: v0.10.0
    buildDate: 2021-11-03
    sha: fd96bebe
    ```

7. Initialize the `tanzu` CLI.

    ```
    tanzu init
    ```
	
    Example output:

    ```sh
    tanzu init
    | initializing ✔  successfully initialized CLI
    ```

You now have a basic installation of `tanzu`. In the next section, you will explore some of the more common functionality used with this tool.

## Optional: Using `tanzu`

This section is not meant to be a CLI reference guide. But if this is your first exposure to the `tanzu` CLI tool, this section should start to familiarize you with some of the more common functions used.

These functions include managing the `tanzu` tool itself, listing and describing Kubernetes packages, and of course creating and managing Tanzu Kubernetes clusters.

### Managing the `tanzu` CLI

First things first, you need to make sure you are running the latest and greatest version of the tool. This may not seem intuitive since you just installed it, but check anyway. There can sometimes be updates available before they hit the Tanzu Network.

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

    If there is an update available, go ahead and install it by typing a `y`.

	Example output:
	
    ```sh
    ✔  successfully updated CLI
    ```

2. Verify the update process.

    ```sh
    tanzu version
    ```

    Example output: 

    ```sh
    tanzu version
    version: v0.12.0
    buildDate: 2021-11-25
    sha: ff02d464
    ```

Your `tanzu` installation should now be fully up to date. Repeating this process on occasion will help keep it that way. 

### Managing plug-ins

While with most CLI tools, the available commands are often thought of as built in, for the Tanzu CLI, these commands are better thought of as plug-ins. 

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

3. **Optional**: If your plug-ins are listed as `upgrade available`, again this can happen due to the separate release schedules and lifecycle management strategies of plug-ins versus the Tanzu CLI itself. You can upgrade each plug-in individually here.
	
    ```sh
    tanzu plugin upgrade <plugin-name>
    ```

There are other useful commands for managing plug-ins as well. Use the `--help` flag at any time to get a list of available commands and their usage.

### Managing packages

Packages are different from plug-ins. While plug-ins function as commands available to the Tanzu CLI, plug-ins are effectively installable applications, usually onto a Kubernetes cluster. 

Some packages are included by default. And like plug-ins, more can be added using a _repository_ model. As repositories are added to the Tanzu CLI, additional packages provided from VMware become available to install and use. More on this in future guides.

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

1. List clusters currently connected to your Tanzu CLI.

    ```sh
    tanzu cluster list
    ```

	Example output:

    ```sh
    tanzu cluster list
    NAME  NAMESPACE  STATUS  CONTROLPLANE  WORKERS  KUBERNETES  ROLES  PLAN
    ```

2. Take a look at how easy it is to create a new Kubernetes cluster using the Tanzu CLI. You will create one in a future guide. 
	
    ```sh
    tanzu cluster create --help
    ```

There is a lot more to unpack with managing clusters, but since you don’t have one to manage yet, this is all you are going to do as part of this guide. 

Future guides will walk you through more of these powerful features for managing the Kubernetes cluster lifecycle. 

## Uninstalling the `tanzu` CLI

As a CLI tool, the Tanzu CLI is meant to just get out of the way when you aren’t using it. However, there may be scenarios where you want to remove the tool. 

Since this tool uses a plug-in architecture, it is a little more involved than simply deleting the binary from your `$PATH`. Follow these instructions to completely remove the Tanzu CLI from your system. 

{{% callout %}}
Before you delete the tool, make sure that any clusters you have created are deleted.
{{% /callout %}}

1. Remove all of the created directories and the Tanzu binary.

    ```sh
    sudo rm -rf ~/tanzu/cli ~/.config/tanzu ~/Library/Application\ Support/tanzu-cli/* /usr/local/bin/tanzu ~/.cache/tanzu
    ```	

From here, you can go back through the install process above and reinstall if needed. 

## Next steps

If you have completed the Tanzu Network guide as well as this one, congratulations! You are now ready to really start playing with the power of the Tanzu ecosystem for developers.

* [Getting Started with VMware Tanzu Application Platform light Profile](/guides/tanzu-application-platform-gs) - This guide will walk you through setting up a basic VMware Tanzu Kubernetes Grid workload cluster. This cluster will be useful for setting up an inner loop development workflow using Tanzu tooling. 
* [Deploying an Application to VMware Tanzu Application Platform](/guides/tanzu-application-platform-deploying-a-workload)
description: This guide will walk you through deploying a demo application on to VMware Tanzu Application Platform.  
* [Inner Loop Development with VMware Tanzu Application Platform](/guides/tanzu-application-platform-inner-loop) - Local application development is a critical workflow for application developers. Getting fast feedback on each code change iteration is an important capability of this workflow. This guide will walk you through setting up a local development workflow which will enable live, local updates with each code save.