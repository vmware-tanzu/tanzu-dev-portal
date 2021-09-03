---
date: 2020-01-30
description: Continuously develop, test, and monitor an Express app with Bitnami,
  Skaffold and Octant
lastmod: '2021-02-05'
linkTitle: Skaffold and Octant
tags:
- Bitnami
- Octant
- Skaffold
- Kubernetes
team:
- Vikram Vaswani
title: Continuously Develop and Monitor an Express Application on Kubernetes with
  Bitnami, Skaffold and Octant
topics:
- CI-CD
- Kubernetes
oldPath: "/content/guides/ci-cd/express-app-bitnami-skaffold-octant.md"
aliases:
- "/guides/ci-cd/express-app-bitnami-skaffold-octant"
level1: Building Modern Applications
level2: Modern Development Practices
---

As Kubernetes' importance as a platform grows, developers are increasingly searching for ways to build and debug cloud-native applications on Kubernetes infrastructure from the get-go. Rather than first hacking on code in local (or virtualized) environments and then migrating it to cloud-native architecture, this new approach involves continuously developing, debugging and deploying containerized applications on a live Kubernetes cluster.

If you're a developer building cloud-native applications and targeting Kubernetes as your deployment architecture, Bitnami can help you with ready-to-use containers and Helm charts. Using these (instead of rolling your own) can save you time, help you follow best practices and allow you to focus on adding features to your application instead of dealing with Kubernetes-related complexity and configuration.

