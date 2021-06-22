---
title: Test Driven Development
weight: 40
layout: single
team:
 - VMware Tanzu Labs
---

Testing at critical to cloud native application development, as it’s our primary (and sometimes only) tool to build confidence that we can push to production at any given time.

## Kinds of Tests

In many traditional organizations with separate quality assurance and testing teams, software engineers may only be used to working with unit tests. As a balanced team with complete ownership of our own releasability, we’ll write and own a full spectrum of tests for our app. These include:
* Unit Tests
* Integration Tests
* Contract Tests
* Behavior Tests

While we may use some additional layers such as end-to-end tests or automated UI tests, these are by far the most expensive to run and we’ll look to build confidence with the other leaner test layers when possible.

Read what [Martin Fowler](https://martinfowler.com/bliki/TestPyramid.html) and [his team](https://martinfowler.com/articles/practical-test-pyramid.html) have to say on the test pyramid, as it will provide a solid foundation for answering questions such as “at which layer should I test this functionality?”.
Read [this article](https://spring.io/blog/2016/04/15/testing-improvements-in-spring-boot-1-4) on testing various slices of your Spring Boot application.
Read through the [Quick Start guide](https://cloud.spring.io/spring-cloud-contract/) on Consumer Driven Contract testing with Spring Cloud Contract.
Read [an introduction](https://docs.cucumber.io/bdd/) to behavior-driven development (BDD) and run through [the basic tutorial](https://docs.cucumber.io/guides/10-minute-tutorial/) on using Cucumber in a Java project.



## The Basics of Test Driven Development

Now that you know what tools you have to test your application, you’ll also want to know how we’ll apply those tools during development during the engagement. Pivotal develops software using the test-driven development methodology where we’ll write tests to describe our intended behavior, see those tests fail, build the functionality to make our tests pass, and the clean up any technical debt created during the process. This is often referred to as the “red-green-refactor” loop.
The best way to learn about test-driven development is to do some of it! Pairing with a Pivot during the engagement will give you lots of practice, but you can prepare yourself by reading [this article on TDD exercises](https://medium.com/@marlenac/learning-tdd-with-katas-3f499cb9c492) and running through some of the [first requirements for the Greeting exercise](https://github.com/testdouble/contributing-tests/wiki/Greeting-Kata) in your IDE.


#### Homework

- [x] Read linked articles on the test pyramid and specific kinds of testing
- [x] Run through at least three requirements from the Greeting exercise



