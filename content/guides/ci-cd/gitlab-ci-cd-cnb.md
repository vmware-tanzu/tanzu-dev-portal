---
date: '2021-02-11'
description: Deploy Cloud Native Apps Using GitLab CI/CD and Cloud Native Buildpacks
lastmod: '2021-02-11'
linkTitle: GitLab CI/CD with Buildpacks
parent: GitLab Auto DevOps
patterns:
- Deployment
tags:
- CI-CD
- GitLab
- Buildpacks
team:
- Samer Akkoub
title: Deploy Cloud Native Apps Using GitLab CI/CD and Cloud Native Buildpacks
topics:
- CI-CD
oldPath: "/content/guides/ci-cd/gitlab-ci-cd-cnb.md"
aliases:
- "/guides/ci-cd/gitlab-ci-cd-cnb"
level1: Deploying Modern Applications
level2: CI/CD, Release Pipelines
---

GitLab is a single application built from the ground up for all stages of the DevOps lifecycle that enables  product, development, QA, security, and operations teams to work on the same project concurrently. It provides teams with a single data store, user interface, and permission model across the DevOps lifecycle. Teams can collaborate and work on a project utilizing a single conversation, which significantly reduces cycle time, allowing developers to focus exclusively on building great software quickly.
This tutorial will explain how to create a sample CI/CD pipeline in GitLab and use Cloud Native Buildpacks to package the project source code into deployable containers.

## What Are Cloud Native Buildpacks?

Traditionally, in the build stage of the CI/CD cycle, the source code and its dependencies are packaged into containers that can be deployed against any proper container-hosting platform, either on-prem or in the cloud. A Dockerfile is usually used to pass all the commands required to assemble an image.

The challenge with this process—especially for large-scale deployments done frequently—is making sure that each and every build is identical and complies with the security, software currency, and build rules of the organization.

