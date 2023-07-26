---
title: Improving your Local DevX With Containerization
description: Using Docker to reduce development environment complexity when building application services locally
date: "2023-02-23"
lastmod: "2023-02-23"
tags:
- Containers
- Docker
- Docker Compose
- DevX
topics:
- Containers
- Networking
- Docker
- Docker Compose
- DevEx
- DevX
- DX
team:
- Andre Browne
- Liam Morley
featured: false
level1: Building Modern Applications
level2: Modern Development Practices
---

Imagine you're working on a service within a [cloud native](https://tanzu.vmware.com/developer/guides/what-is-cloud-native/) distributed system, but acceptance testing is taking forever! You'd like to know if your changes work in harmony with other services, but running everything on your machine will potentially require numerous compilation tools and eat through your system's resources. You could deploy your service to a cloud-based environment, but that would take a long time. What should you do? You can't just skip testing, you're a responsible developer!

## Approaches to developing in a multi-service ecosystem

There are a few approaches to solving this problem, each having their own tradeoffs:

* __Running your services locally.__ This entails building and running multiple services directly on your workstation. This requires disk space, memory, CPU, and eventually might consume enough resources to render the workstation inoperable. In addition, it can require compilation tools and run-time environments for any of the first-party services. Furthermore, any third-party services (e.g. databases, message queues) will need to be set up in order to run everything locally.
* __Running your services in the cloud.__ This entails deploying one or more services to the cloud every time you want feedback. This approach enables you to validate your services in an environment that more closely resembles your production environment. However, it might be the most time intensive, and will require infrastructure to support deploying your services.
* __A hybrid of local and cloud.__ This entails configuring any locally running services to communicate with the services that you have deployed to the cloud. The hybrid approach has some of the advantages and disadvantages of the previous two approaches, and also can require managing proxying, firewall, and other network configuration.
* __A hybrid of local and containerization.__ Containerization allows you to run services on a virtual machine in a custom environment pre-configured for each service. This approach removes some of the complexities and disadvantages of the other approaches, allows you to test your service locally, abstracts away the configuration and dependencies of each service, and mitigates some of the resource impacts of running all services locally.

This guide covers the hybrid of local and containerization using __Docker__ as our virtual environment. You can use Docker to put your dependencies (e.g. compilers, runtimes, even entire databases) in a box, called a container, so that your only dependency is on Docker itself, and not the myriad of dependencies that each individual application service might have.

Whether you're brand new to Docker, or have worked with it for decades, there are some questions you inevitably run into: how do I create these containers? And where can I put them? A popular method is to build the containers using an [automated CI/CD pipeline](https://tanzu.vmware.com/developer/learningpaths/secure-software-supply-chain/what-is-ci-cd/), and then store them in a [container registry](https://tanzu.vmware.com/developer/learningpaths/secure-software-supply-chain/container-registry/). Container Management is an extensive topic, and out of scope for this guide. This guide uses basic containers, with some basic build dependencies, and without any customization.

This guide walks you through step-by-step instructions for using Docker to containerize inter-dependent services, and then confirming that communication is occurring between the services on your workstation and a service running within Docker.

## Prerequisites

This guide requires the following tools, applications and environment:

* [Docker](https://www.docker.com/)
* Docker Compose (Usually installed with Docker * depending on your Operating System)
* [Git](https://git-scm.com/downloads)
* Java 17 or later
* TCP Port availability for port numbers `8888`, `8889`, and `48081`
* [Postman](https://www.postman.com/downloads/), [curl](https://curl.se/) or similar tool capable of executing a HTTP POST request

## Launching the Sample Application Services

To illustrate communication between local and containerized services, this guide has an accompanying repository of three services mimicking a banking domain. Our three services are:

1. __Debit Service__ - This service allows bank customers to perform transactions
1. __Account Service__ - This service can support balance inquiries, deposits, and withdrawals
1. __Audit Service__ - This service logs any requests it receives

This guide illustrates running two of these services on your local computer, and the third service virtually, demonstrating communication between both local and virtual systems.

> ___NOTE:___ While the steps in this guide work with any operating system, the commands below assume a Mac or Linux environment. If you're running on Windows or any other operating system, you may need to tweak commands to suit your needs.

You are ready to start!

1. Start the Docker Engine, if necessary. This ensures that the virtual environment is running. To check, execute the following command:

   ```shell
   docker info
   ```

   If your Docker Engine is not running, you will receive an error similar to:

   ```shell
   ERROR: Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
   ```

1. Clone the repository, located at <https://github.com/vmware-tanzu-labs/simple-distributed-bank-services-demo>:
   ```shell
   git clone https://github.com/vmware-tanzu-labs/simple-distributed-bank-services-demo
   ```

1. Run the Account Service inside a virtual environment using the following command:

   ```shell
   docker compose up account-service
   ```

   This command takes a while to download everything needed to run the container. However you do not need to wait here. You can proceed to the next step. When the service is ready to receive a request, a message similar to the following log entry appears in the console:

   ```shell
   AccountServiceApplication        : Started AccountServiceApplication in 2.656 seconds (process running for 2.984)
   ```

1. Run the Debit Service locally by using the following commands:

    ```shell
   cd debit-service
   SERVER_PORT=8889 ACCOUNT_SERVICE_URL=http://localhost:48081 AUDIT_SERVICE_URL=http://localhost:8888 ./gradlew bootRun
   ```

   This creates a long-running process. When the service is ready to receive a request, a message similar to the following log entry appears in the console:

   ```shell
   DebitServiceApplication        : Started DebitServiceApplication in 2.656 seconds (process running for 2.984)
   ```

   You'll need to run this in a dedicated terminal session. This guide assumes you'll use dedicated terminal sessions for each task.

   The command to start this service specifies three [environment variables](https://12factor.net/config) used to configure how it will run:
   * __SERVER_PORT__ dictates that the Debit Service will run on port `8889`.
   * __ACCOUNT_SERVICE_URL__ specifies that the Debit Service will communicate with the Account Service using a host address and port of `localhost:48081`. __`48081` is the port that Docker exposes to the local workstation to allow communication into the account-service container, and ultimately, the account service.__
   * __AUDIT_SERVICE_URL__ specifies that the Debit Service will communicate with the Audit Service using a host address and port of `localhost:8888`.
1. Run the Audit Service locally on a different port, via the following commands:

   ```shell
   cd audit-service
   SERVER_PORT=8888 ./gradlew bootRun
   ```

   When the service is ready to receive a request, a message similar to the following log entry appears in the console:

    ```shell
    AuditServiceApplication        : Started AuditServiceApplication in 2.656 seconds (process running for 2.984)
   ```

   The command to start this service specifies one environment variable used to configure how it will run:
   * __SERVER_PORT__ dictates that the Audit Service will run on port `8888`.
1. Verify that the 3 services started successfully and are ready to receive requests
1. Make a request against the Debit Service. You can make the request in multiple ways. (e.g. Curl, Postman, etc.). Using curl to make the request, execute the following command:

   ```shell
   curl --verbose --location --request POST 'localhost:8889/purchase' --header 'Content-Type: application/json' --data-raw '{ "amount": 10000 }'
   ```

1. Inspect the Audit Service console. The request in the previous step results in the Debit Service sending a DEBIT type request to the Audit Service, and the Account Service sending a TRANSACTION type request to the Audit Service. In the console you should see:

   ```shell
   {type=DEBIT, status=SUCCESS, amount=10000}
   {type=TRANSACTION, status=SUCCESS, amount=10000}
   ```

## Explaining the Magic

After completing the steps above the Account Service, running as a containerized service in Docker, communicated with the Audit Service, running locally on your workstation. But how does this work?

![Service Architecture](images/diagrams/service-architecture.png 'Service Architecture')

In Step 5 you executed a command that started the Account Service. This application, like the others that run locally, requires configuration. The [docker-compose.yml](https://github.com/vmware-tanzu-labs/simple-distributed-bank-services-demo/blob/main/docker-compose.yml) file stores this configuration for the Account Service container in the `account-service` section of `services`. It looks like this:

```yaml
services:
  account-service:
    image: gradle:7.6.0-jdk17
    command: "./gradlew clean bootRun"
    environment:
      - AUDIT_SERVICE_URL=http://host.docker.internal:8888
      - SERVER_PORT=8081
    ports:
      - 48081:8081
    working_dir: /account-service
    volumes:
      - ./account-service:/account-service
```

By configuring the `AUDIT_SERVICE_URL` as `host.docker.internal:8888`, this allows the containerized application to communicate with the applications running locally. __Herein lies the magic!__ The domain `host.docker.internal` maps to a special network address provided by Docker to allow containers to access the host network on the workstation.

>___NOTE:___ `host.docker.internal` is a specific Docker feature available only for Windows and MacOS. Docker for Linux provides access to the host network via [a different mechanism](https://docs.docker.com/network/drivers/host/).

## Conclusion

Developing Cloud Native applications provides many benefits and some challenges. As your suite of Cloud Native applications and their associated service dependencies grow this can also impact your [Developer Experience (DevX)](https://via.vmw.com/MFrAK3) in undesirable ways.

Today, you learned how to configure and use Docker to support your development efforts while minimizing, or potentially even eliminating, the need to understand how to configure and run every dependency required to test and validate your application.

>___NOTE:___ Due to Docker’s licensing requirements and some compatibility issues with Apple’s silicon (e.g. M1, M2), the approach we describe in this guide may be inaccessible for some. Luckily, [Podman](https://podman.io) is a very capable alternative for container and image management while providing similar network configuration.

## Credits

Thanks to Amanda White, Brian Watkins, Will Sather, Al Bonney, and Chris Gunadi, who contributed their time and insights in support of this guide.

## Helpful Links

[Docker Docs - Get Docker](https://docs.docker.com/get-docker/)

[Docker Docs - Install Docker Compose](https://docs.docker.com/compose/install/)

[Docker Docs - Get started](https://docs.docker.com/get-started/)

[Docker Docs - I want to connect from a container to a service on the host](https://docs.docker.com/desktop/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host)

[Tanzu Developer Center - Secure Software Supply Chains Learning Path](https://tanzu.vmware.com/developer/learningpaths/secure-software-supply-chain/)

[Podman - Installation Instructions](https://podman.io/docs/installation)

[Podman - Getting Started](https://podman.io/get-started)

[Podman - Basic Networking](https://github.com/containers/podman/blob/main/docs/tutorials/basic_networking.md)
