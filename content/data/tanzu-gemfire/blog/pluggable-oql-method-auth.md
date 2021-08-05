---
date: 2020-02-07
description: 'Apache Geode provides a SQL-like query language called OQL that allows
  users to access data stored within the regions.   '
lastmod: '2021-04-22'
team:
- Juan Jose Ramos
title: Pluggable OQL Method Authorization
type: blog
---

## Introduction

[Apache Geode](https://geode.apache.org/) is an in-memory data grid that provides real-time, consistent access to data-intensive applications throughout widely distributed cloud architectures. Between its many features, Apache Geode provides a SQL-like query language called OQL that allows users to access data stored within the regions.

## Why?

Before the release of [Apache Geode 1.3.0](https://archive.apache.org/dist/geode/1.3.0/), the OQL engine used to allow any method invocation on objects present in the Geode member’s classpath, including mutators and, through the usage of [Java Reflection](https://docs.oracle.com/javase/8/docs/technotes/guides/reflection/index.html), internal Geode, JDK or external library methods. This allowed malicious users to do things like the following (ugh!!)

```sql
SELECT * FROM /region.destroyRegion()
SELECT * FROM /region.getCache().close()
```

To prevent these problems, work was done to tighten up the security and, by default, disallow any method call not explicitly added to an internally hard-coded acceptance list.

After the change was in place and released, our users didn’t like this, at all!!... it is fine to tighten up the security, but the change also prevented users from invoking methods from their own data model… ugh!!.

## “Why do we fall, sir?... So that we can learn to pick ourselves up.”

The [Apache Geode community](https://geode.apache.org/community/) learns from previous errors and iterates to improve the end-user experience, that’s why the decision was made to change this “all or nothing approach” and provide users the ability to either choose from some general targeted use case out of box authorization implementations or create their own.

## Out of the Box Implementations

Based on feedback from users, the [Apache Geode community](https://geode.apache.org/community/) tried to cover the most common use cases and scenarios when designing and implementing these authorizers; the full list with a brief description for each one is shown below.

### *RestrictedMethodAuthorizer*
The default “please secure it all” one, it denies everything except for the hard-coded list of known safe methods. Use this if you liked the approach introduced in [Apache Geode 1.3.0](https://archive.apache.org/dist/geode/1.3.0/).

To configure this authorizer in your cluster, just execute the following command:

```
gfsh alter query-service --method-authorizer=org.apache.geode.cache.query.security.RestrictedMethodAuthorizer
```
### *UnrestrictedMethodAuthorizer*
The “I want it all” one, it allows every method invocation except for the ones that are already flagged as “dangerous” by default, that is, those methods that can affect the internals of the cache and its regions and, of course, [Java reflection](https://docs.oracle.com/javase/8/docs/technotes/guides/reflection/index.html). Use this one for secured clusters where only trusted applications have access to the query engine, or whenever all entries within the cache are immutable.

To configure this authorizer in your cluster, execute the following command:

```
gfsh alter query-service --method-authorizer=org.apache.geode.cache.query.security.UnrestrictedMethodAuthorizer 
```

### *JavaBeanAccessorMethodAuthorizer*
The “play by the book” one, allowing only those methods from configured packages that follow the [JavaBean Specification 1.01](https://download.oracle.com/otndocs/jcp/7224-javabeans-1.01-fr-spec-oth-JSpec/); that is, methods that start with `get` or `is` followed by the attribute name. Use this one only when you’re 100% sure that all the developers have followed the mentioned specification.

To configure this authorizer in your cluster, just execute the command:

```
gfsh alter query-service --method-authorizer=org.apache.geode.cache.query.security.JavaBeanAccessorMethodAuthorizer --authorizer-parameters=com.domain.model
```

### *RegExMethodAuthorizer*
The “flexible” one, allowing only those methods that match a regular expression provided by the user. [Apache Geode](https://geode.apache.org/) will still prevent the execution of methods that can mess up your cache and regions, along with [Java reflection](https://docs.oracle.com/javase/8/docs/technotes/guides/reflection/index.html) calls, so you don’t need to worry about mistakenly matching dangerous methods that are already known. Use this one for clusters on which you know exactly what is deployed and when, so you can correctly tweak the RegEx to only allow what you want.

To configure this authorizer in your cluster, execute the following command:

```
gfsh alter query-service --method-authorizer=org.apache.geode.cache.query.security.RegExMethodAuthorizer --authorizer-parameters=com.domain.model.*
```

## Bahhh… None Works For Me 😢
This all looks good, but none of these authorizers work for my use case… regular expressions are too tricky, not all the methods I need to use in OQL follow the [JavaBean Specification 1.01](https://download.oracle.com/otndocs/jcp/7224-javabeans-1.01-fr-spec-oth-JSpec/) and the other two authorizers are either too restrictive or too permissive, what should I do?

Not to worry, now comes the fun part (some code, finally!), you can easily develop a custom authorizer and instruct [Apache Geode](https://geode.apache.org/) to use it whenever a method invocation authorization needs to be executed.

How? Easy, you just need to implement the `MethodInvocationAuthorizer` interface and execute `gfsh alter query-service --method-authorizer=my.authorizer.ClassName` to make sure all members use it. You need to keep in mind, though, that the authorizer will be invoked once per query execution (more on this later on), so the authorization logic must be lightning fast!!.

### *Examples?*
Since [Java annotations](https://docs.oracle.com/javase/8/docs/technotes/guides/language/annotations.html) are here to stay and a huge percentage of developers love to use them, let’s write an authorizer that relies on annotated methods to decide whether they should be allowed or denied during query execution.

The example assumes that you have access to modify the domain model and, more importantly, that you’re willing to do it.

Long story short, the authorize callback will only allow methods annotated with our custom annotation, if and only if the method is not already flagged as dangerous by Geode.

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@interface Authorized {
}

public class AnnotationBasedMethodAuthorizer implements MethodInvocationAuthorizer {
 private RestrictedMethodAuthorizer geodeAuthorizer;

 @Override
 public void initialize(Cache cache, Set parameters) {
  // Register the default authorizer.
  geodeAuthorizer = new RestrictedMethodAuthorizer(cache);
 }

 @Override
 public boolean authorize(Method method, Object target) {
  // Check if forbidden by Geode.
  if (geodeAuthorizer.isPermanentlyForbiddenMethod(method, target)) {
   return false;
  }

  // Check if annotation is present
  return method.isAnnotationPresent(Authorized.class);
 }
}
```

## What About Performance?
Considering that the authorization kicks in while the OQL is being executed, performance is certainly a concern and should be taken into consideration, nobody wants the same authorization logic to be invoked for every single object instance traversed by the query engine while building the result set. To optimize this, the query engine remembers whether the method has been already authorized or not for the current query context, basically meaning that the authorization logic will be called once and only once in the lifetime of a query for every new method seen while traversing the objects.

## References

[Apache Geode Repository](https://github.com/apache/geode)

[OQL Method Invocation Security RFC](https://cwiki.apache.org/confluence/display/GEODE/OQL+Method+Invocation+Security#OQLMethodInvocationSecurity-GeodeBasedMethodAuthorizer)

[OQL Method Invocation Security JIRAs](https://issues.apache.org/jira/browse/GEODE-6983)