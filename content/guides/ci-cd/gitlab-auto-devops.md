---
date: 2019-09-18
description: Configure a CI/CD pipeline using GitLab and a Kubernetes cluster
lastmod: '2021-02-05'
linkTitle: GitLab Auto DevOps
patterns:
- Deployment
subsection: GitLab Auto DevOps
tags:
- CI-CD
- GitLab
- Bitnami
- Kubernetes
- Helm
team:
- Vikram Vaswani
title: Create a Continuous Integration Pipeline with GitLab and Kubernetes
topics:
- CI-CD
oldPath: "/content/guides/ci-cd/gitlab-auto-devops.md"
aliases:
- "/guides/ci-cd/gitlab-auto-devops"
level1: Deploying Modern Applications
level2: CI/CD, Release Pipelines
---

As development velocity increases, it's now become essential for enterprises to have a reliable and readily-available Continuous Integration/Continuous Delivery (CI/CD) pipeline integrated with cloud infrastructure. But although the requirements of such infrastructure are well understood, setting up this pipeline is still a complex task involving knowledge of cloud platforms, containerization tools like Docker, Docker Compose and others, container orchestration tools like Kubernetes and Helm, and DevOps tools and techniques.

Bitnami eases the task of building an enterprise-ready CI/CD pipeline with its application stacks and container images. 

