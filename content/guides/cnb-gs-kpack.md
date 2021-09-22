---
date: '2020-04-16'
description: Discover how to use kpack, a Kubernetes-native build service that uses
  Cloud Native Buildpacks to build OCI-compliant container images on Kubernetes.
lastmod: '2021-06-03'
linkTitle: Getting Started with `kpack`
metaTitle: Getting Started with `kpack` to Automate Builds
parent: Cloud Native Buildpacks
patterns:
- Deployment
tags:
- kpack
- Buildpacks
- Containers
team:
- Tyler Britten
- Ivan Tarin
title: Getting Started with kpack to Automate Builds using Cloud Native Buildpacks
weight: 3
oldPath: "/content/guides/containers/cnb-gs-kpack.md"
aliases:
- "/guides/containers/cnb-gs-kpack"
level1: Deploying Modern Applications
level2: Packaging and Publishing
---

[`kpack`](https://github.com/pivotal/kpack) is a Kubernetes-native build service that builds container images on Kubernetes using [Cloud Native Buildpacks](../cnb-what-is). It takes source code repositories (like GitHub), builds the code into a container image, and uploads it to the container registry of your choice.

## Before You Begin

There are a few things you need to do before getting started with `kpack`:

- Have access to a Kubernetes cluster. If you don't, you can use local options like [Docker Desktop](https://hub.docker.com/search?type=edition&offering=community) or [Minikube](https://github.com/kubernetes/minikube). 

- Check out [Getting Started with Kubernetes](https://kube.academy/courses/getting-started) on KubeAcademy, particularly if you've never worked with Kubernetes before.

- Optionally [install `stern`](https://github.com/wercker/stern/releases), a tool that makes it easy to tail the logs during builds. 
  - Command to install with Homebrew on Mac OS `brew install stern`

- Have the [kubectl CLI](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to interact with your cluster. 
  - Command to install with Homebrew on Mac OS `brew install kubectl` 

- Accessible Docker V2 Registry, [DockerHub](https://hub.docker.com/) will suffice it is free and creating an account is easy.

- Follow the documentation for [installing `kpack`](https://github.com/pivotal/kpack/blob/master/docs/install.md/) in your Kubernetes cluster.


## Initial `kpack` Configuration

Among the things you will need before you get started are a code repository with compatible code (I'm using Spring Java in this case) and a container registry (I'm using Google GCR).

To make sure your `kpack` environment is ready after following the install instructions above, run.

```
kubectl get pods --namespace kpack --watch
```

## Using `kpack`

### Set Up Container Registry Secret

The first thing you need to do is tell `kpack` how to access the container registry to upload the completed images when they're done. 

You'll need a secret with credentials to access GCR, so you'll create a manifest like this and apply it with `kubectl apply -f`.

{{%expand "gcr-registry-credentials.yaml" %}}
Save and apply your secret
```
kubectl apply -f gcr-registry-credentials.yaml
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: gcr-registry-credentials
  annotations:
    kpack.io/docker: us.gcr.io
type: kubernetes.io/basic-auth
stringData:
  username: _json_key
  password: |
    {
        <GCP JSON Credentials Go Here>
    }
```
{{% /expand%}}

{{%expand "dockerhub-registry-credentials.yaml" %}}
Save and apply your secret
```
kubectl apply -f dockerhub-registry-credentials.yaml
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: dockerhub-registry-credentials
  annotations:
    kpack.io/docker: https://index.docker.io/v1/
type: kubernetes.io/basic-auth
stringData:
  username: "<username>"
  password: "<password>"
```
{{% /expand%}}

For more details see the [`kpack` secrets documentation.](https://github.com/pivotal/kpack/blob/master/docs/secrets.md) 

Also note the annotation of `kpack.io/docker`; it tells `kpack` which registries to use these credentials for. In the case of `gcr-registry-credentials.yaml`, any image tagged for `us.gcr.io.`


### Set Up Container Registry Service Account

Now you need a service account referencing those credentials in your secret. The manifest is pretty simple:

{{%expand "gcr-registry-service-account.yaml" %}}
Apply your new service account.
```
kubectl apply -f gcr-registry-credentials.yaml
``` 

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: gcr-registry-service-account
secrets:
  - name: gcr-registry-credentials
imagePullSecrets:
- name: gcr-registry-credentials
```
{{% /expand%}}

{{%expand "dockerhub-service-account.yaml" %}}
Apply your new service account.
```
kubectl apply -f dockerhub-registry-credentials.yaml
``` 

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: dockerhub-service-account
secrets:
- name: dockerhub-registry-credentials
imagePullSecrets:
- name: dockerhub-registry-credentials
```
{{% /expand%}}


### Create your Store

A store is a repository of [buildpacks](http://buildpacks.io/) packaged into [buildpackages](https://buildpacks.io/docs/buildpack-author-guide/package-a-buildpack/) that kpack uses to build images. 
You can add more languages by including more buildpacks you create or from [Paketo Buildpacks](https://github.com/paketo-buildpacks) we have only included a few bellow.

The store will be referenced by a builder resource.

```
kubectl apply -f store.yaml 
```

{{% expand "store.yaml" %}}
```yaml
apiVersion: kpack.io/v1alpha1
kind: ClusterStore
metadata:
  name: default
spec:
  sources:
  - image: gcr.io/paketo-buildpacks/java
  - image: gcr.io/paketo-buildpacks/graalvm
  - image: gcr.io/paketo-buildpacks/java-azure
  - image: gcr.io/paketo-buildpacks/nodejs
  - image: gcr.io/paketo-buildpacks/dotnet-core
  - image: gcr.io/paketo-buildpacks/go
  - image: gcr.io/paketo-buildpacks/php
  - image: gcr.io/paketo-buildpacks/nginx
  ```
{{% /expand%}}  

### Apply a Cluster Stack 

A [stack](https://buildpacks.io/docs/concepts/components/stack/) provides the buildpack lifecycle with build-time and run-time environments in the form of images.

The [pack CLI](https://github.com/buildpacks/pack) command: `pack suggest-stacks` will display a list of recommended stacks that can be used. We recommend starting with the `io.buildpacks.stacks.bionic` base stack. 

```
kubectl apply -f stack.yaml
```

{{% expand "stack.yaml" %}}
```yaml
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
```
{{% /expand%}}



### Apply a Builder

A builder is an image that bundles all the bits and information on how to build your apps, like 
- A buildpack
- An implementation of the lifecycle
- A build-time environment that platforms may use to execute the lifecycle

kpack will push the builder image to your registry.

```
kubectl apply -f builder.yaml 
```

{{% expand "builder.yaml" %}}
- Change `spec.serviceAccount` to your service account's name.
- Change `spec.tag` to your registry address appending `/builder` or a name of your choosing to hold your builder.


```yaml
apiVersion: kpack.io/v1alpha1
kind: Builder
metadata:
  name: my-builder
  namespace: default
spec:
  serviceAccount: dockerhub-registry-service-account
  tag: index.docker.io/<docker-hub-repo>/<builder>
  stack:
    name: base
    kind: ClusterStack
  store:
    name: default
    kind: ClusterStore
  order:
  - group:
    - id: paketo-buildpacks/java
  - group:
    - id: paketo-buildpacks/java-azure
  - group:
    - id: paketo-buildpacks/graalvm
  - group:
    - id: paketo-buildpacks/nodejs
  - group:
    - id: paketo-buildpacks/dotnet-core
  - group:
    - id: paketo-buildpacks/go
  - group:
    - id: paketo-buildpacks/php
  - group:
    - id: paketo-buildpacks/nginx
```
{{% /expand %}}



### Create an Image Configuration

Now you're all ready to start building images and pushing them to your registry. To create a manifest that builds containers off the application code on GitHub:

{{% expand "gcr-image.yaml" %}}
Applying your image yaml will enable automation to build your new image.
This build will take a few minutes and will be subsequently faster each time you run as it has a cache.
```
kubectl apply -f gcr-image.yaml
```  

- Change `spec.tag` to your registry address appending `/app` or a name of your choosing to hold your app.
- Change `spec.serviceAccount` to your service account's name.
- At `spec.source.git.url` is the source code repo being used to build the app.
- The `spec.source.git.revision` is the commit tag used to build, a change here will trigger a new build!

```yaml
apiVersion: build.pivotal.io/v1alpha1
kind: Image
metadata:
  name: petclinic-image
spec:
  tag: us.gcr.io/<project>/<spring-petclinic>
  serviceAccount: gcr-registry-service-account
  builder:
    name: default
    kind: Builder
  source:
    git:
      url: https://github.com/spring-projects/spring-petclinic
      revision: 82cb521d636b282340378d80a6307a08e3d4a4c4
```
{{% /expand %}}

{{% expand "dockerhub-image.yaml" %}}
Applying your image yaml will enable automation to build your new image.
This build will take a few minutes and will be subsequently faster each time you run as it has a cache. 
```
kubectl apply -f dockerhub-image.yaml
``` 

- Change `spec.tag` to your registry address appending `/app` or a name of your choosing to hold your app.
- Change `spec.serviceAccount` to your service account's name.
- At `spec.source.git.url` is the source code being used to build the app.
- The `spec.source.git.revision` is the commit used to build, a change here will trigger a new build!

```yaml
apiVersion: kpack.io/v1alpha1
kind: Image
metadata:
  name: petclinic-image
  namespace: default
spec:
  tag: index.docker.io/<docker-hub-repo>/app
  serviceAccount: dockerhub-service-account
  builder:
    name: my-builder
    kind: Builder
  source:
    git:
      url: https://github.com/spring-projects/spring-petclinic
      revision: 82cb521d636b282340378d80a6307a08e3d4a4c4
```
{{% /expand %}}

You can see the GitHub URL, and that you're building off master. Also, you configured the desired image tag (including the registry) and included the service account and builders you created. Once you apply this manifest, it will begin building.

By running `kubectl get images` you should see the image created but not complete:
```
NAME              LATESTIMAGE   READY
petclinic-image                 Unknown
```

### Watching the Build

If you run a `kubectl get pods`, you'll see a pod created (with a series of init containers) to build the image. 

Since it includes six different containers, it's hard to use `kubectl logs` because you have to know which container to specify at which stage. It's much easier to use the `stern` tool mentioned at the beginning. 

The pod that is created has a name that starts with `image-name-build`; so in this case, `petclinic-image-build.` The command to run to see the logs is `stern petclinic-image-build,` and you'll see all the logs pass by during the build and upload.

Once it's complete you can recheck the image with `kubectl get images`:

```
NAME LATESTIMAGE                                                                                                        READY
petclinic-image   us.gcr.io/pgtm-tbritten/spring-petclinic@sha256:<sha hash>   True
```

You can now run `docker pull us.gcr.io/<project>/<spring-petclinic>` to download the completed image. Or you can create a Kubernetes manifest to run the image.

**As mentioned in the previous section on image configuration, the `spec.source.git.revision` is the commit used to build, try changing it to trigger a new build!**

### Bonus - Deploy your app to Kubernetes

kpack is best used in conjunction with a CI/CD tool, but if you want to deploy your app to Kubernetes now you can very easily.

You will reuse your secret with your registry and pull from the repository that holds the container image.  You created this repo in the *Create an Image Configuration* section and can be found at  `spec.tag` place it after `--image=$DH_USERNAME/app` .

Create a deployment with the image kpack made with your source code
```
kubectl create deployment kpack-demo --image=<registry-name>/<app-repo>      
```    

To verify deployment
```
kubectl get deployments                                          
```

Expose the Pod to the public internet using the kubectl expose command:
```
kubectl expose deployment kpack-demo --type=LoadBalancer --port=8080
```

The `--type=LoadBalancer` flag exposes your Service outside of the cluster.
The application code inside the image `k8s.gcr.io/echoserver` only listens on TCP port 8080.

To verify your service
```
kubectl get services                
```

On cloud providers that support load balancers, an external IP address would be provisioned to access the Service. 

On minikube, the LoadBalancer type makes the Service accessible using:
```
minikube service kpack-demo                                         
```