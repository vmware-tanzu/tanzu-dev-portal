---
title: "Getting Started with Spring Data REST and PostgreSQL"
date: "2023-06-05"
lastmod: "2023-06-05"
level1: Building Modern Applications
level2: Modern Development Practices
tags:
- spring-data
- postgresql
# Author(s)
team:
- Steven Pousty
---

I just want to get it out there&mdash;once I grokked [Spring Data REST](https://spring.io/projects/spring-data-rest), I was sad it took me this long to find it. Hook up Java Persistence Annotation (JPA) and Hibernate to your Spring Boot app, add the Spring Data REST (SDR) dependency, and then a few lines of annotated Java code, and BOOM you have a REST API. As an added bonus, it does the right thing and actually makes your REST API automatically accessible to a Hypermedia as the Engine of Application State ([HATEOAS](https://en.wikipedia.org/wiki/HATEOAS)) client.

Having used it a bit more, I need to temper this enthusiasm. SDR enforces HATEOAS by default and you have to put in extra work to turn it off. I feel like HATEOAS is great in theory, and not practical in practice, especially when other humans are programming against your REST API. 

To be more precise, when I talk about REST in this blog post I am referring to Level 2 maturity in [Richardson’s model](https://martinfowler.com/articles/richardsonMaturityModel.html) of API maturity. In my work, and in talking with other developers, the [Fielding level of REST](https://en.wikipedia.org/wiki/Representational_state_transfer), while interesting, is not really practical in a lot of their use cases. There are few clients, especially in the major web and mobile frameworks, working with a Level 3 API. The benefit from implementing the full REST mantra provides minimal value compared to the extra effort needed to implement it. 

This is a long way of saying, be ready for a HATEOAS API, and know that you will have to put in a little work to get it return object IDs.

One of the fun parts about my job is getting to explore new technology. For most of my developer career I was in the Java EE camp (though not EJBs) versus the Spring camp. I think this has mostly to do with historical reasons. At the time when I decided I was not team Spring (July 2004), Spring was an up and comer and, if memory serves, involved a lot of XML. Well, one of the many benefits of coming to VMware is getting to learn Spring from [Spring people](https://spring.io/).

My internal advocate team is working on an internal project and I am leading up the API/backend pieces. I have already used Spring Boot with JPA/Hibernate and liked it, but I remember seeing this Spring Data REST thing and was curious about what it could do for me. I couldn’t quite find a “getting started” guide that put all the pieces together for me, and so, the rest of this blog post is the getting started I wanted. 

## Into the tech

I assume:
- You know how to install and use the basics of PostgreSQL (if you don’t you need to remedy your deficiency immediately 😀).
- You understand the basics of [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) and [JPA](https://thorben-janssen.com/what-is-spring-data-jpa-and-why-should-you-use-it/) in particular. 
- You understand annotations and the basics of Spring Boot.

Also, there is a [GitHub repository](https://github.com/thesteve0/datarestblog) where all the code is available for this blog post. I think that covers about all you need—so away we go!

First step is to create a database in PostgreSQL. For the purposes of this post, we will call it `mydatabase`. Start up your PostgreSQL instance (on standard ports). 

Next, you'll need to set up your Spring Boot application. You can do this using the [Spring Initializr website](https://start.spring.io/). Select the following options:

- **Project** – Maven (or Gradle—I don’t know it so can’t help you with it.)
- **Language** – Java
- **Spring Boot** – 3.0.5 (or later)
- **Packaging** – Jar
- **Java** – 11 (17 or 20 is also fine)
- **Dependencies** – Spring Web, Spring Data JPA, PostgreSQL Driver, Spring Data REST

Once you've generated the project, extract the contents and open it in your preferred IDE. I am an [IntelliJ](https://www.jetbrains.com/idea/) fan.

Go to your `application.properties` file in src/main/java/resources and add the following configuration for your PostgreSQL database:

```
spring.datasource.url=jdbc:postgresql://localhost:5432/mydatabase
spring.datasource.username=postgres
spring.datasource.password=your_password_here
spring.jpa.hibernate.ddl-auto=create-drop
```

Make sure to replace `your_password_here` with the password for your PostgreSQL database. In this case and for convenience sake, we are using the `postgres` user, which is the root user for the database. **Note:** DO NOT DO THIS IN PRODUCTION. 

## Let’s write some code

Time for some coding. We are going to work with two tables in our database and entity classes&mdash;Person and Department. There is a one to many relationship between Department and People. 

First, let's create the `Department` entity:

```java
package com.vmware.tanzu.datarestblog.dataobjects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Department {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   private String name;

   @OneToMany(mappedBy = "department")
   private List<Person> people;

}
```

This class defines a `Department` entity with `id`, `name`, and `people` attributes. The `people` attribute is a list of `Person` entities, and the `@OneToMany` annotation is used to specify the relationship between `Department` and `Person`. The `mappedBy` attribute is used to specify the name of the attribute on the `Person` entity that maps back to `Department`.

Next, let's create the `Person` entity with a reference to `Department`:

```java
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Person {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   private String firstName;

   private String lastName;

   @ManyToOne
   private Department department;

}
```

This class includes a `department` attribute that references a `Department` entity, and the `@ManyToOne` annotation is used to specify the relationship between `Person` and `Department`.

## Exposing those entities through a REST API

Create a `PersonRepository` interface:

```java
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.vmware.tanzu.datarestblog.dataobjects.Person;

@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface PersonRepository extends PagingAndSortingRepository<Person, Long> {
}
```

This interface extends the `PagingAndSortingRepository` interface provided by Spring Data JPA and specifies the `Person` entity type and the type of the entity's primary key (`Long`). The `@RepositoryRestResource` annotation is used to specify the endpoint for accessing `Person` resources. 

Adding this interface, automagically, creates a REST endpoint at `http://your.host.info/people` when your application is started. Because we extended `PagingAndSortingRepository`, that endpoint has the ability to return subsets of the data as a page. You can also sort the data before returning it by specifying the sort parameter in the request URL. But a limitation of this inheritance is that the [class we extended](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/PagingAndSortingRepository.html) only contains methods for `findAll()`. We will fix that limitation in later code. 

Now let’s make an interface for the department table. Since the table will remain small we don’t have to make the results pageable or sortable. We will just extend `CrudRepository` to get all the normal [CRUD operations](https://nordicapis.com/crud-vs-rest-whats-the-difference/) on the department table. The JavaDoc for `CrudRepository` shows that this class supports the standard CRUD method calls, but not paging and sorting. 

Create a `DepartmentRepository` Interface:

```java
import com.vmware.tanzu.datarestblog.dataobjects.Department;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "departments", path = "departments")
public interface DepartmentRepository extends CrudRepository<Department, Long> {
}
```

And that’s it! We are now done with coding. That is all the code needed to create a fully functioning HATEOAS REST interface!

## Show me the money

I don’t blame you if you don’t believe me&mdash;I was stunned it was this easy. Let’s go ahead and take a look at the REST API we just created. 
Start your application, and navigate to `http://localhost:8080` in your web browser. You should see JSON that looks like:

```json
{
  "_links": {
	"people": {
  	    "href": "http://localhost:8080/people{?page,size,sort}",
   	    "templated": true
	},
	"departments": {
  	    "href": "http://localhost:8080/departments"
	},
	"profile": {
    	    "href": "http://localhost:8080/profile"
	}
    }
}
```

This JSON is a machine (and human) readable representation of the entities available, their URL, and if the URL accepts any parameters. 

If you click on the link for the people endpoint, you should see an empty JSON array (`[]`), but that’s because there is no data in our database. I have also included a SQL file in the base of the [GitHub repository](https://github.com/thesteve0/datarestblog) for this blog post that you can use to populate the database. You can also just use your favorite tool and add any data you want. 

Once you have added some people to the database, a GET request to the people endpoint should return all the data in the `person` table in the database. Along with the values for each person, it returns the URL to get that person’s data and the URLs to get the information from child tables. As explained above, if you click the URL for an individual person such as `http://localhost:8080/people/1`, you will receive an error. Again, this is because the `PagingAndSortingRepository` does not contain any methods to find a person by ID. 

These same capabilities apply to the departments endpoint but you will notice, its URL does not accept parameters. This means it does not allow for paging or sorting.

Let's fix the `PersonRepository` to include a method for finding a `Person` entity by ID. Paste the following method inside the `PersonRepository` class. The class should now look like the following:

```java
public interface PersonRepository extends PagingAndSortingRepository<Person, Long> {
    Person findById(Long id);
}
```

That’s it! We just added a method to our class that will return a `Person` object when given an ID. If you redeploy your app and go back to your rest endpoint, nothing has changed on the top level. However, now the URLs for the individual person in the people response will actually work. 

## Adding a custom non-standard query endpoint

Now suppose you want to have an endpoint that returns a custom result set (the result is not one of our entity objects) based on a query in Java Persistence Query Language (JPQL) or in SQL. Never fear, that is just about as simple as well. All we need to know is an annotation and two lines of code. 

Here's an example of how you can define a custom method that returns a list of `Person` entities with a given `lastName` and `firstName` Steve. 

Just add the following two lines to below the `findById` method:

```java
    @Query("SELECT p FROM Person p WHERE p.lastName = :lastName AND p.firstName = ‘Steve’")
    List<Person> findAllStevesByLastName(@Param("lastName") String lastName);
```

In this example, we defined a custom method named `findAllStevesByLastName` that takes a `String` parameter named `lastName`. We used the `@Query` annotation to specify a JPQL query that selects `Person` entities with the given `lastName`. We also used the `@Param` annotation to bind the `lastName` parameter to the query. Both the method name and the `@Param` name will be part of the resulting URL.

Now, when you access the `/people` endpoint of your REST API, you will have a new endpoint available at `/people/search/findAllStevesByLastName?lastName={lastName}` that returns a list of `Person` entities with the given `lastName`. Note that the name of the custom method (`findAllStevesByLastName`) is used in the endpoint URL, and the `lastName` parameter is passed as a query parameter.

Here is an example URL that should work if you imported the data from the [SQL file](https://github.com/thesteve0/datarestblog/blob/main/schema_data.sql).

To find me:
`http://localhost:8080/people/search/findAllStevesByLastName?lastName=Pousty`

To get an empty result set:
`http://localhost:8080/people/search/findAllStevesByLastName?lastName=Junod`

**Note:** The URL and parameters are case sensitive. 

## Wrap-up

When I started on the internal project, I was guessing I was going to be writing a bunch of JQL and REST controller code. Having seen how easy and powerful Spring Data REST is for creating REST endpoints, it will actually be much less often that I actually hand write all those endpoints. 

We only scratched the surface of what is possible with Spring Data REST. We didn’t cover topics like creating a listener for an API call [using events](https://docs.spring.io/spring-data/rest/docs/current/reference/html/#events) or [excerpting data](https://docs.spring.io/spring-data/rest/docs/current/reference/html/#projections-excerpts.excerpts) to avoid multiple GETs. I encourage you to explore the resources on the [product page](https://spring.io/projects/spring-data-rest). 

I hope this blog can get you started on trying it out. Let me know if you found it as eye opening as I did. You can also ask me “have you been under a rock for years?” Either way, I look forward to seeing what you build with Spring Data REST and PostgreSQL—you are using PostgreSQL aren’t you?!?
