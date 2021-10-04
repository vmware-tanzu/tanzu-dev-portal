---
title: "Kubeapps 2.3.4 - Easier Deployment in VMware Tanzu™ Kubernetes Grid Clusters"
description: A new Kubeapps release is out, and it is even easier to run in TKG clusters! The last version of Kubeapps necessitated a manual update of the current Pinniped version to the latest – this step is no longer required. Keep reading to learn more.
date: "2021-09-23"
tags:
- Kubeapps
- Containers
- Helm
- Kubernetes
# Author(s)
team:
- Raquel Campuzano Godoy
---

A new Kubeapps release is out, and it is even easier to run in TKG clusters! The last version of Kubeapps necessitated a manual update of the current Pinniped version to the latest. This step is no longer required. Cluster administrators can now configure Kubeapps to use the built-in Pinniped instance to authenticate through the same OIDC provider as they have already installed in their VMware Tanzu™ Kubernetes Grid (TKG) clusters. 

Keep reading to learn more about how to benefit from installing the Kubeapps 2.3.4 version.  

## Advanced Features for Tanzu Users 

Kubeapps enables users to consume and manage open-source trusted and validated solutions through an intuitive web-based interface. 

With the previous release, Tanzu users gained the ability of deploying Kubeapps directly to TKG workload clusters. This integration allows users to operate Kubernetes deployments through a web-based dashboard both on-premises in vSphere, and in the public cloud on Amazon EC2 or Microsoft Azure. 

Kubeapps provides a wide catalog of ready-to-run-on Kubernetes solutions. In addition to the default Kubeapps catalog, Tanzu users have the flexibility to configure either VMware Tanzu™ Application Catalog (TAC) as a private chart repository or any of VMware Marketplace™ Catalog or the Bitnami Application Catalog as public chart repositories. This extends the number of available solutions and sources for development teams to work with. [Refer to this blog post to learn more about Kubeapps key features for Tanzu users](https://blog.bitnami.com/2021/06/kubeapps-meets-tanzu-kubernetes-grid.html).  

## How to Use Kubeapps in TKG 

Once Kubeapps is enabled in a cluster, some concerns may arise for cluster administrators when users need to access the tool. These include:  

* How to ensure secure authentication for users to Kubeapps? 
* How to manage the different application catalogs? 
* Is possible to customize the layout of Kubeapps to align it with my corporate branding policies? 

This new release of Kubeapps addresses all these questions. When you install Kubeapps in a TKG cluster, you get an in-built authentication system in TKG via Pinniped using the same version as the cluster runs. Authorization is delegated to the Kubernetes RBAC. This means that the same policies and roles configured for your cluster will be used when users want to enter and use Kubeapps. That way, the authentication to Kubeapps is safe since it will use the same OIDC provider as the TKG cluster. 

## Configure an OIDC for Kubeapps Authentication

To configure an OIDC provider in your cluster for Kubeapps authentication, do the following: 

1. [Configure an Identity Management Provider in the Cluster](https://github.com/kubeapps/kubeapps/blob/master/docs/step-by-step/kubeapps-on-tkg/step-1.md#step-1-configure-an-identity-management-provider-in-the-cluster) 
2. [Configure and install Kubeapps by enabling the Pinniped Proxy component](https://github.com/kubeapps/kubeapps/blob/master/docs/step-by-step/kubeapps-on-tkg/step-2.md) 

## Configure Application Catalogs in Kubeapps

An easy way to deploy applications from the Tanzu Application Catalog and the Bitnami Application Catalog from the VMware Marketplace is through Kubeapps. With Kubeapps, you can either deploy custom applications from a private repository, or access the different catalogs from both public and private repositories provided by VMware. 

To configure application catalogs in Kubeapps once it is running on your TKG cluster, select one of the following solutions:   

* To [add the Bitnami Application Catalog from the VMware Marketplace public repository], go to (https://github.com/kubeapps/kubeapps/blob/master/docs/step-by-step/kubeapps-on-tkg/step-3.md#step-3-add-application-repositories-to-kubeapps). 
* To [add the Tanzu Application Catalog for Tanzu Advanced private repository], go to (https://github.com/kubeapps/kubeapps/blob/master/docs/step-by-step/kubeapps-on-tkg/step-3.md#add-the-vmware-tanzu-application-catalog-for-tanzu-advanced).

Once Kubeapps has been configured with one or more application repositories, you can start to use it to deploy, upgrade, roll back, or delete applications on your TKG clusters through its dashboard. [Check out this documentation to learn how.](https://github.com/kubeapps/kubeapps/blob/master/docs/step-by-step/kubeapps-on-tkg/step-4.md#step-4-deploy-and-manage-applications-with-kubeapps). 

## Configure a Custom User Interface

To provide a rich user experience, Kubeapps supplies a set of parameters to use for configuring a custom user interface. [Learn how to configure the user interface to follow your company branding guidelines.](https://github.com/kubeapps/kubeapps/blob/master/docs/step-by-step/kubeapps-on-tkg/step-4.md#step-4-deploy-and-manage-applications-with-kubeapps)  

## Support and Resources 

Since Kubeapps is an OSS project, support for this version of Kubeapps will be provided on a best-effort basis. For solving the problems you may have (including deployment support, operational support, and bug fixes), open an issue in the [Kubeapps GitHub repository](https://github.com/kubeapps/kubeapps/issues). A markdown template is provided to open new issues.  Also, if you want to contribute to the project, feel free to send us a pull request. The team will review it and guide you through the process of a successful merge. 

In addition, you can reach out to Kubeapps developers at #kubeapps on Kubernetes Slack (click here to sign up). 

For more information about the topics discussed in this blog post, refer to the following links: 

* [Kubeapps for TKG useful links](https://github.com/kubeapps/kubeapps/blob/master/docs/step-by-step/kubeapps-on-tkg/step-4.md#step-4-deploy-and-manage-applications-with-kubeapps) 
* [Bitnami Application Catalog documentation for Helm charts](https://docs.bitnami.com/kubernetes/apps/) 
* [Bitnami documentation for Kubernetes deployments](https://docs.bitnami.com/tutorials/) 

The Kubeapps team continues to work on the revamp of the Kubeapps backend. It will **support multiple package formats** soon. Stay tuned! [Download Kubeapps 2.3.4 now!](https://github.com/kubeapps/kubeapps/releases/tag/v2.3.4)
