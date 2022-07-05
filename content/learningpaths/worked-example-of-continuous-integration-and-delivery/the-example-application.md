---
layout: single
team:
- Paul Kelly
title: The Example Application
weight: 10
---

The example is a Spring Boot REST application called “toybank,” which has a connection to a database. It has two endpoints for adding or retrieving records. It has unit tests, which use an in-memory database (H2), and end-to-end tests, which require an external database. The end-to-end tests run against a deployed toybank. The application has been kept as simple as possible, as its purpose is to show a separation between the unit and end-to-end tests rather than how to write application code. 

Fork the repository [here](https://github.com/pkpivot/toybank), and then clone it to your local machine. To run the unit tests and build a jar file:  


```
./mvnw package 
```


or on Windows: 


```
mvnw package  
```


You should see three tests run with no failures, followed by the Maven “Build Success” message. 


## Set up local database

The application uses a PostgreSQL database that you can run inside a container. Here’s a Docker Compose file for running PostgreSQL and pgAdmin containers with persistent volumes stored on the host machine: 


```
version: '2'
services:
  postgresql:
    image: docker.io/bitnami/postgresql:11
    ports:
      - '5432:5432'
    volumes:
      - 'postgresql_data:/bitnami/postgresql'
    networks: 
    - postgresql_net
    environment:
      - POSTGRESQL_USERNAME=postgres
      - POSTGRESQL_PASSWORD=your-db-password
      - POSTGRESQL_DATABASE=dev
  pgadmin: 
    image: docker.io/dpage/pgadmin4
    ports: 
    - '8880:80'
    networks:
    - postgresql_net
    environment: 
      - PGADMIN_DEFAULT_EMAIL=your-email
      - PGADMIN_DEFAULT_PASSWORD=your-admin-password
volumes:
  postgresql_data:
    driver: local
networks:
  postgresql_net:
```


To run the database and admin containers: 



1. Create a docker-compose.yml file with the contents above. Edit the values _your-db-password_, _your-email_, and _your-admin-password_ to set credentials for your database and for the admin application. From the directory with docker-compose.yml:  \
 \
`docker-compose -up -d`  \

2. Run the `docker ps` command afterwards. There should now be two new containers running.

This file also creates a Docker bridge network for the two containers to communicate with each other. pgAdmin is available on the host at port 8880, so to administer the database, point your browser at [http://localhost:8880](http://localhost:8880) and sign in using _your-email_ and _your-admin-password_. Then, create a new server connection as follows: 



3. Right-click on Servers, Create, Server. 
4. Set name to **postgres-db**, then go to the connection tab and enter the name of the PostgreSQL container. It is probably **postgres_postgresql_1**,** **but you can check the names of running containers with the `docker ps` command.  
5. Set **Username** to **postgres** and **Password** to **_your-db-password_** and Save the server connection. 

You can now administer the database server. Create databases **dev**, **test**, and **production**. To create a new database: 



6. Right-click on **Databases** under postgres-db, then click **Create**, **Database** to add a new database. 


## Run the application

You can run the application on your host machine before deploying it to a Kubernetes cluster. Set the following environment variables: 


```
DATABASE_PASSWORD=secret-root
DATABASE_URL=jdbc:postgresql://localhost:5432/dev
DATABASE_USER=postgres
```


Then, provided you built the application as described above: 


```
java -jar target/toy-bank-1.0.1.jar
```


Point your browser at [http://localhost:8080](http://localhost:8080) to see a 404 error page (the application doesn’t have a mapping setup for “/”). You can put a record into the database, however, by making a POST request to [http://localhost:8080/transaction/](http://localhost:8080/transaction/) with the request body set to: 


```
{
    "accountId" : 2,
    "description" : "Crisps",
    "amount" : 1.25,
    "date" : "2021-12-22"
}
```


The response body will look like the following: 


```
 {
    "id": 1,
    "accountId": 2,
    "description": "Crisps",
    "amount": 1.25,
    "date": "2021-12-22"
}
```


You can view the record either using the pgAdmin tool, or by pointing your browser at [http://localhost:8080/transaction/1](http://localhost:8080/transaction/1). 
