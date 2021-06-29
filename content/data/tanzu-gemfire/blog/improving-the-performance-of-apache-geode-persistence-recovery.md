---
date: 2020-07-20
description: This is our journey into how we improved the system recovery performance.
lastmod: '2021-04-22'
team:
- Jianxia Chen
title: Improving the Performance of Apache Geode Persistence Recovery
type: blog
---

## Introduction

[Apache Geode](https://geode.apache.org/) is a data management platform that provides real-time, consistent access to data-intensive applications throughout widely distributed cloud architectures. Geode pools memory, CPU, network resources, and optionally local disk across multiple processes to manage application objects and behavior. It uses dynamic replication and data partitioning techniques to implement high availability, improved performance, scalability, and fault tolerance. In addition to being a distributed data container, Apache Geode is an in-memory data management system that provides reliable asynchronous event notifications and guaranteed message delivery.

This article assumes you have a basic understanding of Apache Geode. You can refer to the [quick start](https://geode.apache.org/docs/guide/19/getting_started/book_intro.html) for an overview of the system.

Apache Geode offers super fast write-ahead-logging (WAL) persistence with a shared-nothing architecture that is optimized for fast parallel recovery of nodes or an entire cluster. Persistence provides a disk backup of region entry data. The keys and values of all entries are saved to disk, like having a replica of the region on disk. When the member stops for any reason, the region data on disk remains. The disk data can be used at member startup to repopulate the region. Each member has its own set of disk stores, and they are completely separate from the disk stores of any other member.

Disk store files include store management files, access control files, and the operation log(oplog) files, consisting of one file for deletions and another for all other operations. For example, in the file system, there are oplog files with crf, drf and krf file extensions. The crf oplog contains create, update, and invalidate operations for region entries. The drf oplog contains delete operations, and the krf oplog contains the key names as well as the offsets for the values within the crf file. The krf oplog improves startup performance by allowing Geode to load the entry values in the background after the entry keys are loaded. When you start a member with a persistent region, the data is retrieved from disk stores to recreate the member’s persistent region. Entry keys are loaded from the key file in the disk store before considering entry values. Once all keys are loaded, Geode loads the entry values asynchronously.

If you would like to know more about Apache Geode disk storage, please refer to the [Geode documentation](https://geode.apache.org/docs/guide/12/managing/disk_storage/chapter_overview.html).

## Challenges for the Performance of Persistence Recovery

In the recent tests on the cloud environment, we have observed that persistence recovery takes a long time. For example, say we have a Geode cluster with one locator and four servers. We shut down all the servers, but keep the locators running, then restart all the servers together. In some cases like this, we have noticed that two of the servers restart quickly, while the other two servers take significantly longer time to recover the persisted data. This is not how Geode is supposed to work. It is supposed to parallelize the startup of all the servers. This is our journey into how we improved the system recovery performance.

## Remove Unnecessary Thread Synchronization

On a server, one thread holding a lock can block the other thread waiting on the same lock. In a distributed system like Geode, this can further block other threads on the other servers because Geode servers exchange messages, such as request and response messages, to collaborate on certain tasks like region creation. If a thread is blocked before sending a response to a request from the other server, the other server could be blocked waiting for the response. This is what we have observed in the logs.

In the Geode server logs, the `ThreadsMonitor` puts warning messages in the logs to tell which thread is stuck waiting for the lock, and which thread currently holds the lock together with the thread stacks. On the server named server1, our log shows that the thread is waiting on the lock on a `HashMap`. Here is an example of the warning in the log.

{{< gist jchen21 e280e387f128e70537e37093d26f6422 >}}

In the example log, there are two thread stacks. The stack for the thread waiting for the lock, and the other stack for the thread holding the lock. Thread 49 is waiting for the lock on the `HashMap` to be released. Based on the thread stack

`org.apache.geode.internal.cache.GemFireCacheImpl.getRegion(GemFireCacheImpl.java:3212)`,

we can tell from the source code, the `HashMap` is `GemFireCacheImpl.rootRegions`. From the stack, we can also see

`org.apache.geode.internal.cache.CreateRegionProcessor$CreateRegionMessage.process(CreateRegionProcessor.java:362)`.

Thread 49 is trying to process a `CreateRegionMessage`, which is sent from the other server in order to create a region. Thread 49 is supposed to generate a `CreateRegionReplyMessage` and return it to the sender of `CreateRegionMessage`. This is part of the process of creating a replicated region in all the servers. As we keep reading the example log, we can see the `Lock owner thread` stack. The lock owner thread is recovering the persisted krf oplogs. Because the thread is executing

`org.apache.geode.internal.cache.Oplog.readKrf(Oplog.java:1762)`,

the thread is holding the lock on the `HashMap` `GemFireCacheImpl.rootRegions` at

`org.apache.geode.internal.cache.GemFireCacheImpl.createVMRegion(GemFireCacheImpl.java:2925)`

On one of the other servers, server2, we can see a warning in the log:

```
[info 2020/03/25 20:57:45.025 UTC <main> tid=0x1] Initializing region _monitoringRegion_10.128.0.32<v8>41000
[warn 2020/03/25 20:58:01.028 UTC <main> tid=0x1] 15 seconds have elapsed while waiting for replies: <CreateRegionProcessor$CreateRegionReplyProcessor 5 waiting for 3 replies from [10.128.0.31(server1:13379)<v7>:41000, 10.128.0.33(server3:14040)<v7>:41000, 10.128.0.34(server4:13170)<v7>:41000]> on 10.128.0.32(server2:13774)<v8>:41000 whose current membership list is: [[10.128.0.30(locator:10836:locator)<ec><v0>:41000, 10.128.0.31(server1:13379)<v7>:41000, 10.128.0.32(server2:13774)<v8>:41000, 10.128.0.33(server3:14040)<v7>:41000, 10.128.0.34(server4:13170)<v7>:41000]]
[info 2020/03/25 21:02:56.281 UTC <main> tid=0x1] CreateRegionProcessor$CreateRegionReplyProcessor wait for replies completed
[info 2020/03/25 21:02:56.283 UTC <main> tid=0x1] Initialization of region _monitoringRegion_10.128.0.32<v8>41000 completed
```

Note the timestamps on the log entries, from start to completion, region initialization takes more than 5 minutes, which is unusual. As indicated by the log, this is because `CreateRegionProcessor$CreateRegionReplyProcessor` is waiting for 3 replies from other servers. As we can see from the first example log from server1, Thread 49 on server1 is blocked, so it cannot send `CreateRegionReplyMessage` to server2. So on server2, `CreateRegionProcessor$CreateRegionReplyProcessor` is waiting for server1 to reply. This blocks the server initialization process during server restart, and eventually slows down the persistence recovery on server2.

With the help of the warning messages, and the thread stacks, we have identified that in the source code, the synchronization of `HashMap` has caused the persistence recovery to slow down significantly. The thread synchronization on server1 has affected not only server1 itself, but also the progress of server2. For log analysis details, please refer to [GEODE-7945](https://issues.apache.org/jira/browse/GEODE-7945) and its pull request.

Once we understand the root cause, the solution becomes clear. We’d better replace `HashMap` with `ConcurrentHashMap`, to remove unnecessary synchronization among the threads. With `ConcurrentHashMap`, the persistence recovery time is reduced by 30% for recovering the same amount of persistent data during Geode cluster restart.

## Parallel Disk Stores Recovery

After further analyzing the logs, we noticed that the disk stores are recovered sequentially with single thread. There is an opportunity to improve the recovery performance here. If the disk stores are recovered in parallel, the persistence recovery performance can be dramatically improved. When each region is on a different disk store, parallel disk store recovery makes parallel region recovery possible. This is especially effective when the disk stores are on different disk controllers, so that the disk stores don’t have to compete for the same disk controller. With the completion of [GEODE-8035](https://issues.apache.org/jira/browse/GEODE-8035), parallel disk store recovery is introduced. For example, when recovering two regions on two separate disk stores, we can reduce the persistent recovery time by half, compared to the case in which two regions share the same default disk store. With more disk stores, the performance of persistence recovery can be further improved from parallel disk store recovery.

## Performance Results

Replacing `HashMap` with `ConcurrentHashMap` for `GemFireCacheImpl.rootRegions` eliminates the unnecessary blocking of threads during the cluster restart persistence recovery process. Initial tests with and without partition region redundancy and varying numbers of region buckets (up to 2753 buckets) and Geode servers(up to 70 servers) with up to 2 billion entries have shown that the change can reduce the cluster restart time by up to 30%.

To speed up the recovery of multiple regions, it is recommended to have different disk stores for different regions, i.e. one-to-one mapping between region and disk store, so that every region has a dedicated disk store. Assigning the disk stores to separate disk controllers can further improve performance. We have tested this scenario on Google Cloud. With two partitioned regions sharing the same default disk store, it takes 13 minutes to recover 100 million entries on 4 servers. If each of the two regions has its own disk store, even though the two disk stores share the same SSD, the recovery time drops to 10 minutes, a 23% reduction in recovery time. For two regions with two disk stores on two different disk controllers, the recovery time drops to 7 minutes with parallel disk store recovery. This is a reduction in recovery time of almost 50% compared to the case where two regions share a single default disk store.

With the new feature, by default, the disk stores are recovered by multiple threads in parallel when the cluster restarts. This significantly improves the performance of disk store recovery.

For backward compatibility, we introduced a new boolean system property `parallelDiskStoreRecovery`. The default value is `true`. The disk stores recover in parallel by default. If the users prefer sequential disk store recovery, set `parallelDiskStoreRecovery` to `false` when restarting the cluster.

## Conclusion

Geode shared-nothing persistence architecture is powerful for fast parallel recovery of nodes or an entire cluster. With recent performance improvements, we further removed the unnecessary thread synchronization during persistence recovery. We have also introduced parallel disk store recovery within each Geode server. The improvement has made Geode parallel recovery even faster.