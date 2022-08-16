---
data-featured: false
date: '2022-08-15'
description: How to set up a Tanzu GemFire instance on Kubernetes.
lastmod: '2022-08-15'
link-title: Getting Started with Tanzu GemFire for Kubernetes
parent: Spring for Apache Geode
title: Getting Started with Tanzu GemFire for Kubernetes
type: data-guides
weight: 3
---

This guide walks you through creating and testing a Tanzu GemFire cluster on Kubernetes using a *Hello, World!* client application.


## Before you start!
This guide assumes that the [Tanzu GemFire Operator](https://docs.vmware.com/en/VMware-Tanzu-GemFire-for-Kubernetes/2.0/tgf-k8s/GUID-install.html) has been installed in your Kubernetes cluster. 

In order to create a GemFire cluster, you will need a [Tanzu Net](https://network.pivotal.io/products/tanzu-gemfire-for-kubernetes/) account, in order to pull the image from the registry. 

You will also need permission to use `kubectl`. 
 

## Create A Tanzu GemFire Cluster

1. Verify that you are in the Kubernetes cluster you want to use for Tanzu GemFire

    ```
    kubectl config current-context
    ```
   
   
2. Create a namespace for the Tanzu GemFire cluster (We use the creative *namespace* name of `tanzu-gemfire` for this example)
    
    ```
    kubectl create namespace tanzu-gemfire
    ```
   
   
3. Create an image pull secret that will be used to pull down the Tanzu GemFire images needed to create the cluster

    ```
    $ kubectl create secret docker-registry image-pull-secret --namespace=tanzu-gemfire --docker-server=registry.tanzu.vmware.com --docker-username='TANZU NET USERNAME' --docker-password='TANZU NET PASSWD'
    ```  
     
   * Replace `tanzu-gemfire` with the name of your namespace, if different.
   * Replace `TANZU NET USERNAME` with your Tanzu Net Username
   * Replace `TANZU NET PASSWD` with your Tanzu Net Password
     

4. Create your Tanzu GemFire CRD file. 
    
    Below is a simple yaml file that will create a Tanzu GemFire cluster named `hello-world-gemfire-cluster` with 1 [locator](https://docs.vmware.com/en/VMware-Tanzu-GemFire/9.15/tgf/GUID-configuring-running-running_the_locator.html) and 2 [servers](https://docs.vmware.com/en/VMware-Tanzu-GemFire/9.15/tgf/GUID-configuring-running-running_the_cacheserver.html). Save this as a YAML file in your current working directory.
    
  ```yaml
    apiVersion: gemfire.tanzu.vmware.com/v1
    kind: GemFireCluster
    metadata:
        name: hello-world-gemfire-cluster
    spec:
        image: registry.tanzu.vmware.com/pivotal-gemfire/vmware-gemfire:9.15.1
  ```
   
        
> For the full list of GemFire CRD configuration options and explanations check out the Tanzu GemFire [Customer Resource Definition template](https://docs.vmware.com/en/VMware-Tanzu-GemFire-for-Kubernetes/2.0/tgf-k8s/GUID-crd.html).
    
   
5. Apply your Tanzu GemFire CRD YAML from *Step 4* to create the Tanzu GemFire cluster

    ```
    kubectl --namespace=tanzu-gemfire apply -f CLUSTER-CRD-YAML
    ``` 
    * Replace `tanzu-gemfire` with the name of your namespace, if it's different.
    * Replace `CLUSTER-CRD-YAML` with the name of the yaml file you created. 
   
   
   
6.  If successful you should see in your terminal

    ` gemfirecluster.gemfire.tanzu.vmware.com/hello-world-gemfire-cluster created`      



7. Confirm that Tanzu GemFire is up and ready to use
    
    ```
    kubectl --namespace=tanzu-gemfire get GemFireClusters
    ```
   * Replace `tanzu-gemfire` with the name of your namespace, if it's different.
   

   When the cluster is ready to use the output should look similar to
    
    ```
    NAME                          LOCATORS   SERVERS
    hello-world-gemfire-cluster   1/1        2/2
    ```
   Where the `NAME` will be the value you have for the `name` entry in your CRD file from *Step 4* . 
        
---

## Run a Spring Boot for Apache Geode app on Kubernetes

This section will guide you through testing a *Hello, World!* client application, that utilizes Spring Boot for Apache Geode.

### What You'll Need

* The [Hello, World!](https://github.com/gemfire/spring-for-apache-geode-examples/tree/main/hello-world) example.
* JDK 8 or 11
* Spring Boot 2.3 or above
* Spring Boot for Apache Geode 1.3 or above
* A running Tanzu GemFire cluster on Kubernetes
* [Docker](https://docs.docker.com/get-docker/) installed 
* An image repository for the `Hello, World!` example.


###  1. Download the Hello, World! Example

Clone the Hello, World! app from the [examples repo](https://github.com/gemfire/spring-for-apache-geode-examples). 

```
$ git clone https://github.com/gemfire/spring-for-apache-geode-examples.git
```

### 2. Edit the `application.properties` File 

* Navigate to the `spring-for-apache-geode-examples/hello-world` directory. 
* Open the `application.properties`. 
* Uncomment the two listed properties.
* Replace the value for `spring.data.gemfire.pool.locators:` with your Tanzu GemFire cluster information, for each locator (in this example we only have one locator).  The information will follow the form:

   ```
   [GEMFIRE-CLUSTER-NAME]-locator-[LOCATOR-NUMBER].[GEMFIRE-CLUSTER-NAME]-locator.[NAMESPACE-NAME][10334]
   ```
    For our example the value looks like this:

    ```
    spring.data.gemfire.pool.locators: hello-world-gemfire-cluster-locator-0.hello-world-gemfire-cluster-locator.tanzu-gemfire[10334]
    ```

  
* Replace the value for `spring.data.gemfire.management.http.host:` with your Tanzu GemFire cluster information.  This will allow Spring Boot for Apache Geode to push your [initial cluster configuration](https://docs.spring.io/autorepo/docs/spring-boot-data-geode-build/current/reference/html5/#geode-configuration-declarative-annotations-productivity-enableclusteraware) to GemFire.  The information follows a similar form as above:

   ```
   [GEMFIRE-CLUSTER-NAME]-locator-[LOCATOR-NUMBER].[GEMFIRE-CLUSTER-NAME]-locator.[NAMESPACE-NAME][GEMFIRE LOCATOR PORT]
   ```
    For our example the value looks like this:
    
     ```
      spring.data.gemfire.management.http.host: hello-world-gemfire-cluster-locator-0.hello-world-gemfire-cluster-locator.tanzu-gemfire
     ```
      
### 3. Build a Docker Image with Gradle or Maven

Starting with Spring Boot 2.3, you can now customize and create an OCI image using Spring Boot. In this example we're using the [Gradle - packaging OCI images option](https://docs.spring.io/spring-boot/docs/current/gradle-plugin/reference/htmlsingle/#build-image).  If you are using Maven check out the instructions found [here](https://docs.spring.io/spring-boot/docs/current/maven-plugin/reference/htmlsingle/#build-image).

* In a terminal, navigate to the `hello-world` directory.
* Build the application with `./gradlew clean build`
* Open the `build.gradle` file and update the `bootBuildImage` section, with your Docker repository information. This will build an image with the name `docker.io/[docker username]/hello-world:0.0.1-SNAPSHOT`.  
* Build the image with `./gradlew bootBuildImage`


### 4. Push your Docker Image to Docker Hub

For this example, we're using Docker Hub as our registry. This will create a repository on Docker Hub called `hello-world` and push the image we created into that repository.

In a terminal
* Login to your Docker account
* Run the `docker push [IMAGE NAME HERE]`.  For this example it should be similar to this

    ```
    docker push docker.io/[YOUR DOCKER USERNAME]/hello-world:0.0.1-SNAPSHOT
    ```

### 5. Create a deployment in your Kubernetes cluster

Create a Kubernetes deployment for your *Hello, World!* app. This will create a deployment, replicaset, and pod using the hello-world image we created above.

   ```
     kubectl --namespace=tanzu-gemfire create deployment hello-world-deployment --image=docker.io/[YOUR DOCKER USERNAME]/hello-world:0.0.1-SNAPSHOT
   ```  
If successful you should see `deployment.apps/hello-world-deployment created`

### 6. Create a LoadBalancer to access the app
In order to access `Hello, World!` app from a browser, we need to expose the deployment.

```
kubectl --namespace=tanzu-gemfire expose deployment/hello-world-deployment --type="LoadBalancer" --port=80 --target-port=8080
```

> If you're trying this locally with MiniKube, you will need to replace `LoadBalancer` with `NodePort`.

### 7.  Access the Hello, World! Application

Once the Load Balancer has been created, you can now access the *Hello, World!* application using the `External IP` on the LoadBalancer service.

```
kubectl -n tanzu-gemfire get services
``` 

This should output something similar to

```
NAME                                  TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)              AGE
hello-world-deployment                LoadBalancer   10.0.227.199   20.62.226.18   80:31350/TCP         57s
hello-world-gemfire-cluster-locator   ClusterIP      None           <none>         10334/TCP,4321/TCP   132m
hello-world-gemfire-cluster-server    ClusterIP      None           <none>         40404/TCP,4321/TCP   131m
```

In your browser, go to the `EXTERNAL-IP` of the `hello-world-deployment`. 
 
You should see something similar to this, which represents an artificial time delay simulating a database query.
 
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

Note that the ***time to look up*** has been significantly reduced. This represents the app getting the information from the cache, Tanzu GemFire, instead of querying the database.


### 8.  Confirm that the Hello, World! App is connected
If you would like to confirm that your Bike Incident app is actually connected to your Tanzu GemFire cluster you can connect through the Tanzu GemFire / Apache Geode shell - commonly referred to as *gfsh*

In a terminal

* Start gfsh for kubernetes
    ```
    kubectl -n tanzu-gemfire exec -it GEMFIRE-CLUSTER-NAME-locator-0 -- gfsh
    ```  

  * Replace `tanzu-gemfire` with the name of your namespace, if it's different.
  * Replace `GEMFIRE-CLUSTER-NAME` with the name of your Tanzu GemFire cluster. 

* Once you see that `GFSH` has started, connect to your cluster with the `connect` command

    ```
    gfsh> connect
    ``` 
* Once connected run the `list regions` command

    ```
    gfsh> list regions
    ``` 

You should see something similar to

  ```
    List of regions
    ------------------
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
    
   **Shown on the Webpage**
   
   ```
    key: hello
    value: 2020-12-08T13:46:47.322
    time to look up: 2ms
   ```

**Congratulations! You’re ready to start using Tanzu GemFire.**

---


## Delete the Hello, World! app

To delete the *Hello, World!* app you will need to delete the deployment and the service.  

This will remove the *Hello, World!* deployment, replicaset, and pod.

```
kubectl -n tanzu-gemfire delete deployment hello-world-deployment
```

This will remove the *Hello, World!* service.

```
kubectl -n tanzu-gemfire delete service hello-world-deployment
```

---

## Delete the Tanzu GemFire Cluster

If you need to delete your Tanzu GemFire cluster, first remove the cluster

  ```
  kubectl -n tanzu-gemfire delete GemFireCluster hello-world-gemfire-cluster
  ```
   * Replace `tanzu-gemfire` with your namespace if different.
   * Replace `hello-world-gemfire-cluster` with the name of your GemFire instance if different.       

When the Tanzu GemFire cluster has been completely deleted, remove the persistent volume claims of the Kubernetes cluster. These are disk claims that Kubernetes makes on the underlying system. 

   ```
    kubectl -n tanzu-gemfire get persistentvolumeclaims
   ```
    
   * Replace `tanzu-gemfire` with your namespace if different.

Then delete each persistent volume claim listed.

   ```
    kubectl -n tanzu-gemfire delete persistentvolumeclaim PVC_NAME_1 PVC_NAME_2 PVC_NAME_3 ...
   ```
   * Replace `tanzu-gemfire` with your namespace if different.
   * Replace `PVC_NAME_1 PVC_NAME_2 PVC_NAME_3` with each persistent volume claim listed.

---

 ## Learn More
 
 Now that you have successfully created a running Tanzu GemFire cluster on Kubernetes, check out some other guides.
 
 * You can get started by implementing the [cache-aside pattern](/data/tanzu-gemfire/guides/cache-aside-pattern-sbdg) which will improve the read performance of your application. 
  
 * Create an application that utilizes Spring Boot for Apache Geode and Spring Session for [session state caching](/data/tanzu-gemfire/guides/session-state-cache-sbdg).