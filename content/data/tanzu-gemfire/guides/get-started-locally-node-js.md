---
title:  "Getting Started Locally"
link-title: "Getting Started Locally"
parent: Node.js
type: data-guides
data-featured: false
weight: 1
description: A guide to help get your local development environment up and running with a Node.js client side application. 


---

This guide walks you through setting up your local development environment using Apache Geode, the Tanzu GemFire node.js client, and a `Book Service` example.    

## What is Apache Geode?

Tanzu GemFire, an enterprise offering, is powered by Apache Geode and adds additional enterprise functionality and integrations.  Apache Geode is the open source core of Tanzu GemFire.   This means that you can use Apache Geode on your local machine when developing and testing your Tanzu GemFire applications.


## Install Apache Geode for Local Development

When developing and testing your application locally, you can use Apache Geode.

There are multiple ways to install Apache Geode for local development.  We will highlight two different ways below (brew or the .zip/.tar file below), however you can find [additional installation options here](https://geode.apache.org/docs/guide/13/getting_started/installation/install_standalone.html).

 ### Option 1: Using brew
 
 In a terminal run the following command:
 
 `brew install apache-geode`
 
 This will install the most recent version of Apache Geode.

Then configure the Apache Geode environment variables:.

   **macOS/Unix/Linux**
    ```
        $ export GEODE_HOME=/Users/MyGemFire
        $ export PATH=$GEODE_HOME/bin:$PATH
    ```

   **Windows**
    ```
        C:> set GEODE_HOME=c:\Users\MyGemFire
        C:> set PATH=%GEODE_HOME%\bin;%PATH%
    ```

### Option 2: Download a .zip or .tar file.


1. Download the .zip or .tar file from the [Apache Releases page](https://geode.apache.org/releases/).
2.  Unzip or expand the file.
3. Configure the Apache Geode environment variables:.
     
     **macOS/Unix/Linux**
    ```
        $ export GEODE_HOME=/Users/MyGemFire
        $ export PATH=$GEODE_HOME/bin:$PATH
    ```
    
     **Windows**
    ```
        C:> set GEODE_HOME=c:\Users\MyGemFire
        C:> set PATH=%GEODE_HOME%\bin;%PATH%
    ```
    
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

## Setup Your Local Development Environment


This guide allows you to test that your local environment is set up correctly and demonstrates how Tanzu GemFire will improve the read performance of your application.  

This guide uses a `Book Service` example that allows a user to look up books by ISBN or put new books into the service.  


### What You'll Need
* The [Book Service](https://github.com/gemfire/node-examples/tree/master/book-service) example
* Node.js, version 10.16.3 or above
* The Tanzu GemFire Node.js client
* Apache Geode installed on your local machine. 

### 1. Clone the Book Service Example
 
 Clone the [node examples](https://github.com/gemfire/node-examples) from the GemFire Node Examples repository. 
 
 `$ git clone https://github.com/gemfire/node-examples.git`


### 2. Download Node.js for Tanzu GemFire
To run the `Book Service` example, you must download and install the Tanzu GemFire Node.js client library.

* Go to the [Tanzu GemFire](https://network.pivotal.io/products/p-cloudcache/) product page.
* In the "Releases" drop down, find and select the NodeJS-Client.
* Click on the file icon to download the tar file (.tgz).
* Once downloaded, copy it to your `Book Service` project directory. Do not untar the tar file -- the npm command installs the Node.js API directly from the compressed .tgz archive.
 
 ### 3. Install the Tanzu GemFire Node.js Client
 
In a terminal, change your working directory to `node-examples/book-service`, and `npm install` the Tanzu GemFire Node.js client you downloaded above, into your project directory.

```bash
$ npm install /project/gemfire-nodejs-client-2.0.0.tgz 
$ npm update
```
 
 
 ### 4. Mock the TAS VCAP Services Binding
 The local environment mocks the services binding that would exist for a Tanzu Application Service (TAS) environment. A TAS environment injects the services binding through a `VCAP_SERVICES` environment variable. 


 Set this environment variable:

**Mac and Linux**
```bash
$ export VCAP_SERVICES='{"p-cloudcache":[{"label":"p-cloudcache","provider":null,"plan":"dev-plan","name":"pcc-dev","tags":["gemfire","cloudcache","database","pivotal"],"instance_name":"pcc-dev","binding_name":null,"credentials":{"distributed_system_id":"0","gfsh_login_string":"connect --url=https://localhost:7070/gemfire/v1 --user=super-user --password=1234567 --skip-ssl-validation","locators":["localhost[10334]"],"urls":{"gfsh":"https://localhost:7070/gemfire/v1","pulse":"https://localhost:7070/pulse"},"users":[{"password":"1234567","roles":["cluster_operator"],"username":"super-user"},{"password":"1234567","roles":["developer"],"username":"app"}],"wan":{"sender_credentials":{"active":{"password":"no-password","username":"no-user"}}}},"syslog_drain_url":null,"volume_mounts":[]}]}'
```

**Windows**
```bash
C:>set VCAP_SERVICES={"p-cloudcache":[{"label":"p-cloudcache","provider":null,"plan":"dev-plan","name":"pcc-dev","tags":["gemfire","cloudcache","database","pivotal"],"instance_name":"pcc-dev","binding_name":null,"credentials":{"distributed_system_id":"0","gfsh_login_string":"connect --url=https://localhost:7070/gemfire/v1 --user=super-user --password=1234567 --skip-ssl-validation","locators":["localhost[10334]"],"urls":{"gfsh":"https://localhost:7070/gemfire/v1","pulse":"https://localhost:7070/pulse"},"users":[{"password":"1234567","roles":["cluster_operator"],"username":"super-user"},{"password":"1234567","roles":["developer"],"username":"app"}],"wan":{"sender_credentials":{"active":{"password":"no-password","username":"no-user"}}}},"syslog_drain_url":null,"volume_mounts":[]}]}
```

### 5. Start Apache Geode on your machine

{{% alert title="Required" color="info" %}}
Make sure that you have installed Apache Geode on your machine before proceeding.
{{% /alert %}}  

There are shell scripts in the `book-service/scripts` directory. The `startGemFire` script starts up two locators and two cache servers. The locators allow clients to find the cache servers. To simplify local development, the script also creates the single region (analogous to a table in a relational database) that the app uses.

Start the scripts in the `node-examples/book-service` directory

**Mac and Linux**

```
$ ./scripts/startGemFire.sh
```

**Windows**

```
C:>powershell .\scripts\startGemFire.ps1
```

### 6. Run the App Locally

With a current working directory of `node-examples/book-service`

**Mac and Linux**
```
$ node src/server.js
```


**Windows**
```
C:>node .\src\server.js
```
&nbsp;

#### Add a Book to the BookService

To add a book to the data service, use a curl command:

**Mac and Linux**

```
$ curl -X PUT \
  'http://localhost:8080/book/put?isbn=0525565329' \
  -H 'Content-Type: application/json' \
  -d '{
  "FullTitle": "The Shining",
  "ISBN": "0525565329",
  "MSRP": "9.99",
  "Publisher": "Anchor",
  "Authors": "Stephen King"
}'
```

**Windows**
```
C:>curl -X PUT  "http://localhost:8080/book/put?isbn=0525565329"  -H "Content-Type: application/json"  -d "{\"FullTitle\": \"The Shining\", \"ISBN\": \"0525565329\", \"MSRP\": \"9.99\", \"Publisher\": \"Anchor\", \"Authors\": \"Stephen King\"}"
```
&nbsp;

#### Look Up a Book

To look up a book in the data service, use a curl command, specifying the ISBN as a key:

```
$ curl -X GET 'http://localhost:8080/book/get?isbn=0525565329'
```
&nbsp;

## Stop the App and Tear Down the Apache Geode Cluster

When finished running the example locally, shut down the client and server processes.
 * In the shell running `node`, use `control-C` to stop running the app.
 * Use a script to tear down the Apache Geode cluster. With a current working directory of `node-examples/book-service`
 
    **Mac and Linux**
 
    `$ ./scripts/shutdownGemFire.sh`
 
    **Windows**
 
    `C:>powershell .\scripts\shutdownGemFire.ps1`
 
 * Use a script to remove the directories and files containing GemFire logs created for the cluster. With a current working directory of `node-examples/book-service`:
 
    **Mac and Linux**
 
    `$ ./scripts/clearGemFireData.sh`
 
    **Windows**
 
    `C:>powershell .\scripts\clearGemFire.ps1`
 
 * Unset the `VCAP_SERVICES` environment variable to avoid interference with running other examples that would reference this environment variable if it continues to exist.
 
    **Mac and Linux**
 
    `$ unset VCAP_SERVICES`
 
 
    **Windows**
 
    `C:>set VCAP_SERVICES=""`
 
 Congratulations! Your local environment is set up and ready to develop with.
 
---
 
 ## Learn More
  
  Now that you have successfully set up your local development environment, check out some other guides
 
  * Set up your [Tanzu GemFire service instance](data/tanzu-gemfire/guides/get-started-tgf4vms-node-js) on the Tanzu Application Service. 
 
 
 
 
 