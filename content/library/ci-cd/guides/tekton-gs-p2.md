---
date: '2020-06-15'
description: Using Tekton, an automation tool for CI/CD pipelines, learn how to build
  container images from a Dockerfile on top of Kubernetes.
lastmod: '2021-03-07'
linkTitle: Building a Container with Tekton
metaTitle: Building a Container with Tekton
parent: Tekton
patterns:
- Deployment
tags:
- CI-CD
- Tekton
team:
- Brian McClain
title: 'Getting Started with Tekton Part 2: Building a Container'
topics:
- CI-CD
weight: 2
oldPath: "/content/guides/ci-cd/tekton-gs-p2.md"
aliases:
- "/guides/ci-cd/tekton-gs-p2"
level1: Deploying Modern Applications
level2: CI/CD, Release Pipelines
---

In [part one of this guide](/guides/ci-cd/tekton-gs-p1/), you learned how to install Tekton on Minikube, as well as what a basic `Task` looks like. In part two, you'll create a more complex `Task`, which will use [Kaniko](https://github.com/GoogleContainerTools/kaniko) to build and publish a container image. After that, you'll learn how to use a preexisting `Task` and provide parameters to build your code using [Cloud Native Buildpacks](https://buildpacks.io/).

## Before You Begin

If you went through the lessons in [part one of this guide](/guides/ci-cd/tekton-gs-p1/), you're all set! This guide picks up where that guide left off, using the same Tekton installation on top of Minikube, with the same secrets, service accounts, and other resources defined. If you haven't gone through part one yet, make sure you start there. 

## Building a Container with Kaniko

Since Tekton is a tool for automating CI/CD pipelines, you probably want to learn how to create and publish container images. For this example, you'll use [Kaniko](https://github.com/GoogleContainerTools/kaniko), a tool used to build container images from a Dockerfile on top of Kubernetes. Kaniko provides its own container image that you can use as a base. By adding your own code and Dockerfile, Kaniko will build and publish a container image based on that Dockerfile.

You can see the complete example [here on GitHub](https://github.com/BrianMMcClain/tekton-examples/blob/main/kaniko-task.yml).

First, since you'll be pushing the resulting container image to Docker Hub, you'll need to create a service account that uses the secret that you created earlier:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: dockerhub-service
secrets:
  - name: dockercreds
```

Next, you'll need to define one input for the code that will be built, and one output for where to publish the container image:

```yaml
apiVersion: tekton.dev/v1alpha1
kind: PipelineResource
metadata:
  name: sinatra-hello-world-git
spec:
  type: git
  params:
    - name: revision
      value: main
    - name: url
      value: https://github.com/BrianMMcClain/sinatra-hello-world
```

This introduces a new concept—a `PipelineResource`, e—which defines an input into, or an output from, a `Task`. If you want to learn more, make sure to check out the [`PipelineResource` documentation](https://github.com/tektoncd/pipeline/blob/master/docs/resources.md). This `PipelineResource` is of type `git`, which points to the branch named `main` of the code to build on GitHub. It also gives it the name "sinatra-hello-world-git", which is what you’ll use to reference it later on in the example.

You'll need one other `PipelineResource` to define where to publish the container image:

```yaml
apiVersion: tekton.dev/v1alpha1
kind: PipelineResource
metadata:
  name: sinatra-hello-world-tekton-demo-image
spec:
  type: image
  params:
    - name: url
      value: <DOCKER_USERNAME>/sinatra-hello-world-tekton-demo
```

This `PipelineResource` is of type `image`, as in a container image. It's also been given the name "sinatra-hello-world-tekton-demo-image". In this case, it simply takes the image name and tag. Since no full URL is provided, it's assumed that it will be published to Docker Hub, but you can also point to your own container registry.


> **NOTE:** Make sure to replace <DOCKER_USERNAME> with your Docker Hub username

With your input and output defined, it's time to create the `Task` that will build the container. Take some time to carefully read this through:

```yaml
apiVersion: tekton.dev/v1beta1
kind: Task
metadata:
  name: build-docker-image-from-git-source
spec:
  params:
    - name: pathToDockerFile
      type: string
      description: The path to the dockerfile to build
      default: $(resources.inputs.docker-source.path)/Dockerfile
    - name: pathToContext
      type: string
      description: |
        The build context used by Kaniko
        (https://github.com/GoogleContainerTools/kaniko#kaniko-build-contexts)
      default: $(resources.inputs.docker-source.path)
  resources:
    inputs:
      - name: docker-source
        type: git
    outputs:
      - name: builtImage
        type: image
  steps:
    - name: build-and-push
      image: gcr.io/kaniko-project/executor:v0.17.1
      # specifying DOCKER_CONFIG is required to allow kaniko to detect docker credential
      env:
        - name: "DOCKER_CONFIG"
          value: "/tekton/home/.docker/"
      command:
        - /kaniko/executor
      args:
        - --dockerfile=$(params.pathToDockerFile)
        - --destination=$(resources.outputs.builtImage.url)
        - --context=$(params.pathToContext)
```

Here, a new `Task` named "build-docker-image-from-git-source" is created. The best way to understand this is to walk through the spec step by step.

First, there are two `params` that the `Task` will expect:

1. `pathToDockerFile` — Where the Dockerfile is in your code, defaulting to the root directory.
2. `pathToContext` — The directory in which Kaniko should look for your code. If no alternative directory is provided, it assumes that the root directory of your code is the build context.

Next, it defines two `resources` that it expects. It expects one `input` (which it will refer to as "docker-source") of type `git`. It also expects one output (referred to as `builtImage`) of type `image`. As a reminder, a `Task` is simply outlining what inputs and output it expects, but it's not yet defining them. You might expect that these will match the two `PipelineResource` objects that were defined earlier, and you'd be right. The final piece of YAML that you'll define later will tie the two together.

Finally, the `Task` needs to define what `steps` to take. Since Kaniko contains all the logic it needs inside the container image, there's just a single step. Using the Kaniko container image, this step runs the `/kaniko/executor` command with three flags: `--dockerfile`, `--destination`, and `--context.` Each of these flags takes in the information defined in the `params` and `resources` sections.

Phew, that was a lot to digest. Take a moment to make sure you understand each of these sections. At a high level, this Task takes two parameters with two inputs and runs one executable.

There's one final piece, which is the `TaskRunner` to run this `Task`:

```yaml
apiVersion: tekton.dev/v1beta1
kind: TaskRun
metadata:
  name: build-docker-image-from-git-source-task-run
spec:
  serviceAccountName: dockerhub-service
  taskRef:
    name: build-docker-image-from-git-source
  params:
    - name: pathToDockerFile
      value: Dockerfile
  resources:
    inputs:
      - name: docker-source
        resourceRef:
          name: sinatra-hello-world-git
    outputs:
      - name: builtImage
        resourceRef:
          name: sinatra-hello-world-tekton-demo-image
```

This `TaskRun` object says that you want to run the `build-docker-image-from-git-source` `Task` that you just defined and provide the two `PipelineResource` objects that you defined as resources. This is how Tekton knows that it should use the `sinatra-hello-world-git` `PipelineResource` for the `docker-source`.

One other thing to notice is that the `pathToDockerFile` parameter was defined, despite being the same as the default value. This is done to show how `params` are defined in `TaskRun` objects, but note as well that `pathToContext` is omitted. If `params` have a default value, they do not necessarily need to be defined in your `TaskRun`.

If you want an easy way apply this all at once, you can store your Docker Hub username in a Bash variable:

```bash
export DOCKER_USERNAME=<DOCKERHUB_USERNAME>
```

Then you can run the following one-liner to apply all of the objects at once:

```bash
wget -O - https://raw.githubusercontent.com/BrianMMcClain/tekton-examples/main/kaniko-task.yml | sed -e "s/\<DOCKER_USERNAME\>/$DOCKER_USERNAME/" | kubectl apply -f -
```

Once applied, make sure to check the status of the `TaskRun` using the Tekton CLI:

```bash
tkn taskrun describe build-docker-image-from-git-source-task-run
```

```bash
ame:              build-docker-image-from-git-source-task-run
Namespace:         default
Task Ref:          build-docker-image-from-git-source
Service Account:   dockerhub-service
Timeout:           1h0m0s
Labels:
 app.kubernetes.io/managed-by=tekton-pipelines
 tekton.dev/task=build-docker-image-from-git-source

🌡️  Status

STARTED         DURATION    STATUS
8 seconds ago   ---         Running

📨 Input Resources

 NAME              RESOURCE REF
 ∙ docker-source   sinatra-hello-world-git

📡 Output Resources

 NAME           RESOURCE REF
 ∙ builtImage   sinatra-hello-world-tekton-demo-image

⚓ Params

 NAME                 VALUE
 ∙ pathToDockerFile   Dockerfile

🦶 Steps

 NAME                                         STATUS
 ∙ image-digest-exporter-grgxm                ---
 ∙ git-source-sinatra-hello-world-git-2w7hp   ---
 ∙ create-dir-builtimage-dzt9g                ---
 ∙ build-and-push                             ---

🚗 Sidecars

No sidecars
```

In this case, it looks like the `Status` is already `Running`, great! Take a look at the logs to monitor the build:

```bash
tkn taskrun logs build-docker-image-from-git-source-task-run -f
```

If all goes well, once the logs finish, you should see your new image up in Docker Hub!

## Cloud-Native Buildpacks

So far, you've been defining your own tasks and steps to run. However, one of the benefits of Tekton's design is that since each component is shareable through YAML files, you can plug in a `Task` developed by someone else. For this example, you'll be bringing in a `Task` that's already defined, specifically one to [use Cloud Native Buildpacks](https://github.com/tektoncd/catalog/tree/master/buildpacks). If you're unfamiliar with Cloud Native Buildpacks, make sure to check out [Cloud Native Buildpacks: What Are They?](/guides/containers/cnb-what-is/).

To install the `Task`, you can use `kubectl apply`, passing the URL to the YAML directly:

```bash
kubectl apply -f https://raw.githubusercontent.com/tektoncd/catalog/master/buildpacks/buildpacks-v3.yaml
```

Much like how you can use the Tekton CLI to describe a `TaskRun`, you can also use it to describe a `Task` to see what resources, parameters, and steps it defines:

```bash
tkn task describe buildpacks-v3
```

```bash
Name:        buildpacks-v3
Namespace:   default

📨 Input Resources

 NAME       TYPE
 ∙ source   git

📡 Output Resources

 NAME      TYPE
 ∙ image   image

⚓ Params

 NAME               TYPE     DESCRIPTION              DEFAULT VALUE
 ∙ BUILDER_IMAGE    string   The image on which ...   ---
 ∙ CACHE            string   The name of the per...   empty-dir
 ∙ USER_ID          string   The user ID of the ...   1000
 ∙ GROUP_ID         string   The group ID of the...   1000
 ∙ PROCESS_TYPE     string   The default process...   web
 ∙ SOURCE_SUBPATH   string   A subpath within th...

🦶 Steps

 ∙ prepare
 ∙ detect
 ∙ analyze
 ∙ restore
 ∙ build
 ∙ export

🗂  Taskruns

NAME                               STARTED        DURATION    STATUS
build-spring-api-with-buildpacks   18 hours ago   7 minutes   Succeeded
```

Here you can see this `Task` expects an input resource of type `git` and an output resource of type `image`. You can define these just as you did in the previous example. For this example, you'll be building a different application, [in Spring](https://github.com/BrianMMcClain/spring-boot-api-demo). Start by creating the Service Account to authenticate against Docker Hub, the input `git` resource, and the output `image` resource:

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: dockerhub-service
secrets:
  - name: regcred # Create secret for your container registry

---
apiVersion: tekton.dev/v1alpha1
kind: PipelineResource
metadata:
  name: spring-api-git
spec:
  type: git
  params:
    - name: revision
      value: main
    - name: url
      value: https://github.com/BrianMMcClain/spring-boot-api-demo

---
apiVersion: tekton.dev/v1alpha1
kind: PipelineResource
metadata:
  name: spring-api-tekton-demo
spec:
  type: image
  params:
    - name: url
      value: <DOCKER_USERNAME>/spring-api-tekton-demo
```

This should all look familiar from the previous example. The service account uses the secret defined at the beginning of the guide, the `git` `PipelineResource` points to the code that you'll be building, and the image `PipelineResource` will tell Tekton where to send the resulting image.

Finally, define the `TaskRun` to tie it all together:

```yaml
apiVersion: tekton.dev/v1alpha1
kind: TaskRun
metadata:
  name: build-spring-api-with-buildpacks
spec:
  serviceAccountName: dockerhub-service
  taskRef:
    name: buildpacks-v3
  inputs:
    resources:
    - name: source
      resourceRef:
        name: spring-api-git
    params:
    - name: BUILDER_IMAGE
      value: cloudfoundry/cnb:bionic
  outputs:
    resources:
    - name: image
      resourceRef:
        name: spring-api-tekton-demo
```

As you might have expected, this denotes your two `PipelineResource` objects as the input and output resources. It also declares that you'll be using the `cloudfoundry/cnb:bionic` image for the buildpack builder.

As with the previous example, you can apply this all at once by first storing your Docker Hub username in a Bash variable:

```bash
export DOCKER_USERNAME=<DOCKERHUB_USERNAME>
```

Then you can apply the YAML directly:

```bash
wget -O - https://raw.githubusercontent.com/BrianMMcClain/tekton-examples/main/cnb-spring-api-demo.yml | sed -e "s/\<DOCKER_USERNAME\>/$DOCKER_USERNAME/" | kubectl apply -f -
```

Check the status with `tkn taskrun describe`:

```bash
tkn taskrun describe build-spring-api-with-buildpacks
```

```bash
Name:              build-spring-api-with-buildpacks
Namespace:         default
Task Ref:          buildpacks-v3
Service Account:   dockerhub-service
Timeout:           1h0m0s
Labels:
 app.kubernetes.io/managed-by=tekton-pipelines
 tekton.dev/task=buildpacks-v3

🌡️  Status

STARTED         DURATION    STATUS
2 seconds ago   ---         Running(Pending)

📨 Input Resources

 NAME       RESOURCE REF
 ∙ source   spring-api-git

📡 Output Resources

 NAME      RESOURCE REF
 ∙ image   spring-api-tekton-demo

⚓ Params

 NAME              VALUE
 ∙ BUILDER_IMAGE   cloudfoundry/cnb:bionic

🦶 Steps

 NAME                                STATUS
 ∙ analyze                           ---
 ∙ detect                            ---
 ∙ prepare                           ---
 ∙ export                            ---
 ∙ build                             ---
 ∙ restore                           ---
 ∙ git-source-spring-api-git-sg9vs   ---
 ∙ create-dir-image-8fk7w            ---
 ∙ image-digest-exporter-sxrxt       ---

🚗 Sidecars

No sidecars
```

You can also follow along with the logs with `tkn taskrun logs`:

```bash
tkn taskrun logs build-spring-api-with-buildpacks -f
```

Once complete, you'll see your newly created container image up in Docker Hub! Note that there was never a Dockerfile created or any other set of instructions on how to build this container. Instead, Cloud Native Buildpacks looked at your code and determined what it needed in terms of runtime, dependencies, etc.

## Keep Learning

There's still more to learn, and the best place to go next is the [official documentation](https://github.com/tektoncd/pipeline#-tekton-pipelines). There are also some great [examples](https://github.com/tektoncd/pipeline/tree/master/examples) for those looking to get some hands-on learning.