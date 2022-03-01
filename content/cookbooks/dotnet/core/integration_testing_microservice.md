+++
date = "2017-01-05T08:50:33-05:00"
title = "Integration Testing in .NET Core"
tags = ["testing", "integration", "boundary crossing"]
categories = ["recipes"]
summary = "Integration Testing (Boundary Crossing) ASP.NET Core Microservices"
glyph = "fa-file-text-o"
taxonomy = ["CLIENT", "DOT_NET"]
+++

This recipe discusses lessons learned and various patterns and practices discovered while creating some integration tests for the new services created as part of the .NET Core migration effort.

## Integration Testing Scope and Goals

It's important to keep in mind the goals and scope of integration testing when writing these tests. We want to ensure that we have confidence in the code we're testing, but we also don't wan to re-test things that have already been tested.

We must _assume_ that all individual components and classes within an application or service have already been **unit tested** to a sufficient degree of coverage and confidence (note that coverage and confidence are not the same thing - you can get 100% code coverage but still have poorly written tests and no confidence).

Given that assumption, our goal for an integration test is to ensure that all of these components work together when connected in a fully functioning service. We don't need to assert that we get the right values or that individual calculators are calculating the right values, we need to ensure that when we submit input to the service, all components are activated and function without error, and we get _reasonable_ output as a result.

For example, if we're integration testing a service, we would connect this service to a live (but still _test only_) data source, connect it to a live (but preferably isolated) queue, and submit a message and await the  output. We then assert that the output is parseable, in a format we expect, and contains enough indicators to reasonably assure us that all the components have contributed to the output.

In our case, if we know what we should expect for an output, and we can fill the test database with predictable data, then we can assert expected values.

## Setting up the Test Project

Setting up the test project is actually fairly straightforward. First, create an empty test project the same way you have created all your other test projects and add a project (not package) reference to the _main service_ project.

Your integration test will be running through the entire startup routine of your service, so you only need to declare a dependency on the service project under test. Even though this is an integration test you'll still need the usual **xUnit** reference.

## Starting the Test Host

Thankfully with ASP.NET Core we have a few helpful utilities designed specifically for integration testing. The first is the _test host_, a test web host builder that allows us to start up a "full" web host the same way our application might, but designed specifically for testing. This will keep us from attempting to use reserved ports and network connections when running integration tests on a build server.

Make sure your project has a reference to the latest version of `Microsoft.AspNetCore.TestHost`. During the engagement, we used version `1.1.0`.

Next, we can use a test server as a wrapper around a web host builder:

```c#
private readonly TestServer _server;
private readonly HttpClient _client;

public PrimeWebDefaultRequestShould()
{
    // Arrange
    _server = new TestServer(new WebHostBuilder()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseStartup<Startup>());
    _client = _server.CreateClient();
}
```

You're now able to make full HTTP calls to your service using the `HttpClient` obtained from calling `CreateClient` on the test server. If your service uses queues or some other means of triggering functionality, then it will be up to your test to initiate the functionality without an HTTP client.

## Using a Test-Specific `appsettings.json` File

If your integration tests need to read from an `appsettings.json` file or other file source, you'll need to make sure you set the content root on your web host builder, otherwise the test won't find the file either from the command line or on your build server.

If your `Startup` class is designed to read an `appsettings.json` file and you want to supply your own that has test-specific bindings pointing your integration test at a test database, queue, or other resource, then all you need to do is drop the file in the root directory of your test project, ensure the _content root_ is configured properly, and the service you're testing should pick up the test file and _not_ the default file supplied with the service.

## Accessing DI-Managed Services from the Test

In the process of setting up and tearing down the test environment, you may need access to some of the DI-managed services that were created and initialized by your service's _startup_ class. In order to do this, you can simply access the `Services` property of the `TestServer` instance you created at the beginning of the test.

For example, let's say you need to access your singleton `IQueueConsumer` instance. You can get a reference to it as shown below:

```c#
var consumer = (IQueueConsumer)testServer.Services.GetService(typeof(IQueueConsumer));
```

## Running Integration Tests in a CI Pipeline

Running an integration test in a CI pipeline means that the build environment needs to have access to all test resources. This means it will need to access the queue server and any test databases provisioned for integration testing. Firewall rules will need to be provisioned to allow for this. You'll also need to ensure that any data access necessary to run the integration test is _idempotent_ so that the results of the test will be predictable and reproduceable.