This is where buildpacks come in. A buildpack represents a package of all the tools and scripts required to produce a [standards-based](https://www.opencontainers.org), compliant container runtime.  The result is that developers no longer need to worry about maintaining Dockerfiles, and operators can make sure that all the containers are built using standard, preconfigured, tested, and approved images.
Not only that, because the software development is now abstracted from the underlying build process, it is possible to run a complete rebase for a whole environment (dev, test, staging, production) whether as part of a planned OS upgrade/patching process or in response to a newly identified vulnerability.

## How to Use Cloud Native Buildpacks with GitLab CI/CD

GitLab pipelines are defined in the `.gitlab-ci.yml` file; they consist of one or more jobs grouped into stages. If no stages are defined in a pipeline, the following three are assumed: build, test, and deploy. The jobs defined in the `.gitlab-ci.yml` file handle the CI/CD tasks required to get the code built, tested, verified, staged, and deployed to one or more target platforms.

![](/images/guides/ci-cd/gitlab-ci-cd-cnb/screenshots/image3.png)

### Create a New Project in GitLab SaaS  (or Using Your GitLab Instance If You Have a Self-Managed One)

1. Log in to GitLab.com.

2. Click on “New Project.”

![](/images/guides/ci-cd/gitlab-ci-cd-cnb/screenshots/image8.png)

3. As we are going to use Cloud Native Buildpacks, let’s create the new project based on the Spring project template by clicking “Create from Template” and then choosing the Spring template. This will create a sample Java Spring project, which by default will include a Dockerfile. 

![](/images/guides/ci-cd/gitlab-ci-cd-cnb/screenshots/image10.png)

![](/images/guides/ci-cd/gitlab-ci-cd-cnb/screenshots/image12.png)

4. As we are going to use a buildpack to build the project, let’s rename the Dockerfile to `backup-dockerfile` to ensure it won’t be used during the build process. The easiest way to do this is to click the Web IDE link in the top right.

![](/images/guides/ci-cd/gitlab-ci-cd-cnb/screenshots/image5.png)

5. Click the down arrow next to `Dockerfile`, and rename `Dockerfile` to `backup-dockerfile`. 

![](/images/guides/ci-cd/gitlab-ci-cd-cnb/screenshots/image4.png)

6. In GitLab, the project pipeline is configured in the `.gitlab-ci.yml` file. To add a pipeline file to the project, click the new file icon, and in the “Create New File” dialog click  `.gitlab-ci.yml`

![](/images/guides/ci-cd/gitlab-ci-cd-cnb/screenshots/image11.png)

![](/images/guides/ci-cd/gitlab-ci-cd-cnb/screenshots/image7.png)

7. To add GitLab Auto DevOps templates, click the template dropdown and choose “Auto DevOps Template.”

8. This is the whole [GitLab Auto DevOps](https://docs.gitlab.com/ee/topics/autodevops/) template, which was built by GitLab engineers based on CI/CD best practices. Auto DevOps aims to simplify the setup and execution of a mature and modern software development lifecycle, but as using the whole Auto DevOps template covers every stage in the CI/CD lifecycle and requires a GitLab Ultimate license, we will trim down the `.gitlab-ci.yml` file to only include the build stage. To that end, remove all but the following in the `include` section:

```yaml
include:
  - template: Jobs/Build.gitlab-ci.yml  # https://gitlab.com/gitlab-org/gitlab/blob/master/lib/gitlab/ci/templates/Jobs/Build.gitlab-ci.yml
```

9. In order to instruct the build job to use Cloud Native Buildpacks, add `AUTO_DEVOPS_BUILD_IMAGE_CNB_ENABLED: "true"` under the variables section.

10. By default, the `heroku/buildpacks:18` builder will be used to build the output containers. This can be changed by assigning a different builder to the `AUTO_DEVOPS_BUILD_IMAGE_CNB_BUILDER` variable, for example, `AUTO_DEVOPS_BUILD_IMAGE_CNB_BUILDER: paketobuildpacks/builder:base`. If you have the `pack` CLI installed locally, you can see all of the suggested buildpacks by running `pack builder suggest`.
```bash
Suggested builders:
	Google:                gcr.io/buildpacks/builder:v1      Ubuntu 18 base image with buildpacks for .NET, Go, Java, Node.js, and Python                                              
	Heroku:                heroku/buildpacks:18              heroku-18 base image with buildpacks for Ruby, Java, Node.js, Python, Golang, and PHP                                       
	Paketo Buildpacks:     paketobuildpacks/builder:base     Ubuntu bionic base image with buildpacks for Java, .NET Core, NodeJS, Go, Ruby, NGINX, and Procfile                        
	Paketo Buildpacks:     paketobuildpacks/builder:full     Ubuntu bionic base image with buildpacks for Java, .NET Core, NodeJS, Go, PHP, Ruby, Apache HTTPD, NGINX, and Procfile     
	Paketo Buildpacks:     paketobuildpacks/builder:tiny     Tiny base image (bionic build image, distroless-like run image) with buildpacks for Java Native Image and Go   
```

11. Pass the environment variables to the running jobs. This can be accomplished several ways:

 - Directly adding them in the pipeline file (`.gitlab-ci.yml`):

 ![](/images/guides/ci-cd/gitlab-ci-cd-cnb/screenshots/image6.png)

 - Defining them on the pipeline level before running the pipeline:

 ![](/images/guides/ci-cd/gitlab-ci-cd-cnb/screenshots/image1.png)

- Adding them under "Settings" in the left menu -> CI/CD, expanding the "Variables" tab, clicking the edit pen and changing the value to any other buildpack URL (diagram below), then triggering the pipeline again. 

![](/images/guides/ci-cd/gitlab-ci-cd-cnb/screenshots/image2.png)

11. Some buildpacks, like Google and Paketo, make the generated container available on port 8080. So if you are using the Gitlab Deploy template (part of GitLab Auto DevOps), you will need to change the listening port for the readiness probe from `5000` (the default in the template) to `8080`. This can be done easily by setting an environment variable named `HELM_UPGRADE_EXTRA_ARGS` value to `--set service.internalPort=8080 --set service.externalPort=8080`

![](/images/guides/ci-cd/gitlab-ci-cd-cnb/screenshots/image9.png)

### Use Cloud Native Buildpacks with GitLab in GitLab Build Job WITHOUT Using the GitLab Build Template

GitLab CI/CD also allows you to use your own build script if you so wish. Let’s look at a build script that reads the `AUTO_DEVOPS_BUILD_IMAGE_CNB_BUILDER` environment variable to determine which buildpack to use, which we saw how to set in Step 11:  
```yaml
build_using_passed_builder:
    stage: build
    script:
      - >- 
        if ! docker info &>/dev/null; then
          if [ -z "$DOCKER_HOST" ] && [ "$KUBERNETES_PORT" ]; then
            export DOCKER_HOST='tcp://localhost:2375'
          fi
        fi
      - echo $AUTO_DEVOPS_BUILD_IMAGE_CNB_BUILDER
      - >- 
        if [  -z "$AUTO_DEVOPS_BUILD_IMAGE_CNB_BUILDER"]; then
          export AUTO_DEVOPS_BUILD_IMAGE_CNB_BUILDER='heroku/buildpacks:18'
        fi
      - docker login -u gitlab-ci-token -p $CI_JOB_TOKEN $CI_REGISTRY 
      - wget https://github.com/buildpacks/pack/releases/download/v0.17.0/pack-v0.17.0-linux.tgz
      - tar -xvf pack-v0.17.0-linux.tgz
      - chmod +x pack 
      - mv pack /usr/local/bin/
      - pack build $IMAGE --builder $AUTO_DEVOPS_BUILD_IMAGE_CNB_BUILDER 
      - docker push $IMAGE
```

Let’s walk through this step by step to make sure we understand exactly what’s happening:

1. We first determine where Docker, which will be used to build our code, is running.
2. We then look at the `AUTO_DEVOPS_BUILD_IMAGE_CNB_BUILDER` environment variable to determine which buildpack to use. If this variable isn’t set, we default to using `heroku/buildpacks:18`.
3. Next, we authenticate against Docker using the `CI_JOB_TOKEN` variable provided automatically to us by GitLab.
4. We then download the `pack` CLI and make sure it has the proper permissions to make it executable.
5. The `pack` CLI is uses the buildpack defined in the `AUTO_DEVOPS_BUILD_IMAGE_CNB_BUILDER` environment variable to build our code, tagging the container with the name we expect to be provided in the `IMAGE` variable. 
6. Finally, we `docker push` the image to the GitLab container registry.

If you save this at `jobs/build.gitlab-ci.yml`, for example, you can update your `.gitlab-ci.yml` file to use this custom build job instead, with the following change:

```yaml
include:
  - jobs/build.gitlab-ci.yml
```
## Add Kubernetes Clusters to the GitLab Project

Kubernetes clusters can be added to the GitLab project so that applications can be deployed to them directly from the CI/CD pipeline. To add to the K8s cluster project, please follow the steps in the [Add and Removing Kubernetes Cluster](https://docs.gitlab.com/ee/user/project/clusters/add_remove_clusters.html) guide.

## Deploy the Packaged Container to the Kubernetes Clusters

GitLab automates and simplifies the deployment of containers to Kubernetes through the provided AutoDeploy template. Similar to the AutoBuild template, it’s based on CI/CD best practices and can save operators/developers the hassle of composing and maintaining long deployment scripts and [Helm charts](/guides/kubernetes/helm-what-is/). To use the AutoDeploy template we’ll include the `Deploy.gitlab-ci.yml` template under the “include” section in the `.gitlab-ci.yml` file, so it will look like this:
```yaml
include:
  - template: Jobs/Build.gitlab-ci.yml  # https://gitlab.com/gitlab-org/gitlab/blob/master/lib/gitlab/ci/templates/Jobs/Build.gitlab-ci.yml
  - template: Jobs/Deploy.gitlab-ci.yml  # https://gitlab.com/gitlab-org/gitlab/blob/master/lib/gitlab/ci/templates/Jobs/Deploy.gitlab-ci.yml
```

Including the template will once again kick off the pipeline, this time adding a second job to deploy to your Kubernetes cluster. 
While the use of the AutoDeploy template requires a GitLab Ultimate license, you can get one by starting a [30-day trial license](https://about.gitlab.com/free-trial/). Whether you use the AutoDeploy template or write your own build step, you can build CI/DI pipelines for your GitLab projects for free.