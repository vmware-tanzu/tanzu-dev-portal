---
title: Deployment Pipelines
weight: 30
layout: single
team:
  - VMware Tanzu Labs
---

This lab demonstrates
[Github Actions](https://github.com/features/actions),
which provides the ability to do continuous integration/continuous
delivery (CI/CD) from within your Github projects.

In this lab you will create a pipeline to deploy an application to
Tanzu Application Services.
The lab will lead you through the anatomy of how Github Actions solve
this problem.
You can apply the same pipeline structure to other CI tools like
Concourse or Jenkins.

For the purpose of this lab there are two environments:

- Local environment (i.e. your workstation)
- Review environment (the `sandbox` space on PAS)

This is a small but realistic example of a deployment pipeline.
In your actual experience there will likely be more environments such as
a QA, staging, pre-production, etc.

When code is pushed to GitHub,
Github Actions will build, test and deploy to the review environment
automatically.
The application can be observed running on Tanzu Application Services before deciding
to deploy to production.

## Learning Outcomes

After completing the lab, you will be able to:

-   Describe CI and its importance
-   Explain configuration for different environments and why it is
    important
-   Use the CF CLI commands to manage routes for an application
-   Describe the steps of a CI build

## Get started

1.  Check out the
    [Routing](https://docs.google.com/presentation/d/1pAL1pL-KtQT4RUiAE4DdeFedzW-9U1V9Joq2hiukzho/present#slide=id.gb53c81140d_0_51)
    slides.

1.  You must have completed (or fast-forwarded to) the
    [Configuring a Spring Boot application](../configure-app/).
    You must have your `pal-tracker` application associated with the
    `configuration-solution` codebase deployed and running on TAS.

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker`
    directory.

1.  Pull in the pipeline declaration:

    ```bash
    cd ~/workspace/pal-tracker
    git cherry-pick pipeline-start
    ```

    This will pull in a Github Actions pipeline at
    `.github/workflows/pipeline.yml` file which defines the configuration
    for Github Actions.

1.  Github Actions will automatically pick up and execute the
    pipeline when you commit and push your changes in this lab.

## If you get stuck

If you get stuck within this lab,
you can either
[view the solution](../intro/#view-a-solution),
or you can
[fast-forward](../intro/#fast-forward) to the `pipeline-solution` tag.

## Configure environment variables

[Add credentials as PAL Tracker project Github secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#creating-encrypted-secrets)
for the following environment variables based on your PAS Credentials:

1.  `CF_API_URL`

1.  `CF_ORG`

1.  `CF_SPACE`

1.  `CF_USERNAME`

1.  `CF_PASSWORD`

## Understanding Routes

All requests to apps that are running on Tanzu Application Services go through a
router which holds a mapping between the route and an app.
When a request comes in, it is routed to one of the app instances in a
round robin fashion.
You have been using `--random-route` and `random-route: true` in the
class because the route an app is bound to is global to the Cloud
Foundry installation.
In other words, if one student takes the route `pal-tracker` then nobody
else is able to use that route.
Anyone asking to take the `pal-tracker` route after that would be
denied.

Apps can have multiple routes bound to them which can be useful for a
blue-green deployment strategy.

To get some familiarity with routing, run the following commands:

1.  Map another route to your app with the `map-route` command, making
    sure to view the help for the command first.
    Choose a unique hostname by following the
    [Route naming guide](../route-naming/).

1.  Navigate to both the old and new routes in a browser to check that
    both work and go to the same app.

## Configure application manifest

1.  To show that you are pushing to a review environment, change the
    `WELCOME_MESSAGE` in your `manifest.yml` to _Hello from the review
    environment_.

1.  You will also explicitly state routes for your app in your manifest
    file.
    You will differentiate your route from others in the Tanzu Application Services
    instance by following
    [this guide](../route-naming/).

1.  Set this `route` for the application in your manifest.
    Your manifest should now look similar to the solution:

    ```bash
    git show pipeline-solution:manifest.yml
    ```

    You must correctly fill-in the `${UNIQUE_IDENTIFIER}` and `${DOMAIN}`
    placeholders in the solution.

1.  Push your changes to GitHub.

    This will trigger a build of your pipeline in Github.
    Visit the Github Actions view of your project to watch the execution
    of the pipeline.

## View deployed application

After the pipeline runs, check the deployed app in your review
environment and verify that the welcome message is correct.

## Wrap up

Checkout the
[Blue/Green Deployment slides](https://docs.google.com/presentation/d/1tvXFgvV27bGYRVB3eqUIA8CcqdwjQc_HLt-0k-LrK0Y/present#slide=id.gae083b4822_0_219)
about how to use TAS routes to accomplish zero downtime upgrades.

Now that you have completed the lab, you should be able to:

-   Describe CI and its importance
-   Explain configuration for different environments and why it is
    important
-   Use the CF CLI commands to manage routes for an application
-   Describe the steps of a CI build

## Extra

If you have additional time:

1.  Try out triggered deployment to alternate (production) environments
    using
    [Github Deployments](https://developer.github.com/v3/repos/deployments/).

2.  Reimplement the pipeline with an alternate CI build infrastructure
    of your choice:
    - [Concourse](https://concourse-ci.org/)
    - [Jenkins](https://jenkins.io/2.0/)
    - [Travis CI](https://travis-ci.org/)
