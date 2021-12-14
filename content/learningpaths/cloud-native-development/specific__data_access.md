---
date: '2021-07-12'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: Data Access
weight: 130
oldPath: "/content/outcomes/cloud-native-development/specific__data_access.md"
aliases:
- "/outcomes/cloud-native-development/specific__data_access"
tags: []
---

Your app may use manually-configured JDBC drivers, ORM solutions such as [JPA](https://en.wikipedia.org/wiki/Jakarta_Persistence), [Hibernate](http://hibernate.org/orm/), [MyBatis](https://mybatis.org/mybatis-3/), [EclipseLink](https://www.eclipse.org/eclipselink/), or [JNDI](https://en.wikipedia.org/wiki/Java_Naming_and_Directory_Interface) to lookup database connections provided by the containing web server. To improve integration with the Spring and Spring Boot ecosystems for all these, we look into migrating connections to a Spring `DataSource`. 

Read the section on [configuring Spring Boot data sources](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-access.configure-custom-datasource) to see how you can configure these with YAML or Java configuration beans.

Connecting to the database is only one part of the traditional data access layer of an application. There is usually a whole range of data services and frameworks that present an API query and database update. This might involve your ORM of choice mapping Java POJOs to SQL queries, or it might be a facade on top of hand-crafted stored procedures. 

For apps that do not require significant refactoring, we change just enough of this data layer so that it plays well with Spring `DataSource` beans. For broader modernization efforts, we recommend refactoring this layer using Spring Data to drastically reduce the code length (and test surface area the team is responsible for). To learn more about what Spring Data can do for you that a manually-built data layer cannot, see the [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/) guide.

## Homework

- Read the [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/) guide.