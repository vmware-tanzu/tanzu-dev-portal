+++
title = "Testing in Isolated App Domains"
date = 2018-06-15T12:18:45-07:00
+++

## When To Use This Recipe

This recipe should be followed when one or more unit tests must validate outcomes that rely on multiple states of a given static property or class. If you have multiple tests that succeed when run in isolation, but one or more of the tests fail when executed in the same test run, this recipe may for you.

## Tradeoffs

Note that this recipe comes with some tradeoffs:

1. Tests that run in isolated app domains will take longer to run due to the overhead of loading and unloading an app domain to support test execution.

2. The concept of app domains is being deprecated in .NET Core. For this reason, test projects must target full framework for the runtime.

The best medicine for the above is a refactor to eliminate the anti-pattern of static property access from instance classes. If such a refactor is not an option, the above tradeoffs may be worthwhile in exchange for better test coverage.

## Overview

By their very nature, static dependencies cannot be injected into a class instance in isolation. This is due to the workings of the .NET common language runtime (CLR) and how type initializers are handled by the CLR. Take the following class as an example:

```c#
using System;

namespace SampleApp.Configuration
{
    public class ServiceBusConfig
    {
        private static ServiceBusConfig m_config;

        static ServiceBusConfig()
        {
            m_config = new ServiceBusConfig();    
        }

        private ServiceBusConfig()
        {
            this.IsConfigured = !String.IsNullOrEmpty(Environment.GetEnvironmentVariable("CONFIGURED"));
        }

        public bool IsConfigured { get; private set; }

        public static ServiceBusConfig Current => m_config;
    }
}
```

The above example depicts a class that employs the Singleton pattern to expose a single class instance to all callers. The class’s constructor is private; the only way to retrieve an instance of the class is to call the static `ServiceBusConfig.Current` property which provides read-only access to the private static `m_config` member. The value of `m_config` is set in the type initializer. When provided, a type initializer is executed once and only once by the CLR the first time the type is accessed.  

Our fictional configuration class offers only one property, `IsConfigured`. This property is read-only to outside callers and is set only during instantiation. If an environment variable named `CONFIGURED` is found, the value is set to true; otherwise, the value is set to false. We want to test our class to ensure that our `IsConfigured` property behaves as expected, and using a test-first approach we might write the following tests:

```c#
using System;
using Xunit;

namespace SampleApp.Configuration
{
    public class ServiceBusConfigTests
    {
        [Fact]
        public void TestServiceBusConfigIsConfiguredReturnsFalse()
        {
            Environment.SetEnvironmentVariable("CONFIGURED", null);
            var result = ServiceBusConfig.Current.IsConfigured;
            Assert.False(result);
        }

        [Fact]
        public void TestServiceBusConfigIsConfiguredReturnsTrue()
        {
            Environment.SetEnvironmentVariable("CONFIGURED", "TRUE");
            var result = ServiceBusConfig.Current.IsConfigured;
            Assert.True(result);
        }
    }
}
```

Given the above, our unit tests are going to produce frustrating results: either test will pass if run in isolation, but only one test will pass if both tests execute in the same test run. The following figures demonstrate this problem:

<center>
![Figure 1](/testing-in-isolated-appdomains/testing-problem-1.png)

Figure 1 - Executing both tests in one test run - run fails.

![Figure 2a](/testing-in-isolated-appdomains/testing-problem-2.png)
![Figure 2b](/testing-in-isolated-appdomains/testing-problem-3.png)

Figures 2a, 2b - Running the failed test in isolation shows a passing test.

![Figure 3a](/testing-in-isolated-appdomains/testing-problem-4.png)
![Figure 3b](/testing-in-isolated-appdomains/testing-problem-5.png)

Figures 3a, 3b - Running the passing test in isolation shows it also passes when run in isolation.
</center>

To get around the above behavior, we would have to have some way of ensuring the type initializer executed in each test, and that’s exactly what will happen if we provide a new App Domain each time we run a test.

## Step by Step

In most cases, if isolated application domains are required for a given class, every test that runs against the class must execute in isolation. For this reason, we’ll make changes to the entire test class, not just a single test method - we’ll ensure that each time our test class is invoked by the testing framework, a new application domain is created. When our test class is disposed, the app domain we created to support the test invocation will be unloaded. Follow the steps below to implement the solution:

Step 1. Implement `IDisposible` on the test class and add logic to create a new App Domain for each instance of `ServiceBusConfigTests`:

```csharp
public class ServiceBusConfigTests : IDisposible
{
    static int m_count = 0;
    AppDomain m_appDomain;

    public ServiceBusConfigTests()
    {
        m_appDomain = AppDomain.CreateDomain(
            $"AppDomain {++m_count}",
            AppDomain.CurrentDomain.Evidence,
            AppDomain.CurrentDomain.SetupInformation
        );
    }

    ... tests ...

    public void Dispose()
    {
        if (null != m_appDomain){			
            AppDomain.Unload(m_appDomain);
        }
    }
}
```

Step 2. Wrap each test’s implementation in an `AppDomain` callback:

{{<highlight cs "hl_lines=4-5 9 15-16 20">}}
[Fact]
public void TestServiceBusConfigIsConfiguredReturnsFalse()
{
    m_appDomain.DoCallBack(() =>
    {
        Environment.SetEnvironmentVariable("CONFIGURED", null);
        var result = ServiceBusConfig.Current.IsConfigured;
        Assert.False(result);
    });
}

[Fact]
public void TestServiceBusConfigIsConfiguredReturnsTrue()
{
    m_appDomain.DoCallBack(() =>
    {
        Environment.SetEnvironmentVariable("CONFIGURED", "TRUE");
        var result = ServiceBusConfig.Current.IsConfigured;
        Assert.True(result);
    });
}
{{</highlight>}}

Step 3. Re-run the tests:

![Figure 4](/testing-in-isolated-appdomains/testing-solution.png)
