---
title: Data Access
weight: 130
layout: single
team:
 - VMware Tanzu Labs
---

Your app may use manually-configured JDBC drivers, ORM solutions like JPA, Hibernate, or myBatis, or JNDI to look up database connections provided by containing web server. For all of these, we’ll look to migrate connections to a Spring DataSource to allow the connection to play will with all of the other systems that Spring Boot provides the application. Read through the section on configuring Spring Boot data sources to see how these are generally configured in YAML and in Java config beans.

Connecting to the database is only one part of the traditional data access layer of an application - there’s usually a whole stack of data services that present an API around querying and updating the database. This might involve your ORM of choice mapping Java POJOs to SQL queries, or it might be a facade on top of hand-crafted stored procedures. For apps that don’t require large refactoring, we’ll change just enough of this data layer to play well with Spring DataSource beans. For larger modernization efforts, we’ll look to refactor this layer to use Spring Data as it will drastically reduce the necessary code (and as a result reducing the test surface area the team is responsible for too). To get an idea of what Spring Data can do for you in place of manually-built data layer, check out the [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/) guide.


#### Homework

- [x] Run through the [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/) guide
