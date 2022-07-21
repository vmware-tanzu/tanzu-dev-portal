---
layout: single
team:
- Paul Kelly
title: The Example Application
weight: 10
---

The example is a Spring Boot REST application called `toybank`, which has a connection to a database. It has two endpoints for adding or retrieving records. It has unit tests, which use an in-memory database (H2), and end-to-end tests, which require an external database. The end-to-end tests run against a deployed `toybank`. The application has been kept as simple as possible, as its purpose is to show a separation between the unit and end-to-end tests rather than how to write application code. 

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

The application uses a PostgreSQL database that you can run inside a container. Here’s a Docker Compose file for running PostgreSQL and `pgAdmin` containers with persistent volumes stored on the host machine: 


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



1. Create a `docker-compose.yml` file with the contents above. Edit the values `your-db-password`, `your-email`, and `your-admin-password` to set credentials for your database and for the admin application. The value of`your-email` is only used as the login user for the Postgres admin application. 

2.  Run the following command from the directory with `docker-compose.yml`:

```
docker-compose up -d
```

3. Run the `docker ps` command afterwards. There should now be two new containers running. You should see output similar to this (IDs will be different and you might have other containers running as well as the two you just started): 
```
CONTAINER ID   IMAGE                   COMMAND                  CREATED          STATUS         PORTS                           NAMES
49cde7079787   dpage/pgadmin4          "/entrypoint.sh"         11 seconds ago   Up 8 seconds   443/tcp, 0.0.0.0:8880->80/tcp   postgres_pgadmin_1
60906366563e   bitnami/postgresql:11   "/opt/bitnami/script…"   11 seconds ago   Up 8 seconds   0.0.0.0:5432->5432/tcp          postgres_postgresql_1\
```

This file also creates a Docker bridge network for the two containers to communicate with each other. `pgAdmin` is available on the host at port 8880, so to administer the database, point your browser at [http://localhost:8880](http://localhost:8880) and sign in using `your-email` and `your-admin-password`. Then, create a new server connection as follows: 



4. Click **Add new server** under **Quick Links**.  
5. Set name to `postgres-db`, then go to the connection tab and enter the name of the PostgreSQL container. It is probably `postgres_postgresql_1`, but you can check the names of running containers with the `docker ps` command.  

6. Set `Username` to `postgres` and `Password` to `your-db-password` and Save the server connection. 

You can now administer the database server. Create databases `test`, and `production` (the `dev` database was created by the `docker-compose` command). To create a new database: 

7. Right-click on **Databases** under `postgres-db`, then click **Create**, **Database** to add a new database. 


## Run the application

You can run the application on your host machine before deploying it to a Kubernetes cluster. Set the following environment variables (the value for DATABASE_PASSWORD must be the same as the one for `POSTGRESQL_PASSWORD` in your `docker-compose.yml` file): 


```
DATABASE_PASSWORD=your-postgresql-password
DATABASE_URL=jdbc:postgresql://localhost:5432/dev
DATABASE_USER=postgres
```


Then, provided you built the application as described above: 


```
java -jar target/toy-bank-1.0.1.jar
```


Point your browser at [http://localhost:8080](http://localhost:8080) to see a 404 error page (the application doesn’t have a mapping setup for `/`). You can put a record into the database, however, by making a POST request to [http://localhost:8080/transaction/](http://localhost:8080/transaction/) with the request body set to: 


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


You can view the record either using the `pgAdmin` tool, or by pointing your browser at [http://localhost:8080/transaction/1](http://localhost:8080/transaction/1). To use the `pgAdmin` tool, in the right hand pane under `Servers`, click `Refresh` then expand `postgres-db`, `Databases`, `Schemas`, `Tables`, then right-click 
`account_transaction` and select `View/Edit Data`, `All Rows`. 