---
title:  "Cloud Native Buildpacks: Getting Started with `kpack` to Automate Builds"
sortTitle: "Cloud Native Buildpacks"
weight: 3
topics:
- Containers
tags:
- kpack
- Buildpacks
patterns:
- Deployment
team:
- Tyler Britten
---

[`kpack`](https://github.com/pivotal/kpack) is a Kubernetes-native build service that builds container images on Kubernetes using [Cloud Native Buildpacks](../cnb-what-is). It takes source code repositories (like GitHub), builds the code into a container image, and uploads it to the container registry of your choice.

## Before You Begin

There are a few things you need to do before getting started with `kpack`:

- Have access to a Kubernetes cluster. If you don't, you can use local options like [Docker Desktop](https://hub.docker.com/search?type=edition&offering=community) or [Minikube](https://github.com/kubernetes/minikube). 

- Check out [Kubernetes 101](https://kube.academy/courses/kubernetes-101) on KubeAcademy, particularly if you've never worked with Kubernetes before.

- Optionally [install `stern`](https://github.com/wercker/stern/releases), a tool that makes it easy to tail the logs during builds. 
  - Command to install with Homewbrew on Mac OS `brew install stern`

- Have the [kubectl CLI](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to interact with your cluster. 
  - Command to install with Homebrew on Mac OS `brew install kubectl` 

- Accessible Docker V2 Registry, [DockerHub](https://hub.docker.com/) will suffice it is free and creating an account is easy.

- Follow the documentation for [installing `kpack`](https://github.com/pivotal/kpack/blob/master/docs/install.md/) in your Kubernetes cluster.


## Initial `kpack` Configuration

Among the things you will need before you get started are a code repository with compatible code (I'm using Spring Java in this case) and a container registry (I'm using Google GCR).

To make sure your `kpack` environment is ready after following the install instructions above, run `kubectl describe clusterbuilder default` so the output looks like this:

{{% code file="smart/file/name/with/path.html" download="download.html" copy="true" %}}
apiVersion: kpack.io/v1alpha1
kind: ClusterStack
metadata:
  name: base
spec:
  id: "io.buildpacks.stacks.bionic"
  buildImage:
    image: "paketobuildpacks/build:base-cnb"
  runImage:
    image: "paketobuildpacks/run:base-cnb"
{{% /code %}}

The GCP credentials have been redacted here for obvious reasons, but this is the format. If you're using another registry that uses just username/password, you will put that here instead. There are more details in the [`kpack` secrets documentation.](https://github.com/pivotal/kpack/blob/master/docs/secrets.md) 

Also note the annotation of `build.pivotal.io/docker: us.gcr.io`; it tells `kpack` which registries to use these credentials for. In this case, any image tagged for `us.gcr.io.`


### Set Up Container Registry Service Account

Now you need a service account referencing those credentials. The manifest is pretty simple:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: gcr-registry-service-account
secrets:
  - name: gcr-registry-credential
```

### Create an Image Configuration

Now you're all ready to start building images and pushing them to GCR. To create a manifest that builds containers off the application code on GitHub:

```yaml
apiVersion: build.pivotal.io/v1alpha1
kind: Image
metadata:
  name: petclinic-image
spec:
  tag: us.gcr.io/pgtm-tbritten/spring-petclinic
  serviceAccount: gcr-registry-service-account
  builder:
    name: default
    kind: ClusterBuilder
  source:
    git:
      url: https://github.com/tybritten-org/spring-petclinic
      revision: master
```

You can see the GitHub URL, and that you're building off master. Also, you configured the desired image tag (including the registry) and included the service account and builders you created. Once you apply this manifest, it will begin building.

By running `kubectl get images` you should see the image created but not complete:
```
NAME              LATESTIMAGE   READY
petclinic-image                 Unknown
```

### Watching the Build

If you run a `kubectl get pods`, you'll see a pod created (with a series of init containers) to build the image. Since it includes six different containers, it's hard to use `kubectl logs` because you have to know which container to specify at which stage. It's much easier to use the `stern` tool mentioned at the beginning. 

The pod that is created has a name that starts with `image-name-build`; so in this case, `petclinic-image-build.` The command to run to see the logs is `stern petclinic-image-build,` and you'll see all the logs pass by during the build and upload.

Once it's complete you can recheck the image with `kubectl get images`:

```
NAME LATESTIMAGE                                                                                                        READY
petclinic-image   us.gcr.io/pgtm-tbritten/spring-petclinic@sha256:<sha hash>   True
```

You can now run `docker pull us.gcr.io/pgtm-tbritten/spring-petclinic` to download the completed image. Or you can create a Kubernetes manifest to run the image.