* [Bitnami's GitLab CE stack](https://bitnami.com/stack/gitlab) lets you deploy a secure and fully-functional GitLab instance on the cloud in a matter of minutes and integrate it with a Kubernetes cluster. 

* [Bitnami's containers](https://bitnami.com/containers) for [Node.js](https://github.com/bitnami/bitnami-docker-node), [Ruby](https://github.com/bitnami/bitnami-docker-ruby), [Java](https://github.com/bitnami/bitnami-docker-java)  and others makes it easy to containerize your applications in a secure and reliable manner. 

Put the two together, and you have everything you need to create a modern, enterprise-grade CI/CD pipeline that leverages the scalability of Kubernetes with the flexibility of GitLab and the development agility of Bitnami containers. This guide walks you through the process.

## Overview

This guide shows you how to set up a CI/CD pipeline between GitLab (deployed using the [Bitnami GitLab CE stack](https://bitnami.com/stack/gitlab)) and a Kubernetes cluster with GitLab's Auto DevOps feature. With this configuration, every change to application code is automatically built as a Docker container (based on a [Bitnami Node.js base container](https://github.com/bitnami/bitnami-docker-node)) and deployed to the Kubernetes cluster for review and test. 

Communication and monitoring between the GitLab deployment and the Kubernetes cluster is achieved through the use of [Helm](https://helm.sh), [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) and [GitLab Runner](https://docs.gitlab.com/runner/). When GitLab deploys each built container to the cluster, it also makes it available for review at an auto-generated sub-domain of your main domain name.

## Assumptions and prerequisites

This guide makes the following assumptions:

* You have deployed the Bitnami GitLab CE stack on a cloud server and have the GitLab CE administrator credentials. Learn about [deploying Bitnami applications](https://docs.bitnami.com/) and [obtaining credentials](https://docs.bitnami.com/general/faq/get-started/find-credentials/).
* You have a multi-node Kubernetes cluster running. [Learn about deploying a Kubernetes cluster on different cloud platforms](https://docs.bitnami.com/kubernetes/).
* You have the *kubectl* command line (kubectl CLI) installed. [Learn about *kubectl*](https://docs.bitnami.com/kubernetes/get-started-kubernetes#step-3-install-kubectl-command-line).
* You have [Git](https://git-scm.com/) installed.
* You have a domain name and the ability to configure a wildcard DNS record for that domain name. [Learn about wildcard DNS records](https://en.wikipedia.org/wiki/Wildcard_DNS_record).
* You have an SSH key pair which you can use for repository commits. To generate a new SSH key pair, use PuTTYgen (Windows) or the *ssh-keygen* command (Linux and Mac OS X). Learn about [PuTTYgen](http://winscp.net/eng/docs/ui_puttygen) and [*ssh-keygen*](http://www.macworld.co.uk/how-to/mac-software/how-generate-ssh-keys-3521606/).

## Step 1: Configure DNS and SSL for GitLab

As a first step, you must configure a domain name and SSL certificate for GitLab, such that browsing to the domain directs you to a secure page for your GitLab deployment. If you already have an SSL certificate for your domain, you can continue to use that or, if not, you can follow the approach below and generate a free Let's Encrypt SSL certificate.

* Follow the instructions to [configure a custom domain for GitLab](https://docs.bitnami.com/general/faq/configuration/configure-custom-domain/).
* While logged in to the server console, [manually generate and install a Let's Encrypt certificate using *lego*](https://docs.bitnami.com/general/apps/gitlab/administration/generate-configure-certificate-letsencrypt/) as described in our guide.
* Test the configuration by browsing to *https://DOMAIN* (replace the DOMAIN placeholder with the correct domain name) and confirming that you see a secure GitLab login page, as shown below:

![GitLab secure login](/images/guides/ci-cd/gitlab-auto-devops/gitlab-ssl.png)

## Step 2: Configure and activate the GitLab registry

The next step is to activate the GitLab registry, as follows:

* Log in to the server console using SSH (if you're not already logged in).
* Edit the */etc/gitlab/gitlab.rb* file and uncomment and update the *registry_external_url* parameter as below, remembering to replace the DOMAIN placeholder with the GitLab domain name:

  ```plaintext
  registry_external_url 'https://DOMAIN:5005'
  ```

* In the same file, uncomment and update the *external_url* parameter as below, replacing the DOMAIN placeholder with the GitLab domain name:

  ```plaintext
  external_url 'https://DOMAIN'
  ```

* Save your changes to the file.
* Configure the GitLab registry to use the SSL certificates generated in the previous step. Replace the DOMAIN placeholder with the GitLab domain name.

  ```plaintext
  cd /etc/gitlab/ssl
  sudo ln -sf server.crt DOMAIN.crt
  sudo ln -sf server.key DOMAIN.key
  ```

* Execute the commands below to reconfigure and restart GitLab with the changes.
        
  ```plaintext
  sudo gitlab-ctl reconfigure
  sudo /opt/bitnami/ctlscript.sh restart
  ```

* Open port 5005 in the server firewall so that GitLab can connect to, and push built containers, to its internal registry. [Learn about opening firewall ports for your cloud platform](https://docs.bitnami.com/general/faq/administration/use-firewall/).
     
## Step 3: Create a new GitLab project 

You can now log in to GitLab and prepare a new project. This project will host the code that you will eventually run through your CI/CD pipeline to build and deploy on Kubernetes. 

* Browse to your GitLab domain and log in using the administrator credentials.
* On the welcome page, select the "Create a project" option.

![GitLab project creation](/images/guides/ci-cd/gitlab-auto-devops/create-project.png)

* Enter a name and slug for your project. Set the visibility level to "Internal". Click "Create project". 

![GitLab project creation](/images/guides/ci-cd/gitlab-auto-devops/configure-project.png)

Your project is created and you should see the project page, as shown below:

![GitLab project page](/images/guides/ci-cd/gitlab-auto-devops/new-project.png)

Click the "Clone" button and note the clone URL for the repository, which will be needed in [Step 6](#step-6-commit-test-and-repeat).

![GitLab project clone URL](/images/guides/ci-cd/gitlab-auto-devops/project-clone-url.png)

Before you can commit any code to the project repository, you must add your SSH key to your profile, as follows:

* Click your user profile icon in the top right corner of the navigation bar.
* Select the "Settings" menu icon.
* On the "User Settings" page, select the "SSH Keys" menu item.
* Paste the public key component of your SSH key pair in the "Key" field. Add an optional label and click the "Add Key" button to save the changes.

![GitLab key addition](/images/guides/ci-cd/gitlab-auto-devops/add-ssh-key.png)

## Step 4: Configure a Kubernetes cluster for the project

GitLab comes with built-in support for Kubernetes, making it easy to build and test your projects using a Kubernetes cluster. [Learn more about Kubernetes support in GitLab](https://docs.gitlab.com/ee/user/project/clusters/).

First, allow outbound requests from GitLab hooks and services, as follows:

* Navigate to the GitLab administration panel by selecting the "Admin Area" link.
* Navigate to the "Settings -> Network" page and select the "Outbound requests" section.
* Tick the checkboxes to allow requests to the local network from hooks and services.

![GitLab network requests](/images/guides/ci-cd/gitlab-auto-devops/allow-network-requests.png)

Then, configure your Kubernetes cluster in GitLab by following these steps:
  
* Use the *kubectl* command-line tool to obtain the following details for your Kubernetes cluster using the [instructions in the GitLab documentation](https://docs.gitlab.com/ee/user/project/clusters/#add-existing-kubernetes-cluster):
  * Cluster API URL
  * Cluster CA certificate
  * Cluster service token
* From the project page in GitLab, select the "Operations -> Kubernetes" menu item.
* On the resulting page, click the "Add Kubernetes cluster" button. 

![GitLab cluster configuration](/images/guides/ci-cd/gitlab-auto-devops/add-cluster.png)

* Select the "Add existing cluster" tab.
* Enter a name for your cluster with the API URL, CA certificate and server token obtained already. Check the boxes for "RBAC-enabled" cluster and "GitLab-managed cluster". 

![GitLab cluster configuration](/images/guides/ci-cd/gitlab-auto-devops/configure-cluster.png)

* Click the "Add Kubernetes cluster" button to save the changes.
* On the resulting page, find the "Applications" section and install Helm, followed by Ingress. Note the Ingress endpoint IP address generated after installing Ingress.

![Helm/Ingress installation](/images/guides/ci-cd/gitlab-auto-devops/install-helm-ingress.png)

* Configure a wildcard DNS record for your domain pointing to the Ingress IP address through your DNS provider's control panel. Learn how to configure wildcard DNS records for popular DNS providers like [GoDaddy](https://www.godaddy.com/help/set-up-wildcard-dns-3301), [NameCheap](https://www.namecheap.com/support/knowledgebase/article.aspx/597/2237/how-can-i-set-up-a-catchall-wildcard-subdomain) and [AWS Route53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/DomainNameFormat.html#domain-name-format-asterisk).
* Enter the base domain name used by the wildcard DNS record in the "Base domain" field in your GitLab Kubernetes cluster configuration. For example, if you configured a wildcard DNS record for **.example.com*, use *example.com* as the base domain name. This will be the base domain used for all Auto DevOps review deployments. Click "Save changes" to save the changes.

![GitLab base domain configuration](/images/guides/ci-cd/gitlab-auto-devops/configure-base-domain.png)

* Return to the "Applications" section and install Cert-Manager. Remember to provide a valid email address so that Cert-Manager can correctly associate your certificates with your account.
* From the same "Applications" section, install GitLab Runner.
* Confirm that the runner is successfully installed and activated for the project by navigating to the project's "Settings -> CI/CD" page and checking the status of the runner in the "Runners" section. 

![GitLab runner status](/images/guides/ci-cd/gitlab-auto-devops/check-runner-status.png)

## Step 5: Enable Auto DevOps for the project

Once the Kubernetes integration is complete and a runner is active, enable Auto DevOps for the project. Auto DevOps provides a preconfigured CI/CD pipeline which can be used to quickly get started with building, testing and deploying your project. [Learn more about Auto DevOps in GitLab](https://docs.gitlab.com/ee/topics/autodevops/).

To enable Auto DevOps for the project:
* Navigate to the project's "Settings -> CI/CD" page.
* In the "Auto DevOps" section, check the box for "Default to Auto DevOps pipeline" and select the "Continuous deployment to production" strategy.
* Click "Save changes" to enable the default pipeline.

![GitLab Auto DevOps configuration](/images/guides/ci-cd/gitlab-auto-devops/enable-auto-devops.png)

The default Auto DevOps pipeline comes with various stages already configured, depending on which version of GitLab you are running. For example, there are stages to build, run tests, check code quality, scan for dependencies, review code, deploy code and test performance. This default pipeline is fully customizable and stages can be added or removed depending on your requirements, simply by adjusting pipeline variables. [Learn about the available variables](https://docs.gitlab.com/ee/topics/autodevops/#environment-variables).

This tutorial will focus on creating a very simple pipeline consisting of only two stages: build and deploy. To turn off the other stages included in the default pipeline, follow these steps:
 
* Navigate to the project's "Settings -> CI/CD" page.
* In the "Variables" section, add the following three variables and values:

  ```plaintext
  TEST_DISABLED: true
  CODE_QUALITY_DISABLED: true
  PERFORMANCE_DISABLED: true
  ```

* Click "Save variables".

![GitLab Auto DevOps configuration](/images/guides/ci-cd/gitlab-auto-devops/set-variables.png)

## Step 6: Commit, test and repeat

At this point, you are ready to commit some code to the project and have GitLab test and deploy it. This tutorial will create a simple "Hello, world" application in Node.js and then configure a Dockerfile to run it with Bitnami's Node.js development container image. 

Follow these steps:

* Create a working directory for the application on your local host:

  ```plaintext
  mkdir myproject
  cd myproject
  ```

* Create a *package.json* file listing the dependencies for the project:

  ```json
  {
    "name": "simple-node-app",
    "version": "1.0.0",
    "description": "Node.js on Docker",
    "main": "server.js",
    "scripts": {
      "start": "node server.js"
    },
    "dependencies": {
      "express": "^4.13"
    }
  }
  ```

* Create a *server.js* file for the Express application which returns a "Hello world" message on access:

  ```javascript
  'use strict';

  const express = require('express');

  // Constants
  const PORT = process.env.PORT || 3000;

  // App
  const app = express();
  app.get('/', function (req, res) {
    res.send('Hello world\n');
  });

  app.listen(PORT);
  console.log('Running on http://localhost:' + PORT);
  ```

* Create a *Dockerfile* with the following content:

  ```dockerfile
  FROM bitnami/node:9 as builder
  ENV NODE_ENV="production"

  # Copy app's source code to the /app directory
  COPY . /app

  # The application's directory will be the working directory
  WORKDIR /app

  # Install Node.js dependencies defined in '/app/packages.json'
  RUN npm install

  FROM bitnami/node:9-prod
  ENV NODE_ENV="production"
  COPY --from=builder /app /app
  WORKDIR /app
  ENV PORT 5000
  EXPOSE 5000

  # Start the application
  CMD ["npm", "start"]
  ```

    This multi-stage *Dockerfile* creates a new image using Bitnami's Node.js container image as base. It copies the application files to the container's */app* directory and then runs *npm install* to install Express. It then creates a production-ready container image and configures the application to listen to request on port 5000.
    
> Exposing the application on port 5000 is a requirement of GitLab's [default Helm chart](https://gitlab.com/gitlab-org/charts/auto-deploy-app), which is used to deploy the application to the cluster. This can be overridden if needed using a custom Helm chart. Read more in our tutorial on [using a custom Helm chart with the Auto DevOps pipeline](https://docs.bitnami.com/tutorials/customize-ci-cd-pipeline-gitlab-bitnami-charts).

* Initialize a Git repository and commit and push the application code to GitLab. Replace the NAME and EMAIL-ADDRESS placeholders with your name and email address (if not already configured) and the CLONE-URL placeholder with the repository clone URL obtained in [Step 3](#step-3-create-a-new-gitlab-project).

  ```plaintext
  git config --global user.name "NAME"
  git config --global user.name "EMAIL-ADDRESS"
  git init    
  git remote add origin CLONE-URL
  git add .
  git commit -m "Initial commit"
  git push origin master
  ```

Pushing this commit should automatically trigger the Auto DevOps pipeline in GitLab. To see the pipeline in action, navigate to the project's "CI/CD -> Pipelines" page and confirm that the pipeline is running, as shown below:

![GitLab pipeline](/images/guides/ci-cd/gitlab-auto-devops/running-pipeline.png)

In the first stage, GitLab will attempt to build a container image containing the application code using the provided Dockerfile. The container will be pushed to the internal GitLab registry. Here's an example of the output you should see in this first stage:

![GitLab pipeline build output](/images/guides/ci-cd/gitlab-auto-devops/pipeline-build.png)

Once the container image has been built and pushed, the second stage of the pipeline will attempt to deploy it to Kubernetes for review. If successful, the stage output will display a URL, which you can browse to in order to see the application in action. Here's an example of the output you should see in this second stage:

![GitLab pipeline deployment output](/images/guides/ci-cd/gitlab-auto-devops/pipeline-deploy.png)

If you browse to the application URL listed in the output, you should see the output of the Node.js app, as shown below:

![Example output](/images/guides/ci-cd/gitlab-auto-devops/example-1.png)

To test the CI/CD feature, make a change to the application - for example, update the message "Hello world" in the *server.js* file to "Aloha world" - and push the change to GitLab. 

  ```plaintext
  sed -i 's/Hello world/Aloha world/g' server.js
  git add .
  git commit -m "Modified message text"
  git push origin master
  ```

The new commit should trigger the pipeline, causing a new build and deployment to take place, and the new application will be deployed on your cluster for review. As before, check pipeline status in GitLab, wait for it to complete and then browse to the application URL listed in the output of the second stage. You should see the revised output, as shown below:

![Example output](/images/guides/ci-cd/gitlab-auto-devops/example-2.png)

At this point, you have successfully created a simple CI/CD pipeline between GitLab and a Kubernetes cluster. You can now continue to enhance it by [adding new stages to the Auto DevOps pipeline](https://docs.gitlab.com/ee/topics/autodevops/#features), modifying how your code is deployed with a [custom deployment Helm chart](https://docs.gitlab.com/ee/topics/autodevops/#custom-helm-chart), or [configuring pipelines to run on a schedule](https://docs.gitlab.com/ee/user/project/pipelines/schedules.html). 

## Useful links

To learn more about the topics discussed in this guide, use the links below:

* [Bitnami GitLab CE stack documentation](https://docs.bitnami.com/general/apps/gitlab/)
* [Bitnami Node.js container](https://github.com/bitnami/bitnami-docker-node#)
* [Bitnami applications FAQ](https://docs.bitnami.com/general/faq/).
* [Bitnami documentation for Kubernetes deployments on different cloud platforms](https://docs.bitnami.com/kubernetes/).
* [GitLab documentation](https://docs.gitlab.com)
* [Wildcard DNS records](https://en.wikipedia.org/wiki/Wildcard_DNS_record).
* Key generation with [PuTTYgen](http://winscp.net/eng/docs/ui_puttygen) and [*ssh-keygen*](http://www.macworld.co.uk/how-to/mac-software/how-generate-ssh-keys-3521606/).