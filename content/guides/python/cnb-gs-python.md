---
date: '2020-07-21'
description: Read industry best practices about building containers and discover how
  to use Buildpacks to package your Python apps into Docker containers.
lastmod: '2021-03-07'
linkTitle: Python Buildpacks
metaTitle: Building Docker Containers with Python
patterns:
- Deployment
tags:
- Python
- Containers
- Buildpacks
team:
- Ben Wilcock
title: 'Python Like A Pro: Building Docker Containers'
topics:
- Python
- Containers
oldPath: "/content/guides/python/cnb-gs-python.md"
aliases:
- "/guides/python/cnb-gs-python"
level1: Deploying Modern Applications
level2: Packaging and Publishing
---

Packaging your application code into Docker containers is a tricky business. Python code is no exception. There are a _ton_ of best practices that you need to know about if you're going to build a container that is safe, secure, and maintainable over the long term. [Buildpacks][bp-website] codify these best practices, and they're open-source, so they're a great way to turn your application code into runnable containers.

And because buildpacks completely remove the need for a `Dockerfile`, they dramatically simplify the maintenance of your container images --- particularly useful if you have multiple images to maintain. They're no 'flash-in-the-pan' either. Developed by Heroku in 2011, and also used in Cloud Foundry, buildpacks have built and run millions of production workloads!

For Python developers, there are currently two implementations of the Buildpack standard which provide Python compatible buildpacks. One is from Google and the other is from Heroku. In this guide, you'll learn how to use Heroku's Python buildpack to create a container image for a sample Python application.

## Before You Begin

There are a few things you need to do before getting started with Python Buildpacks:

