---
date: 2020-07-31
description: This article describes several common Function execution use cases and
  which threads processes those requests.
lastmod: '2021-04-22'
team:
- Barry Oglesby
title: Threads Used in Apache Geode Function Execution
type: blog
---

## Introduction
When a client executes an Apache Geode Function, the type and attributes of the Function request dictate the threads that processes it on the server.

Apache Geode defines a number of thread pools and threads to process different kinds of messages. The ones involved in Function execution are:

* the Acceptor thread pool which creates **ServerConnection** threads to handle all requests from the client
* the Function Execution thread pool which creates **Function Execution Processor** threads to process Function execution requests
* the **P2P message reader** threads which handle messages between servers

When a client executes a Function, a **ServerConnection** will initially handle the request. Depending on the type and attributes of the request, the **ServerConnection** may hand it off to a **Function Execution Processor** to process. If the Function execution does any replication (e.g. Region put), a **P2P message reader** in the remote server will process that replication. The thread processing the Function execution request is important for several reasons.

## Description of Reasons

### P2P Message Reader Threads

One reason the thread processing the Function execution request is important is that it determines the type of **P2P message reader** in the remote server that handles data replications resulting from the Function execution. When a server is started, it creates two shared **P2P message readers** for each other server. One handles ordered messages like UpdateMessage; the other handles unordered messages like CreateRegionMessage. Depending on the message type, the **P2P message reader** either processes the message itself or hands it off to one of several internal thread pools for processing. With the [conserve-sockets](https://geode.apache.org/docs/guide/12/managing/monitor_tune/performance_controls_controlling_socket_use.html) property set to true (the default), these are the only **P2P message readers** receiving messages from remote servers. Having only two **P2P message readers** for each remote server can be a performance bottleneck. Setting *conserve-sockets* to false addresses this by allowing multiple **P2P message readers** for each remote server. Each one receives and processes a specific remote server’s thread’s requests. This provides better throughput.

A replication from a **ServerConnection** honors the conserve-sockets setting so an unshared **P2P message reader** is used in the remote server. By default, a replication from a **Function Execution Processor** does not honor the conserve-sockets setting so a shared **P2P message reader** is used in the remote server. The default behavior can be changed by setting the socket policy like this in the Function execute method:

```java
public void execute(FunctionContext context) {
  ...
  try {
    DistributedSystem.setThreadsSocketPolicy(false);
    // Process request
  } finally {
    DistributedSystem.setThreadsSocketPolicy(true);
  }
  ...
}
```

### Thread Pool Maximum Sizes

Another reason the thread processing the Function execution request is important is that each thread pool defines a different default maximum number of threads. The Acceptor thread pool default is 800. It can be changed during server startup like:

```
gfsh start server --name=server-1 --server-port=0 --max-connections=1600 ...
```

The Function Execution thread pool default is variable depending on the number of CPUs available. It is defined like:

```java
int MAX_FE_THREADS = Integer.getInteger("DistributionManager.MAX_FE_THREADS",
 Math.max(Runtime.getRuntime().availableProcessors() * 4, 16));
```

In a Function-heavy application, the default maximum is often not enough. It can be changed during server startup like:

```
gfsh start server --name=server-1 --server-port=0 --J=-DDistributionManager.MAX_FE_THREADS=128 ...
```

This article describes several common Function execution use cases and which threads processes those requests.

## Thread Examples

A thread dump of an Apache Geode server will show many threads. The ones relevant to this article are shown below.

A **ServerConnection** looks like:

```
`"ServerConnection on port 64777 Thread 1" #75 daemon prio=5 os_prio=31 tid=0x00007ff8498d7800 nid=0xb10f waiting on condition [0x000070000501d000]
```
A **Function Execution Processor** looks like:
```
"Function Execution Processor2" #56 daemon prio=10 os_prio=31 tid=0x00007ff84ab34800 nid=0x7a03 waiting on condition [0x0000700004e17000]
```
A shared **P2P message reader** looks like:
```
"P2P message reader for (server-2:81597)<v2>:41002 shared ordered uid=6 port=64802" #59 daemon prio=5 os_prio=31 tid=0x00007ff84c49a800 nid=0x7c03 runnable [0x0000700005120000]
```
An unshared **P2P message reader** looks like:
```
"P2P message reader for (server-2:81597)<v2>:41002 unshared ordered uid=14 dom #2 port=65342" #82 daemon prio=10 os_prio=31 tid=0x00007ff84e194000 nid=0xad07 runnable [0x0000700005835000]
```

## Function Use Cases

### Assumptions

All of the use cases in this article have these assumptions:
* the client Pool has single-hop enabled (default)
* the client has the server’s metadata (the layout of the partitioned Region buckets) before it invokes a Function
* the Function hasResult returns true (default)
* the Function optimizeForWrite returns true (non-default, although I would always recommend this setting for Functions that update partitioned Regions)

### Description

In the test for each use case, a client invokes a Function with zero, one or multiple filters on two servers. The Function execute method on the server gets an entry from a Region, updates it and puts it back into the Region. In the **onServer / onServers** use cases, the Function gets the Region from the Cache instead of the RegionFunctionContext.

Each use case describes the threads involved in the server receiving and processing the Function execution request (server-1) and the one processing the data replication (server-2).

The source code for all of these tests is [here](https://github.com/boglesby/function-execution-threads).

The following use cases are described:

* onServer / onServers
* onRegion (Replicated Region)
* onRegion (Replicated Region, Unshared Resources)
* onRegion (Partitioned Region, No Filter)
* onRegion (Partitioned Region, No Filter, Unshared Resources)
* onRegion (Partitioned Region, One Filter)
* onRegion (Partitioned Region, Multiple Filters)
* onRegion (Partitioned Region, Multiple Filters, Unshared Resources)

### onServer / onServers
Both the onServer and onServers use cases behave the same in terms of the threads used from each server’s perspective.

This use case uses two threads:

* one ServerConnection on server-1
* one unshared P2P message reader on server-2

Since the Function execution request is executed by a **ServerConnection**, the replication honors the conserve-sockets setting and uses an unshared **P2P message reader** on the replication server.

A simplified sequence diagram of this use case is:

![Image for post](images/barry_07_31_arch_diagram1.png#diagram)

Below is logging (mainly from a [DistributionMessageObserver](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/distributed/internal/DistributionMessageObserver.java)) on each server that shows the behavior.

A **ServerConnection** on server-1 receives and processes the Function execution request:

```
[info 2020/07/25 07:48:04.138 HST <ServerConnection on port 53445 Thread 2> tid=0x4b] About to process a ExecuteFunction70
[info 2020/07/25 07:48:04.145 HST <ServerConnection on port 53445 Thread 2> tid=0x4b] Executing function=OnServerFunction
```

The **ServerConnection** on server-1 sends an UpdateMessage containing the data replication to server-2:
```
[info 2020/07/25 07:48:04.151 HST <ServerConnection on port 53445 Thread 2> tid=0x4b] About to send a UpdateMessage to [0.0.0.0(server-2:82128)<v1>:41001]
```

An unshared **P2P message reader** on server-2 receives and processes the UpdateMessage:
```
[info 2020/07/25 07:48:04.153 HST <P2P message reader for 0.0.0.0(server-1:82129)<v2>:41002 unshared ordered uid=12 dom #1 port=53500> tid=0x3d] About to process a UpdateMessage from 0.0.0.0(server-1:82129)<v2>:41002
[info 2020/07/25 07:48:04.155 HST <P2P message reader for 0.0.0.0(server-1:82129)<v2>:41002 unshared ordered uid=12 dom #1 port=53500> tid=0x3d] Processed a UpdateMessage from 0.0.0.0(server-1:82129)<v2>:41002
```

The **ServerConnection** on server-1 completes processing the Function execution request:
```
[info 2020/07/25 07:48:04.155 HST <ServerConnection on port 53445 Thread 2> tid=0x4b] Executing function=OnServerFunction completed
[info 2020/07/25 07:48:04.156 HST <ServerConnection on port 53445 Thread 2> tid=0x4b] Completed processing a ExecuteFunction70
```

### onRegion (Replicated Region)
Regardless of the number of filters, all Function execution requests on replicated Regions behave the same.

This use case uses four threads:

* one **ServerConnection**, one **Function Execution Processor**, one shared **P2P message reader** on server-1
* one shared **P2P message reader** on server-2

Since the Function execution request is executed by a **Function Execution Processor**, the replication does not honor the *conserve-sockets* setting and uses shared **P2P message readers**.

A simplified sequence diagram of this use case is:

![Image for post](images/barry_07_31_arch_diagram2.png#diagram)

Below is logging on each server that shows the behavior.

A **ServerConnection** on server-1 receives the Function execution request:

```
[info 2020/07/25 07:51:04.717 HST <ServerConnection on port 53422 Thread 2> tid=0x51] About to process a ExecuteRegionFunctionGeode18
```

A **Function Execution Processor** on server-1 processes the Function execution request:

```
[info 2020/07/25 07:51:04.724 HST <Function Execution Processor2> tid=0x38] Executing function=OnRegionFunction; numKeys=1 keys=[0]; region=/ReplicatedTrade; unsharedResources=false
```

The **Function Execution Processor** on server-1 sends an UpdateMessage containing the data replication to server-2:

```
[info 2020/07/25 07:51:04.725 HST <Function Execution Processor2> tid=0x38] About to send a UpdateMessage to [0.0.0.0(server-2:82129)<v2>:41002]
```
A shared **P2P message reader** on server-2 receives and processes the UpdateMessage and sends a ReplyMessage:

```
[info 2020/07/25 07:51:04.726 HST <P2P message reader for 0.0.0.0(server-1:82128)<v1>:41001 shared ordered uid=6 port=53449> tid=0x39] About to process a UpdateMessage from 0.0.0.0(server-1:82128)<v1>:41001
[info 2020/07/25 07:51:04.727 HST <P2P message reader for 0.0.0.0(server-1:82128)<v1>:41001 shared ordered uid=6 port=53449> tid=0x39] About to send a ReplyMessage to [0.0.0.0(server-1:82128)<v1>:41001]
[info 2020/07/25 07:51:04.727 HST <P2P message reader for 0.0.0.0(server-1:82128)<v1>:41001 shared ordered uid=6 port=53449> tid=0x39] Processed a UpdateMessage from 0.0.0.0(server-1:82128)<v1>:41001
```

The shared **P2P message reader** on server-1 receives and processes the ReplyMessage:

```
[info 2020/07/25 07:51:04.727 HST <P2P message reader for 0.0.0.0(server-2:82129)<v2>:41002 shared unordered uid=2 port=53439> tid=0x37] About to process a ReplyMessage from 0.0.0.0(server-2:82129)<v2>:41002
[info 2020/07/25 07:51:04.727 HST <P2P message reader for 0.0.0.0(server-2:82129)<v2>:41002 shared unordered uid=2 port=53439> tid=0x37] Processed a ReplyMessage from 0.0.0.0(server-2:82129)<v2>:41002
```

The **Function Execution Processor** on server-1 completes processing the Function execution request:

```
[info 2020/07/25 07:51:04.728 HST <Function Execution Processor2> tid=0x38] Executing function=OnRegionFunction completed
```

The **ServerConnection** on server-1 completes processing the Function execution request:

```
[info 2020/07/25 07:51:04.728 HST <ServerConnection on port 53422 Thread 2> tid=0x51] Completed processing a ExecuteRegionFunctionGeode18
```

### onRegion (Replicated Region, Unshared Resources)

This use case uses three threads:
* one ServerConnection, one Function Execution Processor on server-1
* one unshared P2P message reader on server-2

Since the Function execution request is executed by a **Function Execution Processor** in which the thread socket policy is set to false, the replication honors the *conserve-sockets* setting and uses an unshared **P2P message reader** on the replication server.

A simplified sequence diagram of this use case is:

![Image for post](images/barry_07_31_arch_diagram3.png#diagram)

Below is logging on each server that shows the behavior.

A **ServerConnection** on server-1 receives the Function execution request:

```
[info 2020/07/25 07:52:12.862 HST <ServerConnection on port 53422 Thread 3> tid=0x52] About to process a ExecuteRegionFunctionGeode18
```

A **Function Execution Processor** on server-1 processes the Function execution request:

```
[info 2020/07/25 07:52:12.862 HST <Function Execution Processor2> tid=0x38] Executing function=OnRegionFunction; numKeys=1 keys=[0]; region=/ReplicatedTrade; unsharedResources=true
```

The **Function Execution Processor** on server-1 sends an UpdateMessage containing the data replication to server-2:

```
[info 2020/07/25 07:52:12.863 HST <Function Execution Processor2> tid=0x38] About to send a UpdateMessage to [0.0.0.0(server-2:82129)<v2>:41002]
```

An unshared **P2P message reader** on server-2 receives and processes the UpdateMessage:

```
[info 2020/07/25 07:52:12.864 HST <P2P message reader for 0.0.0.0(server-1:82128)<v1>:41001 unshared ordered uid=12 dom #1 port=53999> tid=0x34] About to process a UpdateMessage from 0.0.0.0(server-1:82128)<v1>:41001
[info 2020/07/25 07:52:12.865 HST <P2P message reader for 0.0.0.0(server-1:82128)<v1>:41001 unshared ordered uid=12 dom #1 port=53999> tid=0x34] Processed a UpdateMessage from 0.0.0.0(server-1:82128)<v1>:41001
```

The **Function Execution Processor** on server-1 completes processing the Function execution request:

```
[info 2020/07/25 07:52:12.865 HST <Function Execution Processor2> tid=0x38] Executing function=OnRegionFunction completed
```

The **ServerConnection** on server-1 completes processing the Function execution request:

```
[info 2020/07/25 07:52:12.866 HST <ServerConnection on port 53422 Thread 3> tid=0x52] Completed processing a ExecuteRegionFunctionGeode18
```

### onRegion (Partitioned Region, No Filter)

This use case uses the same four threads as the **onRegion (Replicated Region)** use case:
* one ServerConnection, one Function Execution Processor, one shared P2P message reader on server-1
* one shared P2P message reader on server-2

### onRegion (Partitioned Region, No Filter, Unshared Resources)

This use case uses the same three threads as the **onRegion (Replicated Region, Unshared Resources)** use case:

* one **ServerConnection**, one **Function Execution Processor** on server-1
* one unshared **P2P message reader** on server-2

### onRegion (Partitioned Region, One Filter)

This use case uses the same two threads as **the onServer / onServers use** case:

* one **ServerConnection** on server-1
* one unshared **P2P message reader** on server-2

### onRegion (Partitioned Region, Multiple Filters)
This use case uses the same four threads as the **onRegion (Replicated Region)** use case:

* one **ServerConnection**, one **Function Execution Processor**, one shared **P2P message reader** on server-1
* one shared **P2P message reader** on server-2

### onRegion (Partitioned Region, Multiple Filters, Unshared Resources)

This use case uses the same three threads as the **onRegion (Replicated Region, Unshared Resources)** use case:

* one **ServerConnection**, one **Function Execution Processor** on server-1
* one unshared **P2P message reader** on server-2

## Conclusion
The use cases which require the least number of threads are **onServer / on Servers** and **onRegion (Partitioned Region, One Filter)**. Both of these require one thread on each server. The other use cases each require either three or four threads depending on the thread socket policy setting in the Function execute method. **Setting it set to false** eliminates the use of shared **P2P message readers** and uses one unshared **P2P message reader** on the server receiving the replication.