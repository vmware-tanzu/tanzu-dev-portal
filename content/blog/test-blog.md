---
title: "Test Blog"
description: 
date: "2021-08-03"
topic:
- Python

# Author(s)
team:
-
---


{{< faqs >}}
  {{< faq question="How do you install ArgoCD on Kubernetes?" >}}
    After creating a Kubernetes cluster, ArgoCD can be installed with two simple commands. First, create a namespace to install the ArgoCD and run the command `kubectl create namespace argocd`. Finally, apply the script `kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml` to finish the install.
  {{< /faq >}}
  {{< faq question="What are the benefits of using ArgoCD on Kubernetes?" >}}
    Because ArgoCD can apply git repository configurations to Kubernetes, it assists in the lifecycle management and accelerated deployment of [cloud-native applications](https://tanzu.vmware.com/cloud-native).
  {{< /faq >}}
  {{< faq question="How do you install ArgoCD CLI?" >}}
    On Mac, the ArgoCD CLI can be installed with `brew`, where there is a tap for ArgoCD. Otherwise, the binary will need to be installed by navigating to ArgoCD releases page, installing the correct version appropriate for your platform, renaming the file, modifying the command, logging in, and deploying your application.
  {{< /faq >}}
  {{< faq question="How do you deploy apps to ArgoCD in Kubernetes?" >}}
    After Installation of the ArgoCD CLI, to deploy your applications with ArgoCD, first tell ArgoCD about your deployment target Kubernetes cluster using the command `argocd cluster add target-k8s`, then configure ArgoCD to pull the image using [spring-petclinic](https://github.com/spring-projects/spring-petclinic ). Finally, push your container to DockerHub and create your own configuration files, or [fork our repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo) into your own.
  {{< /faq >}}
  {{< faq question="How do you add a Kubernetes cluster to ArgoCD?" >}}
    Kubernetes clusters can be added to ArgoCD by installing the proper configuration files, installing ArgoCD on a Kubernetes cluster, then starting both the target cluster and the cluster in which you installed ArgoCD.
  {{< /faq >}}
  {{< faq question="What is ArgoCD sync?" >}}
    “Sync” is the terminology ArgoCD uses to describe the application on your target cluster as being up to date with the sources ArgoCD is pulling from. 
  {{< /faq >}}
{{< /faqs >}}