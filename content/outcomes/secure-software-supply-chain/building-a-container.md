---
date: '2021-05-19'
lastmod: '2021-06-15'
layout: single
related:
- /guides/containers/cnb-gs-pack
- /guides/containers/cnb-gs-kpack
title: Building a Container
weight: 3
---

There's many options that you have when deciding how you want to build the container for your code. From writing a Dockerfile by hand to automated build services, finding the right build method is an important first step. Let's take a look at a few options that exist do see the advantages and disadvantages of each!

## Dockerfile

If you're already familiar with building a container image, this is probably where you got your start. A Dockerfile defines a series of actions (copy files, run commands, etc) that will be executed against a base image. These actions are used to prepare an operating system image for your applications, complete with all system-level dependencies. Consider this basic Dockerfile:

```dockerfile
FROM ubuntu:18.04
COPY . /app
RUN make /app
ENTRYPOINT /app/my-app
```

This Dockerfile tells the Docker build process to use the `ubuntu:18.04` container image as a base and to copy the current directory from the local filesystem to `/app` within the filesystem of the container that we're building. The `RUN` command then runs the command to build the application within the context of the container image. Finally, the `ENTRYPOINT` instruction defines the command to run when the container is started. In this case, when the container is started, the executable at `/app/my-app` is launched by default. Users may override this entry point on the command line or through Kubernetes Pod specifications.

One thing to note is that the separation between base image and your code makes a couple things easier. First, you can create a image containing only the dependencies that you need, reducing the security risk that could be inadvertently introduced by maintaining an entire system of dependencies when only a small fraction are ever used. Second, using a common base image among applications means that you're maintaining those dependencies in one place. If you build many Java applications and there's a security vulnerability in the JVM for example, now you only need to update your base image and point your application container to build off of that one image.

With that basic understanding, let's look at a more specific example. In this case, this Dockerfile is used to run a Spring Boot application:

```dockerfile
FROM openjdk:8-jdk-alpine
EXPOSE 8080
ARG JAR_FILE=target/my-application.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

Let's start with the two new instructions added here. Since our container will be running a web application running on port 8080, we can inform the container runtime of this by using the `EXPOSE` instruction. Additionally, from the `ADD` instruction, you might have noticed that this Dockerfile is expecting a prebuilt JAR. If you're a Java developer, you may know that different build tools, such as Maven and Gradle, build their applications differently. The `ARG` instruction defines a variable that can be used in the Dockerfile, with the option to override it when building the container. In this case, we set the default value of `JAR_FILE` to `target/my-application.jar` with the assumption that we're  building this application with Maven outside the context of the Docker build process. If this is the case, the container could then just be built with the following command:

```bash
docker build -t USERNAME/my-application .
```

However, Gradle would place the build artifact in the `build/libs` directory. Luckily, the `docker build` command allows up to override this `ARG` instruction on the command line:

```
docker build --build-arg JAR_FILE=build/libs/\*.jar -t USERNAME/my-application .
```

Finally, the dependencies to build your application may be different from the dependencies to run your application. For this, you can write a Dockerfile with [multiple stages](https://docs.docker.com/develop/develop-images/multistage-build/). A multi-stage build defines multiple `FROM` statements, which quite literally start a new, separate build from the previous. Consider the following Dockerfile which builds a Spring application and creates a container for it:

```Dockerfile
FROM maven:3.8.1-openjdk-11 as BUILD

COPY . /spring-hello-world
WORKDIR /spring-hello-world
RUN  mvn clean package

FROM openjdk:11.0.11-jre-slim
COPY --from=BUILD /spring-hello-world/target/spring-helloworld-0.0.1-SNAPSHOT.jar /spring-hello-world/spring-hello-world.jar

EXPOSE 8080
CMD ["java", "-jar", "/spring-hello-world/spring-hello-world.jar"]
```

This Dockerfile defines two stages. The first `FROM` statement uses the `maven:3.8.1-openjdk-11` container image as a base, and gives the label of `BUILD` as a name for this build stage. The next few lines should look familiar: we copy our source code into it, set our working directory, and run the `mvn clean package` command to build our application.

From there, you'll notice a second `FROM` command. This tells Docker to start a completely fresh container image, separate from whatever was done before it. This time, we're using `openjdk:11.0.11-jre-slim` as a base, which contains just the JRE and removes a lot of unneeded dependencies. You'll notice that the `COPY` command has the `--from=BUILD` argument, which tells Docker that instead of copying files from the local filesystem, copy it from a previous stage, in this case the one labeled `BUILD`. We copy the JAR file from the previous stage into our new stage, expose the port that it's running on, and set the `CMD` to run the resulting JAR. This results in a much slimmer container image, which in turn can result in a much more secure image. Keeping the dependencies limited and scoped to only situation where they're required shrinks the window for possible vulnerabilities. We don't need to ship the full JDK into production alongside each of our applications, so this method allows us to build the code within the container without that extra weight.

There's many more instructions that a Dockerfile may contain. To learn more, please refer to the [Dockerfile reference](https://docs.docker.com/engine/reference/builder/) and the [best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/).


A Dockerfile requires the most hands-on maintenance as you're handling both the instructions to build the container (writing the Dockerfile), as well as the responsibility of actually running the `docker build` command in your pipeline. If you're using a CI/CD solution that provides access to a running Docker daemon that you can trust to be secure, this may not be a big deal. Be sure to consult the documentation for your CI/CD tools.

## Kaniko

[Kaniko](https://github.com/GoogleContainerTools/kaniko) is an example of a tool that can help formalize your build pipeline. When building a Dockerfile directly, you need access to a running Docker daemon, and setting one up inside a container requires privileged escalation. Kaniko does not require these privileges, meaning that you will not be granting containers unnecessary permissions that could be potentially exploited. At its core, Kaniko is a prebuilt container image with an executable that knows how to compile a Dockerfile without Docker itself. You still write your Dockerfile as demonstrated, but instead of running a `docker build` command, you provide it to Kaniko along with your code, and it will build and upload the container to the registry that you specify.

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

You will notice that we have not granted any elevated permissions to this Pod. It is operating with the same permissions that Pods will have at runtime. Limiting permissions is a critical component of a secure software supply chain.

Kaniko does not support the scanning of images for vulnerabilities. Instead, it delegates this functionality to other parts of your CI/CD pipeline. This implies that your registry will need policy enforcement capabilities that prevent the upload of insecure images. Implementing [Harbor](https://goharbor.io/) may be a suitable solution.

To learn more about Kaniko, please reference the documentation in the [Kaniko GitHub repository](https://github.com/GoogleContainerTools/kaniko).

While a solution such as this still requires you to provide a Dockerfile, you're no longer responsible for ensuring consistent and secure access to a Docker daemon. On the other hand, you do require access to a running Kubernetes cluster. If you have this available from your build environment, then using Kaniko becomes a much simpler process. However if you need to maintain a Kubernetes cluster just for this build, perhaps there's a better fitting solution.

## Tanzu Build Service

The final step you can take when deciding how to build your container is a fully-automated build service such as [Tanzu Build Service](https://tanzu.vmware.com/build-service).  While you can tie tools such as Kaniko into a CI/CD pipeline that you run and manage, tools such as Tanzu Build Service aim to provide that automated build-scan-publish pipeline in a single solution. 

Since tools such as Kaniko do not include features such as security scanning, you will need to independently support a scanning solution. This becomes another component to be managed within your build environment.

Tanzu Build Service leverages [Cloud Native Buildpacks](/guides/containers/cnb-what-is/), which contain all of the logic on how to build an application, removing the need to write your own Dockerfile. Additionally, Cloud Native Buildpacks provide a standardized base for all of your container images, meaning that if there's a vulnerability found in the Java runtime for example, you only need to update the buildpack. Tanzu Build Service can then take this new buildpack image and rebase your application containers automatically, ensuring these security fixes are implemented across your infrastructure. 
While a primary use case for Tanzu Build Service is to manage the creation of newly built images, it is also a valuable tool for ensuring that images remain in compliance. When building a secure supply chain, we need to close the loop, by quickly leveraging our investment in these build tools to remediate our production environments. Tanzu Build Service may be a valuable component towards achieving that goal.```

{{< youtube IMmUjUjBzes >}}

If you're interested in learning more about adding Tanzu Build Service to your build pipeline, you can learn more [here](https://tanzu.vmware.com/build-service)!

A fully-automated build system is the most turnkey of the three we've looked at. Removing the need to maintain a Dockerfile is not only a convenience, it can drastically improve the security of your containers. The use of heavily tested buildpacks means that you containers are being built off of known security-hardened base images, and once your containers are built, they're automatically scanned for known CVEs.