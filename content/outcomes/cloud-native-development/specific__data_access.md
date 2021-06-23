---
title: Data Access
weight: 130
layout: single
team:
 - VMware Tanzu Labs
---

Your app may use manually-configured JDBC drivers, ORM solutions like JPA, Hibernate, or MyBatis, or JNDI to lookup database connections provided by containing web server. For all of these, we will look into migrating connections to a Spring `DataSource` to improve integration with the Spring and Spring Boot ecosystems. 

Read through the section on [configuring Spring Boot data sources](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-access.configure-custom-datasource) to see how you can configure them with YAML or Java configuration beans.

Connecting to the database is only one part of the traditional data access layer of an application. There is usually a whole range of data services and frameworks that present an API querying and updating the database. This might involve your ORM of choice mapping Java POJOs to SQL queries, or it might be a facade on top of hand-crafted stored procedures. For apps that do not require significant refactoring, we will change just enough of this data layer to play well with Spring `DataSource` beans. For broader modernization efforts, we will look to refactor this layer to use Spring Data as it will drastically reduce the necessary code (and test surface area the team is responsible for too). To get an idea of what Spring Data can do for you in place of a manually-built data layer, check out the "[Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)" guide.

#### Homework

- Run through the [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/) guide.
