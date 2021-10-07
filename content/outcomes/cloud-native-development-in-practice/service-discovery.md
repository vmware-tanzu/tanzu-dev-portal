---
title: Service Discovery and Client Load Balancing
weight: 120
layout: single
team:
  - VMware Tanzu Labs
---

In this lab you will enable your applications to use
[service discovery](https://docs.pivotal.io/spring-cloud-services/2-0/common/service-registry/)
to register and locate microservices.
The applications will be using Internal Routes on
*Tanzu Application Service*.

At the end of the lab, each application will be able to discover
microservices by name, reducing the configuration needed to deploy our
system.

## Learning outcomes

After completing the lab, you will be able to:

-   Describe the pros and cons of using Service Discovery
-   Describe the pros and cons of using Client Side Load Balancing
-   Explain how to add Client Side Load Balancing and Service Discovery
    to an application
-   Identify the differences between routing through the Gorouter and
    container to container networking

## Get started

1.  Check out the
    [Concepts](https://docs.google.com/presentation/d/14P89lCFrS5Jcql1HA1lxrspMUGKnsc8R1VOQWcMUPLs/present#slide=id.ge9ceda5589_0_0)
    slides.

1.  You must have completed (or fast-forwarded to) the
    [Deploy a Distributed Application lab](../deploy-distributed-system/).
    You must have your `pal-tracker` application associated with the
    `deploy-distributed-app-solution` codebase deployed and running on
    *Tanzu Application Service*.

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker` directory.

You will make no code changes in the lab.
You will make only configuration changes to your
distributed app running on *Tanzu Application Service*.

## Configure Internal Routes

1.  Make sure your work is saved and committed to Github.

1.  Configure network policies for your consuming applications
    `tracker-allocations`, `tracker-backlog`, `tracker-timesheets` to
    talk to `tracker-registration`:

    ```bash
    cf add-network-policy tracker-allocations --destination-app tracker-registration
    cf add-network-policy tracker-backlog --destination-app tracker-registration
    cf add-network-policy tracker-timesheets --destination-app tracker-registration
    ```

1.  Find out the internal route domain for your foundation:

    ```bash
    cf domains
    ```

    look for the domain of the entry marked "Internal".

1.  Create an internal route for the `tracker-registration` application
    using the unique identifier for the host name you used in this lab,
    as well as the internal domain you found in the previous step:

    ```bash
    cf map-route tracker-registration ${INTERNAL_DOMAIN} --hostname=registration-pal-${UNIQUE_IDENTIFIER}
    ```

1.  Set the registration server endpoint configuration to point to the
    internal route:

    ```bash
    cf set-env tracker-allocations REGISTRATION_SERVER_ENDPOINT http://registration-pal-${UNIQUE_IDENTIFIER}.${INTERNAL_DOMAIN}:8080
    cf set-env tracker-backlog REGISTRATION_SERVER_ENDPOINT http://registration-pal-${UNIQUE_IDENTIFIER}.${INTERNAL_DOMAIN}:8080
    cf set-env tracker-timesheets REGISTRATION_SERVER_ENDPOINT http://registration-pal-${UNIQUE_IDENTIFIER}.${INTERNAL_DOMAIN}:8080
    ```

1.  Restart the consuming applications to pick up the new route:

    ```bash
    cf restart tracker-allocations
    cf restart tracker-backlog
    cf restart tracker-timesheets
    ```

1.  Run through the curl commands to verify the container-to-container
    integration works.

# Wrap up

Checkout the
[Implementation slides](https://docs.google.com/presentation/d/1DncxQ8_EXbhUO284pnojaC7Z_DYnGIQ5AaU8OulUrMM/present#slide=id.ge9ceda5589_0_0)
about some types of Service Discovery implementations.

Now that you have completed the lab, you will be able to:

-   Describe the pros and cons of using Service Discovery
-   Describe the pros and cons of using Client Side Load Balancing
-   Explain how to add Client Side Load Balancing and Service Discovery
    to an application
-   Identify the differences between routing through the Gorouter and
    container to container networking