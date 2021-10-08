---
title: Deployment Pipelines
weight: 30
layout: single
team:
  - VMware Tanzu Labs
---

This lab demonstrates
[GitHub Actions](https://github.com/features/actions),
which provides the ability to do continuous integration/continuous
delivery (CI/CD) from within your GitHub projects.

In this lab you will create a pipeline to deploy an application to
*Tanzu Application Service*.
The lab will lead you through the anatomy of how GitHub Actions solve
this problem.
You can apply the same pipeline structure to other CI tools like
Concourse or Jenkins.

For the purpose of this lab there are two environments:

- Local environment (i.e. your workstation)
- Review environment (the `sandbox` space on *Tanzu Application Service*)

This is a small but realistic example of a deployment pipeline.
In your actual experience there will likely be more environments such as
a QA, staging, pre-production, etc.

When code is pushed to GitHub,
GitHub Actions will build, test and deploy to the review environment
automatically.
The application can be observed running on *Tanzu Application Service*
before deciding to deploy to production.

## Learning outcomes

After completing the lab, you will be able to:

-   Describe *Continuous Integration* and *Continuous Delivery*
    and their importance
-   Explain configuration for different environments and why it is
    important
-   Use CLI commands to manage routes for an application
-   Describe the steps of an automated *Continuous Integration* build

## Get started

1.  Review the
    [Routing](https://docs.google.com/presentation/d/1pAL1pL-KtQT4RUiAE4DdeFedzW-9U1V9Joq2hiukzho/present#slide=id.gb53c81140d_0_51)
    slides.

1.  You must have completed (or fast-forwarded to) the
    [Configuring a Spring Boot application](../configure-app/).
    You must have your `pal-tracker` application associated with the
    `configuration-solution` codebase deployed and running on
    *Tanzu Application Service*.

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker`
    directory.

1.  Pull in the pipeline declaration:

    ```bash
    cd ~/workspace/pal-tracker
    git cherry-pick pipeline-start
    ```

    This will pull in a GitHub Actions pipeline at
    `.github/workflows/pipeline.yml` file which defines the configuration
    for GitHub Actions.

1.  GitHub Actions will automatically pick up and execute the
    pipeline when you commit and push your changes in this lab.

## If you get stuck

If you get stuck during this lab,
you can either
[view the solution](../intro/#view-a-solution),
or you can
[fast-forward](../intro/#fast-forward) to the `pipeline-solution` tag.

You may also wish to look at the [Hints](#hints) section for some
further guidance.

## Configure environment variables

[Add credentials as **pal-tracker** project GitHub repository secrets](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository)
for the following environment variables based on your *Tanzu Application Service* credentials:

1.  `CF_API_URL`

1.  `CF_ORG`

1.  `CF_SPACE`

1.  `CF_USERNAME`

1.  `CF_PASSWORD`

## Understanding routes

All requests to apps that are running on *Tanzu Application Service*
go through a router which holds a mapping between the route and an app.
When a request comes in, it is routed to one of the app instances in a
round-robin fashion.
You have been using `--random-route` and `random-route: true` in the
class because the route an app is bound to is global to the
*Tanzu Application Service* installation.
In other words, if one user takes the route `pal-tracker` then nobody
else is able to use that route.
Anyone asking to take the `pal-tracker` route after that would be
denied.

Apps can have multiple routes bound to them which can be useful for a
blue-green deployment strategy.

To get some familiarity with routing, run the following commands:

1.  Map another route to your app with the `cf map-route` command,
    making sure to view the help for the command first.
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
    You will differentiate your route from others in
    *Tanzu Application Service* by following
    [this guide](../route-naming/).

1.  Set this `route` for the application in your manifest.
    Your manifest should now look similar to the solution:

    ```bash
    git show pipeline-solution:manifest.yml
    ```

    You must correctly fill-in the `${UNIQUE_IDENTIFIER}` and `${DOMAIN}`
    placeholders in the solution.

1.  Push your changes to GitHub.

    This will trigger a build of your pipeline in GitHub.
    Visit the GitHub Actions view of your project to watch the execution
    of the pipeline.

## View deployed application

After the pipeline runs, check the deployed app in your review
environment and verify that the welcome message is correct.

## Wrap up

Now that you have completed the lab, you should be able to:

-   Describe *Continuous Integration* and *Continuous Delivery*
    and their importance
-   Explain configuration for different environments and why it is
    important
-   Use CLI commands to manage routes for an application
-   Describe the steps of an automated *Continuous Integration* build

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

## Hints

### How do you map additional routes?

The `cf map-route` command can be a little confusing until you
understand that a route consists of two parts, known as the hostname
and the domain.
This is explained in [the route naming guide](../route-naming/).
If you haven't read that already, it is worth doing so now.

To recap, a foundation may support multiple domains, which you can list
with the `cf domains` command.
There will usually be at least one "shared" domain, that is not
marked as "internal".
This domain will form part of the route to your app that was
generated when you pushed it to *Tanzu Application Service*.
Your app route may be something like this:

```bash
pal-tracker-dangerous-dingo-ab.apps.tas.example.com
```

The domain here is `apps.tas.example.com`.
The hostname component is `pal-tracker-dangerous-dingo-ab`.

To map a new route, you might do something like this:

```bash
cf map-route pal-tracker apps.tas.example.com --hostname my-tracker
```

That would result in a new route, `my-tracker.apps.tas.example.com`.

### What should you do if the GitHub actions are failing?

If your GitHub pipeline is failing the first thing to do is to drill
down through the interface to find out exactly which steps are failing.
You can click on each job, and then see the steps within that.
Clicking on the steps will show you the output from that step.

### What should you do if the `deploy` job is failing?

The most common cause of errors is a misconfiguration of the
environment variables.

The various environment variables starting with `CF_` should
reflect the values that you use to login to your
*Tanzu Application Service* foundation.
The `CF_API_URL` is the value that you used with the `-a` option
at login.
You can find values for `CF_ORG` and `CF_SPACE` by running `cf target`.
The `CF_USERNAME` and `CF_PASSWORD` values should be obvious!

Beware that once you have set the values in GitHub you cannot see
them again, only replace them.
In particular, be careful to make sure that you have not included any
extra spaces in the values.

### What happens if your *Tanzu Application Service* foundation is not accessible from GitHub?

You will have seen that the GitHub actions use the `cf` CLI to login
to your foundation, in order to deploy your app.
If your foundation is not accessible from the Internet, then the GitHub
actions will not be able to complete successfully.

In this case you will need to remove those steps from the `pipeline.yml`
file.
There is, however, still value to running the rest of the build in a
completely separate environment as it may catch issues with your code
that do not show up because of your local machine's configuration.
