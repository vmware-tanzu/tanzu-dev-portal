---
title: Zero Downtime Upgrades
weight: 95
layout: single
team:
  - VMware Tanzu Labs
---

You will demonstrate how to achieve zero downtime upgrades of your
`pal-tracker` application running on *Tanzu Application Service*.

## Learning outcomes

After completing the lab, you will be able to:

- Demonstrate zero downtime upgrades on *Tanzu Application Service*.

## Getting started

Check out the
[Blue/Green](https://docs.google.com/presentation/d/1XeACqEoDSpII-nKpQhbE_6RbXGNCCFP-ivwIBmdXCyE/present#slide=id.ge9cac6b512_0_0)
slides.

### Codebase

1.  You must have completed (or fast-forwarded to) the
    [Scaling lab](../scaling/).
    You must have your `pal-tracker` application associated with the
    `scaling-availability-solution` codebase deployed and running on
    *Tanzu Application Service*.

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker` directory.

1.  Cherry-pick the start point of this lab:

    ```bash
    git cherry-pick rolling-upgrade-solution
    ```

### Monitoring

In this lab you will exercise your `pal-tracker` application under load.

You can monitor the `pal-tracker` application through the following:

-   Command Line via the following `cf` commands:

    - `cf app pal-tracker`
    - `cf events pal-tracker`

-   [*Apps Manager*](https://docs.pivotal.io/application-service/2-11/console/dev-console.html)
    user interface.

If you will monitor via command line you will need a minimum of four
terminal windows open.

If you choose to monitor with *Apps Manager* you will need only one.

## Perform a zero downtime upgrade

What if you need to perform a zero downtime upgrade?
How would you do that?

1.  If you have not already,
    stage and commit your changes from this lab locally.

1.  Pull in a script which will demonstrate a rolling upgrade:

    `git cherry-pick rolling-upgrade-solution`

    You can view the script here:

    ```bash
    git show rolling-upgrade-solution:scripts/rolling-update.sh
    ```

1.  Run a local build to compile, test and regenerate the
    `pal-tracker.jar` file:

    `./gradlew clean build`

1.  Run the script from the `pal-tracker` project directory,
    and make sure to supply the `${DOMAIN}` and `${UNIQUE_IDENTIFIER}`
    parameters you used in the *Deployment Pipelines* lab when
    specifying the route in your `manifest.yml` file:

    `./scripts/rolling-update.sh ${UNIQUE_IDENTIFIER} ${DOMAIN}`

1.  Follow the directions the script gives you to step through the
    process of a zero downtime upgrade.

## Extras

### Perform a rolling update with the `cf cli v7` client

Read about how you can use
[a newer `cf` command line client](https://docs.run.pivotal.io/cf-cli/v7.html)
to perform a rolling update:

[Rolling App Deployments](https://docs.cloudfoundry.org/devguide/deploy-apps/rolling-deploy.html)
