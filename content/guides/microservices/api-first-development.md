---
date: '2020-11-05'
description: API-First approach development allows API teams design-driven development,
  API governance, and agility in incorporating changes.
lastmod: '2021-03-07'
linkTitle: API-First Development
patterns:
- API
tags:
- Swagger
- OpenAPI
- Maven
- Spring
- Spring Boot
team:
- Dan Dobrin
title: Understanding API-First Development
topics:
- Spring
- Microservices
weight: 4
oldPath: "/content/guides/microservices/api-first-development.md"
aliases:
- "/guides/microservices/api-first-development"
level1: Building Modern Applications
level2: Microservice Patterns
---

Organizations are increasingly embracing new processes to deal with microservices architectures, containerization, and continuous delivery as part of the cloud migration journey.
Traditional code-first application development focuses on implementing business logic first, leaving the interface that will eventually be created to expose the functionality as an afterthought. At the time of implementing the interface (the API), most or all business logic has already been implemented, which results in the core business logic driving the API. The API has not been shared with either consumer teams or QA before the code is built, precluding any timely feedback. 

Enterprise Architects, API consumers, QA resources, etc. have access to the API only when the code is committed to source control. Any feedback requires implementation changes, eliminating any possibility of parallelizing development efforts. Additional feedback loops result in delays for API consumers and push back overall project delivery. In effect, it becomes a traditional waterfall process.

**Bottom-line**: in a **“Code-First”** approach, you code the API and generate a machine-readable definition from the code. 

## The Design-First and API-First Approach
In the alternative **“Design-First”** approach, you write out your API design in a human and machine-readable form that all stakeholders can understand, review, and discuss before starting to code. 

In API design, **“Contract-First”** is used interchangeably with Design-First, indicating that the API Designer defines the contract of the API before the implementation is coded. Applying the design-first / contact-first methodology to the world of API development results in **“API-First”** development. 

