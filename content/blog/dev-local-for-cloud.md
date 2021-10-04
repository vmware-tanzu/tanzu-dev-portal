---
date: 2020-05-21
description: Develop apps to run on the cloud right on your laptop.
featured: false
lastmod: '2020-09-17'
patterns:
- Deployment
team:
- David Dieruf
title: Developing Locally for the Cloud
tags: []
---

Your app is destined for the cloud, but it’s going to meet some challenges along the way. First stop is the always fun whiteboarding session(s). Then come the sticky notes, which inevitably yield a backlog. Only when those two steps are complete does the Zen art of coding begin.

But ask yourself this: While whiteboarding the app's design, how often is the developer’s local environment considered? Probably never. In fact, I bet during design a local environment doesn't even make into the afterthoughts. Instead, it's just one of those "figure it out" things.

Take, for example, the design of a microservice. Most likely it's going to be dependent on an external configuration, like Spring Config. Ever consider how a developer is going to test on a config server locally? Do they have access to local containerization, like Docker? Or are they left to waste countless hours rigging up environment variables, only to find a totally different schema when the app is pushed to its platform?

I've been there and done that. It's frustrating, wasteful, and breaks one of the most important of the 12 [factors](https://12factor.net/): No. 10, parity between environments. It's also a personal favorite, and one I've been known to be ornery about.

The goal is not about following a good or bad design (although there’s plenty of room for bad decisions). It’s about achieving the same containerization model locally that your cloud platform is doing for you. That containerization model is going to have nuances with each app, and the secret is to develop with those “in the mix.” The services the app depends on are going to be containerized as well. Indeed, all the containers are going to share a network where they can contact each other. Recreating all this locally will pay dividends when it’s time for production.

Because the architecture is based on a microservice pattern, portability is a must. This can be taken to many different extremes; I myself have been guilty of some overly complicated designs just to reach uber portability. So let's agree that, at a minimum, portability means the app has no opinion on its environment; it is fed configuration like database URIs, timeout values, and storage drive addresses. It can run in memory, within a container, or on the moon. Just give it the right values to find its dependencies.

Now, with containerization and portability a part of design, dev/prod parity is going to be a breeze.

## Shared between all clouds and platforms
The goal of deploying your app on any platform or cloud is to run a snapshot of it in a prescribed way (i.e., Dockerfile or virtual machine). For the app to become a running container, you must first create an image of it. To run the app on a dedicated VM, you must first template the OS. To work in a local environment that closely matches this prescribed design, you need to find the commonalities.

Step one is to get Docker running locally. This is as essential in today’s world as a developer’s IDE. Whether you run the daemon with the CLI or Docker desktop it makes no difference; it's all the same under the hood. The only feature I will call out is running in Linux container mode vs. Windows mode. We'll stick with Linux for this example, but Windows mode is a very close fit. 

With Docker running, your desktop now has the key ingredients of cloud native development: imaging, containerization, and container networking. Regardless of whether a platform is container-based, application-based, or even a (native) public cloud, it always has these three basic things.

## Running the app locally
I try to keep things as simple as possible. After years of fighting overgrown, poorly designed environments, I've learned to use things as they were intended. That means using a technology for its core purpose and nothing more.

When developing locally, the key is to find a balance between things that help recreate production and the simplicity of working on your desktop. Minikube or KIND are powerful tools. If your app needs to communicate with the cluster API, these tools are essential to local development. If your app's home will be in a cluster but it doesn't rely on anything Kubernetes-specific, then why overcomplicate local development? A simple, running Docker process and its CLI for interaction will get the job done.

So, what magical thing combines these basic ingredients to recreate production? Docker Compose. At its core, Docker Compose provides a way to software-define an app's local environment. In a single YAML file you get DNS, networking, container builds, and environment variables.

Let’s look at an example.

```yaml
version: '3.7'
services:
  steeltoe-app:
    container_name: steeltoe-app
    environment:
      db_conn: "Server=db;Database=master;User=sa;Password=12345;"
      another_value: 1234
    build:
      context: c:/my-project
    ports:
    - 8080:8080
    depends_on:
    - db

  db:
    container_name: db
    image: "mcr.microsoft.com/mssql/server:latest"
    environment:
      SA_PASSWORD: "12345"
      ACCEPT_EULA: "Y"
    ports:
    - 1433:1433
```


This short YAML manifest has achieved some very powerful things:

* Network —   A gimme when using Compose. Short of all the fancy things that Docker networking can do, this manifest puts each container in the same (private) network.
* DNS —  Comes with networking. Because Docker knows about the network, it can also route `container_name` correctly.
* Image build — Notice how the `steeltoe-app` in the manifest doesn’t declare an image;  it gives a `build:context` folder instead. Within this folder is your Dockerfile (giving direction on how to create the image) and your app source.
* Environment variables — In order for the app to run, it needs to be told how to connect with its data store as well as configure another value. The data store could be on `localhost` or it could be in a separate data center. Either way, it will handle things the exact same way.
* Startup dependencies — The `steeltoe-app` container should not start up if the database isn’t running. The `depends_on` collection holds the names of other containers to define this dependence.

There are a whole mess of other options and manipulations you do in the [Docker Compose manifest](https://docs.docker.com/compose/compose-file/); chances are this simple example isn’t going to fit your production environment exactly. The key is to recreate things as best as possible.
## Moving past the simple to reach environment parity
I've run into some common production scenarios that needed to be recreated locally. When you mix things like application platforms with stateless microservices, there are scenarios that need to be tested. While this is not an exhaustive list, it does include scenarios that every microservice should be able to handle.
### Manipulating the environment
This could be anything from scaling container instances up and down to streaming logs. The convenient thing with Docker Compose is that it knows quite a bit about what’s going not only within each container but also their shared network. You can refer to containers by their name to scale instances, like `docker-compose scale -i1 steeltoe-app`. Or you can forcefully shut down everything with a simple `docker-compose kill`.

With these commands, you can see exactly how your app will react when its backing service(s) fail, when there are multiple instances running, when a container restart happens, and many other scenarios.

### Connecting IDE to a running container
Unless you are a coding Zen master, your app is going to have some bugs. Obviously you want to minimize those bugs before leaving your desktop. Doing test-driven development is an excellent starting point, but it's not perfect.

As you make updates, you'll want to run the app to see how it reacts to each one. While `docker-compose up --build` is very handy when it comes to rebuilding the container with the latest source, all the “rinse and repeat” gets old, quickly. One idea is to use Docker's mounting capabilities.

Let's say you're working out of the folder c:\my-project. When you tell the IDE to build, it writes your new artifact to the \bin folder within the project.You could tell Docker Compose to start a container that mounts the bin folder to a folder within the container. Then add a start command for the container that references the new artifact. Something like this:

```yaml
steeltoe-app:
    image: mcr.microsoft.com/dotnet/core/runtime:latest
    container_name: steeltoe-app
    ports:
    - 8080:8080
    volumes:
      - c:\my-project\bin:/my-app
    command: ["dotnet", "watch", "run", "/my-app/my-project.dll"]
```

Now, whenever you build the app within the IDE, the container will be running the fresh version.
### Authentication and authorization
I will be the first to admit that recreating something like federated LDAP services is going to be difficult, never mind getting its configuration to a realistic place. Or worse yet, if your app has some magical homegrown auth package that you have no control over.

When I am in this type of scenario, I try to take an objective point of view. No, I can't recreate the exact auth provider, but what is my app dependent on? Active Directory service? Probably not. As long as the app can redirect to an authentication service and be handed back a collection of authorizations, it's a pretty good test. With a little creativity (maybe some open source and Docker hub) you can get your local environment to within a reasonable level of parity to production.
### App observability
Too many times this is an afterthought to production. Yet it turns out everything was available to you way before those executives started breathing down your neck.

An example would be using Grafana for app observability. It gives you the option to preload a dashboard and data source as the container instance is starting. With it in place, you can see exactly what the metrics look like as you manipulate the environment. Better yet, you can run small manipulations one at a time to learn what the traces look like—all locally!

That way, the next time you get the dreaded "app's down" message, you can fire up that prod dashboard and get right to the issue.
## Next steps
To begin the journey of reaching dev/prod environment parity, you’ll need the ability to containerize locally. For some, this might be as simple as installing Docker Desktop. But for others, this might mean virtualization needs to be enabled in the bios, which (depending on how friendly you are with IT admins) could be monumental. An alternative to the bios debacle is to develop on the desktop of a VM. This, of course, comes with its own list of challenges, but once you have Docker going there will be nothing to stop you!