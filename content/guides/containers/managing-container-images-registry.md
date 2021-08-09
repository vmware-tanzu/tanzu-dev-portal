---
date: '2021-02-26'
lastmod: '2021-02-26'
linkTitle: Manage and Secure Container Images in a Registry
patterns:
- Deployment
tags:
- Harbor
- Containers
title: Managing and Securing Container Images in a Registry
topics:
- Kubernetes
- Containers
- Microservices
weight:
oldPath: "/content/guides/containers/managing-container-images-registry.md"
aliases:
- "/guides/containers/managing-container-images-registry"
level1: Deploying Modern Applications
level2: Packaging and Publishing
---

A key reason why enterprises are turning to Kubernetes is that cloud native services and practices boost developer productivity. As you put containerized applications into production, you need a secure way to store, scan, and sign your container images. A container image registry without management and security puts your cloud native environment at risk.

Container images present some security challenges. Images are usually built by layering other images, which could contain vulnerabilities, and those vulnerabilities can find their way into production systems. Defects and malware can also affect container images. When the provenance of a container is dubious or unknown these risks increase.

Container image registries with the following functionality can reduce these risks:

* Scan images for vulnerabilities found in the Common Vulnerabilities and Exploits (CVE) database.
* Sign images as known and trusted by using a notary.
* Set up secure, encrypted channels for connecting to the registry.
* Authenticate users and control access by using existing enterprise accounts managed in a standard directory service, such as Active Directory.
* Tightly control access to the registry using the principles of least privilege and separation of duties.
* Enact policies that let users consume only those images that meet your organization's thresholds for vulnerabilities.

## Harbor: A Secure Image Registry

[Harbor](https://goharbor.io/) is an open source registry that secures artifacts with policies and role-based access control, ensures images are scanned and free from vulnerabilities, and signs images as trusted. A CNCF Graduated project, Harbor delivers compliance, performance and interoperability to help you consistently and securely manage artifacts across cloud native compute platforms like Kubernetes and Docker. Harbor provides all the functionality mentioned above, including:

* Scans images for CVEs in conjunction with a number of scan providers including CentOS/Clair, Aqua/Trivy, Anchore/Engine, and DoSec to detect container images with vulnerabilities. 

* Integrates with Active Directory/LDAP and OIDC to provide role-based access control so that you can securely store images behind your firewall.

* Signs images as trusted by using [Notary](https://github.com/theupdateframework/notary). You can also set policies that prevent vulnerable or untrusted images from being used in production.

### Vulnerability Scanning

Containers often use base images of operating systems like Ubuntu and CentOS from a public image repository, such as DockerHub. The packages of an operating system and the applications on it, however, can contain vulnerabilities.

Vulnerability scanning helps detect known vulnerabilities to reduce the risk of security breaches. Identifying a vulnerability on an image and keeping the vulnerability from going into production reduces the attack surface of a containerized application.

The Harbor image registry scans images with Clair or Trivy (default options) to help prevent images with known vulnerabilities from running in production. With Harbor, you can automate the scanning of images or scan them manually.

Scanners work by continuously importing metadata about vulnerabilities from various sources, including CVEs, and storing the metadata in a database. When Harbor scans an image, Harbor checks the database through the appropriate API and produces a list of vulnerabilities.

### Establishing Content Trust with Notary

Because images are the building blocks of a containerized application, a security best practice is to use signed container images from a trusted registry. Harbor establishes trust by letting publishers sign images when they push them into the repository and by preventing unsigned images from being pulled from the repository.

The Notary services of the Harbor private registry can furnish project-level content trust to container images to ensure that only trusted images are used as developers create their own layered images, automate the building of a container, or select images for use as the building blocks of an application.

### Image and Registry Security in the Software Pipeline

Harbor works in the context of a development pipeline to manage and secure container images. The following diagram illustrates Harbor's role in a development pipeline:

![The Harbor container registry manages and secures container images.](/images/guides/containers/diagrams/harbor-registry-security.png)

Harbor is an important tool in your software security program, ensuring your cloud native application development meets all of the latest security protocols.

## Keep Learning

If you are new to Harbor or haven’t checked in recently, have a look at the [features of the latest release](https://goharbor.io/). This guide focuses on security, but Harbor also provides support for multi-tenancy, replication across registries, and offers an extensible API and web UI.

To get started using Harbor, this guide provides a good, real-world introduction: [Installing Harbor on Kubernetes with Project Contour, Cert Manager, and Let’s Encrypt](/guides/kubernetes/harbor-gs/).