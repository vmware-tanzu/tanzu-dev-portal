---
title: "Creating and Configurating an Ecrypted GemFire Client in Java"
description: > 
    Creating and connecting a GemFire client to a TLS-secured GemFire cluster in Kubernetes can be a breeze, this tutorial will show you how
date: 2023-02-08
type: blog

# Author(s) 
team:
- Louis Jacome

---
## Table of Contents

- [GemFire for Kubernetes Tutorial: Creating and Configuring an encrypted GemFire Client in Java](#gemfire-for-kubernetes-tutorial-creating-and-configuring-an-encrypted-gemfire-client-in-java)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Creating a GemFire Client in Java](#creating-a-gemfire-client-in-java)
    - [Maven Configuration](#maven-configuration)
    - [Writing the BasicGemFireClient](#writing-the-basicgemfireclient)
    - [Configuring the BasicGemFireClient](#configuring-the-basicgemfireclient)
    - [Running the BasicGemFireClient](#running-the-basicgemfireclient)
    - [Creating a BasicGemFireClient Docker container image](#creating-a-basicgemfireclient-docker-container-image)
  - [Preparing the GemFire for Kubernetes cluster](#preparing-the-gemfire-for-kubernetes-cluster)
    - [Installing GemFire for Kubernetes and Creating a GemFire cluster](#installing-gemfire-for-kubernetes-and-creating-a-gemfire-cluster)
    - [Creating cert-manager Resources for the `BasicGemFireClient`](#creating-cert-manager-resources-for-the-basicgemfireclient)
      - [Create the Secret](#create-the-secret)
      - [Create the Certificate](#create-the-certificate)
      - [Mount the Secret to a volume in the `BasicGemFireClient` Pod](#mount-the-secret-to-a-volume-in-the-basicgemfireclient-pod)

## Introduction
VMware GemFire for Kubernetes is a Kubernetes Operator-patterned solution that utilizes the Kubernetes platform to help you quickly and reliably deploy robust GemFire clusters. GemFire is a distributed, in-memory, key-value store that performs read and write operations at amazingly fast speeds. It offers highly available parallel message queues, continuous availability, and an event-driven architecture you can scale dynamically, with no downtime. This means as your requirements increase to support more data, high-performance, real-time apps, GemFire can scale linearly with ease.

This tutorial explores how to develop and deploy a basic GemFire client that performs distributed caching operations with a TLS-secured GemFire for Kubernetes cluster. We will touch on Maven and TLS configuration of the Java-based client, configuring the GemFire cluster, using `cert-manager` to create resources for the client, and deploying the client application to Kubernetes.  `cert-manager` is a cloud native X.509 certificate management for Kubernetes and OpenShift.  

The reader is expected to have some exposure to GemFire and some development experience with Java and Kubernetes.  If you would like to learn more about GemFire and all of it capabilities please head over to: [https://vmware.com/go/gemfire](https://vmware.com/go/gemfire)

The code for the GemFire client and Kubernetes resource definitions used in this tutorial are available on [github](https://github.com/luissson/BasicGemFireClient).

## Creating a GemFire Client in Java
To start, we'll build a basic GemFire client in Java. The focus here will be on creating a client that has the minimal configuration necessary to do `put` and `get` operations against an already running GemFire cluster. As such, this post will make use of the available GemFire API methods for clients. 

### Maven Configuration

The Maven configuration includes all the necessary plugins to compile and distribute the client along with the GemFire dependency. In this example `maven-compiler-plugin` builds the GemFire client using *Java 8*, while the `maven-assembly-plugin` is used to create a single executable jar.  The current version of GemFire 9.15 is also compatible with JDK 8, JDK 11 and JDK 17.

The entry point for the `maven-compiler-plugin` is specified by the `mainClass` tag which is the fully qualified name of the client application `com.vmware.gemfire.BasicGemFireClient`.

[`pom.xml`](https://github.com/luissson/BasicGemFireClient/blob/main/pom.xml)

```xml
...
<build>
   <plugins>
       <plugin>
           <groupId>org.apache.maven.plugins</groupId>
           <artifactId>maven-compiler-plugin</artifactId>
           <configuration>
               <source>8</source>
               <target>8</target>
           </configuration>
       </plugin>
       <plugin>
           <artifactId>maven-assembly-plugin</artifactId>
           <configuration>
               <archive>
                   <manifest>
                       <mainClass>com.vmware.gemfire.BasicGemFireClient</mainClass>
                   </manifest>
               </archive>
               <descriptorRefs>
                   <descriptorRef>jar-with-dependencies</descriptorRef>
               </descriptorRefs>
           </configuration>
       </plugin>
   </plugins>
</build>
...
<dependencies>
   <dependency>
       <groupId>org.apache.geode</groupId>
       <artifactId>geode-core</artifactId>
       <version>1.15.0</version>
   </dependency>
</dependencies>
```

To build the executable jar with dependencies included, run:
```bash
mvn clean compile assembly:single
```

That command places the jar in the auto-generated *target* directory. The jar can then be run by executing:
```bash
java -jar target/gemfireclient-1.0-SNAPSHOT-jar-with-dependencies.jar
```

### Writing the BasicGemFireClient

GemFire is a key-value database and a given GemFire cluster can have many key-value stores. GemFire calls these key-value stores "Region" after a region of memory.  From an implementation perspective Region extends a [java.util.concurrent.ConcurrentMap](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ConcurrentMap.html), which is familiar to Java developers that know and use Java `Map`s. As a result, learning how to program with GemFire is straight forward. GemFire supports a rich feature that goes beyond the scope of this blog. For more information on how to use a region see [Data Regions](https://docs.vmware.com/en/VMware-Tanzu-GemFire/9.15/tgf/GUID-basic_config-data_regions-chapter_overview.html) in the GemFire documentation for details.

Let's walk through some of the code in our example client application.  For simplicity, the `BasicGemFireClient` is a single class with methods that perform data operations. The `BasicGemFireClient` has a constructor that accepts a *region* instance to perform operations on.  The region uses generics of `<Integer, String>` to avoid casting any results. As noted above, GemFire Regions extend standard Java `Map`s, this region then is a Java `Map` of integers to strings.

[`BasicGemFireClient.java`](https://github.com/luissson/BasicGemFireClient/blob/main/src/main/java/com/vmware/gemfire/BasicGemFireClient.java) Constructor:

```java
public class BasicGemFireClient {
 private final Region<Integer, String> region;
 
 public BasicGemFireClient(Region<Integer, String> region) {
   this.region = region;
 }
 
``` 
`BasicGemFireClient.putData()` generates the region data in a for loop.   We will use the ordinal as the key and concatenate that ordinal with the string `value` to create our value.  Then we store the Integer key and the concatenated String value using the `put` method.

```java 
 
 void putData(int numValues) {
   for(int i = 0; i < numValues; i++) {
     region.put(i, "value" + i);
   }
 }
```
`BasicGemFireClient.getRegionKeys()` gets the set of keys on the server.  If we asked the client region for it's key set it could vary based on the policy set on the client region. As one gets more advanced GemFire architectures it will make sense for this design choice. For this application we just care about all the keys on the server, not what is stored on the client. The client will ask the server(s) for its key set.  

```java
 Set<Integer> getRegionKeys() {
   return new HashSet<>(region.keySetOnServer());
 }
 ```
`BasicGemFireClient.getAndPrintValues()` this method iterates through the set of keys and asks the server for each value associated with a given key with the `Region.get` method.   It then prints that key and the corresponding value out.
```java
 void getAndPrintValues(Set<Integer> keySet) {
   for(Integer key : values) {
     System.out.printf("%d:%s\n", key, region.get(key));
   }
 }
```

### Configuring the BasicGemFireClient

As we saw, to instantiate the `BasicGemFireClient` a region must be provided. There are several GemFire region types to choose from based on high availability, asynchronous distributions, query performance, and more. For a GemFire client though, we have three region options to consider: local, proxy, and caching proxy. 

* **LOCAL** - region is only accessible to the process on which it was started, data and operations are not distributed to other members. This type of region would be good for any application meta data that is needed.  The easiest way to think about a local region is maybe GemFire is embedded in a desktop application.  Local regions can persist data and can even be queried.
* **CACHING_PROXY** - regions use some of the client application memory space to cache some of the data held on the server.  
* **PROXY** - regions hold no state information, and simply forwards data and cache operations to the regions held on the server.   Proxy regions are the simplest to get started with.  I recommend just making proxy regions until you find empirical evidence that your application needs more.

The `BasicGemFireClient` was designed to be run in the same Kubernetes cluster where the GemFire cluster and operator are deployed.  Since we recommend Proxy client regions our code will instantiate our client region as a proxy region.

By default, a GemFire for Kubernetes cluster is secured by TLS, which requires that the client to be properly configured to connect. For our example client, the configuration will consist of the location of both keystore and truststore along with their passwords; see [Configuring SSL](https://docs.vmware.com/en/VMware-Tanzu-GemFire/9.15/tgf/GUID-managing-security-implementing_ssl.html) for more details. The client can then use the GemFire API to create a cache reference after providing the configured SSL properties.

There are many ways to handle secrets in Kubernetes, since this is a learning experiance we are going doing it as easy as possible.  For this example we are going to pass configuration parameters as environment variables which can be declared in the application's corresponding Pod spec/yaml. For the `BasicGemFireClient`, the hostnames for the GemFire cluster, truststore, and keystore passwords are consumed as environment variables; specifically `TRUST_PSWD` is used as both the truststore and keystore password (for convenience) and is set by reading the value of the `TRUST_STORE_PSWD` environment variable.   The host for the GemFire cluster is set by reading the value of the `LOCATOR_HOST` environment variable. The location of the truststore and keystore files are hard-coded to the expected location on disk -- within the `*/certs*` directory.

Setting up the GemFire TLS Connection:
```java
String locatorAddress = System.getenv("LOCATOR_HOST");
String TRUST_PSWD= System.getenv("TRUST_STORE_PSWD");
 
Properties props = new Properties();
 
props.setProperty("ssl-enabled-components", "all");
props.setProperty("ssl-endpoint-identification-enabled", "true");
props.setProperty("ssl-keystore", "./certs/keystore.p12");
props.setProperty("ssl-keystore-password", TRUST_PSWD);
props.setProperty("ssl-truststore", "./certs/truststore.p12");
props.setProperty("ssl-truststore-password", TRUST_PSWD);
 
// connect to the locator using default port 10334
ClientCache cache = new ClientCacheFactory(props)
   .addPoolLocator(locatorAddress, 10334);
```

The `ClientCache` is an interface that GemFire clients use to manage data.   From this `ClientCache` we can then create client regions based on whatever policy your architects need.  As recommended our example client application region will be a *proxy* for the real cache in the running GemFire cluster.

```java
Region<Integer, String> region =
   cache.<Integer, String>createClientRegionFactory(ClientRegionShortcut.PROXY)
       .create("example-region");
```

Note: Before clients can use this `example-region` proxy region the `example-region` region must be created on the servers.   This will be shown in a later step using the GemFire CLI called gfsh (pronounced gee-FISH)

### Running the BasicGemFireClient

With the configuration ready, all that's left to do is instantiate the `BasicGemFireClient` and execute the available data operations.

```java
BasicGemFireClient example = new BasicGemFireClient(region);
example.putData(10);
example.getAndPrintValues(example.getRegionKeys());
 
cache.close();
```

A successful run of the client will `put` 10 key-value pairs into the region, and `get` the values before and displaying the results:

```bash
0:value0
1:value1
2:value2
3:value3
4:value4
5:value5
6:value6
7:value7
8:value8
9:value9
```

### Creating a BasicGemFireClient Docker container image

To run the client application in Kubernetes, a container image must be built and uploaded to a container registry. Provided in the [example git repository](https://github.com/luissson/BasicGemFireClient) is a [Dockerfile](https://github.com/luissson/BasicGemFireClient/blob/main/Dockerfile) that builds the `BasicGemFireClient` container image. To build the image, from the root of the git repository execute

```bash
docker build --tag <<IMAGE-REPOSITORY>>/gfclient .
docker push <<IMAGE-REPOSITORY>>/gfclient
```

This will build then push the container image to the image repository substituted in place of \<\<IMAGE-REPOSITORY\>\>.


## Preparing the GemFire for Kubernetes cluster

### Installing GemFire for Kubernetes and Creating a GemFire cluster

To date, GemFire for Kubernetes has been certified on the following platforms: Azure Kubernetes Service, Amazon Elastic Kubernetes Service, Google Kubernetes Engine, Red Hat OpenShift, Tanzu Kubernetes Grid, and Tanzu Kubernetes Grid Integrated Edition.

To install GemFire for Kubernetes on one of the above platforms, please consult the [Prerequisites and Supported Platforms](https://docs.vmware.com/en/VMware-Tanzu-GemFire-for-Kubernetes/2.1/gf-k8s/GUID-supported-configurations.html) and [Install or Uninstall the Tanzu GemFire Operator](https://docs.vmware.com/en/VMware-Tanzu-GemFire-for-Kubernetes/2.1/gf-k8s/GUID-install.html) product pages.

A sample (1 locator, 2 server) GemFire for Kubernetes cluster yaml is provided below to run alongside the `BasicGemFireClient` application. Note, the `vmware-gemfire` container image, run by GemFire member pods, must be available at the desired image repository substituted in for \<\<IMAGE-REPOSITORY\>\>.

[`gemfirecluster.yaml`](https://github.com/luissson/BasicGemFireClient/blob/main/k8s/gemfirecluster.yaml)
```yaml
apiVersion: gemfire.vmware.com/v1
kind: GemFireCluster
metadata:
 name: gemfire-cluster
spec:
 image: registry.tanzu.vmware.com/pivotal-gemfire/vmware-gemfire:9.15.2
 antiAffinityPolicy: Cluster
 locators:
   replicas: 1
   resources:
     requests:
       memory: 1Gi
       cpu: "1"
     limits:
       memory: 1Gi
       cpu: "1"
   persistentVolumeClaim:
     resources:
       requests:
         storage: "1Gi"
 servers:
   replicas: 2
   resources:
     requests:
       memory: 2Gi
       cpu: "2"
     limits:
       memory: 2Gi
       cpu: "2"
   persistentVolumeClaim:
     resources:
       requests:
         storage: "10Gi"
```

To create the GemFire for Kubernetes cluster, execute

```bash
kubectl apply -f gemfirecluster.yaml
```

Once the above GemFire cluster is up and running, lets create the `example-region` region for the client application. The process below shows how to create the region by shelling into a locator pod, launching [gfsh](https://geode.apache.org/docs/guide/114/tools_modules/gfsh/chapter_overview.html), and executing the `create region` command:

Shell into the locator pod using `kubectl`
```bash
kubectl exec -it gemfire-cluster-locator-0 sh
```

Within the locator shell, retrieve the fully qualified domain name of the locator (FQDN), then launch gfsh

```bash
$ hostname -f
 
$ gfsh
```
From gfsh, connect to the GemFire cluster specifying the locator's FQDN with the default locator port 10334, and security properties file with TLS configuration. Proceed past the prompts by pressing enter and proceed to connect to the GemFire cluster.

```bash
gfsh>connect --locator=<<LOCATOR-FQDN>>[10334] --security-properties-file=/security/gfsecurity.properties
```

Once connected, create the `example-region`

```bash
gfsh>create region --name='example-region' --type=PARTITION
```

Now the GemFire cluster is configured and ready for the `BasicGemFireClient` application.

### Creating cert-manager Resources for the `BasicGemFireClient`

In this section, [several yaml files](https://github.com/luissson/BasicGemFireClient/tree/main/k8s) will be provided that define necessary Kubernetes resources to run the `BasicGemFireClient` application. It's assumed that the kubectl is targeting the intended Kubernetes cluster.

Commands to ensure we are using the right Kubernetes cluster:
```bash
# List available Kubernetes clusters
kubectl config get-contexts
 
# Currently targeted cluster
kubectl config current-context
 
# Change targeted cluster to 'my-kubernetes-cluster-name'
kubectl config use-context my-kubernetes-cluster-name
```

`cert-manager` is a prerequisite of GemFire for Kubernetes. It greatly simplifies the process of generating and managing certificates in Kubernetes. In the configuration of the `BasicGemFireClient` application, it's required that truststore and keystore files be on the client filesystem to connect to the GemFire for Kubernetes cluster. After taking advantage of the certificate issuer bundled with the GemFire for Kubernetes operator, generating these files is simplified to a three step process:

1. Create a Kubernetes secret that stores the certificate data
2. Create a Certificate to generate the certificate data
3. Mount the Secret to a volume in the `BasicGemFireClient` Pod

#### Create the Secret

First, generate a Secret that will be used to store the certificate data after `cert-manager` generates it. `cert-secret.yaml` below defines a Secret named `client-cert` in the `app` namespace. The provided password ("client-password") is used to secure the truststore and keystore files.

[`cert-secret.yaml`](https://github.com/luissson/BasicGemFireClient/blob/main/k8s/client-secret.yaml)
```yaml
apiVersion: v1
kind: Secret
metadata:
 name: client-cert
 namespace: app
stringData:
 password: client-password
```

To create the Secret, execute

```bash
kubectl apply -f cert-secret.yaml
```

#### Create the Certificate

Next, generate the Certificate using `cert-manager`.

`client-cert.yaml` defines a Certificate that will be issued by the `gemfire-ca-issuer`.  This issuer is bundled with the GemFire for Kubernetes operator. Other important fields include `dnsNames` (Subject Alternative Names) which associate various objects in the `app` namespace with the certificate, the `secretName` is where `cert-manager` stores the certificate data, `keystores` generates a keystore in the GemFire-supported pkcs12 format using the password provided in the `client-cert` Secret.

[`client-cert.yaml`](https://github.com/luissson/BasicGemFireClient/blob/main/k8s/client-cert.yaml)
```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
 name: client-cert
 namespace: app
spec:
 duration: 2160h # 90d
 renewBefore: 360h # 15d
 subject:
   organizations:
   - Example.com
 commonName: client-cert
 isCA: false
 privateKey:
   algorithm: RSA
   encoding: PKCS1
   size: 2048
 usages:
 - server auth
 - client auth
 dnsNames:
 - "*.app"
 issuerRef:
   kind: ClusterIssuer
   name: gemfire-ca-issuer
   group: cert-manager.io
 secretName: client-cert
 keystores:
   pkcs12:
     create: true
     passwordSecretRef:
       key: password
       name: client-cert
```

Create the Certificate by executing

```bash
kubectl apply -f client-cert.yaml
```

Once complete, the certificate data is stored in the `client-cert` Secret created earlier.

Note: If the default configuration for TLS mutual/two-way authentication is desired, the truststore will be used by the client to authenticate the server's provided certificate. This is enabled by setting `clientAuthenticationRequired` to true in the `tls` section of the [`gemfirecluster.yaml`](https://github.com/luissson/BasicGemFireClient/blob/main/k8s/gemfirecluster.yaml).

```yaml
apiVersion: gemfire.vmware.com/v1
kind: GemFireCluster
spec:
  security:
    tls:
      ...
      clientAuthenticationRequired: true
```

#### Mount the Secret to a volume in the `BasicGemFireClient` Pod

Finally, define the Pod for the `BasicGemFireClient` application. The Pod will deploy to the `app` namespace and use the *gfclient* Docker container image created earlier after substituting the desired image repository in place of\<\<IMAGE-REPOSITORY\>\>.

[`gfclient.yaml`](https://github.com/luissson/BasicGemFireClient/blob/main/k8s/gfclient.yaml)
```yaml
apiVersion: v1
kind: Pod
metadata:
 name: gfclient
 namespace: app
spec:
 containers:
 - name: gfclient
   image: <<IMAGE-REPOSITORY>>/gfclient:latest
   imagePullPolicy: Always
   volumeMounts:
   - mountPath: /certs
     name: cert-volume
   env:
   - name: "TRUST_STORE_PSWD"
     valueFrom:
       secretKeyRef:
         name: client-cert
         key: password
   - name: "LOCATOR_HOST"
     value: "<<LOCATOR-FQDN or IP-ADDRESS>>"
 volumes:
 - name: cert-volume
   secret:
     secretName: client-cert
```

The certificate contents of `cert-secret` will be on the Pod filesystem under */certs*. In addition, the required values for the environment variable `TRUST_STORE_PSWD` is retrieved from the `client-cert` secret while the `LOCATOR_HOST` value is hard-coded to either the FQDN of a locator in the GemFire cluster or its IP address.

To create the `BasicGemFireClient` Pod, execute

```bash
kubectl apply -f gfclient.yaml
```

Once created, the Pod starts the `BasicGemFireClient` application created above. After successfully running, one can inspect the Pod logs and see the expected output:

```bash
kubectl logs gfclient -n app
 
# Attempting connection to locator gemfire-cluster-locator.default.svc.cluster.local
# ERROR StatusLogger Log4j2 could not find a logging implementation. Please add log4j-core to the classpath. Using #SimpleLogger to log to the console...
# SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
# SLF4J: Defaulting to no-operation (NOP) logger implementation
# SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
# 0:value0
# 1:value1
# 2:value2
# 3:value3
# 4:value4
# 5:value5
# 6:value6
# 7:value7
# 8:value8
# 9:value9
```

This concludes the tutorial, we have covered how to:
* Develop a GemFire client (using Java & maven) capable of doing distributed caching operations
* Configure the client to communicate with a TLS-enabled GemFire cluster
* Containerize the client application
* Install VMware GemFire for Kubernetes and create a GemFire cluster
* Create cert-manager resources for the GemFire client
* Deploy the GemFire client
 

