---
date: 2020-02-06
description: Apache Geode as a remote cache for Gradle to share commonly built task
  outputs across remote builds to improve build times
lastmod: '2021-04-22'
team:
- Jason Huynh
title: Apache Geode as a Remote Gradle Build Cache
type: blog
---

## Introduction
Gradle task output can be cached locally but also remotely. The idea of a remote cache is to share commonly built task outputs across remote builds to improve build times. With a few steps, we can use Apache Geode as a remote cache for Gradle.

## What’s Apache Geode?
[Apache Geode](https://geode.apache.org/) is a fault tolerant, highly concurrent and scalable in-memory data grid that can be used in many ways, including as a cache. A *region* is a data structure, similar to a distributed map, that we will use to store the task output. Regions provide extra features such as LRU eviction, that can be used to improve our solution in the future. As data grows, we can add more nodes to the cluster and with a simple rebalance command, the data will be evenly distributed across all the nodes.

## How?

### Prerequisites

Assuming you have Apache Geode installed. For help, see the [User Guide](https://geode.apache.org/docs/).

### Start Apache Geode Cluster

First we start a one locator and one server cluster.

```
1. ./gfsh 
2. start locator --name=locator1
3. start server --name=server1 
```

Create the region where we will store the Gradle artifacts

```
4. create region --name='gradleRegionName' 
```

### Using the [Geode Gradle Build Cache](https://github.com/jhuynh1/geode-gradle-build-cache)

Change your project's settings.gradle to include the following:

```groovy
buildscript {
   repositories {
       maven {
         url "https://dl.bintray.com/jasonhuynh/jhuynh1-maven/"
       }
       jcenter()
     }
     dependencies {
       classpath 'com.github.jhuynh1.geode.gradle.build.cache:geode-gradle-build-cache:0.1'
     }
 }
 
 import com.github.jhuynh1.geode.gradle.build.cache.GeodeGradleBuildCache
 import com.github.jhuynh1.geode.gradle.build.cache.GeodeGradleBuildCacheServiceFactory
 
 buildCache {
   local {
     //this is set to false to hilite usage of remote cache
     //this setting will impact your performance
     enabled = false 
   }

   // Register custom build cache implementation
   registerBuildCacheService(GeodeGradleBuildCache.class, GeodeGradleBuildCacheServiceFactory.class)
 
   remote(GeodeGradleBuildCache) {
     enabled = true 
     //this is set to allow pushing to the remote cache
     //the type of system will probably affect this setting (ci vs dev)
     push = true
     //optional settings.  The defaults are listed below
     //locatorHost = 'localhost'
     //locatorPort = 10334
     //gradleRegionName = 'gradleRegionName'
   }
 }
```

Run a build with `--build-cache` or add `org.gradle.caching=true` to gradle.properties.

### Remote and Local Cache
There are different ways to configure the remote and local cache relationship in Gradle to get optimal performance. These settings were not configured to get the best performance but to show the usage of the remote cache. More resources can be found online for creating ci and developer specific configurations. More info [here](https://docs.gradle.org/current/userguide/build_cache.html).

## What next?
The code for the Geode Gradle Build Cache can be found [here](https://github.com/jhuynh1/geode-gradle-build-cache). There are many improvements and features someone could add, some ideas that come to mind:

   * Store meta data or statistics about our build and use that to determine when to actually cache or force a miss to have it build locally.  

   * We could add a continuous query to alert us when certain files or certain file sizes are uploaded.  

   * Maybe we have remote teams that span WAN sites, we could replicate the region across a wan and have multiples sites and teams sharing artifacts.

## Want to learn more about Apache Geode?

More [tutorials/examples](https://github.com/apache/geode-examples) of Apache Geode </br>
Please reach out to the [Apache Geode Community](https://geode.apache.org/community/)!