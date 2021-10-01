---
date: '2021-01-29'
lastmod: '2021-02-05'
linkTitle: Spring REST Docs
parent: Spring Boot
patterns:
- API
tags:
- Spring Boot
- Testing
- Spring
title: Using Spring REST Docs
weight: 4
oldPath: "/content/guides/spring/spring-rest-docs.md"
aliases:
- "/guides/spring/spring-rest-docs"
level1: Building Modern Applications
level2: Frameworks and Languages
---

[Spring REST Docs](https://spring.io/projects/spring-restdocs#overview) provides a useful and always update-to-date way to document an application's RESTful services by combining hand-written documentation created with [Asciidoctor](https://asciidoctor.org) and auto-generated snippets created by [Spring MVC unit tests](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#unit-testing-spring-mvc). 

The `@AutoConfigureRestDocs` [annotation](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-testing-spring-boot-applications-testing-autoconfigured-rest-docs) in Spring Boot allows you to leverage Spring REST Docs in your tests. This guide explains how to configure Spring REST Docs and use it in combination with [JUnit](https://junit.org/junit5/) for unit testing. 


## Configuration steps for Spring REST Docs  
Java 7 and Spring Framework 4.2 are the minimum requirements, and you will need to add the following dependency to your project's `pom.xml` file. You can omit the version if it is already managed by the parent POM.

```xml
<dependency>
    <groupId>org.springframework.restdocs</groupId>
    <artifactId>spring-restdocs-mockmvc</artifactId>
    <version>2.0.5.RELEASE</version>
    <scope>test</scope>
</dependency>
```

The following two plugins are configured to process Asciidoctor files and include the documentation during application packaging.

```xml
<build>
   <plugins>
      <plugin>
         <groupId>org.asciidoctor</groupId>
         <artifactId>asciidoctor-maven-plugin</artifactId>
         <version>2.1.0</version>
         <dependencies>
            <dependency>
               <groupId>org.asciidoctor</groupId>
               <artifactId>asciidoctorj</artifactId>
               <version>2.4.2</version>
            </dependency>
         </dependencies>
         <executions>
            <execution>
               <id>generate-docs</id>
               <phase>prepare-package</phase>
               <goals>
                  <goal>process-asciidoc</goal>
               </goals>
               <configuration>
                  <backend>html</backend>
                  <doctype>book</doctype>
                  <attributes>
                     <snippets>${project.build.directory}/generated-snippets</snippets>
                  </attributes>
               </configuration>
            </execution>
         </executions>
      </plugin>
      <plugin>
         <artifactId>maven-resources-plugin</artifactId>
         <executions>
            <execution>
               <id>copy-resources</id>
               <phase>prepare-package</phase>
               <goals>
                  <goal>copy-resources</goal>
               </goals>
               <configuration>
                  <outputDirectory>${project.build.outputDirectory}/static/docs</outputDirectory>
                  <resources>
                     <resource>
                        <directory>${project.build.directory}/generated-docs</directory>
                     </resource>
                  </resources>
               </configuration>
            </execution>
         </executions>
      </plugin>
   </plugins>
</build>
```

## Set up for JUnit testing

First declare a `JUnit` rule which is configured with the output directory where the generated document snippets will be saved. This output directory should match the snippets directory specified in the `pom.xml` file.

```java
@Rule
public JUnitRestDocumentation restDocumentation = new JUnitRestDocumentation( "target/generated-snippets" );
```
Then configure MockMvc in a method annotated with @Before method.
```java

private MockMvc mockMvc;

@Before
public void setUp() {
    this.mockMvc = MockMvcBuilders
   				 .webAppContextSetup( this.context )
   				 .apply( documentationConfiguration( this.restDocumentation ) )
   				 .alwaysDo(
   					 document(
   						 "{method-name}/{step}",
   						 preprocessRequest(prettyPrint()),
   						 preprocessResponse(prettyPrint())
   					 )
   				 )
   				 .build();
}
```

In the above set up, parameterized output directory is set to be `{method-name}/{step}`, where:

* `{method-name}` is the name of the test method, formatted using kebab-case
* `{step}` represents the count of calls made to the service in the current test

Refer to the section Generate document snippets to see how the parameterized directory is interpreted.

## Write unit test to invoke the RESTful service and document the API

The following unit test case does the following actions:

* Performs an `HTTP GET` against a RESTful service endpoint
* Sets the values for four path parameters which are `accountNumber, lobType, term, sequence, and context`
* Sets the value for a request parameter named `asOf`
* Sets the acceptable media type of the HTTP response
* Validates the response status code is 200
* Validates the response payload
* Explicitly documents all path parameters
* Explicitly documents the request parameter

Other HTTP request components such as HTTP request headers can also be set and documented. Other HTTP response components such as HTTP response headers can be documented as well.

```java
@Test
public void testEventSyncFoundEventsWithAsOf() throws Exception {

    String url: "/sync/{accountNumber}/{lobType}/{term}/{sequence}/{context}";

    EventsDetails eventDetails = mockEventDetailsAsOf();

    given( eventService.readEvents( any( ReadEvents.class ) ) ).willReturn( eventDetails);

    this.mockMvc.perform(
   		 RestDocumentationRequestBuilders
   			 .get( url, accountNumber, lobType, term, sequence, "PriorCarrier" )
   			 .param("asOf", String.valueOf( Clock.systemUTC().millis() ))
   			 .accept(MediaType.APPLICATION_JSON)
   		 )
   	 .andExpect( status().isOk() )
   	 .andExpect( content().json( mapper.writeValueAsString( eventDetails.getEvents()) ) )
   	 .andDo(
   		 document("{method-name}/{step}",
   			 pathParameters (
   				 parameterWithName( "accountNumber" ).description( "The account number of" ),
   				 parameterWithName( "lobType" ).description( "The line of business" ),
   				 parameterWithName( "term" ).description( "The term" ),
   				 parameterWithName( "sequence" ).description( "The sequence" ),
   				 parameterWithName( "context" ).description( "The context of" )
   			 ),
   			 requestParameters(
   				 parameterWithName( "asOf" ).description( "The asOf" )
   			 )
   		 )
   	 );

    verify (eventService, times(1)).readEvents(any (ReadEvents.class));

}

```

## Generate document snippets
When the unit test is executed, the documentation snippets are generated. In the above example, the documentation snippets are generated in the directory `target/generated-snippets/test-event-sync-found-events-with-as-of/1` and the snippets include the following Asciidoctor documentation:

* `curl-request.adoc`
* `http-request.adoc`
* `http-response.adoc`
* `path-parameters.adoc`
* `request-parameters.adoc`

## Integrate and use the generated Asciidoctor snippets
Create an `index.adoc` file under directory `src/main/asciidoc/`. In this file, you will use the Asciidoctor "include" macro to include the above generated Asciidoctor snippets, as shown below.

```
To sync up with asOf time, you will:
include::{snippets}/test-event-sync-found-events-with-as-of/1/curl-request.adoc[]

The HTTP request sent to the server is:
include::{snippets}/test-event-sync-found-events-with-as-of/1/http-request.adoc[]

The path parameters are:
include::{snippets}/test-event-sync-found-events-with-as-of/1/path-parameters.adoc[]

The request parameters are:
include::{snippets}/test-event-sync-found-events-with-as-of/1/request-parameters.adoc[]

The HTTP response is:
include::{snippets}/test-event-sync-found-events-with-as-of/1/http-response.adoc[]
```

As specified in the `pom.xml`, the `asciidoctor-maven-plugin` will execute the "process-asciidoc" goal during the `prepare-package` phase. In the above example, the `index.adoc` will be rendered as `index.html` and stored in the directory `target/generated-docs`. Then the `maven-resources-plugin` executes the "copy-resources" goal to copy the rendered `index.html` to the right directory for application packaging.

## Keep Learning
Spring offers a useful [getting started guide on Spring Rest Docs](https://spring.io/guides/gs/testing-restdocs/) with a tutorial that walks you through the process of using them.