- Install [Docker Desktop](https://hub.docker.com/search?type=edition&offering=community). The `pack` CLI requires the Docker daemon, so you'll need to have that installed and running locally. 

- Check out [Containers 101](https://kube.academy/courses/containers-101) on KubeAcademy, particularly if you've never worked with containers or Docker before.

- Follow the documentation for [installing `pack`](https://buildpacks.io/docs/install-pack/) in your local environment.

- [Optional] If you are completely new to buildpacks, you might prefer to first read up on [what are buildpacks?](/guides/containers/cnb-what-is)

## Using Buildpacks With Python

Buildpacks work the same way no matter what language the code is written in. In this guide you'll use a simple Python application, but remember that the process works in the same way for Node.JS, Java, Go, PHP, and more.

Follow the steps below to quickly create a container image for a Python application using the Heroku Python Buildpack.

### Get The Sample Python Application

Download the sample Python application from Github and make the sample application's folder your current working directory as follows:

```bash
> git clone https://github.com/benwilcock/buildpacks-python-demo.git
> cd buildpacks-python-demo
```

In the folder you will notice three text files, `web.py`, `requirements.txt`, and `Procfile`.

The file `web.py` contains a hello-world web application written in `Python3` using the `Flask` and `MarkupSafe` libraries. 

```python
from flask import Flask
from markupsafe import escape
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/hello/<username>')
def hello_user(username):
    # say hello to that user
    return 'Hello %s' % escape(username)
```

The file `requirements.txt` clarifies which libraries your application is dependent on, and their versions. Pip can generate the contents of this file for you using the command `pip freeze`.

```text
click==7.1.2
Flask==1.1.2
itsdangerous==1.1.0
Jinja2==2.11.2
MarkupSafe==1.1.1
Werkzeug==1.0.1
```

The `Procfile` specifies the command-line used to execute the application at runtime. In this case the Procfile declares that the `web.py` file contains your `FLASK_APP`, calls `flask run`, and binds the web-server to the `--host` with the IP address `0.0.0.0`. It is expected that the `--port` to bind the application to will be set as an environment variable using the name `$PORT`.

```text
web: FLASK_APP=web.py python3 -m flask run --host=0.0.0.0 --port=$PORT
```


### Get The List Of Suggested Builders

There are many implementations of the [Buildpacks][bp-website] standard. These implementations are called 'builders'. To discover the very latest list of suggested builders, use the `pack suggest-builders` command as follows: 

```bash
> pack suggest-builders

Suggested builders:
	Google:                gcr.io/buildpacks/builder:v1                 Ubuntu 18 base image with buildpacks for .NET, Go, Java, Node.js, and Python
	Heroku:                heroku/buildpacks:18                         heroku-18 base image with buildpacks for Ruby, Java, Node.js, Python, Golang, & PHP
	Paketo Buildpacks:     gcr.io/paketo-buildpacks/builder:full-cf     cflinuxfs3 base image with buildpacks for Java, .NET, NodeJS, Golang, PHP, HTTPD and NGINX
        ...
```

As you can see, both [Heroku][heroku-python-bp] and [Google Cloud Platform][google-buildpacks] offer open-source Python compatible builders. For this exercise, you'll use the Heroku builder, but you could just as easily use Google's. 

### Set Heroku As Your Default Builder

Copy the name of the builder that you want to set as your default from the list above --- in this case it's `heroku/buildpacks:18` --- and use the `pack set-default-builder` command to set this buildpack as the default as shown below:

```bash
> pack set-default-builder heroku/buildpacks:18
Builder heroku/buildpacks:18 is now the default builder
```

### Use `pack` To Create Your Container Image

To run the builder and create your Python application container image, use the command `pack build`. Be sure to also specify an image name for the container in the format "&lt;repository&gt;/&lt;container-name&gt;:&lt;tag&gt;" as shown in the following example:

```bash
> pack build benwilcock/python-sample:1.0.0
```

The process of building the image will now begin. The first time you do this, you will notice that docker is downloading a series of container image 'layers.' This is because buildpacks are also containers, so they must first be pulled by Docker before the buildpack can be run locally. Once these images are in your cache, the process is much quicker. The output looks something like this:

```bash
18: Pulling from heroku/buildpacks
4e20becbd46f: Pull complete
3c742a4a0f38: Already exists
ab0f59294661: Downloading [=============================>                     ]  16.05MB/26.96MB
Digest: sha256:296e4f3394e3147a61bd8b08d3c46c0dfa2bf2d4266ed598241cf2419dc96fa3
Status: Image is up to date for heroku/buildpacks:18
18: Pulling from heroku/pack
Digest: sha256:219a7621db58790ace66a87d33a200cd89aeda03192994e11a05967fbf8892f6
Status: Image is up to date for heroku/pack:18
===> DETECTING
heroku/python   0.2
heroku/procfile 0.5
===> ANALYZING
Restoring metadata for "heroku/python:shim" from cache
===> RESTORING
Restoring data for "heroku/python:shim" from cache
===> BUILDING
-----> No change in requirements detected, installing from cache
-----> Installing SQLite3
-----> Installing requirements with pip
-----> Discovering process types
       Procfile declares types     -> web
===> EXPORTING
Reusing layer 'launcher'
Reusing layer 'heroku/python:profile'
Adding 1/1 app layer(s)
Reusing layer 'config'
*** Images (a904788f7748):
      index.docker.io/benwilcock/python-sample:1.0.0
Adding cache layer 'heroku/python:shim'
Successfully built image benwilcock/python-sample:1.0.0
```

When you see the words "Successfully built image" the process is complete. Your new container image will now be available in your local Docker image repository. You can list the images in your local repository with the command `docker images`.

```bash
> docker images
REPOSITORY                  TAG                 IMAGE ID            CREATED             SIZE
benwilcock/python-sample    1.0.0               59843a212207        40 years ago        651MB
```

> Already we're benefiting from buildpack engineering! Notice that the `CREATED` date says "40 years ago". This is a best practice whereby the timestamps of layers are 'zeroed' to make container builds more reproducible, cache-able, and to avoid unnecessary image downloads. You can read more [here](https://buildpacks.io/docs/reference/reproducibility/).

### Test The Container Image

Testing the container is no more difficult than running the image with the `docker run` command as follows:

```bash
> docker run -d -ePORT=8080 -p8080:8080 --name python-sample benwilcock/python-sample:1.0.0
```

Now the container image of your application is running in the background, simply query the `http://localhost:8080` endpoint, either using a command-line tool like [Httpie][httpie] as shown below, or a regular web browser.

```bash
> http localhost:8080/
```

Your application will respond with the legend "Hello, World!" like so:

```
HTTP/1.0 200 OK
Content-Length: 13
Content-Type: text/html; charset=utf-8
Date: Tue, 21 Jul 2020 10:27:47 GMT
Server: Werkzeug/1.0.1 Python/3.6.11

Hello, World!
```

And you're done! You built your sample Python application into an OCI compliant Docker container image without resorting to a `Dockerfile`. Heroku will take care of most of the underlying maintenance tasks on the operating system and the Python interpreter. All you need to do is re-run `pack build` and you'll get a fresh image. If nothing changed, neither will your image.

### Tidy Up

You can stop and remove the container from Docker as follows:

```bash
> docker stop python-sample
> docker rm python-sample
```

### Keep Learning

Learn more about buildpacks right here on the Tanzu Developer Center with these great guides:

- [Buildpacks: What Are They?](/guides/containers/cnb-what-is)

- [Getting Started With The `pack` CLI](/guides/containers/cnb-gs-pack)

- [Getting Started With Automated Builds Using `kpack`](/guides/containers/cnb-gs-kpack)

Find out more about what the `pack` tool can do by using the `--help` command and browsing the [Buildpacks.io][bp-website] website. 

If you liked this guide, you might find these others in our 'Python Like A Pro' series useful:

- [Install Python Like A Pro!][gs-pyenv]
- [Managing Python Project Dependencies Like A Pro!][gs-pyenv-venv]
- [Managing Python Global Packages Like A Pro][gs-pipx]
- [Run Python In Production Like A Pro!][gs-cf]

And if you'd prefer to see the buildpack in action without actually following the steps above, check out the accompanying YouTube video guide:

{{< youtube JS_YIn49xuw >}}

---
[heroku-python-bp]: https://github.com/heroku/heroku-buildpack-python
[heroku-python-bp-help]: https://devcenter.heroku.com/articles/python-support
[bp-spec]: https://github.com/buildpacks/spec/blob/main/platform.md
[bp-website]: https://buildpacks.io
[google-buildpacks]: https://github.com/GoogleCloudPlatform/buildpacks
[httpie]: https://httpie.org/
[bp-github]: https://github.com/buildpacks

[gs-pyenv]: /guides/python/gs-python-like-a-pro
[gs-pyenv-venv]: /guides/python/gs-managing-python-packages
[gs-pipx]: /guides/python/gs-python-installing-global-packages
[gs-cnb]: /guides/python/cnb-gs-python
[gs-cf]: /guides/python/cf-gs