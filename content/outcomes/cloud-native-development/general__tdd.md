---
date: '2021-07-12'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: Test-Driven Development
weight: 40
---

Testing is crucial to cloud native application development. It is our primary (and sometimes only) way to build confidence that we can push to production at any given time.

## Test Types

In many traditional organizations with independent, quality assurance and testing teams, software engineers may only leverage unit tests. As a [balanced team](/outcomes/application-development/balanced-teams/) with complete ownership of releases, we write and own an extensive spectrum of tests for our app. These include:
* Unit Tests
* Integration Tests
* Contract Tests
* Behavior Tests

While we may use some additional layers such as end-to-end tests or automated UI tests, these are the most expensive to run. We look to build confidence with the other leaner test layers when possible.

* Read what [Martin Fowler](https://martinfowler.com/bliki/TestPyramid.html) and [his team](https://martinfowler.com/articles/practical-test-pyramid.html) have to say on the test pyramid, and how it provides a solid foundation for answering questions such as "at which layer should I test this functionality?".

* Read [this article](https://spring.io/blog/2016/04/15/testing-improvements-in-spring-boot-1-4) to learn more on testing various slices of your Spring Boot application.

* Read through the [Quick Start Guide](https://cloud.spring.io/spring-cloud-contract/) on Consumer-Driven Contract testing with Spring Cloud Contract.

* Read [an introduction](https://docs.cucumber.io/bdd/) to behavior-driven development (BDD) and run through [the basic tutorial](https://docs.cucumber.io/guides/10-minute-tutorial/) on using Cucumber in a Java project.



## The Basics of Test Driven Development

Now that you know the tools you have to test your application, it's time to learn how to use those tools in your development project. 

VMware Tanzu develops software using the test-driven development methodology of writing tests to describe our intended behavior. First, we write tests, see our tests fail, build the functionality to make our tests pass, and clean up any technical debt created during the process. This approach is often referred to as the "red-green-refactor" loop.
The best way to learn about test-driven development is to do some of it! Pairing with an experienced software engineer will give you lots of practice. Or, if you prefer to do it yourself, you can prepare by reading [this article on TDD exercises](https://medium.com/@marlenac/learning-tdd-with-katas-3f499cb9c492) and running through some of the [first requirements for the Greeting exercise](https://github.com/testdouble/contributing-tests/wiki/Greeting-Kata) in your IDE.


#### Homework

- Read linked articles on the test pyramid and specific kinds of testing.
- Run through at least three requirements from the Greeting exercise.


#### Additional resources

- Review the [foundaments of Test Driven Development](/outcomes/application-development/test-driven-development/).