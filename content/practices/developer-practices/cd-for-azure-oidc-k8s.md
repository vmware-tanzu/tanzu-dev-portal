---
dev_practice: true
title: "Continuous Deployment (CD) for Azure-AD OIDC Kubernetes"
description: "Securely connect a CI/CD pipeline host machine to an Azure-AD-integrated K8s cluster"
lastmod: 2021-03-25T13:15:22-04:00
draft: false
tags: ["Delivery", "Developer", "Testing", "CI/CD", "Azure"]
description: "Setting Up Your Test Objects to Avoid Future Pain"
image: "default-cover-dev.jpg"
length: "As needed"
---

Written by: [Jake Stout](https://www.linkedin.com/in/jake-stout-a08aa848)

## Problems This Solves

> _"My team needs to securely connect our CI/CD pipeline host machine an Azure-AD-integrated K8s cluster"_

Depending on where and how a K8s cluster is provisioned, there are different ways of configuring a pipeline host machine's identity credential so that its `kubectl` tool can connect to the cluster securely:

- A token for a native Kubernetes Service Account, with a cluster-admin ClusterRole
- An Azure service principal or managed identity credential
- Use another identity system that integrates with your cluster. [See here](https://kubernetes.io/docs/reference/access-authn-authz/authentication/) for more documentation about authentication strategies.

This document explains how to use an **Azure service principal**. This document should also be helpful for using an Azure Managed Identity because Azure's `kubelogin` tool is compatible with both identity types.

The pipeline host machine's K8s connection is configured within the machine's KUBECONFIG file - [see more about KUBECONFIG on kubernetes.io here](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/).

## Solution

You can use Azure AD service principals for clusters integrated with Azure AD OIDC.

Often, these clusters are hosted on Azure Kubernetes Service (AKS), but this also applies to Kubernetes clusters hosted elsewhere (e.g. an Azure VM or on-premise server).

This solution relies on your pipeline host machine using the `kubelogin` CLI tool. Use this to login as an Azure AD Service Principal or Managed Identity (aka MI or MSI). This identity needs admin access via a Kubernetes ClusterRole in order to create Kubernetes resources on your cluster.

### Requirements

- `kubelogin` CLI tool installed on build agents
- Azure AD Service Principal (or Managed Identity)
    - with an administrative ClusterRole access to your cluster
- Kubernetes Service Account with cluster admin role
- kubectl CLI tool
    - Commands `apply`, `rollout restart`, & `rollout status`
- Kubernetes `Deployment` resource defined in YAML (e.g. `my-app-deployment.yaml`)

### Getting an initial KUBECONFIG file

You need KUBECONFIG data located on the pipeline host machine so that the `kubectl` tool can connect to your cluster's API server. This initial KUBECONFIG file only needs your cluster's API Server URL.

The KUBECONFIG may or may not have some credential (e.g. a certificate or token) in it. The `kubelogin` tool will replace this credential with some Azure AD credential. See Setup section below.

To get an initial KUBECONFIG:

1. use the `az login && az aks get-credentials -r my-team-resource-group -n my-team-aks` command on your workstation. This initializes your machine's `$HOME/.kube/config` file.
1. Make the contents of that KUBECONFIG available to your build script that will run on the pipeline host. Preferably not that machine's own `$HOME/.kube/config` because then another team using the  might accidentally access your cluster.

   Instead, if for example using Github Actions, you might store the contents in a Github Secret named `MY_TEAM_KUBECONFIG`. Then, your Github Workflow script can initialize a KUBECONFIG using that secret data:

   `echo "${{secrets.MY_TEAM_KUBECONFIG}}" > $HOME/.kube/config`

   At the end of your CD script, you might cleanup the KUBECONFIG so it does not linger on the pipeline host:

   `rm $HOME/.kube/config`

   Alternatively, if your organization stores KUBECONFIG data in a database like Hashicorp Vault, you may pull the KUBECONFIG file from that database. Some companys' automation processes upload a KUBECONFIG file during cluster creation.

   Use https://github.com/hashicorp/vault-action if the KUBECONFIG was uploaded to a HashiCorp Vault database.

### Getting an authorized Azure AD Service Principal

Follow the steps on `kubelogin` documentation below to (1) create an SP and (2) add a k8s ClusterRole allowing the SP admin access:

https://github.com/Azure/kubelogin#service-principal-login-flow-non-interactive

> Some person or account must already have admin access to create the ClusterRole. An AKS cluster will have an Azure AD group set as its administrator during creation.

### The CD script

The CD script must do at minimum the following in order for `kubectl` commands to work:

1. Checkout the repository containing your Kubernetes resource definition YAML files.
2. Initialize the KUBECONFIG data
3. Access the Azure AD service principal's clientID and secret
4. Call Azure's `kubelogin convert-kubeconfig` CLI tool command

### Example Solution - GitHub Actions

The below example solution is a Github Workflow that pulls the KUBECONFIG and Azure AD Service Principal credentials from an on-premise Hashicorp Vault server.

See the kubelogin documentation if you want to use an Azure Managed Identity instead.

```yaml
on:
  push:
    branches:
      - release

name: aad-continuous-deployment-dev

env:
  KUBECONFIG: ${{ github.workspace }}/.kube/config

jobs:
  deploy-job:
    needs: build-and-test-image-job
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@master
      - name: Fetch kubeconfig and service principal from Vault
        id: secrets
        uses: hashicorp/vault-action@master
        with:
          url: https://my-vault-server.my-company.com
          token: ${{ secrets.VAULT_TOKEN }}
          caCertificate: ${{ secrets.VAULT_CLIENT_CERT }}
          secrets: |
            azure/data/my-team-resource-group/my-team-aks kube_config;
            azure/creds/my-team-aks-spn client_id | AAD_SERVICE_PRINCIPAL_CLIENT_ID;
            azure/creds/my-team-aks-spn client_secret | AAD_SERVICE_PRINCIPAL_CLIENT_SECRET;
      - name: Initialize the kubeconfig file
        run: |
          mkdir ${{ github.workspace }}/.kube
          touch $KUBECONFIG
          echo -e '${{ steps.secrets.outputs.kube_config }}' > $KUBECONFIG
      - name: Convert kubeconfig for Azure AD non-interactive Service Principal login
        run: kubelogin convert-kubeconfig -l spn
      - name: Apply deployment changes
        run: kubectl apply -f k8s/my-app-deployment.yaml
      - name: Force pods to redownload image # (b/c image tag is always :latest)
        run: kubectl rollout restart deployment/my-app
      - name: Verify Deployment
        run: kubectl rollout status deployment/my-app
      - name: Cleanup
        run: rm $KUBECONFIG
```

### Pros
- Works best for organizations dependent on Azure AD. Integrates with Azure's AD identity provider
- Does not rely on a person's Azure credentials

### Cons
- Azure Managed Identities may be more "future proof" in the Microsoft domain
- Uses non-native Kubernetes concepts, like Azure AD
- Sometimes Service Principals are created dynamically and may not sync with Azure AD immediately. A `sleep 20` or some `az` CLI polling command might be needed.
- Need to find a place (e.g. Hashicorp Vault) to store the KUBECONFIG and Service Principal credentials
- Require a developer to manually create an initial KUBECONFIG with the API server url (if a KUBECONFIG is not already available)
- If teams are not authorized to manage their cluster, they may have to work with their organization's Kubernetes admins to setup Roles and Service Accounts
- Other Kubernetes providers (AWS, GKE) may require somehwat different KUBECONFIG setup

## Further Reading

### Kubernetes
- https://kubernetes.io/docs/reference/access-authn-authz/authentication/
- http://docs.shippable.com/deploy/tutorial/create-kubeconfig-for-self-hosted-kubernetes-cluster/
- https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/

### Azure

- https://github.com/Azure/kubelogin

### Amazon Kubernetes

- https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html
- https://docs.aws.amazon.com/eks/latest/userguide/authenticate-oidc-identity-provider.html

### Google Kubernetes

- https://cloud.google.com/build/docs/deploying-builds/deploy-gke
- https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl