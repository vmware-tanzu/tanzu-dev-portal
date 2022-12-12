---
date: 2021-06-28
description: Dive into the pros and cons between Dockerfile and Buildpacks
featured: true
weight: 1
lastmod: '2021-06-28'
patterns:
- Deployment
team:
- Cora Iberkleid
title: Understanding the Differences Between Dockerfile and Cloud Native Buildpacks
---


Container images enable you to bundle an application with all of its dependencies—soup to nuts, all the way down to the OS file system. Effectively, you are packaging your app and its environment into a single, immutable, and runnable artifact. You can then drop that image onto any container runtime and you’re (nearly) off to the races.

The benefits of taking this approach over deploying an application-only artifact onto a custom and curated environment are well established: greater predictability, repeatability, portability, and scalability, to name just a few. So, what’s the catch? The responsibility of providing the runtime and OS shifts from the ops or IT team that formerly created and maintained the target environment to the dev or DevOps team that is now packaging the application as an image. With this transition, organizations large and small must reimagine how they ensure consistency, security, transparency, and upkeep of these modernized deployable artifacts.

How you build your images is a key part of the answer. Let’s compare two approaches—Dockerfile and Cloud Native Buildpacks—to see how they measure up when it comes to meeting, or exacerbating, these challenges.

## What Is Dockerfile?

[Dockerfile](https://docs.docker.com/engine/reference/builder) is the oldest and most common approach for building images. A Dockerfile is a script where each command begins with a keyword called a Dockerfile instruction. Each instruction creates a layer in a Docker image. After the last instruction is executed, the resulting image becomes your deployable artifact.

Here is a simple example of a Dockerfile for a Java app. It adds the app artifact (.jar file) onto a base OS image that has a pre-installed Java runtime (JRE), and it defines the app startup command:

```dockerfile
FROM adoptopenjdk:11-jre-hotspot
COPY ./target/*.jar app.jar
CMD ["java", "-jar", "app.jar"]
```

You would create an image by running:

```bash
cd my-app-repo
mvn package
docker build . --tag my-image --file Dockerfile
```

## What Are Buildpacks?

A [Cloud Native Computing Foundation (CNCF) project](https://www.cncf.io/blog/2020/11/18/toc-approves-cloud-native-buildpacks-from-sandbox-to-incubation), [Cloud Native Buildpacks](https://buildpacks.io)—also referred to as CNBs or buildpacks, for short—provides an opinionated and structured way to build images.

You don’t need to create or maintain any scripts of your own. You simply choose an OSS or vendored “[builder](https://buildpacks.io/docs/concepts/components/builder)” that serves the function of a thorough and well-formed Dockerfile (without actually using a Dockerfile). The builder provides the runtime base image for your application as well as any logic for compiling your code and layering it onto the base image in a thoughtful manner.

The builder itself is an image, too, but you cannot use the `docker` CLI to execute the builder and generate an image for your application. You need a specialized tool—a “[platform](https://buildpacks.io/docs/concepts/components/platform),” in CNB-speak—that knows how to access the builder and orchestrate the creation of your application image. The platform that provides the most comparable user experience to the [`docker build`](https://docs.docker.com/engine/reference/commandline/build) command is a CLI called [`pack`](https://buildpacks.io/docs/tools/pack).

You could create an image by running:

```bash
cd my-app-repo
pack build my-image --builder paketobuildpacks/builder:base
```

If your builder of choice can handle applications written in various languages, this command will work for any of them, as the tooling automatically figures out which logic to apply.

## Where Dockerfile Shines

Dockerfile has been around as long as Docker images, so it is familiar technology to many already in the container ecosystem. There are many examples on the internet, and it is often easy and convenient to reach for the most traditional tool in your kit.

Since a Dockerfile is a plain text file that uses a direct syntax comprising about a dozen [instructions](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#dockerfile-instructions), it serves as a transparent (though not always precise) record of the software that has been installed into an image. It is easy to update and can be saved to a version control system along with your application code.

The true power of Dockerfile lies in its flexibility. The images you can build are limited only by your ability to script your Dockerfile. You can start from scratch or augment an existing image—any one of Docker’s [Official](https://docs.docker.com/docker-hub/official_images) or [Verified Publisher](https://docs.docker.com/docker-hub/publish) images, for example, or really any image you get your hands on. You can install system packages, allow or limit root access, lock in configuration, and so on. The sky's the limit.

## Challenges With Dockerfile

The drawbacks of Dockerfile also lie in its flexibility. Each Dockerfile becomes another piece of custom code that you own. You must account for correctness, efficiency, and security. Over the life of your app, you must also continually keep an eye out for when OS and runtime bits might require patches or upgrades.

The simplicity of Dockerfile poses additional challenges. It’s just a script that, at first pass, likely lives in the same repo as your app code. Any efforts to vet, standardize, or reuse Dockerfiles across applications or development teams is up to you. Any automation for building and maintaining images as part of a DevOps toolchain is also up to you. Without proper planning and oversight, things can quickly get messy.

## Where Buildpacks Shine

The CNB project provides the structure needed for creating and maintaining images at scale. At the same time, it provides a simple user experience, obviating the need to become an image-building expert when you might only be building a single image. 

The task of choosing and maintaining the base image (think the “FROM” statement in a Dockerfile) and the know-how for providing the contents of the rest of the layers (analogous to all the other instructions in a Dockerfile) are delegated to buildpacks. The CNB project provides a [Buildpack API](https://buildpacks.io/docs/reference/spec/buildpack-api) to foster an ecosystem of buildpacks. In our example above, we chose the open source [Paketo Buildpacks](https://paketo.io), which can handle applications written in Java, Ruby, Golang, .NET Core, and more. In each case, Paketo Buildpacks employ optimizations related to image size and layering; caching; and security; as well as standards and optimizations particular to a given programming language. One example of how buildpacks automatically do something few would reliably get right is the Paketo Java memory calculation.

CNBs also provide choices around the user experience. As with buildpacks, a [Platform API](https://buildpacks.io/docs/reference/spec/platform-api) enables an ecosystem of tools that can be incorporated into your workflow. Need a CLI to mimic the `docker build` approach? Use `pack`. Want to recreate the “Build as a Service” experience of the prior generation of Heroku and Cloud Foundry buildpacks? Install [`kpack`](https://github.com/pivotal/kpack#readme) into your Kubernetes cluster and let it autonomously kick off builds whenever you commit new code to git or upgrade your builder image. 

Suddenly, achieving consistent builds across your organization becomes trivial. As long as all apps are built using the same builder, you can guarantee they will be built in the same way. Since the builders are themselves images and are decoupled from platforms, CNBs inherently provide a way to distribute and reuse build logic across an organization.

The resulting app images are enriched with metadata that make them easy to inspect. You can examine an image directly, without needing to seek out the script that generated it, to determine which base images and buildpacks were used to create it. Depending on your choice of buildpacks, you may also get a detailed Software Bill of Materials (SBOM) including runtime version, application dependencies, and other details. Your security and operations teams will thank you.

Also worth mentioning is the capability to swap out OS layers without rebuilding an image. With Dockerfile, patching the OS requires an update to the “FROM” statement, which in turn forces re-creation of all the layers in the image, even if the app did not change. CNBs provide a [rebasing](https://buildpacks.io/docs/concepts/operations/rebase) capability, which is faster and safer. That capability is particularly powerful in combination with `kpack` as together they enable you to roll out an OS update across a large number of images in a matter of minutes.

## Challenges With Buildpacks

Buildpacks require you to fit in a box. That box might be big enough for you not to care most of the time, but it will likely be too small at some point, for some application.

On one hand, your mileage will vary depending on how robustly the current ecosystem of buildpacks supports your use case. For example, if you are building Java applications, Paketo provides a set of battle-tested buildpacks that are not only likely to meet your needs, but to solve problems you might not have considered (exiting cleanly on an out-of-memory error, for example). On the other hand, if you are writing your applications in Lisp you might find yourself needing to write your own custom buildpacks, which requires significantly more work. The exact calculus for a given app will change over time as the buildpack ecosystem grows.

What’s more, you may run into certain limitations with buildpacks. For example, currently you can't install an arbitrary OS package using `apt-get install`. While most applications can handle it, if you wanted to run, say, PostgreSQL and needed some package that doesn't exist on your runtime base image, you'd be out of luck. In such a case, you would be better off creating a one-off Dockerfile. To benefit from the automation at scale that buildpacks afford, you need to give up some flexibility. This tradeoff isn't novel, but it will be a deal breaker for some workloads.

## Making The Call

Cloud Native Buildpacks resolve much of the operational complexity of using Dockerfiles. You can embrace the opinions and leverage the expertise of the authors behind the buildpacks of your choice to easily assemble images for applications written in a variety of languages. Your organization can incorporate custom buildpacks to express and effectuate their own opinions. You can ensure that any build by any member of your team or organization, carried out on any machine, will result in the same image. You can provide insight to your operations and security teams about an image’s contents. You have a choice of platforms tailored to individual developers or large-scale systems and more. You can build one image at a time or patch an OS across an estate of images in one fell swoop.

You may run into situations where buildpacks cannot handle certain requirements. In these cases, scripting your own Dockerfile will provide the power and flexibility you need to assemble an image for your application.

Nevertheless, the advantages of Cloud Native Buildpacks are very appealing, both for simplicity and security. Enough, presumably, to justify favoring buildpacks over Dockerfile wherever possible.

## Learn More

To learn more about Dockerfile, check out the [Dockerfile reference documentation](https://docs.docker.com/engine/reference/builder) or check out our [Container Basics workshop](/workshops/lab-container-basics).

For more information on Cloud Native Buildpacks, a great place to start is the [CNB project website](https://buildpacks.io). We also have some terrific [guides on Cloud Native Buildpacks](/guides/containers/cnb-what-is/), as well as [pack](/guides/containers/cnb-gs-pack/) and [kpack](/guides/containers/cnb-gs-kpack/).

You can also check out my KubeAcademy course on [Building Images](https://kube.academy/courses/building-images).
