---
date: 2020-05-29
description: Building Containers from your code.
featured: false
lastmod: '2020-09-17'
patterns:
- Deployment
tags:
- Buildpacks
- Concourse
- Containers
team:
- Tyler Britten
title: From Commit to Container
---

While running software in containers is very popular, it can be a little confusing to figure out the best way to get your code into a container. Now that the industry is mostly unified on Open Container Initiative (OCI) Standard container image formats, they can be built in any number of ways. 

Building via Dockerfiles is the most commonly used approach, but there are also other tools that can make it easier with less learning upfront and some other advantages. 
## Dockerfiles
If you’re not familiar with the specification for Dockerfiles, you can find it [here](https://docs.docker.com/engine/reference/builder/). The basic layout looks something like this:

```dockerfile
FROM debian:latest

ADD my-app-file /app/

CMD /app/my-app-file
```

The first thing we need is a starting point, and in this case, we’re using a debian image, and the `latest` version. There are also ones that are language-specific like `python` or `golang` and ones tied to specific distributions.

The next lines include whatever steps we need to prepare the image, and the last line tells the image what command to run when the image is executed. There are a lot of variations of this but these are the basics. How can we make it better? Well a real application that is a bit more complicated would make this easier. Here’s a very simple golang http server application:

```go
package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/", func (w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello World!")
    })

    http.ListenAndServe(":8080", nil)
}
```


A very simple Dockerfile for this app would look like this:

```dockerfile
FROM golang:latest
RUN mkdir /app
ADD main.go /app/ 
WORKDIR /app
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .
CMD ["/app/main"]
EXPOSE 8080
```

The `FROM` is a language-specific image. We’re creating a directory, copying our application into the image, and then using go to compile the binary. The last line `EXPOSE` tells your container runtime which port this image exposes.

When you run a `docker build . -t myrepo/myimage` with just these two short text files, you end up with an 829MB image- that’s rather large.

### Multistage Dockerfiles
The reason the resulting image is so large is that the source image is large too, but for good reason. The golang image is 810MB as it contains a lot more operating system components to successfully be able to compile all sorts of golang programs. The nice thing about go is that the resulting binary is portable. So you can use one image to build the binary, and then copy it to a new, smaller image that doesn’t need all the extra build components, as shown in this example:

```dockerfile
FROM golang:latest as builder
RUN mkdir /app 
ADD main.go /app/ 
WORKDIR /app 
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest

COPY --from=builder /app/main main

CMD ["main"]

EXPOSE 8080
```

Now if you build using this Dockerfile, your image is only 13MB. Much better! You can see we tagged the first image as `builder` and then used the `--from` option of `COPY` to copy the file to the smaller image based on alpine linux. But can you get it smaller? Yes! Change the `FROM alpine:latest` to `FROM scratch` which is an empty image. The result will be a 7.41MB image. Now though if you need bash or literally anything but your binary in that image, you’ll have to explicitly add it- that's the main downside of using `scratch`. 

There are a whole bunch of other tricks to building Dockerfiles and it really depends on your comfort with them and what you’re trying to accomplish.

## Cloud-Native Buildpacks
If your goal is just to get your code into a running image without being concerned about all the details in the last section, buildpacks might be right for you. [Cloud-Native Buildpacks](../../guides/containers/cnb-what-is/) are designed to identify your code and automatically build and image. Here’s an [example](../../guides/containers/cnb-gs-pack/) using java, but we can do the same for our go app here.

All you need to do is initialize the go module with a simple `go mod init` command. Now you can use the `pack` CLI to build our app by running `pack build myrepo/myimage.` The resulting image will be a reasonable 82MB, and you didn’t even need to write a single line of Dockerfile. Buildpacks also have a lot of other advantages for automating image builds and updated existing ones to provide more secure, scalable image building. 

## Cloud Foundry on Kubernetes
 
Both the `docker build` and `pack build` commands get you a container image, but neither gets you a running copy of your application. Cloud Foundry leverages buildpacks too, but it also manages the deployment of the images as well via the [cf-for-k8s](../../guides/kubernetes/cf4k8s-gs/) project. For this example here, once you’re setup, a simple `cf push myapp` would take your go application, build it, push it, and also deploy it. In the end you would have a single instance of your application running without having to know anything about Dockerfiles, buildpacks, or Kubernetes.

## Using These Tools in Your Pipeline to Production

In these examples, you ran these commands manually, which is great to get started but isn't scalable. The key to speeding up your code moving to production is automatically building your images no matter which tool you choose. 

For the case of Dockerfiles or Cloud Foundry, the most common approach is to use a [Continuous Integration](../../guides/ci-cd/ci-cd-what-is/) tool like Jenkins or [Concourse](../../guides/ci-cd/concourse-gs/) to automatically run these commands on each code commit.

For buildpacks, there’s a tool called [`kpack`](../../guides/containers/cnb-gs-kpack/) which can run on Kubernetes and help automate the building of your images. It supports multiple source formats and can push to any standard container registry.

Try out some of these different approaches to running your application and see which works the best for different applications.