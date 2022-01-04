---
date: 2020-06-24
description: This article describes how to use ObjectGraphSizer to calculate the size
  of a Region.
lastmod: '2021-04-22'
team:
- Barry Oglesby
title: Calculating the Size of an Apache Geode Region
type: blog
---

## Introduction

Calculating the size of an Apache Geode [Region](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/cache/Region.java) can be useful for capacity planning. While certain statistics like PartitionedRegionStats dataStoreBytesInUse are helpful in this regard, they are limited. For example, this statistic does not exist for replicated Regions. [ObjectGraphSizer](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/size/ObjectGraphSizer.java) can be used to calculate the size of any object in bytes and to create a histogram of the object being sized. It does this by recursively traversing each field of the object.

An [ObjectFilter](https://github.com/apache/geode/blob/210dc4fe9b1657d8d7cb5c197c6b0153389be3ea/geode-core/src/main/java/org/apache/geode/internal/size/ObjectGraphSizer.java#L242) can be used in conjunction with ObjectGraphSizer to accept or reject each object as it is traversed. Its basic use is to reject objects that shouldn’t be included in the size. Without the appropriate ObjectFilter, ObjectGraphSizer would traverse practically every object in the JVM while sizing a Region since it has a reference to its Cache and DistributedSystem.

This article describes how to use ObjectGraphSizer to calculate the size of a Region.

## Region Implementation

There are mainly two different kinds of Regions, namely replicated and partitioned. Each is implemented differently.

### Replicated Region

A replicated Region is implemented by a [DistributedRegion](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/DistributedRegion.java) which contains a map of RegionEntries. Each [RegionEntry](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/RegionEntry.java) contains the key and data value.

A simplified architecture is shown below:

![Class Diagram For Distributed Region](images/barry_06_24_diagram1.png#diagram)

## Partitioned Region

A partitioned Region is implemented by a [PartitionedRegion](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/PartitionedRegion.java) which contains a collection of BucketRegions. A [BucketRegion](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/BucketRegion.java) is an extension of DistributedRegion.

A simplified architecture is shown below:

![class diagram for PartitionedRegion](images/barry_06_24_diagram2.png#diagram)

## Implementation
All source code described in this article as well as an example usage is available [here](https://github.com/boglesby/calculate-region-size).

The implementation consists of a [CalculateRegionSizeFunction](https://github.com/boglesby/calculate-region-size/blob/master/server/src/main/java/example/server/function/CalculateRegionSizeFunction.java) and a [RegionObjectFilter](https://github.com/boglesby/calculate-region-size/blob/master/server/src/main/java/example/server/function/RegionObjectFilter.java).

For each input region name, the **CalculateRegionSizeFunction**:

* gets the Region
* invokes ObjectGraphSizer to calculate the size in bytes and create a histogram of the Region in that server
* writes the Region’s size and histogram in the server’s log
* returns the Region’s size and histogram in a [SingleMemberRegionSize](https://github.com/boglesby/calculate-region-size/blob/master/server/src/main/java/example/SingleMemberRegionSize.java)

The **RegionObjectFilter**:

* implements ObjectFilter and is used to determine whether to include or reject an object from the Region’s size

A **SingleMemberRegionSize** is created for each Region and returned to the client. It encapsulates:

* regionName
* size
* histogram

### Calculate Region Size

The **CalculateRegionSizeFunction** calculateSize method invokes ObjectGraphSizer to calculate the region size and create the histogram:

```java
private SingleMemberRegionSize calculateSize(Cache cache, Region region) {
 SingleMemberRegionSize size = null;
 ObjectGraphSizer.ObjectFilter filter = new RegionObjectFilter(cache);
 try {
  long regionSize = ObjectGraphSizer.size(region, filter, false);
  String regionHistogram = ObjectGraphSizer.histogram(region, filter, false);
  size = new SingleMemberRegionSize(region.getName(), regionSize, regionHistogram);
 } catch (Exception e) {
  cache.getLogger()
   .warning("Caught the following exception attempting to calculate the size of region=" + region.getFullPath(), e);
 }
 return size;
}
```

## Accept or Reject Objects from Region Size

The **RegionObjectFilter** accept method receives the object and its parent object and uses these to decide whether to accept or reject the object. In this case, it just uses the class of the object.

The **RegionObjectFilter** was tested with a few different region configurations, including PARTITION_REDUNDANT_PERSISTENT and REPLICATE_PERSISTENT Regions. Other configurations may introduce different object references that should also be excluded but are not. In that case, the sizer would not be completely accurate. Enabling logging can help debug this kind of issue.

The **RegionObjectFilter** accept method:

```java
public boolean accept(Object parent, Object object) {
 boolean accept = true;
 if (object instanceof Cache
  || object instanceof CachePerfStats
  || object instanceof Class
  || object instanceof ClusterDistributionManager
  || object instanceof DiskRegionStats
  || object instanceof DiskStore
  || object instanceof DistributedLockService
  || object instanceof DistributedMember
  || object instanceof DistributedSystem
  || object instanceof Logger
  || object instanceof HeapLRUStatistics
  || object instanceof OneTaskOnlyExecutor
  || object instanceof PartitionedRegionStats
  || object instanceof PersistentMemberManager
  || object instanceof ResourceManager
  || object instanceof ScheduledThreadPoolExecutor) {
  if (this.logAllClasses || this.logRejectedClasses) {
   logObject(parent, object, "Rejecting");
  }
  accept = false;
 } else {
  if (this.logAllClasses || this.logAcceptedClasses) {
   logObject(parent, object, "Accepting");
  }
 }
 return accept;
}
```

### Create Region Histogram
The ObjectGraphSizer histogram method is used to create the histogram of the Region. For each object included in the size, the histogram shows the class of that object, the number of those objects and the size in bytes of those objects.

In the current code, the histogram is logged only on the server, but the **SingleMemberRegionSize** instance returned to the client contains the histogram, so the code can be easily changed to log it on the client as well.

Each server’s log file will contain a message with the Region’s histogram like:

```
[info 2020/06/16 14:35:38.119 HST <ServerConnection on port 52917 Thread 16> tid=0xe1] Histogram for PartitionedTrade is:
clazz size count
...
class java.util.concurrent.atomic.AtomicLong 33624 1401
class org.apache.geode.internal.cache.BucketRegion 39600 75
class java.util.concurrent.locks.ReentrantReadWriteLock 42336 1764
class [Ljava.util.HashMap$Node; 42856 642
class java.util.concurrent.locks.ReentrantReadWriteLock$ReadLock 49760 3110
class java.util.concurrent.locks.ReentrantReadWriteLock$Sync$ThreadLocalHoldCounter 49760 3110
class java.util.concurrent.locks.ReentrantReadWriteLock$WriteLock 49760 3110
class [Lorg.apache.geode.internal.util.concurrent.CustomEntryConcurrentHashMap$HashEntry; 58440 1232
class org.apache.geode.internal.util.concurrent.CustomEntryConcurrentHashMap$Segment 68992 1232
class java.util.concurrent.ConcurrentHashMap 91136 1424
class java.util.HashMap 91728 1911
class [Ljava.util.concurrent.ConcurrentHashMap$Node; 100928 377
class [C 101288 1047
class org.apache.geode.internal.cache.PreferBytesCachedDeserializable 106400 6650
class java.util.concurrent.locks.ReentrantReadWriteLock$NonfairSync 145632 3034
class org.apache.geode.internal.cache.DiskId$PersistenceWithIntOffset 319200 6650
class org.apache.geode.internal.cache.entries.VersionedThinDiskRegionEntryHeapStringKey1 425600 6650
class [B 7344032 6701
```

### Logging Parent and Child Objects
The logging in the **RegionObjectFilter** accept method can be used to log every object being traversed along with its parent. Logging like this can be used to:
* help determine objects to reject from the size
* determine the path from the root to each object

Each log message contains:
* object toString
* object identity using System.identityHashCode
* object class name
* parent object toString
* parent object identity using System.identityHashCode
* parent object class name

Using the object and parent identities makes it easy to navigate from an object to the root.

Reduced logging for the path from the root Region to the RegionEntry in the partitioned case looks like:

```
[info 2020/06/17 05:56:50.838 HST <ServerConnection on port 62526 Thread 3> tid=0x5e] Accepting object=Partitioned Region @7cbe8a7a [path='/PartitionedTrade'; dataPolicy=PERSISTENT_PARTITION; ...] objectIdentity=2092862074; objectClass=org.apache.geode.internal.cache.PartitionedRegion; parent=null parentIdentity=0; parentClass=null
[info 2020/06/17 05:56:50.840 HST <ServerConnection on port 62526 Thread 3> tid=0x5e] Accepting object=CacheDistributionAdvisor for region /PartitionedTrade objectIdentity=1698241241; objectClass=org.apache.geode.internal.cache.partitioned.RegionAdvisor; parent=Partitioned Region @7cbe8a7a [path='/PartitionedTrade'; dataPolicy=PERSISTENT_PARTITION; ...] parentIdentity=2092862074; parentClass=org.apache.geode.internal.cache.PartitionedRegion
[info 2020/06/17 05:56:51.033 HST <ServerConnection on port 62526 Thread 3> tid=0x5e] Accepting object=org.apache.geode.internal.cache.ProxyBucketRegion@411197b2 objectIdentity=1091671986; objectClass=org.apache.geode.internal.cache.ProxyBucketRegion; parent=[ProxyBucketRegion;@1e291594 parentIdentity=506008980; parentClass=[ProxyBucketRegion;
[info 2020/06/17 05:56:51.185 HST <ServerConnection on port 62526 Thread 3> tid=0x5e] Accepting object=BucketRegion[path='/__PR/_B__PartitionedTrade_48;serial=124;primary=false] objectIdentity=1339192337; objectClass=org.apache.geode.internal.cache.BucketRegion; parent=org.apache.geode.internal.cache.ProxyBucketRegion@411197b2 parentIdentity=1091671986; parentClass=org.apache.geode.internal.cache.ProxyBucketRegion
[info 2020/06/17 05:56:51.760 HST <ServerConnection on port 62526 Thread 3> tid=0x5e] Accepting object=org.apache.geode.internal.cache.VMRegionMap@2641ec8f objectIdentity=641854607; objectClass=org.apache.geode.internal.cache.VMRegionMap; parent=BucketRegion[path='/__PR/_B__PartitionedTrade_48;serial=124;primary=false] parentIdentity=1339192337; parentClass=org.apache.geode.internal.cache.BucketRegion
[info 2020/06/17 05:56:52.536 HST <ServerConnection on port 62526 Thread 3> tid=0x5e] Accepting object={0=VersionedThinDiskRegionEntryHeapStringKey1@15fd1f1f (key=0; rawValue=PreferBytesCachedDeserializable@1819111325; version={v1; rv1; mbr=f1306b3bd360487b-8263dc885915f613; time=1592409319324};member=f1306b3bd360487b-8263dc885915f613)} objectIdentity=306255424; objectClass=org.apache.geode.internal.util.concurrent.CustomEntryConcurrentHashMap; parent=org.apache.geode.internal.cache.VMRegionMap@2641ec8f parentIdentity=641854607; parentClass=org.apache.geode.internal.cache.VMRegionMap
[info 2020/06/17 05:56:53.331 HST <ServerConnection on port 62526 Thread 3> tid=0x5e] Accepting object=VersionedThinDiskRegionEntryHeapStringKey1@15fd1f1f (key=0; rawValue=PreferBytesCachedDeserializable@1819111325; version={v1; rv1; mbr=f1306b3bd360487b-8263dc885915f613; time=1592409319324};member=f1306b3bd360487b-8263dc885915f613) objectIdentity=368910111; objectClass=org.apache.geode.internal.cache.entries.VersionedThinDiskRegionEntryHeapStringKey1; parent=[CustomEntryConcurrentHashMap$HashEntry;@7eb505fd parentIdentity=2125792765; parentClass=[CustomEntryConcurrentHashMap$HashEntry;
```

### Return Results

A collection of **SingleMemberRegionSize** instances are returned to the client from each member, one per sized Region.

They are currently logged on the client like:

```
Member sizes for regions [ReplicatedTrade, PartitionedTrade]:
member=xxx.xxx.x.xx(server-1:37320)<v1>:41001(version:UNKNOWN[ordinal=115])
        regionName=ReplicatedTrade; size=12,404,384 bytes
        regionName=PartitionedTrade; size=9,716,936 bytes
member=xxx.xxx.x.xx(server-2:37322)<v2>:41002(version:UNKNOWN[ordinal=115])
        regionName=ReplicatedTrade; size=12,404,256 bytes
        regionName=PartitionedTrade; size=9,832,064 bytes
member=xxx.xxx.x.xx(server-3:37323)<v3>:41003(version:UNKNOWN[ordinal=115])
        regionName=ReplicatedTrade; size=12,404,128 bytes
        regionName=PartitionedTrade; size=9,674,160 bytes
```

## Future
Region APIs that use ObjectGraphSizer like these would be very useful additions to Apache Geode:

* getSizeInBytes to calculate the Region’s size in bytes
* getHistogram to create a histogram

Also, including the parent object field name in the ObjectFilter accept method would be helpful in determining whether to include or reject the object from the size.