---
date: '2021-10-22'
lastmod: '2021-10-22'
title: Working With the Spring Distributed Lock
linkTitle: Working With the Spring Distributed Lock
parent: Spring Integration
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

A working repo of this code currently exist here: https://github.com/estand64/distributed-lock

Most of the time when designing microservices we create code that can handle multiple instances of our services all running at the same time, however every so often we run into a situation where we only want something processed once or when preforming something similar to the [Leader Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/leader-election). Since our code is running in different pods we can't use `synchronize` and need to use an external method, this is fraught with a few pitfalls when implementing[^1]. Thankfully Spring has done a lot of the hard work and all we need is to provide it a database connection and it will create a distributed lock for us, this example will show the lock with both Redis and JDBC.

<br>

## Package Imports

First you'll need import the necessary packages most of which are in the Spring Integration package, what else you'll need depends on whether you use the Redis or JDBC version.

##### All versions will need this:

```
<dependency\>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-integration</artifactId>
</dependency>
```

---

##### Needed for the Redis based lock (I'm using Lettuce here, however Spring will also support Jedis if you want to use that):

```
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

##### Needed for the JDBC based lock (I'm using Postgres here, however any Relational Database that Spring supports will work):

```
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

One more note about running the JDBC version of the distributed lock is that it needs the database to have some tables and indexes set up before hand in order to work. If you don't set these up the first time you attempt to obtain the lock a JDBC Exception will be thrown. The current collection of sql files for this can be found in the [Spring Integration JDBC github repo](https://github.com/spring-projects/spring-integration/tree/e901c89fef3eea00ddf6d503ae9926667a1d6972/spring-integration-jdbc/src/main/resources/org/springframework/integration/jdbc). In the example here I'm using [Flyway](https://flywaydb.org/) to run the SQL script automatically, if you want to use this you'll also need to add the following dependency:

```
<dependency>
	<groupId>org.flywaydb</groupId>
	<artifactId>flyway-core</artifactId>
</dependency>
```

<br>

## Create Lock Repository

Once the necessary packages are imported you can get started on setting up your code, first order of business is creating the lock repository beans that will be used to grab the locks later. You'll need to create a `String` name to represent this `LockRegistry`, also you'll need to do this for every repository you want to create (this however is likely going to be only one).

```
private static final String LOCK_NAME = "lock";
```

Then create the repository bean you need.

---

##### Redis lock repository setup:

```
@Bean(destroyMethod = "destroy")
public RedisLockRegistry redisLockRegistry(RedisConnectionFactory redisConnectionFactory) {
    return new RedisLockRegistry(redisConnectionFactory, LOCK_NAME);
}
```

---

##### JDBC lock repository setup:

```
@Bean
public DefaultLockRepository DefaultLockRepository(DataSource dataSource){
    return new DefaultLockRepository(dataSource);
}

@Bean
public JdbcLockRegistry jdbcLockRegistry(LockRepository lockRepository){
    return new JdbcLockRegistry(lockRepository);
}
```

<br>

## Injecting the Registries

The two registries should be injected slightly differently due to how they are implemented behind the scenes (have a [look here](https://docs.spring.io/spring-boot/docs/2.0.x/reference/html/using-boot-spring-beans-and-dependency-injection.html) if you want to understand dependency injection in Spring).

---

For Redis I would recommend injecting a `LockRegistry` object in your code due to the fact the `RedisLockRegistry` is a final object and thus mocking during tests becomes a painful task if you need mock a `RedisLockRegistry`. This will run into problems if you have more than one LockRegistry bean, in that case use `@Qualifier` to specify the registry you want.

```
public RedisLockService(LockRegistry redisLockRegistry) {
    super(redisLockRegistry);
}
```

---

For the JDBC lock it makes more sense to inject the actual `JDBCLockRepository` since you'll have two beans of type `LockRegistry` due to needing the `DefaultLockRepository` when initializing the `JDBCLockRepository` bean. Also unlike the `RedisLockRegistry`, `JDBCLockRepository` isn't `final` and can be easily mock during testing.

```
public JDBCLockService(JdbcLockRegistry jdbcLockRegistry) {
    super(jdbcLockRegistry);
}
```

<br>

## Obtain a lock from the repository

There's a bit of code involved here but not much that's really logically happening, most of the code is needed for error cases.

```
private static final String MY_LOCK_KEY = "someLockKey";

private <T> T lock(LockRegistry lockRegistry, LockableActions<T> lockableActions, Time waitTime){
    Lock lock = null;
    try {
        lock = lockRegistry.obtain(MY_LOCK_KEY);
    } catch (Exception e){
        return lockableActions.onError.apply(e);
    }

    T successful;
    try{
        waitTime = waitTime == null ? DEFAULT_WAIT : waitTime;
        successful = lock.tryLock(waitTime.duration, waitTime.timeUnit) ? lockableActions.onSuccess().get() : lockableActions.onFailure().get();
    } catch (Exception e){
        successful = lockableActions.onError().apply(e);
    } finally {
        try {
            lock.unlock();
        }catch (Exception e){}
    }
    return successful;
}
```

Let's go over the key parts here.

1. `lock = lockRegistry.obtain(MY_LOCK_KEY);` This is just getting the specific lock from the database. The documentation for the registry interface list the key as an `Object` but most all of the implementations require a `String`, as is the case with both the `RedisLockRegistry` and `JDBCLockRegistry`. This also makes it easy to add an identifier to the key though in case you only care about other instances possibly running the same processing for a specific item.
2. `lock.tryLock(waitTime.duration, waitTime.timeUnit)` This is where the magic happens and a lock object is created for us hopefully. There are two versions of this method, the empty parameter one which trys once to grab the lock, or in this case a method that take a timeout and will for that time deration attempt to lock the lock every 100 milliseconds. Both of these methods return `true` if the lock was able to be locked, otherwise it will return `false`
3. `finally {....lock.unlock();)...` Being good programmers we also need to make sure that if anything happens while we are processing something inside of locked block that we always unlock it to prevent a deadlock.

<br>

## Testing

Mocking these out is rather easy, the only thing to remember is that you also need a mock to lock to give back to the call of `.obtain()`.

```
private Lock lock = mock(Lock.class);
private JdbcLockRegistry registry = mock(JdbcLockRegistry.class);

// set to either true or false depending on what you're testing
when(lock.tryLock()).thenReturn(true);
when(registry.obtain(anyString())).thenReturn(lock);
```

[^1]: One of biggest pitfalls however is still possible with this, which is to use the same lock across different services. Please never do this as it's a good way to end up in a system wide race condition and these are painful to even figure out let alone solve.
