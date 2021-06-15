---
data-featured: false
date: 2021-01-19
description: This article describes how to use the ObjectGraphSizer to calculate the
  size of a GatewaySender queue.
lastmod: '2021-04-22'
team:
- Barry Oglesby
title: Calculating the Size of an Apache Geode GatewaySender Queue
type: blog
---

## Introduction
The in-memory size of an Apache Geode [GatewaySender](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/cache/wan/GatewaySender.java) queue can be used to determine the amount of queue memory to allocate for that GatewaySender. The [ObjectGraphSizer](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/size/ObjectGraphSizer.java) can be used to calculate the size of any object in bytes and also to create a histogram of the object being sized. It does this by recursively traversing each field of the object. An [ObjectFilter](https://github.com/apache/geode/blob/77ef0b71d8b98cdac5b6de35a68c20ccba22126e/geode-core/src/main/java/org/apache/geode/internal/size/ObjectGraphSizer.java#L242) can be used in conjunction with the ObjectGraphSizer to accept or reject each object as it is traversed. Its basic use is to reject objects that shouldn’t be included in the size.

This article describes how to use the ObjectGraphSizer to calculate the size of a GatewaySender queue.

Note: See the [GatewaySender Queue Implementation](data/tanzu-gemfire/blog/logging-apache-geode-gatewaysender-queue-events/#gatewaysender-queue-implementation) section of my **Logging Apache Geode GatewaySender Queue Events** blog for details on the architecture of GatewaySenders.

## Implementation
All source code described in this article as well as an example usage is available [here](https://github.com/boglesby/calculate-gateway-sender-queue-size).

The implementation consists of a [CalculateGatewaySenderQueueEntrySizesFunction](https://github.com/boglesby/calculate-gateway-sender-queue-size/blob/master/server/src/main/java/example/server/function/CalculateGatewaySenderQueueEntrySizesFunction.java), a number of [GatewaySenderQueueEntrySizers](https://github.com/boglesby/calculate-gateway-sender-queue-size/blob/master/server/src/main/java/example/server/function/GatewaySenderQueueEntrySizer.java) and a [GatewayQueueEventRegionEntryObjectFilter](https://github.com/boglesby/calculate-gateway-sender-queue-size/blob/master/server/src/main/java/example/server/function/GatewayQueueEventRegionEntryObjectFilter.java).

For each input GatewaySender id, the **CalculateGatewaySenderQueueEntrySizesFunction**:

- gets the GatewaySender for the input identifier
- creates the appropriate **GatewaySenderQueueEntrySizer** based on the type of GatewaySender
- invokes the **GatewaySenderQueueEntrySizer** *calculateEntrySizes* method

The supported types of GatewaySenderQueueEntrySizer are:

- [SerialGatewaySenderQueueEntrySizer](https://github.com/boglesby/calculate-gateway-sender-queue-size/blob/master/server/src/main/java/example/server/function/SerialGatewaySenderQueueEntrySizer.java) for serial GatewaySenders
- [ParallelGatewaySenderQueueEntrySizer](https://github.com/boglesby/calculate-gateway-sender-queue-size/blob/master/server/src/main/java/example/server/function/ParallelGatewaySenderQueueEntrySizer.java) for parallel GatewaySenders
- [ParallelGatewaySenderQueueByBucketEntrySizer](https://github.com/boglesby/calculate-gateway-sender-queue-size/blob/master/server/src/main/java/example/server/function/ParallelGatewaySenderQueueByBucketEntrySizer.java****) for parallel GatewaySenders whose entries are to be sized by bucket

The GatewayQueueEventRegionEntryObjectFilter is used by ObjectGraphSizer to include or exclude specific objects from the entry size.

### Serial GatewaySender
The SerialGatewaySenderQueueEntrySizer is used to size serial GatewaySender entries. It:

- gets and sorts the replicated Regions implementing the GatewaySender queue (one per dispatcher thread)
- streams each Region sorted by name and calculates the size of its entries sorted by key
- adds a summary of total sizes
- logs the results

#### Get Queue Regions
The *getRegions* method gets a sorted list of the serial GatewaySender’s Regions like:

```java
private List<Region> getRegions() {
  return ((InternalGatewaySender) this.sender).getQueues()
    .stream()
    .map(rq -> rq.getRegion())
    .sorted(Comparator.comparing(Region::getName))
    .collect(Collectors.toList());
}
```
#### Calculate Queue Region Sizes
The *addAndReturnSizes* method streams the queue Region’s entries, sorts them by long key, invokes addAndReturnSize for each and sums their sizes like:

```java
private long addAndReturnSizes(StringBuilder builder, Region region, boolean summaryOnly) {
  ...
  long totalBytes = ((Set<NonTXEntry>) region.entrySet())
    .stream()
    .map(entry -> entry.getRegionEntry())
    .sorted((entry1, entry2) -> Long.compare((long) entry1.getKey(), (long) entry2.getKey()))
    .mapToLong(entry -> addAndReturnSize(builder, entry, summaryOnly))
    .sum();
  ...
  return totalBytes;
}
```

The *addAndReturnSize* method calculates the size of an entry using the ObjectGraphSizer and **GatewayQueueEventRegionEntryObjectFilter** like:

```java
protected long addAndReturnSize(StringBuilder builder, RegionEntry regionEntry, boolean summaryOnly) {
  long numBytes = 0l;
  ObjectGraphSizer.ObjectFilter filter = new GatewayQueueEventRegionEntryObjectFilter(this.cache);
  try {
    numBytes = ObjectGraphSizer.size(regionEntry, filter, false);
    if (!summaryOnly) {
      addEntry(builder, regionEntry, numBytes);
    }
  } catch (Exception e) {
    this.cache.getLogger().warning("Caught exception attempting to dump the size of " + regionEntry + ":", e);
  }
  return numBytes;
}
```
#### Accept or Reject Objects
The *accept* method rejects objects with specific conditions like:

```java
public boolean accept(Object parent, Object object) {
  boolean accept = true;
  if (object instanceof RegionEntry && parent != null
    || object instanceof EnumListenerEvent
    || object instanceof PartitionedRegion
    || object instanceof TransactionId
    || object instanceof EventID
    || (object instanceof String && parent instanceof GatewaySenderEventImpl)) {
    accept = false;
  }
  ...
  return accept;
}
```
#### Example Output
The primary server’s log file will contain a message for the serial GatewaySender’s primary entries like:

```
[info 2021/01/02 09:18:15.760 HST <ServerConnection on port 58546 Thread 2> tid=0x7e] 
Serial GatewaySender nyserial contains the following 1000 primary entries and sizes grouped by dispatcher:

 Dispatcher nyserial.0 contains the following 200 entries:
  key=0; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=808
  key=1; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=624
  key=2; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=856
  key=3; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,224
  key=4; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=720
  ...
  
 Dispatcher nyserial.0 contains 171,608 total bytes

 Dispatcher nyserial.1 contains the following 200 entries:
  key=0; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=472
  key=1; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=504
  key=2; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=520
  key=3; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=792
  key=4; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,312
  ...

 Dispatcher nyserial.1 contains 180,528 total bytes

 Dispatcher nyserial.2 contains the following 200 entries:
  key=0; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,120
  key=1; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,264
  key=2; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,104
  key=3; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=792
  key=4; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=968
  ...

 Dispatcher nyserial.2 contains 177,848 total bytes

 Dispatcher nyserial.3 contains the following 200 entries:
  key=0; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,240
  key=1; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,048
  key=2; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,040
  key=3; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,016
  key=4; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,104
  ...

 Dispatcher nyserial.3 contains 170,504 total bytes

 Dispatcher nyserial.4 contains the following 200 entries:
  key=0; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,240
  key=1; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=728
  key=2; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=848
  key=3; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=912
  key=4; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=496
  ...

 Dispatcher nyserial.4 contains 178,424 total bytes

Serial GatewaySender nyserial contains 1000 primary entries entries consisting of 878,912 bytes
```
Any secondary server’s log file will contain a message for the serial GatewaySender’s secondary events like:

```
[info 2021/01/02 09:18:15.729 HST <ServerConnection on port 58457 Thread 2> tid=0x89] 
Serial GatewaySender nyserial contains the following 1000 secondary entries and sizes grouped by dispatcher:

 Dispatcher nyserial.0 contains the following 200 entries:
  key=0; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=840
  key=1; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=656
  key=2; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=888
  key=3; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=1,256
  key=4; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=752
  ...

 Dispatcher nyserial.0 contains 178,008 total bytes

 Dispatcher nyserial.1 contains the following 200 entries:
  key=0; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=504
  key=1; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=536
  key=2; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=552
  key=3; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=824
  key=4; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=1,344
  ...

 Dispatcher nyserial.1 contains 186,928 total bytes

 Dispatcher nyserial.2 contains the following 200 entries:
  key=0; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=1,152
  key=1; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=1,296
  key=2; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=1,136
  key=3; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=824
  key=4; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=1,000
  ...

 Dispatcher nyserial.2 contains 184,248 total bytes

 Dispatcher nyserial.3 contains the following 200 entries:
  key=0; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=1,272
  key=1; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=1,080
  key=2; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=1,072
  key=3; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=1,048
  key=4; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=1,136
  ...

 Dispatcher nyserial.3 contains 176,904 total bytes

 Dispatcher nyserial.4 contains the following 200 entries:
  key=0; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=1,272
  key=1; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=760
  key=2; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=880
  key=3; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=944
  key=4; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=VMCachedDeserializable; numBytes=528
  ...

 Dispatcher nyserial.4 contains 184,824 total bytes

Serial GatewaySender nyserial contains 1000 secondary entries entries consisting of 910,912 bytes
```
### Parallel GatewaySender
The **ParallelGatewaySenderQueueEntrySizer** is used to size parallel GatewaySender entries. It:

- gets the PartitionedRegion implementing the GatewaySender’s queue
- gets the PartitionedRegion’s local primary entries
- streams the primary entries sorted by key and calculates its size
- repeats the previous two steps for the local secondary entries
- adds a summary of total sizes
- logs the results

#### Get Queue Region
The PartitionedRegion implementing the parallel GatewaySender’s queue is retrieved using code like:

```java
PartitionedRegion region = (PartitionedRegion) this.cache.getRegion(sender.getId() + ParallelGatewaySenderQueue.QSTRING);
```
#### Get Primary Queue Entries
The set of local primary BucketRegions is retrieved from the PartitionedRegion using code like:

```java
Set<BucketRegion> brs = region.getDataStore().getAllLocalPrimaryBucketRegions();
```
The *getEntries* method gets a list of all the primary entries by streaming the set of BucketRegions and flat-mapping their entries like:

```java
private List<NonTXEntry> getEntries(Set<BucketRegion> brs) {
  return (List<NonTXEntry>) brs
    .stream()
    .flatMap(br -> br.entrySet().stream())
    .collect(Collectors.toList());
}
```
#### Get Secondary Queue Entries
There isn’t an existing method to get the set of local secondary BucketRegions like the getAllLocalPrimaryBucketRegions method for primary BucketRegions. The *getLocalSecondaryBucketRegions* method gets the set of local secondary BucketRegions like:

```java
protected Set<BucketRegion> getLocalSecondaryBucketRegions(PartitionedRegion region) {
  Set<BucketRegion> primaryBucketRegions = region.getDataStore().getAllLocalPrimaryBucketRegions();
  Set<BucketRegion> allBucketRegions = new HashSet<>(region.getDataStore().getAllLocalBucketRegions());
  allBucketRegions.removeAll(primaryBucketRegions);
  return allBucketRegions;
}
```
The *getEntries* method above gets a list of all the secondary entries.
#### Calculate Sizes of the Queue Entries
The *addAndReturnSizes* method streams the list of entries, sorts them by long key, invokes addAndReturnSize for each and sums their sizes like:

```java
private long addAndReturnSizes(StringBuilder builder, List<NonTXEntry> entries, boolean summaryOnly, boolean isPrimary) {
  ...
  long totalBytes = entries
    .stream()
    .map(entry -> entry.getRegionEntry())
    .sorted((entry1, entry2) -> Long.compare((long) entry1.getKey(), (long) entry2.getKey()))
    .mapToLong(entry -> addAndReturnSize(builder, entry, summaryOnly))
    .sum();
  ...
  return totalBytes;
}
```
The *addAndReturnSize* method in the serial case above is used to calculate size of an entry.
#### Example Output
Each server’s log file will contain a message for the parallel GatewaySender’s primary and secondary queues like:

```
[info 2021/01/02 09:19:47.956 HST <ServerConnection on port 58395 Thread 4> tid=0x8d] 
Parallel GatewaySender ny contains the following 331 primary entries and sizes:
  key=114; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,408
  key=117; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=792
  key=119; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=752
  key=120; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,072
  key=122; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=744
  ...

Parallel GatewaySender ny contains the following 335 secondary entries and sizes:
  key=118; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,248
  key=123; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=784
  key=126; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,408
  key=128; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,112
  key=133; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,000
  ...

Parallel GatewaySender ny contains:

 331 primary entries consisting of 293,384 bytes
 335 secondary entries consisting of 294,272 bytes
 666 total entries consisting of 587,656 bytes
```
### Parallel GatewaySender Grouped By Bucket
The **ParallelGatewaySenderQueueByBucketEntrySizer** is used to size parallel GatewaySender entries grouped by bucket. It:

- gets the PartitionedRegion implementing the GatewaySender’s queue
- gets the PartitionedRegion’s local primary BucketRegions
- streams the local primary BucketRegions sorted by id and calculates its size
- streams each BucketRegion’s entries sorted by long key and calculates its size
- repeats the previous three steps for the local secondary BucketRegions
- adds a summary of total sizes
- logs the results

#### Get Queue Region
The PartitionedRegion implementing the parallel GatewaySender’s queue is retrieved using code like above.

#### Get Primary BucketRegions
The set of local primary BucketRegions is retrieved from the PartitionedRegion using code like above.

#### Get Secondary BucketRegions
The set of local secondary BucketRegions is retrieved from the PartitionedRegion using the *getLocalSecondaryBucketRegions* method above.

#### Calculate Sizes of the BucketRegions
The *addAndReturnSizes* method streams the set of BucketRegions, sorts them by id, invokes *addAndReturnSizes* for each and sums their sizes like:

```java
private long addAndReturnSizes(StringBuilder builder, Set<BucketRegion> brs, int numEntries, boolean summaryOnly, boolean isPrimary) {
  ...
  return brs
    .stream()
    .sorted(Comparator.comparingInt(BucketRegion::getId))
    .mapToLong(br -> addAndReturnSizes(builder, br, summaryOnly))
    .sum();
}
```
#### Calculate Size of the Entries in a BucketRegion
The *addAndReturnSizes* method streams a BucketRegion’s entries, sorts them by long key, invokes *addAndReturnSize* for each and sums their sizes like:

```java
private long addAndReturnSizes(StringBuilder builder, BucketRegion br, boolean summaryOnly) {
  ...
  long totalBytes = ((Set<NonTXEntry>) br.entrySet())
    .stream()
    .map(entry -> entry.getRegionEntry())
    .sorted((entry1, entry2) -> Long.compare((long) entry1.getKey(), (long) entry2.getKey()))
    .mapToLong(entry -> addAndReturnSize(builder, entry, summaryOnly))
    .sum();
  ...
  return totalBytes;
}
```
The addAndReturnSize method in the serial case above is used to calculate size of an entry.
#### Example Output
Each server’s log file will contain a message for the parallel GatewaySender’s primary and secondary queues like:

```
[info 2021/01/02 09:21:08.501 HST <ServerConnection on port 58395 Thread 5> tid=0x8f] 
Parallel GatewaySender ny contains the following 38 primary buckets consisting of 331 total entries and sizes grouped by bucket:

 Bucket 1 contains the following 9 entries and sizes:
  key=114; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,408
  key=227; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,328
  key=340; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,000
  key=453; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=536
  key=566; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,128
  key=679; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=744
  key=792; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=432
  key=905; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,216
  key=1018; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=440

 Bucket 1 contains 8,232 total bytes

 Bucket 4 contains the following 10 entries and sizes:
  key=117; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=792
  key=230; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=672
  key=343; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=640
  key=456; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=912
  key=569; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,208
  key=682; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=872
  key=795; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,360
  key=908; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=696
  key=1021; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=704
  key=1134; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,336

 Bucket 4 contains 9,192 total bytes

 Bucket 6 contains the following 7 entries and sizes:
  key=119; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=752
  key=232; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,192
  key=345; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=800
  key=458; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,120
  key=571; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,272
  key=684; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=928
  key=797; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,280

 Bucket 6 contains 7,344 total bytes

 Bucket 7 contains the following 7 entries and sizes:
  key=120; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,072
  key=233; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=496
  key=346; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,272
  key=459; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=728
  key=572; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,096
  key=685; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=448
  key=798; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,152

 Bucket 7 contains 6,264 total bytes

 Bucket 9 contains the following 5 entries and sizes:
  key=122; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=744
  key=235; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=488
  key=348; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,216
  key=461; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=488
  key=574; entryClass=VMThinDiskLRURegionEntryHeapLongKey; valueClass=GatewaySenderEventImpl; numBytes=1,344

 Bucket 9 contains 4,280 total bytes

 ...

Parallel GatewaySender ny contains:

 331 primary entries consisting of 293,384 bytes
 335 secondary entries consisting of 294,272 bytes
 666 total entries consisting of 587,656 bytes
```
## Future
A GatewaySender API that uses the ObjectGraphSizer to calculate its size in bytes would be a very useful addition to Apache Geode.