* [Bitnami's containers](https://bitnami.com/containers) for [Node.js](https://github.com/bitnami/bitnami-docker-node), [Ruby](https://github.com/bitnami/bitnami-docker-ruby), [Java](https://github.com/bitnami/bitnami-docker-java) and many others make it easy to containerize your applications in a consistent manner using the latest and most secure version of your programming language.

* [Bitnami's Helm charts](https://github.com/bitnami/charts/) for runtime environments like [Node.js](https://github.com/bitnami/charts/tree/master/bitnami/node) and infrastructure components like [Memcached](https://github.com/bitnami/charts/tree/master/bitnami/memcached), [MySQL](https://github.com/bitnami/charts/tree/master/bitnami/mysql), [Elasticsearch](https://github.com/bitnami/charts/tree/master/bitnami/elasticsearch), [Apache Kafka](https://github.com/bitnami/charts/tree/master/bitnami/kafka) and many others let you deploy your applications on Kubernetes in a secure and reliable manner without worrying about packaging, dependencies and Kubernetes YAML files.

This guide gets you started with continuous development (CD) on Kubernetes. It uses [Skaffold](https://skaffold.dev/), in combination with Bitnami containers and Helm charts, to let you test and debug your application in a live Kubernetes environment with minimal setup effort. It also uses  [Octant](https://octant.dev/) to help you monitor your cluster in real time and understand how your application behaves under different workloads.
 
## Assumptions and Prerequisites

This guide makes the following assumptions:

* You have a multi-node Kubernetes cluster running. [Learn about deploying a Kubernetes cluster on different cloud platforms](https://docs.bitnami.com/kubernetes/).
* You have the following tools installed and configured to work with your Kubernetes cluster:
  * *kubectl* CLI. [Learn how to install *kubectl*](https://docs.bitnami.com/kubernetes/get-started-kubernetes#step-3-install-kubectl-command-line).
  * Helm v2.x package manager. [Learn about installing Helm v2.x](https://v2.helm.sh/docs/using_helm/#installing-helm).
* You have Docker installed. [Learn about installing and configuring Docker for your platform](https://docs.docker.com/install/).
* You have a Docker Hub account. If not, [sign up for a free Docker Hub account](https://hub.docker.com/signup).

> As of this writing, Skaffold only works with Helm v2.x.

## Step 1: Create a simple Express application

Your first step is to write some starter code. In this section, you will create a simple "Hello, world" application using [Express](https://expressjs.com/). Follow these steps:

* Create a working directory for the application on your development system:

  ```plaintext
  mkdir myproject
  cd myproject
  ```
  
* Create a *package.json* file listing the dependencies for the project:

  ```json
  {
    "name": "my-express-app",
    "version": "1.0.0",
    "description": "Express Hello World app",
    "main": "app.js",
    "scripts": {
      "start": "node app.js"
    },
    "dependencies": {
      "express": "4.17.1"
    }
  }
  ```

* Create an *app.js* file for the Express application which returns a "Hello world" message on access:

  ```javascript
  'use strict';

  const express = require('express');

  const PORT = process.env.PORT || 3000;

  const app = express();

  app.get('/', function (req, res) {
    res.send('Hello world\n');
  });

  app.listen(PORT);
  console.log('Running on http://localhost:' + PORT);
  ```

If you have Node.js installed in your local environment, you can test this application by running the following commands and then browsing to *http://localhost:3000*:

```
npm install
npm start
```

## Step 2: Configure the application pipeline with Skaffold

[Skaffold](https://skaffold.dev/) is an open source tool that makes it easy to build and deploy containers on Kubernetes. In this step, you will configure Skaffold to build your Express application as a container and to deploy it on the cluster using Helm.

Begin by downloading and install Skaffold using the [official installation instructions for your platform](https://skaffold.dev/docs/install/). Once Skaffold is installed, create a file named *skaffold.yaml* in your project directory and fill it with the content below. To ensure this works correctly with your Docker Hub account, replace the DOCKER-HUB-USERNAME placeholder with your Docker Hub username.

```yaml
apiVersion: skaffold/v2alpha2
kind: Config
metadata:
  name: my-express-app
build:
  artifacts:
  - image: DOCKER-HUB-USERNAME/my-express-app
deploy:
  helm:
    releases:
    - name: my-express-app
      chartPath: bitnami/node
      remote: true
      setValues:
        image.repository: DOCKER-HUB-USERNAME/my-express-app
        service.type: LoadBalancer
        getAppFromExternalRepository: false
        applicationPort: 3000
      setValueTemplates:
        image.tag: "{{ .DIGEST_HEX }}"
```

This file defines the Skaffold configuration for build and deploy stages. Let's look at each stage in detail.

### Build stage

```yaml
...
build:
  artifacts:
  - image: DOCKER-HUB-USERNAME/my-express-app
...
```

In the build stage, Skaffold will use Docker and a local *Dockerfile* to build the application, and then push it to a registry (by default, Docker Hub). Instead of creating a *Dockerfile* from scratch, you will streamline your work by using [Bitnami's Node.js Docker image](https://github.com/bitnami/bitnami-docker-node/), which comes with the latest bug fixes and most secure version of Node.js. Create the *Dockerfile* as follows:

```
FROM bitnami/node:10 as builder
ENV NODE_ENV="production"

# Copy app's source code to the /app directory
COPY . /app

# The application's directory will be the working directory
WORKDIR /app

# Install Node.js dependencies defined in '/app/package.json'
RUN npm install

FROM bitnami/node:10-prod
ENV NODE_ENV="production"
COPY --from=builder /app /app
WORKDIR /app
ENV PORT 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

Skaffold will automatically build and tag the image using this *Dockerfile*. Once the image is built and tagged, the *image* parameter in the build configuration tells Skaffold where to push the built image.

If you are not already logged in to Docker Hub, use the command below to log in before proceeding. This is necessary so that Skaffold can push its built images to your Docker Hub account.

```bash
docker login
```

### Deploy stage

```yaml
...
deploy:
  helm:
    releases:
    - name: my-express-app
      chartPath: bitnami/node
      remote: true
      setValues:
        image.repository: DOCKER-HUB-USERNAME/my-express-app
        service.type: LoadBalancer
        getAppFromExternalRepository: false
        applicationPort: 3000
      setValueTemplates:
        image.tag: "{{ .DIGEST_HEX }}"
```

In the deploy stage, Skaffold will use a Helm chart to deploy the built container to the Kubernetes cluster. Instead of spending time and effort to create and test a custom Helm chart for this purpose, you will use [Bitnami's Node.js Helm chart](https://github.com/bitnami/charts/tree/master/bitnami/node). This is a ready-to-use, preconfigured solution that is compliant with current best practices and includes all the tools you need for a Node.js deployment on Kubernetes. 

The *remote* parameter tells Skaffold that the chart is available in a remote repository (not locally) and the *chartPath* parameter tells Skaffold where to find it. Skaffold relies on Helm's repository list to locate the chart, so when using Bitnami's Node.js chart as shown above, you must ensure that the Bitnami chart repository is known to Helm. If this is not the case, use the command below before proceeding to the next step:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```

Bitnami's Node.js chart comes with a large number of configurable parameters, which allow you to tune the deployment to your needs. These parameters are set through the *setValues* and *setValueTemplates* options. Here's a quick explanation of the ones used above:

* The *image.repository* parameter tells the chart where to find the built image - in this case, the Docker Hub repository.
* The *image.tag* parameter sets the tag to identify the image by - in this case, the auto-generated tag from the build stage.
* The *getAppFromExternalRepository* parameter is set to *false* because the application is already included in the generated image and does not need to be downloaded from an external source.
* The *service.type* parameter configures the deployment to be available at a public load balancer IP address so that it can be easily reviewed or tested.
* The *applicationPort* parameter exposes the application on port 3000, which is the port configured for the application in the *Dockerfile*. 

> For Node.js applications that use MongoDB, Bitnami's Node.js chart will automatically deploy MongoDB on your cluster. Alternatively, if you're using a cloud-based MongoDB service, you can skip the cluster deployment of MongoDB and instead configure the chart with the necessary credentials to connect to your remote MongoDB service. [See the complete list of available chart parameters](https://github.com/bitnami/charts/tree/master/bitnami/node#parameters).

## Step 3: Continuously build and test the application

You're now ready to build and test the application. Use the command below to tell Skaffold to start monitoring your project directory and build and deploy your Express application on Kubernetes using Bitnami's container image and Helm chart:

```bash
skaffold dev
```

In the build stage, Skaffold will build, tag and push your application to Docker Hub, as shown below:

![Build output](/images/guides/ci-cd/express-app-bitnami-skaffold-octant/build.png)

Once the image is built and pushed, Skaffold will proceed to the deployment stage and deploy the application on Kubernetes with Helm:

![Deployment output](/images/guides/ci-cd/express-app-bitnami-skaffold-octant/deploy.png)

Once the deployment is complete, use the command shown in the output of the Helm chart to obtain the load balancer IP address for the service:

![Service details](/images/guides/ci-cd/express-app-bitnami-skaffold-octant/service.png)

If you browse to the IP address, you should see the output of the Express application, as shown below:

![Example output](/images/guides/ci-cd/express-app-bitnami-skaffold-octant/example-1.png)

To test the CD feature, make a change to the application - for example, update the message "Hello world" in the *app.js* file to "Aloha world". 

```plaintext
sed -i 's/Hello world/Aloha world/g' app.js
```

The change should be detected by Skaffold, which will build, push and deploy a fresh version of the application image to the Kubernetes cluster. Once the process is complete, browse to the application URL again and you should see the modified output of the application, as shown below:

![Example output](/images/guides/ci-cd/express-app-bitnami-skaffold-octant/example-2.png)

At this point, you have successfully created a continuous development pipeline between your working directory and your Kubernetes cluster. 

## Step 4: Monitor and inspect the running application with Octant

As you're developing your application, it's a good idea to monitor it on the cluster in real time. This gives you an idea of how it will behave under different conditions, and also lets you see the effect of changes you make to its deployment architecture. 

[Octant](https://octant.dev) is an open source tool that lets you monitor your cluster and the applications running on it in real time through a simple Web interface. It also lets you debug faster by supporting granular inspection of Kubernetes objects and streaming container logs.

Begin by downloading and install Octant to your system path using the [official installation instructions for your platform](https://octant.dev/docs/master/getting-started). Once Octant is installed, run it with the command below:

```
octant
```

This will start a browser on your system and direct you to the Octant dashboard. In case you're running Octant on a different or virtual host, you can instead use the command below and then browse to http://IP-ADDRESS:7777, where IP-ADDRESS is the IP address of the Octant host:

```
octant --listener-addr 0.0.0.0:7777
```

> Note that Octant does not come with authentication enabled so, if accessing it remotely from a different host, ensure that your firewall configuration only allows access from whitelisted hosts or add your own authentication layer to avoid cluster information being exposed to unauthorized users.

The Octant dashboard will display the running workloads on the cluster:

![Octant workload display](/images/guides/ci-cd/express-app-bitnami-skaffold-octant/workloads.png)

You can also drill down to see individual pods, services, nodes and other cluster objects: 

![Octant pod display](/images/guides/ci-cd/express-app-bitnami-skaffold-octant/pods.png)

Octant updates its data in real time so, when you make a change to your application and have it redeployed by Skaffold, the impact will be immediately visible in the Octant dashboard. This makes it a powerful tool to help developers understand how the application they are working on behaves on Kubernetes.

## Useful links

To learn more about the topics discussed in this guide, use the links below:

* [Bitnami Node.js container](https://github.com/bitnami/bitnami-docker-node)
* [Bitnami Node.js Helm chart](https://github.com/bitnami/charts/tree/master/bitnami/node)
* [Skaffold documentation](https://skaffold.dev/docs/)
* [Octant documentation](https://octant.dev/docs/master/getting-started/)
* [Express documentation](https://expressjs.com/en/starter/installing.html)