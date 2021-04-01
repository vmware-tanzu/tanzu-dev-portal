---
dev_practice: true
title: "Continuous Deployment (CD) for Native Kubernetes"
description: "Securely connect a CI/CD pipeline host machine to a natively deployed K8s cluster"
lastmod: 2021-03-25T13:15:43-04:00
draft: false
tags: ["Delivery", "Developer", "Testing", "CI/CD", "Kubernetes"]
image: "default-cover-dev.jpg"
length: "As needed"
---

Written by: [Jake Stout](https://www.linkedin.com/in/jake-stout-a08aa848)

## Problems This Solves

> My team needs to securely connect our CI/CD pipeline host machine to a natively deployed K8s cluster

Depending on where and how a K8s cluster is provisioned, there are different ways of configuring a pipeline host machine so that its `kubectl` tool can connect to the cluster securely:

- A token for a native Kubernetes Service Account, with a cluster-admin ClusterRole
- An Azure service principal or managed identity credential
- Use another identity system that integrates with your cluster

This document explains how to use a K8s-native service account token on your pipeline host machine. The pipeline host machine's K8s connection is configured within the machine's KUBECONFIG file - [see more about KUBECONFIG on kubernetes.io here](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/).

## Solution

You can create a native Kubernetes Service Accounts token and store that token with the pipeline host machine's KUBECONFIG.
With self-hosted clusters, a native-Kubernetes Service Account is a popular credential choice.

> Warning: if your cluster is integrated with Azure AD or another identity provider, these native service accounts will probably not be recognized by that provider without extra configuration.

### Requirements
- Kubernetes Service Account with cluster admin role
- kubectl CLI tool
    - Commands `apply`, `rollout restart`, & `rollout status`
- Kubernetes `Deployment` resource defined in YAML (e.g. `my-app-deployment.yaml`)
- Pipeline host machine to run CD scripts (e.g. Github Actions, Jenkins, TeamCity)


### Getting a KUBECONFIG file

Ask the Kubernetes admin for a way to get the 3 parameters below. Whoever created the cluster should have access to these parameters:

1. Cluster's API server URL
1. Cluster's CA certificate data (base64 encoded)
1. A service account token (see section "[Getting a service account configured](#Getting-a-service-account-configured)")

With the above data collected, you can create a simple Kubeconfig file:

```yaml
apiVersion: v1
kind: Config
users:
- name: my-service-account
  user:
    token: <service account token>
clusters:
- cluster:
    certificate-authority-data: <CA certificate base64 data>
    server: <API server url>
  name: my-self-hosted-cluster
contexts:
- context:
    cluster: my-self-hosted-cluster
    user: my-service-account
  name: my-cluster-context
current-context: my-cluster-context
```

### Getting a service account configured

Someone with the proper Kubernetes roles will need to run the below commands:

```bash
kubectl create serviceaccount cookbook-sa
# serviceaccount/cookbook-sa created

kubectl create clusterrolebinding cookbook-sa-admin --clusterrole=cluster-admin --serviceaccount=default:cookbook-sa
# clusterrolebinding.rbac.authorization.k8s.io/cookbook-sa-admin created
```

To get the service account token: 

```bash
TOKENNAME=`kubectl get serviceaccount/cookbook-sa -o jsonpath='{.secrets[0].name}'`
kubectl get secret $TOKENNAME -o jsonpath='{.data.token}'| base64 --decode
```

### The CD script

The CD script must do at minimum the following in order for `kubectl` commands to work:

1. Checkout the repository containing your Kubernetes resource definition YAML files.
1. Access the kubeconfig file described above.

### Example Solution - GitHub Actions

The below Github Workflow represents an example CD script that will deploy to your cluster.

Notice it accesses the KUBECONFIG file data stored in a Github Secret named `MY_TEAM_KUBECONFIG`. You may have to fetch this value in a different way (and/or from a different source) that's appropriate for your organization's automation platform.

```yaml
on:
  push:
    branches:
      - release

name: on-premise-continuous-deployment-dev

env:
  KUBECONFIG: ${{ github.workspace }}/.kube/config

jobs:
  deploy-job:
    needs: build-and-test-image-job
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@master
      - name: Initialize the kubeconfig file
        run: |
          mkdir ${{ github.workspace }}/.kube
          touch $KUBECONFIG
          echo -e '${{ secrets.MY_TEAM_KUBECONFIG }}' > $KUBECONFIG
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
- Uses only native Kubernetes concepts (kubectl, KUBECONFIG, service accounts, roles)
- Does not rely on a person's credentials
- Some organizations prefer native Kubernetes like Service Accounts

### Cons
- Won't work if the K8s cluster is OIDC-integrated because the OIDC provider won't recognize a Kubernetes service account token
- Some Kubernetes admins may prefer to install an x509 certificate on the pipeline hostmachine, and then configure the KUBECONFIG with that certificate as a "credential"
- Team may not have a place to store the KUBECONFIG on their pipeline host or automation platform
- If teams are not authorized to manage their cluster, they may have to work with their organization's Kubernetes admins to setup Roles and Service Accounts
- Other Kubernetes providers (AWS, GKE) may require somewhat different KUBECONFIG setup

## Further Reading

### Kubernetes
- https://kubernetes.io/docs/reference/access-authn-authz/authentication/
- http://docs.shippable.com/deploy/tutorial/create-kubeconfig-for-self-hosted-kubernetes-cluster/
- https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
- https://kubernetes.io/docs/reference/access-authn-authz/authentication/

### Azure

- https://github.com/Azure/kubelogin

### Amazon Kubernetes

- https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html
- https://docs.aws.amazon.com/eks/latest/userguide/authenticate-oidc-identity-provider.html

### Google Kubernetes

- https://cloud.google.com/build/docs/deploying-builds/deploy-gke
- https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl

