---
data-featured: true
date: '2021-04-07'
description: A guide to help get your local development environment up and running.
lastmod: '2021-04-22'
link-title: Getting Started Locally
parent: Spring for Apache Geode
title: Getting Started Locally
type: data-guides
weight: 1
---

This guide walks you through setting up your local development environment using Apache Geode and a *Hello, World!* client application.    

## What is Apache Geode?

VMware GemFire, an enterprise offering, is powered by Apache Geode and adds additional enterprise functionality and integrations.  Apache Geode is the open source core of VMware GemFire.   This means that you can use Apache Geode on your local machine when developing and testing your VMware GemFire applications.


## Install Apache Geode for Local Development

There are multiple ways to install Apache Geode for local development.  We will highlight two different ways below (brew or a .zip/.tar file), however you can find [additional installation options here](https://geode.apache.org/docs/guide/13/getting_started/installation/install_standalone.html).

 ### Option 1: Using brew
 
 In a terminal run the following command:
 
 `brew install apache-geode`
 
 This will install the most recent version of Apache Geode.

### Option 2: Download a .zip or .tar file.

1. Download the .zip or .tar file from the [Apache Releases page](https://geode.apache.org/releases/).
2.  Unzip or expand the file.
3. Add the Geode bin directory to your PATH environment variable.
     
     **macOS/Unix/Linux**
     ```
    PATH=$PATH:$JAVA_HOME/bin:path_to_product/bin
    export PATH
    ```
    
     **Windows**
    `set PATH=%PATH%;%JAVA_HOME%\bin;path_to_product\bin`

### Check your installation

In a terminal type

```gfsh version```

You should see something similar to

```
gfsh version
1.13.1
```

Apache Geode is now installed on your machine.

---

## Set Up Your Local Environment

This section will guide you through testing a *Hello, World!* client app on your local machine to confirm that your local environment is set up correctly.


### What You'll Need
* The [Hello, World!](https://github.com/gemfire/spring-for-apache-geode-examples/tree/main/hello-world) example.
* JDK 8 or 11
* Spring Boot 2.1 or above
* Spring Boot for Apache Geode 
* Apache Geode installed on your local machine.

### 1. Download the Hello, World! Example

Clone the *Hello, World!* app from the VMware GemFire [examples repo](https://github.com/gemfire/spring-for-apache-geode-examples). 

```
$ git clone https://github.com/gemfire/spring-for-apache-geode-examples.git
```

### 2. Start an Apache Geode Cluster

{{% alert title="Required" color="warning" %}}
Make sure that you have installed Apache Geode on your machine before proceeding.
{{% /alert %}} 

This will start a small local cluster for the *Hello, World!* app to connect.   

* In a terminal start the Geode Shell (gfsh)

    ```
    gfsh
    ```
* Start a **locator**.  Locators provide both discovery and load balancing services. 

    ```
    start locator --name=hello-world-locator
    ```
* Start a server.  Servers are primarily used to store data in **regions** (similar to a table in a relational database. 

    ```
    start server --name=hello-world-server
    ```

* Once those commands have finished you can run the `list members` command and you should see something similar to

```
Member Count : 2

       Name         | Id
------------------- | ---------------------------------------------------------------------------
hello-world-locator | 192.168.1.14(hello-world-locator:33323:locator)<ec><v0>:41000 [Coordinator]
hello-world-server  | 192.168.1.14(hello-world-server:33423)<v1>:41001
```


### 3. Build and Run the App

In a different terminal, navigate to the working directory of `spring-for-apache-geode-examples/hello-world`, and build the application

```
./gradlew build
```

then run the application

```
./gradlew bootRun
```

*We are running a Gradle task so you will most likely see the executing progress bar stop around 75% when the app is up and running.*

Now that the application has started, open a browser and go to **(http://localhost:8080)**.

You should see something similar to the below, which represents an artificial time delay simulating a database query.

> key: hello
>
>value: 2019-10-01T16:17:51.557 (this will be your current date & time)
>
>time to look up: 3057ms (quantity of time that it took to acquire the key-value pair).


**Refresh the page** and you should see something similar to

> key: hello
>
>value: 2019-10-01T16:17:51.557 (this will be your current date & time)
>
>time to look up: 6ms (quantity of time that it took to acquire the key-value pair).

Note that the ***time to look up*** has been significantly reduced. This represents the app getting the information from the cache (Apache Geode), instead of querying the database.

To confirm that your app is connected to your local cluster, in your **gfsh** terminal run the following commands

* List the regions
    ```
    list regions
    ```
    
    You should see something similar to this, which shows that a region with the name *Hello* was created.
    
    ```
    List of regions
    ---------------
    Hello
    ```

* Confirm the web page timestamp has the same value as that stored in your *Hello* region. Run the *gfsh* command

    ``
    get --key hello --region=/Hello
    ``
    
    You should see something similar to this, where the "Value" listed in your terminal should match the "value" shown on the web page. 
    
    **Response from the gfsh command**
    ```
    Result      : true
    Key Class   : java.lang.String
    Key         : hello
    Value Class : java.lang.String
    Value       : "2020-12-08T13:46:47.322"
    ```
    
    **Shown on the Page**
    ```
    key: hello
    value: 2020-12-08T13:46:47.322
    time to look up: 2ms
    ```

### 4. Stop the App and Tear Down the Apache Geode Cluster

* Stop the *Hello, World! app. 
* Then shutdown the Apache Geode cluster - this will stop the locator and server, and delete any data you may have in the cluster. 

    In your gfsh terminal run the following command 

    ```
    shutdown --include-locators=true
    ```
* Exit gfsh by typing `exit`.

**Congratulations! Your local environment is set up and ready to develop with.**

---

 ## Learn More
 
 Now that you have successfully set up your local development environment, check out some other guides
  
 * Set up your [VMware GemFire service instance](/data/tanzu-gemfire/guides/get-started-tgf4vms-sbdg/) on the Tanzu Application Service. 

 * Set up [VMware GemFire for Kubernetes](/data/tanzu-gemfire/guides/get-started-tgf4k8s-sbdg/). 
  
 * You can get started by implementing the [cache-aside pattern](/data/tanzu-gemfire/guides/cache-aside-pattern-sbdg) which will improve the read performance of your application. 
 
* Create an application that utilizes Spring Boot for Apache Geode and Spring Session for [session state caching](/data/tanzu-gemfire/guides/session-state-cache-sbdg).