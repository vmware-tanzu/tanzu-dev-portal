---
date: '2021-02-05'
description: Learn how Bitnami applies security best practices to its containers.
lastmod: '2021-02-05'
linkTitle: Container Security Best Practices
patterns:
- Deployment
tags:
- Bitnami
- Docker
- Containers
- Kuberenetes
- Security
team:
- Carlos Rodriguez Hernandez
title: Best Practices for Securing and Hardening Container Images
topics:
- Containers
oldPath: "/content/guides/containers/security-best-practices.md"
aliases:
- "/guides/containers/security-best-practices"
level1: Deploying Modern Applications
level2: Packaging and Publishing
---

When a container is built and/or used, it is important to ensure that the image is built by following best practices in terms of security, efficiency, performance, etc. This article will go over some of the key points Bitnami takes into account when publishing Bitnami containers. It covers image tagging, non-root configuration and arbitrary UIDs, the importance of reducing size and dependencies, and the release process, including CVE scanning and tests.

## Rolling and immutable tags

A Docker tag is a label used to uniquely identify a Docker image. It allows users to deploy a specific version of an image. A single image can have multiple tags associated with it.

Every time Bitnami publishes a new version of an image, the associated tags are also updated to make it easier for users to get the latest version.

### Rolling tags

Bitnami uses rolling tags (a tag that may not always point to the same image) for its Docker container images. To understand how this works, let's use the Bitnami etcd container image tags as an example:

```plaintext
3, 3-debian-10, 3.4.13, 3.4.13-debian-10-r8, latest
```

* The *latest* tag always points to the latest revision of the etcd image.
* The *3* tag is a rolling tag that always points to the latest revision of etcd 3.x.
* The *3.4.13* tag is a rolling tag that points to the latest revision of etcd 3.4.13. It will be updated with different revisions or daily releases but only for etcd 3.4.13.
* The *3-debian-10* tag points to the latest revision of etcd 3.x for Debian 10, in case there are other distros supported.

When Bitnami releases container images - typically to upgrade system packages - it fixes bugs or improves the system configuration and also updates container tags to point to the latest revision of the image. Therefore, the rolling tags shown above are dynamic; they will always point to the latest revision or daily release of the corresponding image.

Continuing with the example above, the *3.4.13* tag might point to the etcd 3.4.13 revision 8 today, but it will refer to the etcd 3.4.13 revision 9 when Bitnami next updates the container image.

The suffix revision number (*rXX*) is incremented every time that Bitnami releases an updated version of the image for the same version of the application. As explained in the next section, suffixed tags are also known as immutable tags.

> Any tags that do not explicitly specify a distribution, such as *3* or *3.4.13*, should be assumed to refer to Debian 10.

### Immutable tags

A static, or immutable, tag always points to the same image. This is useful when you depend on a specific revision of an image For example, if you use the tag *3.4.13-debian-10-r8*, this tag will always refer to etcd *3.4.13 revision 8*. The use of this tag ensures that users get the same image every time.

### Usage recommendations

Which tag should you use and when? Follow these guidelines:

* If you are using containers in a production environment (such as Kubernetes), use immutable tags. Bitnami uses immutable tags by default in the Bitnami Helm Charts. This ensures that your deployment won't be affected if a new revision inadvertently breaks existing functionality.
* If you are using containers for development, use rolling tags. This ensures that you are always using the latest version. Rolling tags also make it easier to use a specific version of a development tool (such as *bitnami/node:12* for Node.js 12).

## Root and non-root containers

There are two types of Bitnami container images: root and non-root. Non-root images add an extra layer of security and are generally recommended for production environments. However, because they run as a *non-root* user, privileged tasks such as installing system packages, editing configuration files, creating system users and groups, and modifying network information, are typically off-limits.

This section gives you a quick introduction to non-root container images, explains possible issues you might face using them, and also shows how to modify them to work as root images.

### Non-root containers

By default, Docker containers are run as *root* users. This means that you can do whatever you want in the container, such as install system packages, edit configuration files, bind privilege ports, adjust permissions, create system users and groups, or access networking information.

With a non-root container, you can't do any of this. A non-root container must be configured only for its main purpose, for example, run the NGINX server.

A non-root container is a container in which the user executing the processes is not the *root* user but an unprivileged user, like *1001*. This is usually modified through the `USER` instruction in the Dockerfile.

### Advantages of non-root containers

Non-root containers are recommended for the following reasons:

* Security: Non-root containers are more secure. If there is a container engine security issue, running the container as an unprivileged user will prevent any malicious code from gaining elevated permissions on the container host. [Learn more about Docker's security features](https://docs.docker.com/engine/security/security/#other-kernel-security-features).

* Platform restrictions: Some Kubernetes distributions (such as [OpenShift](https://www.openshift.com)) run containers using random UUIDs. This approach is not compatible with root containers, which must always run with the *root* user's UUID. In such cases, root-only container images will simply not run and a non-root image is a must. [Learn more about random UUIDs](https://cookbook.openshift.org/users-and-role-based-access-control/why-do-my-applications-run-as-a-random-user-id.html)

### Disadvantages of non-root containers

Non-root containers also have some disadvantages when used for local development:

* Write failures on mounted volumes: Docker mounts host volumes preserving the host UUID and GUID. This can lead to permission conflicts with non-root containers, as the user running the container may not have the appropriate privileges to write on the host volume.

* Write failures on persistent volumes in Kubernetes: Data persistence in Kubernetes is configured using persistent volumes. Kubernetes mounts these volumes with the *root* user as the owner; therefore, non-root containers don't have permissions to write to the persistent directory.

* Issues with specific utilities or services: Some utilities (e.g. Git) or servers (e.g. PostgreSQL) run additional checks to find the user in the */etc/passwd* file. These checks will fail for non-root container images.

To learn more about these issues, as well as potential solutions for each, [refer to our detailed blog post on this topic](https://engineering.bitnami.com/articles/running-non-root-containers-on-openshift.html).

Bitnami non-root containers fix the above issues:

* For Kubernetes, Bitnami Helm charts use an *initContainer* for changing the volume permissions properly. As the image runs as non-root by default, it is necessary to adjust the ownership of the persistent volume so that the container can write data to it.
By default, the charts are configured to use Kubernetes Security Context to automatically change the ownership of the volume. However, this feature does not work in all Kubernetes distributions. As an alternative, the charts support using an *initContainer* to change the ownership of the volume before mounting it in the final destination. [See an example of this in action from the Bitnami RabbitMQ chart](https://github.com/bitnami/charts/blob/9353a76a4ddda6bf1da78328496fb649c951e80d/bitnami/rabbitmq/templates/statefulset.yaml#L58) you can see how this *initContainer* is used.
* For specific utilities, Bitnami ships the [*libnss-wrapper* package](https://packages.debian.org/sid/libnss-wrapper), which defines custom user space files to ensure the software acts correctly. [See an example of this in action from the Bitnami PostgreSQL image](https://github.com/bitnami/bitnami-docker-postgresql/blob/master/12/debian-10/rootfs/opt/bitnami/scripts/libpostgresql.sh#L25).

### Use non-root containers as root containers

If you wish to run a Bitnami non-root container image as a root container image, you can do it by adding the line `user: root` right after the `image:` directive in the container's *docker-compose.yml* file. After making this change, restart the container and it will run as the *root* user with all privileges instead of an unprivileged user.

In Kubernetes, the user that executes the container can be customized by using [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/).

### Use arbitrary UUIDs

On some platforms like OpenShift, to support running containers with volumes mounted in a secure way, images must run as an arbitrary user ID. When those platforms mount volumes for a container, they configure the volume so it can only be written to by a particular user ID, and then run the image using that same user ID. This ensures the volume is only accessible to the appropriate container, but requires that the image is able to run as an arbitrary user ID.

That means a non-root container executing on a platform with this policy can't assume anything about the UUID. These platforms change the default container user to an arbitrary UUID, but the GUID is unmodified and containers are executed as *XXX:root* (where *XXX* is the arbitrary UUID).

Bitnami images are configured with the proper permissions for the user and group in order to meet the requirements of these platforms. They do this by ensuring that the *XXX* user belongs to the *root* group and that the directories have the appropriate read, write and execution permissions.

## Execute one process per container

Each container should have only one concern. Decoupling applications into multiple containers makes it easier to scale horizontally and reuse containers. For instance, a web application stack might consist of three separate containers, each with its own unique image, to manage the web application, database, and an in-memory cache in a decoupled manner.

Although all Bitnami images follow this good practice there are cases where two or more processes need to be executed at the same time in the same image. One such case is that of the [Bitnami PostgreSQL with Replication Manager Docker Image](https://github.com/bitnami/bitnami-docker-postgresql-repmgr) where, apart from the *postgres* process, there is a separate process for the *repmgr* daemon. There are also other cases where the application spawns additional processes on its own.

It is therefore important to take a decision about the number of processes per container keeping in mind the goal of keeping each container as clean and modular as possible.

## Performance considerations

As indirectly described in the previous section, it is important to follow the "Principle of least privilege" (POLP), an important concept in computer security. This refers to the practice of limiting access rights for users to the bare minimum permissions they need to perform their work.

In the same way, a good security practice is to install and maintain only the minimum necessary dependencies in a container image. It is also important to reduce the size of the images to improve the security, performance, efficiency, and maintainability of the containers.

Package installation in Bitnami images (also applicable to already-installed packages) is usually done using the `install_packages` script. This tool was created to install system packages in a smart way for container environments. Apart from installing packages only with the required dependencies (no recommended packages or documentation), it also removes the cache and unnecessary package repositories.

## Daily builds and release process

Bitnami automatically re-releases its container catalog every 24 hours. In terms of security, releasing the Bitnami containers on a daily basis ensures that the system packages and components bundled in the image are up-to-date from the package repositories.

As explained previously, this approach means that a new immutable tag is produced every day, increasing the revision number. At the same time, rolling tags are updated to point to this new immutable tag.

> For the Bitnami Community Catalog, the release frequency is set to 1 day. However, this can be modified by the customer in the [Tanzu Application Catalog](https://tanzu.vmware.com/application-catalog).

Apart from daily releases, there are other processes that can trigger a new release. For example, if there is a new version (major, minor, or patch) of the main component, Bitnami's tracking system detects this new upstream release and trigger a new release of the Bitnami image, which uses the *-r0* tag suffix.

Before a new image is released, antivirus scanners and other tests are executed. If these are unsuccessful, the release is blocked. These are discussed in the following sections

### CVE and virus scanning

If you are running development containers to create a proof of concept or for production workloads, you will probably already be aware of CVEs that may affect the container's operating system and packages. There are various tools/scanners to check containers for CVEs, such as [Clair](https://coreos.com/clair/docs/latest/), [Anchore](https://github.com/anchore/anchore-engine), [Notary](http://github.com/theupdateframework/notary) and others.

There are two ways of ensuring the health of containers: using a virus scan or a CVE scan.

* The virus scan is executed during the release process. The virus scan performed by Bitnami uses antivirus engines for scanning the files present in the container, stopping the release if a positive is detected.

* While the antivirus scan is a blocking step when releasing a container, the CVE scan is a tool executed periodically to trigger new releases. This tool analyzes the containers bundled by the Bitnami Helm charts. If it finds a CVE, it triggers the release of the affected container.

### Verification and functional testing

During the release process, all containers are tested to work with all deployment technologies with which they are likely to be used:

* Docker Compose, using several Docker Compose files to test different features like LDAP, cluster topologies, etc.
* Helm charts, tested on different Kubernetes platforms such as GKE, AKS, IKS, TKG, etc., and under different scenarios.

Two types of tests are executed for each deployment method:

* Verification tests: This type of testing involves inspecting a deployment to check certain properties. For example, checking if a particular file exists on the system and if it has the correct permissions.
* Functional tests: This type of testing is used to verify that an application is behaving as expected from the user's perspective. For example, if the application must be accessible using a web browser, functional testing uses a headless browser to interact with the application and perform common actions such as logging in and out and adding users.

## FIPS

If customers require compliance with [FIPS 140-2](https://csrc.nist.gov/publications/detail/fips/140/2/final), Bitnami containers can ship a FIPS-enabled version of OpenSSL. In a FIPS-enabled kernel, OpenSSL (and the applications using it) will only use FIPS-approved encryption algorithms. In the case of applications that have a FIPS mode (such as Elasticsearch), this would be enabled as well.

## Conclusion

By implementing the above points in the Bitnami build and release process, Bitnami ensures that its container images are built following best practices in terms of security and performance and can be safely used on most platforms as part of production deployments.

## Useful links

To learn more about the topics discussed in this guide, use the links below:

* [Understand Bitnami's rolling tags for container images](https://docs.bitnami.com/tutorials/understand-rolling-tags-containers)
* [Work with non-root containers for Bitnami applications](https://docs.bitnami.com/tutorials/work-with-non-root-containers)
* [Why non-root containers are important for security](https://engineering.bitnami.com/articles/why-non-root-containers-are-important-for-security.html)
* [Best practices writing a Dockerfile](https://engineering.bitnami.com/articles/best-practices-writing-a-dockerfile.html)
* [How Bitnami continuously scans container images to fix CVE-reported security issues](https://engineering.bitnami.com/articles/how-bitnami-continuously-scans-container-images-to-fix-cve-reported-security-issues.html)
* [Running non-root containers on OpenShift](https://engineering.bitnami.com/articles/running-non-root-containers-on-openshift.html)