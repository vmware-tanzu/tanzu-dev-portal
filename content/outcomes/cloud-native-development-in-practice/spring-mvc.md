---
title: Spring MVC with REST Endpoints
weight: 40
layout: single
team:
  - VMware Tanzu Labs
---

In this lab, you will build a service which will expose a
[RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer)
API for time entries.
A "time entry" is a record of hours worked for a specific user, on a
particular day &mdash; the kind of information that you might record
on a timesheet for project tracking or billing purposes.
The lab will introduce the fundamentals of
[Spring MVC](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc)
for building web services.

# Learning outcomes

After completing the lab, you will be able to:

- Develop RESTful JSON APIs using Spring MVC controllers
- Demonstrate the ability to manually test a JSON API
- Describe when to use the `@Bean` annotation

## Get started

1.  Review the
    [Web Apps](https://docs.google.com/presentation/d/17UWVwjWNjP3H0i8jCXybCyB7qC_N7gesq3vCj1aUsag/present#slide=id.gd58f40471a_2_0)
    slides.

1.  You must have completed (or fast-forwarded to) the
    [Deployment pipelines lab](../pipelines/).
    You must have your `pal-tracker` application associated with the
    `pipeline-solution` codebase deployed and running on
    *Tanzu Application Service*.

1.  In a terminal window,
    make sure you start in the `~/workspace/pal-tracker`
    directory.

1.  Pull in unit and integration tests for this lab:

    ```bash
    git cherry-pick mvc-start
    ```

The goal is to get the test suite passing by the end of the lab.

## If you get stuck

If you get stuck within this lab,
you can either
[view the solution](../intro/#view-a-solution),
or you can
[fast-forward](../intro/#fast-forward) to the `mvc-solution` tag.

## Time Entries CRUD

The start point of the lab provides you with a time entry data class,
an interface used to define the operations of
a repository for those entities, and an in-memory implementation of
that repository interface.

You will build a service that can do
[CRUD (Create, Read, Update,Delete) operations](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)
on time entries.

### Data layer

Review the following Java classes:

-   `TimeEntry` - Java "data class" which functions as a
    [value object](https://en.wikipedia.org/wiki/Value_object)
    and a logical repository persisted record.
    It will also be used in the controller you will build in this lab as a
    [data transfer object](https://en.wikipedia.org/wiki/Data_transfer_object).

    ```bash
    git show mvc-solution:src/main/java/io/pivotal/pal/tracker/TimeEntry.java
    ```

-   `TimeEntryRepository` - The interface specifying the CRUD repository
    operations.
    You will use this in another lab for building out a relational
    database backed CRUD repository.

    ```bash
    git show mvc-solution:src/main/java/io/pivotal/pal/tracker/TimeEntryRepository.java
    ```

-   `InMemoryTimeEntryRepository` -
    implements the `TimeEntryRepository` interface using a `HashMap`
    based implementation.

    ```bash
    git show mvc-solution:src/main/java/io/pivotal/pal/tracker/InMemoryTimeEntryRepository.java
    ```

-   `InMemoryTimeEntryRepositoryTest` -
    the unit tests for the `InMemoryTimeEntryRepository`

    ```bash
    git show mvc-solution:src/test/java/test/pivotal/pal/tracker/InMemoryTimeEntryRepositoryTest.java
    ```

### Get your code to compile

1.  Your code will not compile at this point because you cherry-picked
    additional tests for classes which are not implemented.

1.  Create empty classes and stub methods so that your code compiles.
    Use the tests as a guide.
    Consider using Java IDE auto-completion features to help you.

1.  Do not move on until the following command passes (indicating that
    your code compiles).

    ```bash
    ./gradlew clean compileTestJava
    ```

### Wiring your in-memory repository

Declare a
[`@Bean`](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/beans.html#beans-java-bean-annotation)
method which returns your implementation of the `TimeEntryRepository`
in the `PalTrackerApplication` class.

## REST controller

In this section of the lab,
you will build out a REST service for time entries using a
[Spring MVC Annotated REST Controller](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-controller).

### Implement the controller Java class

1.  Review each test case in the `TimeEntryControllerTest` class:

    -   Notice the pattern of setting up text fixtures,
        executing the controller methods under test,
        and verifying successful execution of each method.

        ```java
        // Test setup
        ...

        // Unit under test

        ... controller.<method> ...

        // Verification

        verify(timeEntryRepository) ...
        assertThat(...)
        ...
        ```

    -   Notice the use of
        [mocking](https://en.wikipedia.org/wiki/Mock_object)
        patterns, such as the mock trained stubs in the test fixture
        setup:

        ```java
        doReturn(expectedResult)
            .when(timeEntryRepository)
            ...
        ```

        and use of mock verify in the test verification stage:

        ```java
        verify(timeEntryRepository)
            ...
        ```

1.  Use the `TimeEntryControllerTest` unit test to guide the
    implementation of the `TimeEntryController`,
    using a *Test First* approach:

    -   Lead with the tests -
        Start with the first test case `testCreate()`

    -   Run the test first and watch it fail (red).
        Analyze the failure,
        and implement the fix to clear the failure.
        Repeat this step in the test case until it passes (green).

    -   Use the `mock, verify, and assertion` logic to drive out the
        implementation of the unit (controller method) under test.

    -   Do the simplest implementation possible to make the current test
        pass -
        do not anticipate design for future tests.

    -   Repeat for each test,
        from beginning of the `TimeEntryControllerTest` to end,
        until all tests are green.

### Research how to implement the REST controller with Spring

Spring MVC controllers are Java objects with an annotation that
signals to Spring that they are controllers.

1.  Use the following tips to build out your solution:

    -   For convenience,
        use the `@RestController` annotation.
        This is a regular Spring MVC controller,
        but it also includes the `@ResponseBody` annotation which
        automatically serializes objects into JSON when they are
        returned from a handler method.

    -   Controller handler methods are annotated with
        [`@RequestMapping`](https://docs.spring.io/spring/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-requestmapping)
        or one of the associated
        [custom annotations](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-requestmapping-composed),
        such `@GetMapping`, `@PostMapping`, `@PutMapping`
        and `@DeleteMapping`.
        Use the custom annotations in your solution.

        The annotation takes the URL that the handler will respond to as
        an argument.

    -   Pay close attention to the
        [handler method argument annotations](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-arguments)
        such as
        [`@RequestBody`](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-requestbody)
        and
        `@PathVariable`,
        each has a specific purpose for making sure elements of the
        HTTP request are passed to the appropriate handler method
        arguments.

    -   All of your controller methods will return a
        [`ResponseEntity`](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-responseentity)
        type.
        This allows you to return objects (serialized into JSON) and to
        have control of the HTTP status codes.

1.  For full context, read about
    [Spring's annotated controllers here](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-controller).

### Annotate the `TimeEntryController`

1.  Use the `TimeEntryApiTest` to guide the implementation of the
    annotations you researched in the
    [previous section](#research-how-to-implement-the-rest-controller-with-spring).
    in the `TimeEntryController` controller.

1.  Use a *Test First* approach:
    Iterate through each `TimeEntryApiTest` test case,
    and add annotations only for the handler method being tested on
    the associated test case.

1.  After you are done making all the `TimeEntryApiTest` tests pass,
    make sure all the tests in the `pal-tracker` project pass:

    ```bash
    ./gradlew clean build
    ```

### Exercise endpoints

1.  Start your application locally

1.  Use the `curl` commands below to verify
that your application behaves as expected.

    __Get all time entries__

    ```bash
    curl -v localhost:8080/time-entries
    ```

    __Create a time entry__

    ```bash
    curl -v -XPOST -H"Content-Type: application/json" localhost:8080/time-entries -d'{"projectId": 1, "userId": 2, "date": "2019-01-01", "hours": 8}'
    ```

    **Note:** On UNIX-like systems, you can set the shell variable
    `TIME_ENTRY_ID` to the value of the ID that was created by the
    previous command.
    Assuming the ID value was 42, you would do that like this:

    ```bash
    TIME_ENTRY_ID=42
    ```

    You can then cut and paste the commands in the following sections
    directly.
    Otherwise, replace the placeholder `${TIME_ENTRY_ID}` with the value
    of the ID.

    __Get a time entry by ID__

    ```bash
    curl -v localhost:8080/time-entries/${TIME_ENTRY_ID}
    ```

    __Update a time entry by ID__

    ```bash
    curl -v -XPUT -H"Content-Type: application/json" localhost:8080/time-entries/${TIME_ENTRY_ID} -d'{"projectId": 88, "userId": 99, "date": "2019-01-01", "hours": 8}'
    ```

    __Delete a time entry by ID__

    ```bash
    curl -v -XDELETE -H"Content-Type: application/json" localhost:8080/time-entries/${TIME_ENTRY_ID}
    ```

1.  Move on when you have validated that your application behaves
    correctly on your local machine.

## Deploy

1.  Push your code to GitHub and let the pipeline deploy to your \
    *Tanzu Application Service* environment.

1.  Redo the [Exercise endpoints](#exercise-endpoints) section on
    *Tanzu Application Service* by replacing `localhost:8080` with the
    *Tanzu Application Service* environment route.

1.  Make sure all the endpoints succeed in the
    *Tanzu Application Service* environment before you move on.

## Wrap up

Now that you have completed the lab, you should be able to:

- Develop RESTful JSON APIs using Spring MVC controllers
- Demonstrate the ability to manually test a JSON API
- Describe when to use the `@Bean` annotation

## Extras

If you have some additional time,
work through the following exercises.

### `TimeEntry` class smells

Review the `TimeEntry` class,
as well as the all the tests that use it.

Some questions to ponder:

1.  How many concerns does the `TimeEntry` class service in the
    `pal-tracker` application?
    Does the design and usage of `TimeEntry` break any of the SOLID
    principles,
    and if so,
    name one.

1.  How could the `pal-tracker` application design be improved as the
    app evolves?

### API versioning

Try implementing a new API version alongside the current time entry
controller.

Take a look at the
[App Continuum documentation](http://www.appcontinuum.io/#v8-tag-versioning)
for ideas on how to implement api versioning.