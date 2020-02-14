---
title:  "Getting Started with Cloud Native Buildpacks: Using kpack to automate builds"
date:   2020-02-10
---

## Getting Started with Cloud Native Buildpacks: Using kpack to automate builds"

### What is `kpack`?

[`kpack`](https://github.com/pivotal/kpack) is a kubernetes native build services that builds container images on kubernetes using [Cloud Native Buildpacks](../what-is/what-is-cnb). It takes source code repositories (like github) and builds the code into a container image, and uploads it to the container registry of your choice.

### Before you begin

- Have access to a kubernetes cluster. If you don't you can use local options like [Docker Desktop](https://hub.docker.com/search?type=edition&offering=community) or [Minikube](https://github.com/kubernetes/minikube). 

- Check out [Kubernetes 101](https://kube.academy/courses/kubernetes-101) on KubeAcademy, particularly if you've never worked with kubernetes before.

- Follow the documentation for [installing `kpack`](https://github.com/pivotal/kpack/blob/master/docs/install.md/) in your kubernetes cluster.

- Optionally [install `stern`](https://github.com/wercker/stern/releases), an tool that makes it easy to tail the logs during builds.

### Initial `kpack` Configuration

A couple things you will need before you get started: is have a code repository with compatible code (I'm using Spring Java in this case) and a container registry (I'm using Google GCR).

To make sure my kpack environment is all ready after following the install instructions above, I'll run `kubectl describe clusterbuilder default` and the output looks like this:

```
Name:         default
Namespace:
Labels:       <none>
Annotations:  kubectl.kubernetes.io/last-applied-configuration:
                {"apiVersion":"build.pivotal.io/v1alpha1","kind":"ClusterBuilder","metadata":{"annotations":{},"name":"default"},"spec":{"image":"cloudfou...
API Version:  build.pivotal.io/v1alpha1
Kind:         ClusterBuilder
Metadata:
  Creation Timestamp:  2020-02-14T14:37:47Z
  Generation:          1
  Resource Version:    212182
  Self Link:           /apis/build.pivotal.io/v1alpha1/clusterbuilders/default
  UID:                 c019e370-cd32-4a32-b3c0-982c7d99d672
Spec:
  Image:          cloudfoundry/cnb:bionic
  Update Policy:  polling
Status:
  Builder Metadata:
    Id:       org.cloudfoundry.azureapplicationinsights
    Version:  v1.1.9
    Id:       org.cloudfoundry.procfile
    Version:  v1.1.9
    Id:       org.cloudfoundry.jmx
    Version:  v1.1.9
    Id:       org.cloudfoundry.go
    Version:  v0.0.2
    Id:       org.cloudfoundry.springboot
    Version:  v1.2.9
    Id:       org.cloudfoundry.jvmapplication
    Version:  v1.1.9
    Id:       org.cloudfoundry.springautoreconfiguration
    Version:  v1.1.8
    Id:       org.cloudfoundry.buildsystem
    Version:  v1.2.9
    Id:       org.cloudfoundry.archiveexpanding
    Version:  v1.0.102
    Id:       org.cloudfoundry.jdbc
    Version:  v1.1.9
    Id:       org.cloudfoundry.openjdk
    Version:  v1.2.11
    Id:       org.cloudfoundry.googlestackdriver
    Version:  v1.1.8
    Id:       org.cloudfoundry.nodejs
    Version:  v2.0.0
    Id:       org.cloudfoundry.distzip
    Version:  v1.1.9
    Id:       org.cloudfoundry.tomcat
    Version:  v1.3.9
    Id:       org.cloudfoundry.dotnet-core
    Version:  v0.0.4
    Id:       org.cloudfoundry.debug
    Version:  v1.2.8
    Id:       org.cloudfoundry.dep
    Version:  0.0.89
    Id:       org.cloudfoundry.go-compiler
    Version:  0.0.83
    Id:       org.cloudfoundry.go-mod
    Version:  0.0.84
    Id:       org.cloudfoundry.node-engine
    Version:  0.0.146
    Id:       org.cloudfoundry.npm
    Version:  0.0.87
    Id:       org.cloudfoundry.yarn
    Version:  0.0.99
    Id:       org.cloudfoundry.dotnet-core-aspnet
    Version:  0.0.97
    Id:       org.cloudfoundry.dotnet-core-build
    Version:  0.0.55
    Id:       org.cloudfoundry.dotnet-core-conf
    Version:  0.0.98
    Id:       org.cloudfoundry.dotnet-core-runtime
    Version:  0.0.106
    Id:       org.cloudfoundry.dotnet-core-sdk
    Version:  0.0.99
    Id:       org.cloudfoundry.icu
    Version:  0.0.25
    Id:       org.cloudfoundry.node-engine
    Version:  0.0.133
  Conditions:
    Last Transition Time:  2020-02-14T14:37:48Z
    Status:                True
    Type:                  Ready
  Latest Image:            index.docker.io/cloudfoundry/cnb@sha256:83270cf59e8944be0c544e45fd45a5a1f4526d7936d488d2de8937730341618d
  Observed Generation:     1
  Stack:
    Id:         io.buildpacks.stacks.bionic
    Run Image:  index.docker.io/cloudfoundry/run@sha256:9e366d007db857d7bcde2edb0439cf8159cb9ddb9655bee21ba479c06ae8f42d
Events:         <none>
```

It lists all the available builders that are configured so that means we're ready to get started.

### Using `kpack`

#### Set up Container Registry Secret

First thing we need to do is tell `kpack` how to access the container registry to upload the completed images when they're done. First we'll need a secret with credentials to access GCR, so you'll create a manifest like this and apply it with `kubectl apply -f`:

```
apiVersion: v1
kind: Secret
metadata:
  name: gcr-registry-credentials
  annotations:
    build.pivotal.io/docker: us.gcr.io
type: kubernetes.io/basic-auth
stringData:
  username: _json_key
  password: |
    {
        <GCP JSON Credentials Go Here>
    }
```

I've redacted the gcp credentials for obvious reasons, but this is the format. If you're using another registry that uses just username/password you would put that here instead. 

Also note the annotation of `build.pivotal.io/docker: us.gcr.io`- it tells kpack which registries to use these credentials for. In this case, any image tagged for `us.gcr.io`.



#### Set up Container Registry Service Account

Now we need a service account referencing those credentials. The manifest is pretty simple:

```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: gcr-registry-service-account
secrets:
  - name: gcr-registry-credential
```

#### Create an Image Configuration

Now we're all ready to start building images and pushing them to GCR. Let's create a manifest that builds containers off my application code on github:

```
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

You can see the github url, and that we're building off master. Also we configured the desired image tag (including the registry), and included the service account and builders we created. Once we apply this manifest, it will begin building.

Running `kubectl get images` you should see the image created but not complete:
```
NAME              LATESTIMAGE   READY
petclinic-image                 Unknown
```

#### Watching the Build

If you run a `kubectl get pods` you'll see a pod created (with a series of init containers) to build the image. Since it includes 6 different containers, it's hard to use `kubectl logs` because you have to know what container to specify at what stage. What's way easier is to use the `stern` tool we mentioned at the begining. 

The pod thats created has a name that starts with `image-name-build-` so in our case `petclinic-image-build`. The command to run to see the logs is `stern petclinic-image-build` and you'll see all the logs go buy during the build and upload.

Once it's complete we can check the image again with `kubectl get iamges`:

```
NAME LATESTIMAGE                                                                                                        READY
petclinic-image   us.gcr.io/pgtm-tbritten/spring-petclinic@sha256:<sha hash>   True
```

I can now run a `docker pull us.gcr.io/pgtm-tbritten/spring-petclinic` and download the completed image. Or I can create a kubernetes manifest to run the image.

