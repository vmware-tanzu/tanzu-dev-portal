---
title: "The Most Useful Statistics for Troubleshooting Tanzu GemFire Deployments"
description: >
    This article describes the most useful statistics for troubleshooting Tanzu GemFire Deployments.
date: 2021-07-01
type: blog

# Author(s)
team:
- Barry Oglesby
 
---

## Introduction
Each member of the Tanzu GemFire `DistributedSystem` produces a variety of statistics including ones in these categories:

- Operating System
- Java Virtual Machine (JVM)
- JVM heap memory
- JVM garbage collection
- Peer to peer requests
- Client to server requests
- Cache performance

If the `statistic-sampling-enabled` property is set to true, then the statistics are periodically written to an archive file configured by the `statistic-archive-file` property. The main way to view the file is to use the [Visual Statistics Display](https://gemtalksystems.com/products/vsd/) (vsd) tool. See the documentation [here](https://gemfire.docs.pivotal.io/910/geode/managing/troubleshooting/producing_troubleshooting_artifacts.html) for additional details on producing the statistics file. See the documentation [here](https://gemfire.docs.pivotal.io/910/gemfire/tools_modules/vsd/chapter_overview.html) for additional details on vsd.

Some of these statistics are helpful in troubleshooting most issues; some are more obscure and only apply to narrow situations.

This article describes the statistics that are most useful when troubleshooting issues, and in some cases, relationships between the statistics.

## Most Useful Statistics
All of the statistics are grouped into categories. The most useful categories are listed below. The most important statistics in each category are described in the following sections.

- VMStats — statistics for the JVM
- VMMemoryPoolStats — statistics for JVM heap memory
- VMGCStats — statistics for JVM garbage collection
- StatSamplerStats — statistics for the statistics sampler itself
- ResourceManagerStats — statistics for heap monitoring
- PartitionedRegionStats — statistics for partitioned regions
- LinuxSystemStats — statistics for the operating system
- DistributionStats — statistics for peer to peer requests
- CacheServerStats — statistics for client to server requests
- CachePerfStats — statistics for cache performance

### `VMStats`
The `VMStats` instance groups together all the statistics related to the JVM process including:

- **`fdsOpen`** / **`fdLimit`** — indicate the current and maximum number of file descriptors in the JVM retrieved from the `UnixOperatingSystemMXBean` provided by `ManagementFactory.getOperatingSystemMXBean()`. If the number of open file descriptors reaches the limit, then an exception with ‘*Too many open files*’ will occur.
- **`processCpuTime`** — indicates the processing time of the JVM CPU retrieved from `UnixOperatingSystemMXBean` from `ManagementFactory.getOperatingSystemMXBean()`. This statistic shows how much of the total host CPU (see `LinuxSystemStats`) is accounted for by the JVM.
- **`threads`** — indicates the number of threads in the JVM retrieved from the `ThreadMXBean` provided by `ManagementFactory.getThreadMXBean()`

### `VMMemoryPoolStats`
A `VMMemoryPoolStats` instance groups together all the statistics related to a java heap memory space. Examples include `CMS Old Gen`, `Par Eden Space`, `G1 Eden Space` and `G1 Old Gen`. One is created for each of the `MemoryPoolMXBeans` provided by `ManagementFactory.getMemoryPoolMXBeans()`.

- **`currentUsedMemory`** — indicates the current heap usage of the JVM
- **`currentMaxMemory`** — indicates the maximum heap usage of the JVM

### `VMGCStats`
A `VMGCStats` instance groups together all the statistics related to a java garbage collector. Examples include `ConcurrentMarkSweep`, `ParNew`, `G1 Old Generation` and `G1 Young Generation`. One is created for each of the `GarbageCollectorMXBeans` provided by `ManagementFactory.getGarbageCollectorMXBeans()`.

- **`collections`** — indicates the number of garbage collections
- **`collectionTime`** — indicates the garbage collection time in nanoseconds. Spikes in this statistic may cause members to be disconnected from the `DistributedSystem` and may require garbage collection tuning or adjustments to the configured heap or region configuration (e.g. add or change heap LRU eviction).

### `StatSamplerStats`
The `StatSamplerStats` instance groups together all the statistics related to statistic sampling.

- **`delayDuration`** — indicates the delay between samples taken by the statistics sampler thread . The [`HostStatSampler’s`](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/statistics/HostStatSampler.java) `statThread` samples statistics periodically based on the *statistic-sample-rate* property. If the `statThread` doesn’t sample when it should, the `delayDuration` will show a spike. This often indicates a resource issue (e.g. GC or CPU) and helps narrow the time frame for investigation.
- **`jvmPauses`** — indicates the number of JVM pauses. This statistic is incremented when the delay between statistics samples is greater than three seconds. This time is configurable via the [gemfire.statSamplerDelayThreshold](https://github.com/apache/geode/blob/2271b7f2b7c5ff8adc1b066894a3b714975cbe0d/geode-core/src/main/java/org/apache/geode/internal/statistics/HostStatSampler.java#L66) java system property.

### `ResourceManagerStats`
The `ResourceManagerStats` instance groups together all the statistics related to the monitoring of heap usage.

- **`heapCriticalEvents`** — indicates the number of times the heap usage exceeded the critical heap percentage. The critical heap percentage is the percentage at which the member will accept no more Cache operations. It is configured via the `ResourceManager's` `critical-heap-percentage` property.
- **`evictionStartEvents`** — indicates the number of times the heap usage exceeded the eviction heap percentage. The eviction heap percentage is the percentage at which eviction will begin for regions defined with heap LRU eviction. It is configured via the `ResourceManager's` `eviction-heap-percentage` property.

### `PartitionedRegionStats`
A `PartitionedRegionStats` instance groups together all the statistics related to a partitioned region.

- **`bucketCount`** — indicates the number of buckets defined in the member
- **`primaryBucketCount`** — indicates the number of primary buckets defined in the member
- **`dataStoreBytesInUse`** — indicates the number of entry bytes across all the buckets including primaries and secondaries
- **`dataStoreEntryCount`** — indicates the number of entries across all the buckets including primaries and secondaries

### `LinuxSystemStats`
The `LinuxSystemStats` instance groups together all the statistics related to the linux system performance.

- **`cachedMemory`** — indicates the amount of memory cached in RAM retrieved from `/proc/meminfo`
- **`cpuActive`** — indicates the active CPU percentage retrieved from `/proc/stat`
- **`freeMemory`** — indicates the amount of free memory available on the host machine retrieved from `/proc/meminfo`. This statistic helps determine if the amount of available memory is adequate for the JVM heap plus native threads.
- **`loadAverage1`**, **`loadAverage5`**, **`loadAverage15`** — indicate the number of running and waiting processes retrieved from `/proc/loadavg`. These statistics help determine if the load on the system is too high for the number of CPUs.
- **`physicalMemory`** — indicates the amount of physical memory on the host retrieved from `/proc/meminfo`
- **`recvBytes`** — indicates the number of bytes received over the network from other members retrieved from `/proc/net/dev`
- **`recvDrops`** — indicates the number of received bytes dropped retrieved from `/proc/net/dev`. Non-zero values for this statistic indicate possible network issues.
- **`xmitBytes`** — indicates the number of bytes transmitted over the network to other members retrieved from `/proc/net/dev`
- **`xmitDrops`** — indicates the number of transmitted bytes dropped retrieved from `/proc/net/dev`. Non-zero values for this statistic indicate possible network issues.

### `DistributionStats`
The `DistributionStats` instance groups all the statistics related to peer to peer communication and processing.

- **`nodes`** — indicates the number of members of the `DistributedSystem`
- **`functionExecutionThreads`** / **`functionExecutionQueueSize`** — indicate the number of threads in the `ExecutorService` called [`functionExecutionPool`](https://github.com/apache/geode/blob/2271b7f2b7c5ff8adc1b066894a3b714975cbe0d/geode-core/src/main/java/org/apache/geode/distributed/internal/ClusterOperationExecutors.java#L149) used to process Function execution requests and the queue for excess requests when all the threads are in use. The **`functionExecutionThreads`** statistic corresponds to the number of `Function Execution Processor` threads (default maximum is the maximum of processors*16 and 100). If the **`functionExecutionQueueSize`** is consistently greater than zero, then the `functionExecutionPool’s` maximum number of threads can be increased by setting the [DistributionManager.MAX\_FE_THREADS](https://github.com/apache/geode/blob/2271b7f2b7c5ff8adc1b066894a3b714975cbe0d/geode-core/src/main/java/org/apache/geode/distributed/internal/OperationExecutors.java#L31) java system property. See my blog [here](data/tanzu-gemfire/blog/threads-used-in-geode-function-execution/) for additional information on when and how Function execution threads are used.
- **`highPriorityThreads`** / **`highPriorityQueueSize`** — indicate the number of threads in the `ExecutorService` called [`highPriorityPool`](https://github.com/apache/geode/blob/2271b7f2b7c5ff8adc1b066894a3b714975cbe0d/geode-core/src/main/java/org/apache/geode/distributed/internal/ClusterOperationExecutors.java#L127) used to process high priority messages (e.g. [`CreateRegionMessage`](https://github.com/apache/geode/blob/8333d606fce4737da1e5dc846efa53f3ab035cd3/geode-core/src/main/java/org/apache/geode/internal/cache/CreateRegionProcessor.java#L311), [`RequestImageMessage`](https://github.com/apache/geode/blob/8333d606fce4737da1e5dc846efa53f3ab035cd3/geode-core/src/main/java/org/apache/geode/internal/cache/InitialImageOperation.java#L1522)) and the queue for excess requests when all the threads are in use. The **`highPriorityThreads`** statistic corresponds to the number of `Pooled High Priority Message Processor` threads (default maximum is 1000). If the **`highPriorityQueueSize`** is consistently greater than zero, then the `highPriorityPool’s` maximum number of threads can be increased by setting the [DistributionManager.MAX_THREADS](https://github.com/apache/geode/blob/2271b7f2b7c5ff8adc1b066894a3b714975cbe0d/geode-core/src/main/java/org/apache/geode/distributed/internal/OperationExecutors.java#L28) java system property.
- **`partitionedRegionThreads`** / **`partitionedRegionQueueSize`** — indicate the number of threads in the `ExecutorService` called [`partitionedRegionPool`](https://github.com/apache/geode/blob/2271b7f2b7c5ff8adc1b066894a3b714975cbe0d/geode-core/src/main/java/org/apache/geode/distributed/internal/ClusterOperationExecutors.java#L146) used to process partitioned region messages (e.g. [`PutMessage`](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/partitioned/PutMessage.java), [`DestroyMessage`](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/partitioned/DestroyMessage.java)) and the queue for excess requests when all the threads are in use. The **`partitionedRegionThreads`** statistic corresponds to the number of `PartitionedRegion Message Processor` threads (default maximum is the maximum of processors*32 and 200). If the **`partitionedRegionQueueSize`** is consistently greater than zero, then the `partitionedRegionPool’s` maximum number of threads can be increased by setting the [DistributionManager.MAX\_PR_THREADS](https://github.com/apache/geode/blob/2271b7f2b7c5ff8adc1b066894a3b714975cbe0d/geode-core/src/main/java/org/apache/geode/distributed/internal/ClusterOperationExecutors.java#L70) java system property.
- **`processingThreads`** / **`overflowQueueSize`** — indicate the number of threads in the `ExecutorService` called [`threadPool`](https://github.com/apache/geode/blob/2271b7f2b7c5ff8adc1b066894a3b714975cbe0d/geode-core/src/main/java/org/apache/geode/distributed/internal/ClusterOperationExecutors.java#L121) used to process normal messages (e.g. [`TXCommitMessage`](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/TXCommitMessage.java), [`ManagerStartupMessage`](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/management/internal/ManagerStartupMessage.java)) and the queue for excess requests when all the threads are in use. The **`processingThreads`** statistic corresponds to the number of `Pooled Message Processor` threads (default maximum is 1000). If the **`overflowQueueSize`** is consistently greater than zero, then the `threadPool’s` maximum number of threads can be increased by setting the [DistributionManager.MAX_THREADS](https://github.com/apache/geode/blob/2271b7f2b7c5ff8adc1b066894a3b714975cbe0d/geode-core/src/main/java/org/apache/geode/distributed/internal/OperationExecutors.java#L28) java system property.
- **`sendersTO`** — indicates the number of outgoing thread-owned (TO) connections to other members. This statistic will only be set with the `conserve-sockets` property set to false. In that case, when a thread processing a request in one member needs to send a message to another member, it will create and use a dedicated connection to that member. An example is when a `ServerConnection` thread processing a client put request needs to replicate the value to a secondary member. This will cause the remote member to create a dedicated `P2P message reader` thread to handle this message and any future messages from the local member and thread. This will increment the **`sendersTO`** statistic in the local member and the **`receiversTO`** statistic in the remote member.
- **`receiversTO`** — indicates the number of incoming thread-owned (TO) connections from remote members. A corresponding **`sendersTO`** will be incremented in the remote member. This statistic corresponds to the number of `P2P message reader` threads and will only be set with the `conserve-sockets` property set to false.
- **`senderTimeouts`** — indicates the number of outgoing thread-owned (TO) connections that have been idle for the `socket-lease-time` property (default is 60000 ms) and have been closed. When a thread-owned connection is closed, its corresponding remote `P2P message reader` thread will also be closed. The local **`sendersTO`** and the remote **`receiversTO`** statistics will be decremented. In addition, the local **`senderTimeouts`** will be incremented. The thread-owned connections between members are created on demand and can be costly to create (especially with SSL). Once they are established, they should be maintained as long as the thread that established them exists. Increasing `socket-lease-time` (maximum is 600000 ms) or disabling it by setting it to zero will help ensure that connections are not closed prematurely.
- **`replyTimeouts`** — indicates the number of times a thread in one member waited for at least `ack-wait-threshold` seconds (default=15) for a reply from another member. The thread will continue to wait even though the timeout has occurred until either the reply is received or the remote member leaves the `DistributedSystem`. This statistic corresponds to a *15 second warning* message in the log.
- **`replyWaitsInProgress`** — indicates the number of threads in one member waiting for a reply from a remote member. This statistic flatlined above zero indicates a permanently stuck thread.
- **`suspectsReceived`** — indicates the number of suspect messages received from other members whenever a member departs unexpectedly or there are network issues such that a specific member cannot be contacted
- **`suspectsSent`** — indicates the number of suspect messages sent to other members whenever a member departs unexpectedly or there are network issues such that a specific member cannot be contacted

### `CacheServerStats`
The `CacheServerStats` instance groups all the statistics related to client to server communication and processing.

- **`currentClients`** — indicates the number of unique clients that currently have a connection to this server. For long-lived clients, this statistic should be relatively flat.
- **`currentClientConnections`** — indicates the total number of client connections to this server. This statistic indicates the number of client threads performing Cache operations.
- **`closeConnectionRequests`** — indicates the number of close connection requests from clients. For long-lived clients, this statistic is an indicator of how often idle client connections are timed-out and closed. This statistic also has a relationship with **`sendersTO`** and **`receiversTO`**. Churn in this statistic also means churn in those statistics. Churn in this case means socket connections from the client to the server and from that server to its members being closed and reopened. Since creating socket connections can be expensive (especially for SSL), this statistic should be as close to zero as possible. If there is a lot of churn in this statistic then the client `Pool's` `idle-timeout` property should be increased or disabled. The default is five seconds which is often too low.
- **`connectionsTimedOut`** — this statistic indicates the number of connections that the server determines have timed out on the client based on the `Pool's` `read-timeout` property. Even though the statistic is incremented, the `ServerConnection` thread processing the client request continues processing that request. This statistic should be as close to zero as possible. If not, then the `read-timeout` property should be increased.
- **`threadQueueSize`** — this statistic indicates the number of client requests waiting for a `ServerConnection` thread to process them. It is only applicable if the `CacheServer's` `max-threads` property is set greater than zero. This property causes an `ExecutorService` called [`pool`](https://github.com/apache/geode/blob/8333d606fce4737da1e5dc846efa53f3ab035cd3/geode-core/src/main/java/org/apache/geode/internal/cache/tier/sockets/AcceptorImpl.java#L128) to be created. If the **`threadQueueSize`** is consistently greater than zero, then the `max-threads` property should be increased.

### `CachePerfStats`
The `CachePerfStats` instance groups all the statistics related to Cache usage.

- **`cacheListenerCallsInProgress`** — indicates the number of CacheListener callbacks in progress. This statistic flatlined above zero indicates a permanently stuck CacheListener.
- **`cacheWriterCallsInProgress`** — indicates the number of CacheWriter callbacks in progress. This statistic flatlined above zero indicates a permanently stuck CacheWriter.
- **`loadsInProgress`** — indicates the number of CacheLoader callbacks in progress. This statistic flatlined above zero indicates a permanently stuck CacheLoader.


## Conclusion
This article has shown some of the more useful statistics used when troubleshooting issues.
