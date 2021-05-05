---
title: Building a Container
weight: 2
layout: single
---

There's many options that you have when deciding how you want to build the container for your code. From writing a Dockerfile by hand to automated build services, finding the right build method is an important first step. Let's take a look at a few options that exist do see the advantages and disadvantages of each!

## Dockerfile

If you're already familiar with building a container image, this is probably where you got your start. A Dockerfile defines a set of steps to build you container, as well as if it should use another container image as a base. This allows us to reuse more generic container images that may contain things such as the appropriate application runtimes and dependencies. Consider this basic Dockerfile:

```dockerfile
FROM ubuntu:18.04
COPY . /app
RUN make /app
ENTRYPOINT /app/my-apo
```

This Dockerfile tells the builder to use the `ubuntu:18.04` container image as a base and to copy the current directory from the local filesystem to `/app` within the container that we're building. The `RUN` command then runs the command to build the application. Finally, the `ENTRYPOINT` instruction defines what to run when the container is started. In this case, when the container is started, the executable at `/app/my-app` is ran.

With that basic understanding, let's look at a more specific example. In this case, this Dockerfile is used to run a Spring Boot application:

```dockerfile
FROM openjdk:8-jdk-alpine
EXPOSE 8080
ARG JAR_FILE=target/my-application.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

Let's start with the two new instructions added here. Since our container will be running a web application running on port 8080, we can inform the container runtime of this by using the `EXPOSE` instruction. Additionally, from the `ADD` instruction, you might have noticed that this Dockerfile is expecting a prebuilt JAR. If you're a Java developer, you may know that different build tools, such as Maven and Gradle, build their applications differently. The `ARG` instruction defines a variable that can be used in the Dockerfile, with the option to override it when building the container. In this case, we set the default value of `JAR_FILE` to `target/my-application.jar` with the assumption that we're building this application Maven. If this is the case, the container could then just be built with the following command:

```bash
docker build -t USERNAME/my-application .
```

However, Gradle would place the build artifact in the `build/libs` directory. Luckily, the `docker build` command allows up to override this `ARG` instruction in the command line:

```
docker build --build-arg JAR_FILE=build/libs/\*.jar -t USERNAME/my-application .
```

There's many more instructions that a Dockerfile can contain. To learn more, please refer to the [Dockerfile reference](https://docs.docker.com/engine/reference/builder/) and the [best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/).

## Kaniko

[Kaniko](https://github.com/GoogleContainerTools/kaniko) is an example of a tool that can help formalize your build pipeline. Where building a Dockerfile directly requires you to have Docker up and running wherever you're performing your build, Kaniko allows you to build a container from a Dockerfile on top of Kubernetes. At its core, Kaniko is a prebuilt container image with an executable that knows how to compile a Dockerfile without Docker. You still write your Dockerfile as demonstrated, but instead of running a `docker build` command, you provide it to Kaniko along with your code, and it will build and upload the container wherever you specify.

Consider the following Kubernetes pod definition:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kaniko
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:latest
    args: ["--dockerfile=Dockerfile",
            "--context=git://github.com/ORG/REPO.git#refs/heads/main",
            "--destination==<DOCKER USERNAME>/<CONTAINER NAME>"]
    volumeMounts:
      - name: kaniko-secret
        mountPath: /kaniko/.docker
  restartPolicy: Never
  volumes:
    - name: kaniko-secret
      secret:
        secretName: regcred
        items:
          - key: .dockerconfigjson
            path: config.json
```

In this case, a pod will be spun up in Kubernetes using the Kaniko executor image, which will pull down the latest commit in the `main` branch of the GitHub repository defined in the `--context` argument, build it using the Dockerfile in the repository, and upload it to the container registry defined in the `--destination` argument. This build process, and the build process of other similar tools, makes it much easier to integrate a container build into your CI/CD pipelines.

To learn more about Kaniko, please reference the documentation in the [Kaniko GitHub repository](https://github.com/GoogleContainerTools/kaniko).

## Tanzu Build Service

The final step you can take when deciding how to build your container is a fully automated build service such as [Tanzu Build Service](https://tanzu.vmware.com/build-service).  While you can tie tools such as Kaniko into a CI/CD pipeline that you run and manage, tools such as Tanzu Build Service aim to provide that automated build-scan-publish pipeline in a single solution. 

Tanzu Build Service leverages [Cloud Native Buildpacks](/guides/containers/cnb-what-is/), which contain all of the logic on how to build an application, removing the need to write your own Dockerfile. Additionally, Cloud Native Buildpacks provide a standardized base for all of your container images, meaning that if there's a vulnerability found in the Java runtime for example, you only need to update the buildpack. Tanzu Build Service can then take this new buildpack image and rebase your application containers automatically, ensuring these security fixes are implemented across your infrastructure. 

{{< youtube IMmUjUjBzes >}}

If you want to lean more about the technologies that pack Tanzu Build Service, make sure to reference [Getting Started with the pack CLI](/guides/containers/cnb-gs-pack/), a tool that allows you to build containers using Cloud Native Buildpacks locally, as well as [Getting Started with kpack](/guides/containers/cnb-gs-kpack/), the open-source component of Tanzu Build Service that automates the build of containers.

If you're interested in learning more about adding Tanzu Build Service to your build pipeline, you can learn more [here](https://tanzu.vmware.com/build-service)!