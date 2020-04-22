---
title:  "Cloud Native Buildpacks: Getting Started with the `pack` CLI"
sortTitle: "Cloud Native Buildpacks"
weight: 2
topics:
- containers
tags:
- buildpacks

---

### What is `pack`?

[`pack`](https://github.com/buildpacks/pack) is a command line interface (CLI) tool that builds container images locally on your developer machine using [Cloud Native Buildpacks](../what-is/what-is-cnb).

### Before you Begin

- Install [Docker Desktop](https://hub.docker.com/search?type=edition&offering=community). The `pack` CLI requires the Docker daemon, so you'll need to have this installed and running locally. 

- Check out [Containers 101](https://kube.academy/courses/containers-101) on KubeAcademy, particularly if you've never worked with containers or Docker before.

- Follow the documentation for [installing `pack`](https://buildpacks.io/docs/install-pack/) in your local environment.

### Using `pack`

#### Build Image from Working Directory

To generate a container image, use `pack build`. The following commands will clone a sample Java repository, change to the app directory, and build the container image from this working directory.

```
git clone https://github.com/buildpacks/samples

cd samples/apps/java-maven

pack build myapp
```

#### Build Image from Specified Path

Alternatively, you may point to the app path using the `-p` option:

```
git clone https://github.com/buildpacks/samples

pack build myapp -p samples/apps/java-maven
```

#### Run Image Locally

After you've built your image locally, test it out with Docker using the following command: 

```
docker run --rm -p 8080:8080 myapp
```

Visit `localhost:8080` in your favorite browser to see the app running.

#### Publish Image to Repository

If you are logged in to a container registry from your local machine via Docker Desktop, you can build your image and publish to a remote registry at the same time using the `--publish` option. Just make sure to clarify the `username` before the app name:

```
pack build username/myapp -p samples/apps/java-maven --publish
```

