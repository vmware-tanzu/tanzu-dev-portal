---
date: '2021-10-22'
lastmod: '2021-10-22'
title: Working With the Spring Distributed Lock
linkTitle: Working With the Spring Distributed Lock
description: A simple demonstration of how to implement a Spring Distributed Lock with in your Spring application
patterns:
  - API
tags:
  - Spring Boot
  - Spring Integration
  - API
  - Getting Started
  - Spring
  - Microservices
team:
  - Eric Standley
weight: 2
oldPath: '/content/guides/spring/spring-distributed-lock.md'
aliases:
  - '/guides/spring/spring-distributed-lock'
level1: Building Modern Applications
level2: Frameworks and Languages
---

Most of the time when designing microservices we create code that can handle multiple instances of our services all running at the same time, however every so often we run into a situation where we only want something processed once or when preforming something similar to the [Leader Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/leader-election). Since our code is running in different pods we can't use `synchronize` and need to use an external method, this is fraught with a few pitfalls when implementing[^1]. Thankfully Spring has done a lot of the hard work and all we need is to provide it a database connection and it will create a distributed lock for us, this example will show the lock with both Redis and JDBC.

## Before You Begin

Before you begin, there are a few tools you will need:

- [Postgres](https://www.postgresql.org/) or [Redis](https://redis.io/)
- Your text editor or IDE of choice.
  [JDK 16+](https://www.oracle.com/java/technologies/javase-downloads.html) or newer.(if you don't want to use the records that are setup in the example code Java 11+ will work)
- An understanding of Spring Boot and dependency injection.

You can see the [completed example on GitHub](https://github.com/estand64/distributed-lock).

## Package Imports

First you'll need import the necessary Spring Integration packages into your `pom.xml` file, then depending on if you're using the Redis or JDBC version you'll have to farther import some Spring Integration sub packages and the necessary drivers to connect to your data store of choice.

All versions need this:

```xml
<dependency\>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-integration</artifactId>
</dependency>
```

---

If using `Redis` import this:

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
	<groupId>org.springframework.integration</groupId>
	<artifactId>spring-integration-redis</artifactId>
</dependency>
<dependency>
	<groupId>io.lettuce</groupId>
	<artifactId>lettuce-core</artifactId>
</dependency>
```

---

If using `JDBC` import this:

```xml
<dependency>
	<groupId>org.springframework.integration</groupId>
	<artifactId>spring-integration-jdbc</artifactId>
</dependency>
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<dependency>
	<groupId>org.postgresql</groupId>
	<artifactId>postgresql</artifactId>
</dependency>
```

One more note about running the JDBC version of the distributed lock is that it needs the database to have some tables and indexes set up before hand in order to work. If you don't set these up the first time you attempt to obtain the lock a JDBC Exception will be thrown. The current collection of SQL files for this can be found in the [Spring Integration JDBC github repo](https://github.com/spring-projects/spring-integration/tree/e901c89fef3eea00ddf6d503ae9926667a1d6972/spring-integration-jdbc/src/main/resources/org/springframework/integration/jdbc). In the example here I'm using [Flyway](https://flywaydb.org/) to run the SQL script automatically, if you want to use this you'll also need to add the following dependency:

```xml
<dependency>
	<groupId>org.flywaydb</groupId>
	<artifactId>flyway-core</artifactId>
</dependency>
```

If you don't run the script to populate the table this is the SQL exception you'll see:
![img](images/sql_error.png)

## Create Lock Repository

Once the necessary packages are imported you can get started on setting up your code, first order of business is creating the lock repository beans that will be used to grab the locks later. With the Redis version you'll need to create a `String` name to represent this `LockRegistry`, thus you can create multiple repositories this way (this however is unlikely and you'll likely only be using one). If you want a better understanding of how the `@Bean` gives us access to our object [look here](https://docs.spring.io/spring-boot/docs/2.0.x/reference/html/using-boot-spring-beans-and-dependency-injection.html).

---

Redis:

```java
private static final String LOCK_NAME = "lock";

@Bean(destroyMethod = "destroy")
public RedisLockRegistry redisLockRegistry(RedisConnectionFactory redisConnectionFactory) {
    return new RedisLockRegistry(redisConnectionFactory, LOCK_NAME);
}
```

---

JDBC:

```java
@Bean
public DefaultLockRepository DefaultLockRepository(DataSource dataSource){
    return new DefaultLockRepository(dataSource);
}

@Bean
public JdbcLockRegistry jdbcLockRegistry(LockRepository lockRepository){
    return new JdbcLockRegistry(lockRepository);
}
```

## Setup A Controller

In order to interact with our lock you'll need to set up a way to hit your code from the outside world, the easiest way is to set up a `RestController` with some endpoints for you to hit. To follow the proper Spring way to do this you'll also have to inject our service class that we'll set up in the next section.

```java
@RestController
@RequestMapping("/")
public class MyController {
    private final LockService lockService;

    public MyController(LockService lockService) {
        this.lockService = lockService;
    }

    @PutMapping("/lock")
    public String lock(){
        return lockService.lock();
    }

    @PutMapping("/properLock")
    public String properLock(){
        return lockService.properLock();
    }

    @PutMapping("/failLock")
    public String failLock(){
        lockService.failLock();
        return "fail lock called, output in logs";
    }
}
```

It's ok if you don't know everything that's happening here, the important part is to realize we setup the follow endpoints: `/lock`, `/properLock`, and `/failLock`. Also that these endpoint will call functions in the service class that we'll set up in the next section.

## Setup The Service Class

First let's create a simple interface to match the methods we have in our controller created in the above section.

```java
public interface LockService {
    String lock();
    void failLock();
    String properLock();
}
```

Now let's set up the service class that will contain our logic that we want to lock. All you need to do is create a new class that implements `LockService` and make sure it looks similar to the following:

---

Redis:

```java
@Service
public class RedisLockService implements LockService{
    private static final String MY_LOCK_KEY = "someLockKey";
    private final LockRegistry lockRegistry;

    public RedisLockService(LockRegistry redisLockRegistry) {
        this.lockRegistry = redisLockRegistry;
    }
}
```

---

JDBC:

```java
@Service
public class JDBCLockService implements LockService{
    private static final String MY_LOCK_KEY = "someLockKey";
    private final LockRegistry lockRegistry;

    public JDBCLockService(JdbcLockRegistry jdbcLockRegistry) {
        this.lockRegistry = jdbcLockRegistry;
    }
}
```

Now you might be wondering why for the Redis implementation are you injecting a `LockRegistry` but for the JDBC implementation we're inject the more specific `JDBCLockRegistry`. In the case of the `RedisLockRegistry`, the class itself is `final` and thus if we inject that we would have a hard time with most mocking frameworks when writing our tests. With the `JDBCLockRepository` it's easier to inject the actual class as you'll have two beans of type `LockRegistry` due to needing the `DefaultLockRepository` when initializing the `JDBCLockRepository` bean. Another option that I won't go into much here is to use Spring's `@Qualifier` to specify the registry you want ([Qualifier Info](https://www.baeldung.com/spring-qualifier-annotation)).

## Obtain a Lock From the Repository

From here on out the Redis and JDBC code will look the same as we only need a `LockRegistry` object. Here is the most basic use of the lock.

```java
private static final String MY_LOCK_KEY = "someLockKey";
/**
constructors from above omitted here
**/
public String lock(){
    var lock = lockRegistry.obtain(MY_LOCK_KEY);
    String returnVal = null;
    if(lock.tryLock()){
        returnVal = "jdbc lock successful";
    }
    else{
        returnVal = "jdbc lock unsuccessful";
    }
    lock.unlock();
    return returnVal;
}
```

Let's go over the key parts here.

1. `lock = lockRegistry.obtain(MY_LOCK_KEY)` This is just getting the specific lock we want from the database. The documentation for the registry interface list the key as an `Object` but both the `RedisLockRegistry` and `JDBCLockRegistry` enforce that this must be a `String`. This also makes it easy to add an identifier to the key in the case where you only care about other instances possibly running the same processing for a specific item.
2. `lock.tryLock()` This is where the magic happens and the lock object is actually locked for us thus stopping other instances from processing what we want to process.
3. `lock.unlock()` Lastly we always need to unlock the lock to prevent a deadlock.

Once we have this if we fire up our code and call our endpoint.
![img](images/lockOutput.png)

## A Better Way to do the Above

The above method while easy to read to understand how the lock should be used isn't all the code we need if we want to use this lock in production, so lets update the code a bit.

```java
    @Override
    public String properLock() {
        Lock lock = null;
        try {
            lock = lockRegistry.obtain(MY_LOCK_KEY);
        } catch (Exception e) {
            // in a production environment this should be a log statement
            System.out.println(String.format("Unable to obtain lock: %s", MY_LOCK_KEY));
        }
        String returnVal = null;
        try {
            if (lock.tryLock()) {
                returnVal =  "jdbc lock successful";
            }
            else{
                returnVal = "jdbc lock unsuccessful";
            }
        } catch (Exception e) {
            // in a production environment this should log and do something else
            e.printStackTrace();
        } finally {
            // always have this in a `finally` block in case anything goes wrong
            lock.unlock();
        }

        return returnVal;
    }
```

The most important change here is that `lock.tryLock()` has been moved inside a `try` block that has a `finally` condition that unlocks the lock. This is much better in that if the processing you do inside the lock fails and throws an exception the code still executes the `unlock()`. This substantially cuts down the risk of causing a thread to hold the lock indefinitely and bring our processing across the system to a halt. And if we call the `/propLock` endpoint we'll get the same output as the simple lock.

Once we have this if we fire up our code and call our endpoint, everything should look the same.
![img](images/properLockOutput.png)

## Failure to Lock

The most common reason for the lock to fail is that another instance has already locked the lock, however this would take quite a bit of setup to pull off. We can however have two different thread try to grab this lock to show how it will fail, and also show how the time out version of `tryLock()` works. In this case you'll want to set up two threads that have a time out to try to grab the lock, but have a sleep time longer than that wait time thus forcing one of the threads to fail.

```java
    public void failLock(){
        var executor = Executors.newFixedThreadPool(2);
        Runnable lockThreadOne = () -> {
            UUID uuid = UUID.randomUUID();
            StringBuilder sb = new StringBuilder();
            var lock = lockRegistry.obtain(MY_LOCK_KEY);
            try {
                System.out.println("Attempting to lock with thread: " + uuid);
                if(lock.tryLock(1, TimeUnit.SECONDS)){
                    System.out.println("Locked with thread: " + uuid);
                    Thread.sleep(5000);
                }
                else{
                    System.out.println("failed to lock with thread: " + uuid);
                }
            } catch(Exception e0){
                System.out.println("exception thrown with thread: " + uuid);
            } finally {
                lock.unlock();
                System.out.println("unlocked with thread: " + uuid);
            }
        };

        Runnable lockThreadTwo = () -> {/*is the same as lockThreadOne*/};
        executor.submit(lockThreadOne);
        executor.submit(lockThreadTwo);
        executor.shutdown();
    }
```

In here you can see we aren't calling `trylock()` any more but are instead calling `lock.tryLock(1, TimeUnit.SECONDS)`. Unlike the original call this version of the lock doesn't return false if it can't grab the lock right away, instead it will keep attempting to lock every 100ms until it hits the time limit given(in this case 1 second). If it can't obtain the lock in that time frame only then will it return false, so once this up and running call the endpoint well result in the following:

![img](images/failOutput.png)

With this being the output in the logs:
![img](images/failLogOutput.png)

Here we can see that one of threads was able to grab the lock where then the other failed since it timed out.

## Testing

Mocking these out is rather easy, the only thing to remember is that you also need a mocked lock to give back to the call of `.obtain()`.

```java
private Lock lock = mock(Lock.class);
private JdbcLockRegistry registry = mock(JdbcLockRegistry.class);

// set to either true or false depending on what you're testing
when(lock.tryLock()).thenReturn(true);
when(registry.obtain(anyString())).thenReturn(lock);
```

## Wrapping Up

You should now have a good understanding of now of how the Spring Distributed Lock works and how to use it. From here you can take the sample code and fill in what the Redis service should look like, or try re-locking the lock from within the same thread (the outcome might not be what you expect), or if you're ambitious you can run two instances to see how the lock preforms when interacting with more than one instance.

[^1]: One of biggest pitfalls however is still possible with this, which is to use the same lock across different services. Please never do this as it's a good way to end up in a system wide race condition and these are painful to even figure out let alone solve.