The basic idea is that you create an API contract before doing a full code implementation. The human-readable API specification becomes the first deliverable, allowing fast feedback from various stakeholders. These rapid iterations are a game changer, as changing the API specification takes minutes not hours or days and __*all stakeholders have the same understanding and speak the same language*__. Once the team determines that the API specification is “good enough”, the skeleton of a full application can be generated. Many different programming languages are supported. For example, a full Spring Boot Application including [Maven](https://maven.apache.org) scripts and JSON-to-Java mapping can be generated. 

The developer codes the business logic implementation in the generated server stub. As the server-side developer is working on their implementation, consumers of the API can generate client-side stubs and start their implementation work. QA teams can use the API spec to get a head start on service testing.

The **API-First**  approach has several advantages: 
* Design-driven development - API designers use the API design to drive development efforts
* Parallel work - Multiple stakeholders work in parallel (API designers, API consumers, technical writers, QA)
* API Governance - API teams can use a **contract-as-code* approach, versioning and publishing their API specifications
* Assisting DevOps - DevOps team can use the API design to test the API before Production deployment
* Agility in incorporating changes - API design becomes an ongoing and evolving process, well-supported by automated tooling 

**NOTE**: API First is illustrated in this document through the lens of the [OpenAPI Specification](http://spec.openapis.org/oas/v3.0.3), with code generated for a [Spring Boot Application](https://spring.io/projects/spring-boot).

## API-First with Open API Spec 3.0

The OpenAPI Specification (OAS) is a language and vendor-agnostic API specification standard, which allows both humans and computers to discover and understand the capabilities of the service without access to source code or documentation. When properly defined, a consumer can understand and interact with a remote service with a minimal amount of implementation logic. While there are many permutations of tools, technologies, and languages to approach API design and development, most new server-side development happens in the Java programming language. 

This document will walk you through a well-known problem (Petstore) and illustrates a real-world scenario of putting **‘API-First in Practice’** with Open API for the first time. The goal is to provide a clear path to becoming effective at agile API development 

Read more about the [Open API Initiative](https://openapis.org).

## API-First Development Workflow

There are 7 high-level steps in the API-First workflow:

1. **Create** the API specification
2. **Build** API specs at-scale within your organization
3. **Collaborate** with stakeholders
4. **Version / Share** API spec with other teams
5. **Generate** Client/Server scaffolding for Spring Boot
6. **Implement** business logic
7. **Deploy** the microservice 

![API Dev Flow](/images/guides/microservices/api-first/api-first-dev-new.png)

In summary, begin the API design using the OpenAPI Spec 3.0.x. Then evolve and iterate the API specification in collaboration with the product owner, service consumers, and other stakeholders. Once the team is comfortable that the API specification is 'good enough' - generate the server-side artifacts for a Spring Boot Application. Finally, deploy the app to the cloud or locally. 

## Step 1: Create the API Specification

Use the OpenAPI 3.0 specification standard and the YAML format to describe the API. 

This example uses a modified Petstore OpenAPI [sample spec](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml), incorporating concepts such as **contract-as-code** and API governance.
The starting point for this exercise is the [API-First OpenAPI specification](/images/guides/microservices/api-first/apifirst_openapi.yaml).

Start by importing the [API specification](/images/guides/microservices/api-first/apifirst_openapi.yaml) into the Web version of the [OpenAPI editor](https://editor.swagger.io/). Please note that the editor starts by default with a sample, or your last imported specifications. You can also run the OpenAPI editor [locally](https://swagger.io/docs/open-source-tools/swagger-editor/) if you prefer.
![API Editor](/images/guides/microservices/api-first/apieditor.png)

### The top-level context of the API:
```yaml
openapi: 3.0.2
servers:
  - url: /v3
info:
  description: |-
    ddobrin: 
    This is a sample Pet Store Server based on the OpenAPI 3.0 specification, with changes to the specification file layout.
    The resulting specification file illustrates reusable specification elements, for usage in organizations building APIs at scale.

    swagger.io team:
    This is a sample Pet Store Server based on the OpenAPI 3.0 specification.  You can find out more about
    Swagger at [http://swagger.io](http://swagger.io). In the third iteration of the pet store, we have switched to the design first approach!
    You can now help us improve the API whether it is by making changes to the definition itself or to the code.
    That way, with time, we can improve the API in general, and expose some of the new features in OAS3.

    Some useful links:
    - [The Original Pet Store repository](https://github.com/swagger-api/swagger-petstore)
    - [The original source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)
  version: 1.0.6-SNAPSHOT
  title: Swagger Petstore - OpenAPI 3.0
  termsOfService: 'http://swagger.io/terms/'
  contact:
    email: ddobrin@vmware.com 
  license:
    name: Apache 2.0
    url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
tags:
  - name: pet
    description: Everything about your Pets
    externalDocs:
      description: Find out more
      url: 'http://swagger.io'
  - name: store
    description: Operations about user
  - name: user
    description: Access to Petstore orders
    externalDocs:
      description: Find out more about our store
      url: 'http://swagger.io'
```

Consumers of the API should start by reading the info, version and tags sections to understand its purpose and goals. This should be followed by a detailed analysis of the tags, paths and component information to understand the API fully and to learn how to interact with it.

* **openapi** - This string MUST be the semantic version number of the OpenAPI Specification version that the OpenAPI document uses, based on [Semver 2.0.0](https://semver.org/)
* **info** - This element provides metadata about the API and MAY be used by tooling as required
* **title** -  Ensure that the title is clear and broad enough that it covers the API as whole
* **version** - Specifies the version of this particular specification, for ex 1.0.6-SNAPSHOT
* **tags** - Specifies a list of unique tags used by the specification with additional metadata

### Defining the Paths
```yaml
paths:
  /pet:
    post:
      tags:
        - pet
      summary: Add a new pet to the store
      description: Add a new pet to the store
      operationId: addPet
      responses:
        '200':
          description: Successful operation
          content:
            application/xml:
              schema:
                $ref: '#/components/schemas/Pet'
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
        '405':
          description: Invalid input
      security:
        - petstore_auth:
            - 'write:pets'
            - 'read:pets'
      requestBody:
        description: Create a new pet in the store
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
          application/xml:
            schema:
              $ref: '#/components/schemas/Pet'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/Pet'
    put:
      tags:
        - pet
      summary: Update an existing pet
      description: Update an existing pet by Id
      operationId: updatePet
      responses:
        '200':
          description: Successful operation
          content:
            application/xml:
              schema:
                $ref: '#/components/schemas/Pet'
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
        '400':
          description: Invalid ID supplied
        '404':
          description: Pet not found
        '405':
          description: Validation exception
      security:
        - petstore_auth:
            - 'write:pets'
            - 'read:pets'
      requestBody:
        description: Update an existent pet in the store
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
          application/xml:
            schema:
              $ref: '#/components/schemas/Pet'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/Pet'
  /pet/findByStatus:
...
  /pet/findByTags:
...
  
```

The path parameters define the shape of the API via URIs. Each URI definition has multiple HTTP verbs that can act on it.

* **post**, **put**, **get**, etc - Definition of the respective operation in this path, what the API expects
* **summary**, **description** - A short summary and description of what the operation does and its behavior
* **operationId** - Unique string to identify the operation
* **tags** - Tags used for logical grouping of operations by resources or other qualifiers
* **security** - Contains a declaration of which security mechanisms can be used for this operation
* **requestBody** - The request body applicable for this operation, supported only in HTTP methods
* **responses** - The list of possible responses as they are returned from executing this operation

### Defining the Component Objects 
The Component Object section defines a set of reusable objects for different aspects of the OpenAPI spec. Objects defined within the components object will have no effect on the API unless they are explicitly referenced from properties outside the components object.

Please note that the definitions for some of the component objects have been commented out and replaced by a link to an external document. This is addressed and explained in step 2 of this guide.

```yaml
components:
  schemas:
...
    Customer:
      properties:
        id:
          type: integer
          format: int64
          example: 100000
        username:
          type: string
          example: fehguy
        address:
          type: array
          items:
            $ref: '#/components/schemas/Address'
          xml:
            wrapped: true
            name: addresses
      xml:
        name: customer
      type: object
    Address:
      properties:
        street:
          type: string
          example: 437 Lytton
        city:
          type: string
          example: Palo Alto
        state:
          type: string
          example: CA
        zip:
          type: string
          example: 94301
      xml:
        name: address
      type: object
...
    # The response has been refactored into a reusable element definition
    ApiResponse:
        $ref: "./schemas/response.yaml"
    
    # ApiResponse:
    #   properties:
    #     code:
    #       type: integer
    #       format: int32
    #     type:
    #       type: string
    #     message:
    #       type: string
    #   xml:
    #     name: '##default'
    #   type: object
...

```

## Step 2: Build API Specs At-Scale Within Your Organization
Organizations don’t build the majority of their API specifications in isolation or as one-off documents. As lines-of-business scale up their API/Microservices efforts, it is imperative to introduce best practices to API design, similar to their development or deployment counterparts.

One such best practice is **reuse** of specification component objects, while treating API specs in the context of **governance** as **contract-as-code**.

In our Petstore spec, we have simply externalized the definition of the ApiResponse and Order objects to separate files, which offers major advantages:
* Version each of the component files independently using the same Semver semantic versioning notation
* Allow different APIs to use independent versions of reusable component objects
* Standardize reusable components such as header elements, standard errors, reusable domain object representation, etc.
* Integrate with DevOps processes for consistent management of APIs at scale

```yaml
# apifirst_openapi.yaml
...    
    # The response has been refactored into a reusable element definition
    ApiResponse:
        $ref: "./schemas/response.yaml"
...
```
```yaml
# response.yaml
properties:
    code:
        type: integer
        format: int32
    type:
        type: string
    message:
        type: string
xml:
    name: '##default'
type: object
```

While this process lends itself well to building API specs at scale within an organization, from a design perspective, we need to look at the **process of bundling** multiple API specification files into a single file, representing the API specification. This bundling process is a prerequisite to generating client/server stubs from a single definition file or publishing the spec to the API Marketplace, where consumers can discover it.

API marketplaces aggregate APIs and provide a place for application developers to upload, distribute, and monetize their APIs while also providing a space for consumers to discover and implement APIs for their own products. Organizations will decide which APIs will be published for internal, respectively external consumption.

Another big benefit for providers who list their APIs on a marketplace is that It makes it possible to publish an API to gather feedback and assess its feasibility, before proceeding to its implementation.

There are multiple tools available to bundle API specifications. For this example, I use [__*swagger-cli*__](https://github.com/APIDevTools/swagger-cli):
```shell
# Installation
npm install -g @apidevtools/swagger-cli

# Usage 
# bundle a file
> swagger-cli bundle -o <bundled file> -t yaml <starter file>

# validate the file against the OpenAPI v3 specification
> swagger-cli validate <bundled file>

# Our example
# Start file: apifirst_openapi.yaml
# De-referenced files: order.yaml and response.yaml
> swagger-cli bundle -o apifirst_openapi_bundled.yaml -t yaml apifirst_openapi.yaml
> swagger-cli validate apifirst_openapi_bundled.yaml 

```

The bundled file is available [here](/images/guides/microservices/api-first/apifirst_openapi_bundled.yaml) and you can observe the de-referenced component objects, for example ApiResponse:
```yaml
   ApiResponse:
      properties:
        code:
          type: integer
          format: int32
        type:
          type: string
        message:
          type: string
      xml:
        name: '##default'
      type: object
```

## Step 3: Collaborate with stakeholders

As the API is developing, the specification file can and should be shared with other collaborators for review. The idea is to ensure that the paths and models are *good enough*. You don't have to strive for perfection; a few brief meetings with stakeholders will ensure that there is a common understanding and consensus. API-First allows for rapid iterations without changing the code/plumbing during the initial phases.

The first cut of an API spec should minimally include the RESTful paths, responses and high-level request and response objects. The API should be small enough to make it easily understandable for a stakeholder within a single review session. A good understanding of domain driven design, API design, REST design and Open API spec are all prerequisites.

The API design spec can save you hours of implementation and refactoring effort when developing the code. It allows subject matter experts to discuss the API and make changes.  Quality engineers can get involved and begin early test design and development. Architects can begin to think about system architecture implications and sourcing of data. Data analysts can begin thinking about data fields and standards alignment where appropriate. The spec becomes the campfire across which multiple teams can gather to discuss the API and make changes.

## Step 4: Version / Share API Spec with Other Teams
API specifications should be treated as code; they should be shared and versioned.

Design and development teams are familiar with source control tools and should apply the same governance principles to API specifications, introducing the concept of **contract-as-code**.

This allows the decoupling of teams working on code generation and implementation from API Design teams--who can continue work on refining the spec--or QA and Architecture teams.

## Step 5: Generate Client/Server Scaffolding for Spring Boot

To jump-start the API development process, a command-line tool can be used to generate artifacts for both the client and server side. This guide demonstrates the process for Spring Boot as an example:
* server-side - project scaffolding, including Spring Boot artifacts for controller, model and API, as well as configuration and the Maven POM file
* client-side - model to be used by the client, in their language of choice

The example below uses the [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator) from [OpenAPITools](https://openapitools.org/).

```shell
# Installation
> brew install openapi-generator

# Usage 
> openapi-generator-cli generate -i <input API spec> -g <target> -o <output folder>

# Generate Spring Boot artifacts from the specification defined in **apifirst_openapi_bundled.yaml**
# Use default parameters, for ex Java 8
> openapi-generator generate -i apifirst_openapi_bundled.yaml -g spring -o output

# You have the choice of generating a Java or Kotlin Spring Boot project, with detailed generation parameters listed below
# Multiple parameters can be customized, for ex. package names, Java version, Reactor artifacts, etc
https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/spring.md
https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/kotlin-spring.md 
```

The generated artifacts are built and Spring Boot can then be started:
```shell
# build
> cd output
> mvn clean package

# start the app; built Jar derives the name from the version in the spec
> java -jar target/openapi-spring-1.0.6-SNAPSHOT.jar 
# or 
> mvn spring-boot:run
```

To generate client-side artifacts, for example in Java, you can use the parameters defined in
```shell
> openapi-generator generate -i apifirst_openapi_bundled.yaml -g java -o output_client

https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/java.md
```

The API generator automatically generates a user-friendly web page (Swagger UI), which you can leverage right away after starting the Spring Boot application. 

![Swagger UI](/images/guides/microservices/api-first/api-first-swaggerui1.png)

This allows for quick execution of the API -- the web-form allows for data to be entered directly and for the API to be tested quickly by any user without special tools or technology skill sets.

![Swagger UI Try It](/images/guides/microservices/api-first/api-first-swaggerui2.png)

## Step 6: Implement Business Logic

The generated code can be opened in the IDE of your choice and business logic can be implemented in the three controllers generated for this API: Pet, User, Store API Controller.
![Spring Boot](/images/guides/microservices/api-first/api-first-springboot-intellij.png)

## Step 7: Deploy the Microservice 

As you have seen, the OpenAPI generator generates source code, Maven scripts, etc., allowing you to build the executable Spring Boot JAR file. It is up to your team to decide what process you will follow when deploying the resulting service on-premises or to the cloud.

## Why Choose API-First?

There are many permutations of tools, technologies, languages and methods for approaching API design and development. You can save weeks of microservices coding with a few hours of API design and proper governance and communication.  

The goal of this guide is to provide a clear path to effective API-First development. API-First Development practice as outlined in this document is not only effective, but also consistent, repeatable and makes more efficient use of human resources.

## Keep Learning
Here's a widely used, opinionated list of things you should be aware of to make effective use of API-First:

1. [Open API 3.0 Specification](https://github.com/OAI/OpenAPI-Specification)
2. [JSON Spec](http://www.json.org)
3. [YAML Spec](http://yaml.org/spec/)
4. [Open API Editor](https://editor.swagger.io/)

The specifications used in this document can be found here:
1. [The start API First specification](/images/guides/microservices/api-first/apifirst_openapi.yaml)
2. [The ApiResponse component object](/images/guides/microservices/api-first/schemas/response.yaml)
3. [The Order component object](/images/guides/microservices/api-first/schemas/order.yaml)
4. [The bundled API First specification](/images/guides/microservices/api-first/apifirst_openapi_bundled.yaml)

Need to get up to date on what’s happening around APIs? [The 2020 State of the API Report](https://www.postman.com/state-of-api/) describes the latest trends based on a worldwide survey.