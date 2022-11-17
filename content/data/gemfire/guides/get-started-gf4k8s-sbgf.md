---
data-featured: false
date: '2022-08-15'
description: How to set up a VMware GemFire instance on Kubernetes.
lastmod: '2022-08-15'
link-title: Getting Started with VMware GemFire for Kubernetes
parent: Spring for VMware GemFire
title: Getting Started with VMware GemFire for Kubernetes
type: data-guides
weight: 3
aliases:
    - get-started-tgf4k8s-sbdg/
---

This guide walks you through creating and testing a VMware GemFire cluster on Kubernetes using a *Hello, World!* client application.


## Before you start!
This guide assumes that the [VMware GemFire Operator](https://docs.vmware.com/en/VMware-Tanzu-GemFire-for-Kubernetes/2.0/tgf-k8s/GUID-install.html) and a **cert-manager** have been installed in your Kubernetes cluster. 

In order to create a GemFire cluster, you will need a [Tanzu Net](https://network.pivotal.io/products/tanzu-gemfire-for-kubernetes/) account, in order to pull the GemFire image from the registry. 

You will also need permission to use `kubectl`. 
 

## Create A VMware GemFire Cluster

1. Verify that you are in the Kubernetes cluster you want to use for VMware GemFire

    ```
    kubectl config current-context
    ```
   
   
2. Create a namespace for the VMware GemFire cluster (We use the creative *namespace* name of `gemfire-cluster` for this example)
    
    ```
    kubectl create namespace gemfire-cluster
    ```
   
   
3. Create an image pull secret that will be used to pull down the VMware GemFire images needed to create the cluster

    ```
    $ kubectl create secret docker-registry image-pull-secret --namespace=gemfire-cluster --docker-server=registry.tanzu.vmware.com --docker-username='TANZU NET USERNAME' --docker-password='TANZU NET PASSWD'
    ```  
     
   * Replace `--namepsace=gemfire-cluster` with the name of your namespace, if different.
   * Replace `--docker-username='TANZU NET USERNAME'` with your Tanzu Net Username
   * Replace `--docker-password='TANZU NET PASSWD'` with your Tanzu Net Password
     

4. Create your VMware GemFire CRD file. 
    
    Below is a simple yaml file that will create a VMware GemFire cluster named `hello-world-gemfire-cluster` with 1 [locator](https://docs.vmware.com/en/VMware-Tanzu-GemFire/9.15/tgf/GUID-configuring-running-running_the_locator.html) and 2 [servers](https://docs.vmware.com/en/VMware-Tanzu-GemFire/9.15/tgf/GUID-configuring-running-running_the_cacheserver.html), with TLS turned off. Save this as a YAML file in your current working directory.
    
      ```yaml
      apiVersion: gemfire.vmware.com/v1
      kind: GemFireCluster
      metadata:
        name: hello-world-gemfire-cluster
      spec:
        image: registry.tanzu.vmware.com/pivotal-gemfire/vmware-gemfire:9.15.3
        security:
          tls: {}
      ```
   
        
> For the full list of GemFire CRD configuration options and explanations check out the VMware GemFire [Customer Resource Definition template](https://docs.vmware.com/en/VMware-Tanzu-GemFire-for-Kubernetes/2.0/tgf-k8s/GUID-crd.html).
    
   
5. Apply your VMware GemFire CRD YAML from *Step 4* to create the VMware GemFire cluster

    ```
    kubectl -n gemfire-cluster apply -f CLUSTER-CRD-YAML
    ``` 
    * Replace `-n gemfire-cluster` with the name of your namespace, if it's different.
    * Replace `CLUSTER-CRD-YAML` with the name of the yaml file you created in Step 4. 
   
      
6.  If successful you should see in your terminal

    `gemfirecluster.gemfire.vmware.com/hello-world-gemfire-cluster created`      



7. Confirm that VMware GemFire is up and ready to use
    
    ```
    kubectl -n gemfire-cluster get GemFireClusters
    ```
   * Replace `-n gemfire-cluster` with the name of your namespace, if it's different.
   

   When the cluster is ready to use the output should look similar to
    
    ```
    NAME                          LOCATORS   SERVERS   CLUSTER IMAGE                                                     OPERATOR VERSION
    hello-world-gemfire-cluster   1/1        2/2       registry.tanzu.vmware.com/pivotal-gemfire/vmware-gemfire:9.15.3   2.0.0-build.73
    ```
   Where the `NAME` will be the value you have for the `name` entry in your CRD file from *Step 4* . 
        
---

## Run a Spring Boot for VMware GemFire app on Kubernetes

This section will guide you through testing a *Hello, World!* client application, that utilizes Spring Boot for Apache Geode.

### What You'll Need

* The [Hello, World!](https://github.com/gemfire/spring-for-gemfire-examples/tree/main/hello-world) example.
* JDK 8 or 11
* Spring Boot 2.6 or above
* [Spring Boot for VMware GemFire](https://docs.vmware.com/en/Spring-Boot-for-VMware-GemFire/index.html) 
* VMware GemFire for Kubernetes 2.0+
* [Docker](https://docs.docker.com/get-docker/)
* [A Pivotal Commercial Maven Repo account (free)](https://commercial-repo.pivotal.io/login/auth)
* An image repository to push the `Hello, World!` image that is created in the guide.


###  1. Download the Hello, World! Example

Clone the Hello, World! app from the [examples repo](https://github.com/gemfire/spring-for-gemfire-examples). 

```
$ git clone https://github.com/gemfire/spring-for-gemfire-examples.git
```

### 2. Edit the `application.properties` File 

* Navigate to the `spring-for-gemfire-examples/hello-world` directory. 
* Open the `application.properties`. 
* Uncomment the two listed properties.
* Replace the value for `spring.data.gemfire.pool.locators:` with your VMware GemFire cluster information, for each locator (in this example we only have one locator).  The information will follow the form:

   ```
   [GEMFIRE-CLUSTER-NAME]-locator-[LOCATOR-NUMBER].[GEMFIRE-CLUSTER-NAME]-locator.[NAMESPACE-NAME][10334]
   ```
    For our example the value looks like this:

    ```
    spring.data.gemfire.pool.locators: hello-world-gemfire-cluster-locator-0.hello-world-gemfire-cluster-locator.gemfire-cluster[10334]
    ```

  
* Replace the value for `spring.data.gemfire.management.http.host:` with your VMware GemFire cluster information.  This will allow Spring Boot for VMware GemFire to push your initial cluster configuration to GemFire.  The information follows a similar form as above:

   ```
   [GEMFIRE-CLUSTER-NAME]-locator-[LOCATOR-NUMBER].[GEMFIRE-CLUSTER-NAME]-locator.[NAMESPACE-NAME]
   ```
    For our example the value looks like this:
    
     ```
      spring.data.gemfire.management.http.host: hello-world-gemfire-cluster-locator-0.hello-world-gemfire-cluster-locator.gemfire-cluster
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
     kubectl -n gemfire-cluster create deployment hello-world-deployment --image=docker.io/[YOUR DOCKER USERNAME]/hello-world:0.0.1-SNAPSHOT
   ```  
If successful you should see `deployment.apps/hello-world-deployment created`

### 6. Create a LoadBalancer to access the app
In order to access `Hello, World!` app from a browser, we need to expose the deployment.

```
kubectl -n gemfire-cluster expose deployment/hello-world-deployment --type="LoadBalancer" --port=80 --target-port=8080
```

> If you're trying this locally with MiniKube, you will need to replace `LoadBalancer` with `NodePort`.

### 7.  Access the Hello, World! Application

Once the Load Balancer has been created, you can now access the *Hello, World!* application using the `External IP` on the LoadBalancer service.

```
kubectl -n gemfire-cluster get services
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

Note that the ***time to look up*** has been significantly reduced. This represents the app getting the information from the cache, VMware GemFire, instead of querying the database.


### 8.  Confirm that the Hello, World! App is connected
If you would like to confirm that your Hello World! app is connected to your VMware GemFire cluster you can connect through the VMware GemFire shell - commonly referred to as *gfsh*

In a terminal

* Start gfsh for kubernetes
    ```
    kubectl -n gemfire-cluster exec -it hello-world-gemfire-cluster-locator-0 -- gfsh
    ```  

  * Replace `-n gemfire-cluster` with the name of your namespace, if it's different.
 

* Once you see that `GFSH` has started, connect to your cluster with the `connect` command

    ```
    connect --locator=hello-world-gemfire-cluster-locator-0.hello-world-gemfire-cluster-locator.gemfire-cluster[10334]
    ``` 
* Once connected run the `list regions` command

    ```
    list regions
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
    Value       : "2022-11-17T19:22:30.894"
   ```
    
   **Shown on the Webpage**
   
   ```
    key: hello
    value: 2022-11-17T19:22:30.894
    time to look up: 2ms
   ```

**Congratulations! You’re ready to start using VMware GemFire for Kubernetes.**

---


## Delete the Hello, World! app

To delete the *Hello, World!* app you will need to delete the deployment and the service.  

This will remove the *Hello, World!* deployment, replicaset, and pod.

```
kubectl -n gemfire-cluster delete deployment hello-world-deployment
```

This will remove the *Hello, World!* service.

```
kubectl -n gemfire-cluster delete service hello-world-deployment
```

---

## Delete the VMware GemFire Cluster

If you need to delete your VMware GemFire cluster, first remove the cluster

  ```
  kubectl -n gemfire-cluster delete GemFireCluster hello-world-gemfire-cluster
  ```
   * Replace `-n gemfire-cluster` with your namespace if different.
   * Replace `hello-world-gemfire-cluster` with the name of your GemFire instance if different.       

When the VMware GemFire cluster has been completely deleted, remove the persistent volume claims of the Kubernetes cluster. These are disk claims that Kubernetes makes on the underlying system. 

   ```
    kubectl -n gemfire-cluster get persistentvolumeclaims
   ```
    
   * Replace `-n gemfire-cluster` with your namespace if different.

To delete all the persistent volume claim listed, run the following command

   ```
    kubectl delete pvc -n gemfire-cluster --all
   ```
   * Replace `-n gemfire-cluster` with your namespace if different.
   
---

 ## Learn More
 
 Now that you have successfully created a running VMware GemFire cluster on Kubernetes, check out some other guides.
  
 * Create an application that utilizes Spring Boot for VMware GemFire and Spring Session for [session state caching](/data/gemfire/guides/session-state-cache-sbgf).