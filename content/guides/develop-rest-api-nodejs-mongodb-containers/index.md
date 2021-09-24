---
date: 2020-03-24
lastmod: '2021-02-05'
linkTitle: Develop Node.js REST API
patterns:
- API
tags:
- Microservices
- API
- REST
- MongoDB
- Node.js
team:
- Vikram Vaswani
title: Develop a REST API with Bitnami's Node.js and MongoDB Containers
weight: 1
oldPath: "/content/guides/microservices/develop-rest-api-nodejs-mongodb-containers.md"
aliases:
- "/guides/microservices/develop-rest-api-nodejs-mongodb-containers"
level1: Building Modern Applications
level2: Microservice Patterns
---

For developers building cloud-native applications and APIs for Kubernetes, Bitnami offers a variety of [containers](https://bitnami.com/stacks/containers) and [Helm charts](https://github.com/bitnami/charts/) to ease the process. These ready-to-use assets make it easier to develop and deploy applications consistently, follow best practices and focus on code rather than infrastructure configuration. Bitnami containers and charts are also always secure, optimized and up-to-date, so you can rest assured that your applications always have access to the latest language features and security fixes. 

To illustrate these benefits, this two-part series will walk you through the process of developing and deploying a sample Node.js REST API locally using Bitnami containers. Then, once your API is reasonably stable or ready, it will show you how to make it available to a wider group of reviewers or users by deploying it on Kubernetes using Bitnami Helm charts. 

In this first part, you will create and run a sample REST API locally on your development system using the Sails framework. You will also create a local MongoDB service for API data storage, and integrate and test your REST API with this MongoDB service. To perform these tasks, you can either use your existing Node.js development environment or, if you don't have one, you can use the following Bitnami container images:

* [Bitnami's Node.js container image](https://github.com/bitnami/bitnami-docker-node/) contains the Node.js runtime together with all required dependencies and development tools.

* [Bitnami's MongoDB container image](https://github.com/bitnami/bitnami-docker-mongodb) contains the official MongoDB Community binaries together with support for persistence, SSL and replica sets.

## Assumptions and prerequisites

This guide assumes that:

* You have Docker installed and configured. [Learn more about installing Docker](https://docs.docker.com/engine/installation/).
* You have a basic understanding of Node.js and REST API concepts. Learn more about [Node.js](https://nodejs.org/) and [REST](https://en.wikipedia.org/wiki/Representational_state_transfer).

## Step 1: Create a skeleton Node.js application

The first step is to create a skeleton Node.js application. This article will use the Bitnami Node.js container image and the popular [Sails MVC framework](https://sailsjs.com/); however, there are multiple tools and methods to do this and you should feel free to use a different approach or a different framework. For example, if you already have a Node.js development environment, you can use that instead and skip the Docker commands below. 

* Begin by creating a directory for your application and making it the current working directory:

  ```bash
  mkdir myapp
  cd myapp
  ```
  
* Use the following Docker commands to create and start a [Bitnami Node.js container](https://github.com/bitnami/bitnami-docker-node/) on your host: 

  ```bash
  docker create -v $(pwd):/app -t --net="host" --name node bitnami/node:13
  docker start node
  ```
  
  The *-v* argument to the first command tells Docker to mount the host's current directory into the container's */app* path, so that the effects of commands run in the container are seen on the host. The *--net="host"* parameter tells Docker to use the host's network stack for the container. The container is named *node*.
  
  Once the container is running, connect to the container console with the command below. This will give you a command shell and allow you to use the Node.js tools available in the image for subsequent tasks.
  
  ```bash
  docker exec -it node /bin/bash
  ```
  
* Install Sails and then use the Sails CLI to create the scaffolding for a skeleton application. When prompted for the application type, choose an "Empty" application.
  
  ```bash
  npm install -g sails
  sails new .
  ```

  Once the application scaffolding has been generated, start the application:
  
  ```bash
  sails lift
  ```
  
* By default, a Sails application starts in development mode and runs at port 1337. Browse to http://DOCKER-HOST-ADDRESS:1337, where DOCKER-HOST-ADDRESS is the IP address of your host, and confirm that you see the Sails welcome page shown below:

  ![Sails default page](images/sails-welcome.png)

* Exit the container console. This will terminate the Sails application process, although the container will continue to run in the background. 
  
## Step 2: Create and start a local MongoDB service

[MongoDB](https://www.mongodb.com/) is a scalable and popular data storage accompaniment for Node.js applications. [Bitnami's MongoDB image](https://github.com/bitnami/bitnami-docker-mongodb) makes it easy to create a local MongoDB service which can be used to store, retrieve and modify data related to your REST API. Alternatively, if you already have the MongoDB server and a MongoDB database on your host, you can use that instead and skip the Docker commands below. 

Create and start a MongoDB database service using the [Bitnami MongoDB container](https://github.com/bitnami/bitnami-docker-mongodb) on your host.  If you wish, you can replace the database credentials and other variables shown below with your own values, but make a note of them as you will need them in the next step.

```bash
docker create -e MONGODB_USERNAME=myapp -e MONGODB_PASSWORD=myapp -e MONGODB_DATABASE=mydb -e MONGODB_ROOT_PASSWORD=root --net="host" --name mongodb bitnami/mongodb
docker start mongodb
```

The environment variables passed to the first command set the administrator password for the MongoDB instance and also create a new database named *mydb* with corresponding user credentials. This database will be used to store data for the REST API. As before, the *--net="host"* parameter tells Docker to use the host's network stack for this container as well. The container is named *mongodb* and, once started, the MongoDB service will be available on the Docker host at port 27017.

## Step 3: Create and configure a REST API endpoint

At this point, you have a skeleton Node.js application and a MongoDB database service. You can now start creating your REST API. As before, if you're using an existing Node.js development environment, skip the Docker commands below. 

* Connect to the container console again with the command below:
    
  ```bash
  docker exec -it node /bin/bash
  ```
  
* Sails comes with a built-in [generator for API endpoints](https://sailsjs.com/documentation/concepts/extending-sails/generators/available-generators). Use this to generate the scaffolding for a new sample REST API endpoint for Item objects. By default, this endpoint will be exposed at the */item* URI.
 
  ```bash
  sails generate api item
  ```

* Install the MongoDB adapter for Sails:

  ```bash
  npm install sails-mongo --save  
  ```
  
  Exit the Docker container once the installation is complete.

* Follow the [steps outlined in the Sails documentation to configure the generated application to use MongoDB](https://sailsjs.com/documentation/tutorials/using-mongo-db) for data storage. First, edit the *myapp/config/datastores.js* file and modify the default data store entry as shown below. 

  ```javascript
  default: {
    adapter: 'sails-mongo',
    url: 'mongodb://myapp:myapp@localhost/mydb'
  }
  ```
  
  If you used different values when creating the MongoDB container, or if you're using a different MongoDB installation, remember to replace the values shown above as needed.
  
  Then, update the *id* and *migrate* attributes in the *myapp/config/models.js* file:
  
  ```javascript
  migrate: 'alter',
  id: { type: 'string', columnName: '_id' },
  ```
  
* Create a data model for the REST API Item object. For this article, use a simple model with just two attributes: a *name* and a *quantity*. Edit the *myapp/api/models/Item.js* and update it to look like this:

  ```javascript
  module.exports = {

    attributes: {
        name: 'string',
        quantity: 'number'
    }
  };
  ```

* Connect to the container console again. Start the application and put it in the background:
    
  ```bash
  docker exec -it node /bin/bash
  sails lift &
  ```
  
  Exit the Docker container once the application starts.

As before, the application will start in development mode and become available at port 1337 of the host. 

## Step 4: Test the REST API

Your REST API is now active and configured to use MongoDB. You can now proceed to test it from your host, by sending it various types of HTTP requests and inspecting the responses. If you're using the Bitnami containers, remember that they are using the host's network stack and so will be available at ports 1337 (Node.js) and 27017 (MongoDB) respectively.

* At the host console, send a POST request to the API using *curl* to create a new item record:

  ```bash
  curl -H "Content-Type: application/json" -X POST -d '{"name":"milk","quantity":"10"}' http://localhost:1337/item
  ```
  
  You should see output similar to that shown below:

  ![POST request](images/api-post.png)

* Check if the item record was created with a GET request:

  ```bash
  curl http://localhost:1337/item
  ```

  You should see output similar to that shown below:
  
  ![GET request](images/api-get.png)

  You can also connect to the running MongoDB container and use the *mongo* CLI to see the data in the MongoDB database.
  
  ```bash
  docker exec -it mongodb /bin/bash
  mongo --authenticationDatabase mydb -u myapp -p myapp mydb --eval "db.item.find()"
  ```

  You should see output similar to that shown below:

  ![Database check](images/db-get.png)

* Modify the item record with a PUT request. Replace the ID placeholder in the command below with the document's unique identifier from the previous commands.

  ```bash
  curl -H "Content-Type: application/json" -X PUT -d '{"name":"milk","quantity":"5"}' http://localhost:1337/item/ID
  ```
  
  You should see output similar to that shown below:
  
  ![PUT request](images/api-put.png)

* Delete the item record with a DELETE request:

  ```bash
  curl -H "Content-Type: application/json" -X DELETE http://localhost:1337/item/ID
  ```

  You should see output similar to that shown below:
  
  ![DELETE request](images/api-delete.png)

  You can also connect to the running MongoDB container and use the *mongo* CLI to confirm that the data has been deleted from the MongoDB database:

  ```bash
  docker exec -it mongodb /bin/bash
  mongo --authenticationDatabase mydb -u myapp -p myapp mydb --eval "db.item.count()"
  ```
  
  You should see output similar to that shown below:

  ![Database check](images/db-delete.png)
  
At this point, you have a working Node.js REST API integrated with a MongoDB database. However, it's currently only available on your local machine and only while the containers are running. This is fine for local development, but becomes a bottleneck when you want to make it available to others for review and testing. 

That's where the [second part of this series](/guides/microservices/deploy-rest-api-nodejs-mongodb-charts/) comes in. Continue adding features to your API and once you're happy with it, proceed to the concluding article and learn how to make your REST API available to a larger group by containerizing it, deploying it on Kubernetes and connecting it to a MongoDB service also running on Kubernetes. 

## Useful links

To learn more about the topics discussed in this article, use the links below:

* [Bitnami's Node.js container image](https://github.com/bitnami/bitnami-docker-node/)
* [Bitnami's MongoDB container image](https://github.com/bitnami/bitnami-docker-mongodb)
* [Sails documentation](https://sailsjs.com/documentation/reference)
* [MongoDB documentation](https://docs.mongodb.com/manual/)