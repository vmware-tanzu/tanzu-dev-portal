---
date: 2020-08-11
description: How does Python look in the cloud-native world of today?
featured: false
lastmod: '2020-10-08'
patterns:
- Deployment
tags:
- Kubernetes
- Python
- Buildpacks
team:
- Brian McClain
title: 'Hello Python, My Old Friend: Revisiting Python in a Cloud-Native Climate'
---

For quite a while now, I’ve kept an eye on [RedMonk’s programming language rankings](https://redmonk.com/sogrady/2020/07/27/language-rankings-6-20/) — which track the usage of all programming languages based on data from GitHub, as well as discussion about them on Stack Overflow —— to get insight into the various language trends. In the [January 2020 update,](https://redmonk.com/sogrady/2020/02/28/language-rankings-1-20/) something interesting happened: Python reached  No. 2 on the list, taking over Java. 

As RedMonk pointed out, “[T]he numerical ranking is substantially less relevant than the language’s tier or grouping. In many cases, one spot on the list is not distinguishable from the next.” However, it’s still interesting, especially as Python has continued to hold the No. 2 spot into the latest ranking after spending approximately seven years ranked third or fourth.

RedMonk isn’t alone in its findings, either. GitHub’s report, [The State of the Octoverse](https://octoverse.github.com/) also ranked Python as the second most-popular language used on that website, just behind JavaScript. Not only that, it also found Python remains among the top 10 fastest-growing languages in the community, despite already having a foothold with developers. In the [JetBrains Python Developers Survey in 2019](https://www.jetbrains.com/lp/python-developers-survey-2019/), it found that one of the most popular things developers use Python for is web development, with Flask and Django fighting for the top web framework.

At one time Python was my main language of choice. For the past few years, I’ve primarily been a Java developer, and a Ruby developer before that. Since the time that Python was my go-to, the landscape of software development has changed significantly. Microservices-based architecture continued to gain popularity at mach speed and the adoption of serverless began. Perhaps  most significantly, we saw the rise of Kubernetes. 

So now that Java’s been bumped out of the top spot for more than six months running, it seems like an especially good time to revisit how to build an application in Python.
## Building the Application

For the purposes of this post, I wanted to keep the application simple. I chose a two-tier application: a [backend app](https://github.com/BrianMMcClain/python-shop-backend) that serves up a list of items in an inventory, and a [frontend app](https://github.com/BrianMMcClain/python-shop-frontend) to display the inventory. Both applications were written using [Flask](https://flask.palletsprojects.com/en/1.1.x/), a lightweight web application framework for Python. Flask provides a lot to make developing web apps in Python easy, with features such as routing, response templates, logging, session management, and more. For this app, we’re using it just for basic request routing and template rendering.

If you’ve written in Python before, much of the code should look pretty standard. The backend application has one endpoint served at `/` , which returns a JSON array of objects. The frontend app has a single endpoint, also at `/`, which requests the lists of items from the backend and passes them to a [template that it renders](https://github.com/BrianMMcClain/python-shop-frontend/blob/main/templates/index.html). One thing that should be pointed out is the `getBackendURI()` function in the [app.py file](https://github.com/BrianMMcClain/python-shop-frontend/blob/main/app.py) for the frontend. This function is called when the frontend needs to know where to request data from the backend:

```python
CONFIG_PATH = "/config/config.cfg"

def getBackendURI():
    if os.path.exists(CONFIG_PATH):
        app.config.from_pyfile(CONFIG_PATH)
        return app.config["BACKEND_URI"]
    return "http://localhost:8082"
```

This method reads the contents of `/config/config.cfg` to know where to send requests when reaching out to the backend. If the file doesn’t exist, it sends requests to localhost. You may notice that this file doesn’t exist anywhere in the code; that’s because we’ll be generating it when we deploy our application to Kubernetes.  Be sure to keep that in mind.

## Packaging the Application

Speaking of deploying to Kubernetes, now we need to package our code into containers. We could write a Dockerfile ourselves, but lucky for us, [Cloud Native Buildpacks](/guides/containers/cnb-what-is/) can build the container automatically! If you’re new to using Cloud Native Buildpacks with Python, I recommend reading [this guide](/guides/python/cnb-gs-python) from my teammate [Ben Wilcock](/team/ben-wilcock/) which explains how to get started.

Since I just use [Docker Hub](https://hub.docker.com/) as my container registry, you can use the following commands yourself so long as you replace my username with your own. While we’re in the directory containing the [`python-shop-backend`](https://github.com/BrianMMcClain/python-shop-backend) code, let’s build and push a container image for it:

```bash
$ pack build brianmmcclain/python-shop-backend  --builder gcr.io/buildpacks/builder:v1
…
Successfully built image brianmmcclain/python-shop-backend

$ docker push brianmmcclain/python-shop-backend
```

In the above example, I’ve used the [pack CLI](/guides/containers/cnb-gs-pack/) to build a container from my code, telling it to use a specific builder. In this case, the builder can tell that we’re building a container for a Python application, so it pulls in the dependencies with `pip` by reading the `requirements.txt` file.   It knows how to run the application, thanks to the `Procfile`.

Next, we’ll do the same thing in the directory containing the [`python-shop-frontend`](https://github.com/BrianMMcClain/python-shop-frontend) code:

```bash
$ pack build brianmmcclain/python-shop-frontend  --builder gcr.io/buildpacks/builder:v1
…
Successfully built image brianmmcclain/python-shop-frontend

$ docker push brianmmcclain/python-shop-frontend
```

Just as we saw with the backend code, `pack` builds the container, then we push it up to Docker Hub. Now all that’s left is to run it!

## Deploying to Kubernetes

In the `python-shop-frontend` codebase, I’ve included a file named [deploy.yaml, ](https://github.com/BrianMMcClain/python-shop-frontend/blob/main/deploy.yaml) which contains all of the resources we need to deploy to Kubernetes. In my case, I’m just deploying to Minikube, but you can [use other solutions](/blog/kubernetes-at-home-local-k8s-options/) if you’d like. You can apply this YAML to Kubernetes with the `kubectl apply` command:

```bash
$ kubectl apply -f deploy.yaml
deployment.apps/python-shop-backend created
service/python-shop-backend-service created
configmap/python-shop-frontend-config created
deployment.apps/python-shop-frontend created
service/python-shop-frontend-service created
```

You should see a couple of deployments created: one for the frontend and one for the backend. We’ve also created two services for each deployment to attach to. Finally, we’ve created a ConfigMap named `python-shop-frontend-config`. Remember when we were looking at the code and noticed a reference to a file at `/config/config.cfg`? Here’s where that data lives. Take a look at this ConfigMap definition:

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: python-shop-frontend-config
data:
  config.cfg: |
    BACKEND_URI="http://python-shop-backend-service:8080"
```

Here’s where we’ve defined that `BACKEND_URI` will point to the `python-shop-backend-service` service in port 8080. We then reference this ConfigMap in the Deployment for the frontend:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: python-shop-frontend
  labels:
    app: python-shop-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: python-shop-frontend
  template:
    metadata:
      labels:
        app: python-shop-frontend
    spec:
      containers:
      - name: python-shop-frontend
        image: brianmmcclain/python-shop-frontend:latest
        volumeMounts:
        - name: python-shop-frontend-config-volume
          mountPath: /config
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
      volumes:
      - name: python-shop-frontend-config-volume
        configMap:
          name: python-shop-frontend-config
```

Notice the volume defined in the `volumes` section named `python-shop-frontend-config-volume`, which references the `python-shop-frontend-config` ConfigMap. In the container specification, we then mount this volume to the container running the frontend at `/config`:

```yaml
  spec:
      containers:
      - name: python-shop-frontend
        image: brianmmcclain/python-shop-frontend:latest
        volumeMounts:
        - name: python-shop-frontend-config-volume
          mountPath: /config
```

With this configuration, a file is created from the ConfigMap named `config.cfg` and mounted at `/config`, which our application reads to know the value of `BACKEND_URI`. By configuring our code this way, if the address of the backend ever changes we can update the ConfigMap without having to restart our frontend container.

## So What’s the Verdict?

In putting together this post, I was reminded of what an enjoyable experience it is to write in Python. I was also very happy to see how easily we can use it to leverage more modern technologies, such as Kubernetes and Cloud Native Buildpacks. Indeed, Python is lightweight, and can result in fairly slim container images.  Flask, meanwhile, proves to be a great framework for developing modern applications. 

Of course, there would be a lot more to consider if we were writing a production application, such as logging, metrics, a proper web server to back our code, and much more. But it makes sense that Python has had such a hold on the software community, and it’s exciting to see that it’s only getting stronger. If, like me, you want to learn more, I suggest checking out some of the other content that [Ben](/team/ben-wilcock) has been making, such as [running Python in production](/guides/python/cf-gs/).

{{< youtube JS_YIn49xuw >}}