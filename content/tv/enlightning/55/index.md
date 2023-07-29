---
Date: '2023-08-03T08:00:00-07:00'
Description: "Keeping Secrets Secret: Secrets Store CSI Driver"
PublishDate: '2023-08-03T00:00:00-07:00'
date: '2023-08-03'
episode: '55'
explicit: 'no'
guests:
- Anish Ramasekar
hosts:
- Whitney Lee
youtube: "vOJK2BwR3zc"
lastmod: '2020-10-09'
title: "Keeping Secrets Secret: Secrets Store CSI Driver"
twitch: vmwaretanzu
type: tv-episode
---

Applications running on Kubernetes require access to sensitive information like passwords, SSH keys, and authentication tokens. But how do you configure your applications when the source of truth for these secrets is an external secret store? What if you need to securely store, retrieve and perform zero-touch rotation of these secrets? Meet the [Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/), a Kubernetes sig-auth sub-project providing a simple way to retrieve secrets from enterprise-grade external stores such as Azure Key Vault, AWS Secrets Manager, Google Secret Manager, and HashiCorp Vault.

In this session, we will demonstrate how to use the Secrets Store CSI Driver to mount and rotate sensitive information from external secrets stores into Kubernetes applications. We will also the discuss trade-offs of Secrets Store CSI Driver versus other solutions for accessing external secret stores, and how Secrets Store CSI Driver Custom Resource Definitions (CRDs) are used enable pod portability across Kubernetes environments.

\\(^-^)/
