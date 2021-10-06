---
date: 2020-06-03
description: This is a how-to article that describes a way to log all the events in
  a GatewaySender queue.
lastmod: '2021-04-22'
team:
- Barry Oglesby
title: Logging Apache Geode GatewaySender Queue Events
type: blog
---

## Introduction
 Apache Geode provides a mechanism to asynchronously distribute batches of events between two disparate DistributedSystems called a [WAN topology](https://geode.apache.org/docs/guide/12/topologies_and_comm/multi_site_configuration/chapter_overview.html). The events are stored in queues in the local DistributedSystem before being batched and distributed. For troubleshooting purposes, it is sometimes necessary to see the events in the queue, but there is no OOTB way to do this.
 
 This is a how-to article that describes a way to log all the events in a GatewaySender queue.
 
 ## GatewaySender Queue Implementation
 There are two different kinds of GatewaySenders, namely serial and parallel. The queue for each is implemented differently.
 
 ### Serial GatewaySender Queue
 The serial GatewaySender queue is implemented by a collection of DistributedRegions, one per dispatcher thread.
 
 A simplified architecture is shown below:
![img](images/barry_06_03_diagram.png#diagram)

### Parallel GatewaySender Queue
The parallel GatewaySender queue is implemented by a single PartitionedRegion colocated with the data Region attached to it. Each dispatcher thread processes a subset of the PartitionedRegion buckets.

A simplified architecture is shown below:
![img](images/barry_06_03_diagram1.png#diagram)

### Queue Region Entries
The queue Region entries are keyed by continuously-increasing longs and valued by instances of [GatewaySenderEventImpl](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/wan/GatewaySenderEventImpl.java), each of which defines several fields including:
* region: the name of the Region on which the event occurs
* operation: the operation (e.g. Create)
* key: the modified key
* value: the modified value
* possible duplicate: whether the event may have been received in the remote DistributedSystem. It gets set to true after HA events (e.g. a server crashing).
* event id: the originator of the event and other order-preserving information

## Implementation
All source code described in this article as well as an example usage is available [here](https://github.com/boglesby/log-gateway-sender-queue).

For each input GatewaySender id, the **LogGatewaySenderQueueFunction**:
* gets the GatewaySender
* creates the appropriate **GatewaySenderQueueLogger** based on the type of GatewaySender
* invokes logQueue on the **GatewaySenderQueueLogger**

The GatewaySenderQueueLogger:
* gets the Region(s) implementing the GatewaySender queue
* for serial GatewaySenders, gets and logs all entries sorted by key and grouped by dispatcher thread
* for parallel GatewaySenders, gets and logs all primary and secondary entries either sorted by key or grouped by bucket

### Serial GatewaySender
**Get Queue Regions**
To get the serial GatewaySender’s Regions, stream its RegionQueues and for each get its Region like:

```java
private List<Region> getRegions() {
 return ((InternalGatewaySender) this.sender).getQueues()
  .stream()
  .map(rq -> rq.getRegion())
  .sorted(Comparator.comparing(Region::getName))
  .collect(Collectors.toList());
}
```

**Get Queue Region Contents**
To get the contents, stream the Regions and for each Region get its contents like:

```java
private String getContents(List<Region> regions, String header) {
 return regions
  .stream()
  .map(br -> getRegion(br))
  .collect(Collectors.joining("\n\n", header, ""));
}
private String getRegion(Region region) {
 return getContents(region, getHeader(region));
}
```

**Get Queue Entries**
Finally, to get each entry’s contents, stream the Region’s entries and for each entry, get its contents like below. One thing to note is that the getEntry method deserializes the data value. To avoid that, pass false as the argument to the getValueAsString method. That will show the value as a byte[].

```java
protected String getContents(Map<Long,GatewayQueueEvent> region, String header) {
 return region.entrySet()
  .stream()
  .sorted(Map.Entry.comparingByKey())
  .map(entry -> getEntry(entry))
  .collect(Collectors.joining("\n", header, ""));
}
protected String getEntry(Map.Entry<Long,GatewayQueueEvent> entry) {
 GatewaySenderEventImpl gsei = (GatewaySenderEventImpl) entry.getValue();
 return new StringBuilder()
  .append("\t\tqueueKey=").append(entry.getKey())
  .append("; region=").append(gsei.getRegionPath())
  .append("; operation=").append(gsei.getOperation())
  .append("; eventKey=").append(gsei.getKey())
  .append("; value=").append(gsei.getValueAsString(true))
  .append("; possibleDuplicate=").append(gsei.getPossibleDuplicate())
  .append("; eventId=").append(gsei.getEventId().expensiveToString())
  .toString();
}
```

**Example Output**
The primary server’s log file will contain a message like:

```
[info 2020/06/01 12:49:11.567 HST <ServerConnection on port 57136 Thread 4> tid=0x87] 
The queue for serial GatewaySender nyserial contains the following 1000 primary entries grouped by dispatcher:
Queue for dispatcher nyserial.0 contains the following 200 entries:
    queueKey=0; region=/Trade; operation=CREATE; eventKey=2; value=PDX[26084582,example.client.domain.Trade]{id=2}; possibleDuplicate=true; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030000|1;sequenceID=2]
    queueKey=1; region=/Trade; operation=CREATE; eventKey=7; value=PDX[26084582,example.client.domain.Trade]{id=7}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030000|1;sequenceID=7]
    ...
  Queue for dispatcher nyserial.1 contains the following 200 entries:
    queueKey=0; region=/Trade; operation=CREATE; eventKey=3; value=PDX[26084582,example.client.domain.Trade]{id=3}; possibleDuplicate=true; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030001|1;sequenceID=3]
    queueKey=1; region=/Trade; operation=CREATE; eventKey=8; value=PDX[26084582,example.client.domain.Trade]{id=8}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030001|1;sequenceID=8]
    ...
  Queue for dispatcher nyserial.2 contains the following 200 entries:
    queueKey=0; region=/Trade; operation=CREATE; eventKey=4; value=PDX[26084582,example.client.domain.Trade]{id=4}; possibleDuplicate=true; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030002|1;sequenceID=4]
    queueKey=1; region=/Trade; operation=CREATE; eventKey=9; value=PDX[26084582,example.client.domain.Trade]{id=9}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030002|1;sequenceID=9]
    ...
  Queue for dispatcher nyserial.3 contains the following 200 entries:
    queueKey=0; region=/Trade; operation=CREATE; eventKey=0; value=PDX[26084582,example.client.domain.Trade]{id=0}; possibleDuplicate=true; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030003|1;sequenceID=0]
    queueKey=1; region=/Trade; operation=CREATE; eventKey=5; value=PDX[26084582,example.client.domain.Trade]{id=5}; possibleDuplicate=true; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030003|1;sequenceID=5]
    ...
  Queue for dispatcher nyserial.4 contains the following 200 entries:
    queueKey=0; region=/Trade; operation=CREATE; eventKey=1; value=PDX[26084582,example.client.domain.Trade]{id=1}; possibleDuplicate=true; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030004|1;sequenceID=1]
    queueKey=1; region=/Trade; operation=CREATE; eventKey=6; value=PDX[26084582,example.client.domain.Trade]{id=6}; possibleDuplicate=true; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030004|1;sequenceID=6]
    ...
```

Any secondary server’s log file will contain a message like:

```
[info 2020/06/01 12:49:11.600 HST <ServerConnection on port 57163 Thread 4> tid=0x89] 
The queue for serial GatewaySender nyserial contains the following 1000 secondary entries grouped by dispatcher:
Queue for dispatcher nyserial.0 contains the following 200 entries:
    queueKey=0; region=/Trade; operation=CREATE; eventKey=2; value=PDX[26084582,example.client.domain.Trade]{id=2}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030000|1;sequenceID=2]
    queueKey=1; region=/Trade; operation=CREATE; eventKey=7; value=PDX[26084582,example.client.domain.Trade]{id=7}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030000|1;sequenceID=7]
    ...
  Queue for dispatcher nyserial.1 contains the following 200 entries:
    queueKey=0; region=/Trade; operation=CREATE; eventKey=3; value=PDX[26084582,example.client.domain.Trade]{id=3}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030001|1;sequenceID=3]
    queueKey=1; region=/Trade; operation=CREATE; eventKey=8; value=PDX[26084582,example.client.domain.Trade]{id=8}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030001|1;sequenceID=8]
    ...
  Queue for dispatcher nyserial.2 contains the following 200 entries:
    queueKey=0; region=/Trade; operation=CREATE; eventKey=4; value=PDX[26084582,example.client.domain.Trade]{id=4}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030002|1;sequenceID=4]
    queueKey=1; region=/Trade; operation=CREATE; eventKey=9; value=PDX[26084582,example.client.domain.Trade]{id=9}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030002|1;sequenceID=9]
    ...
  Queue for dispatcher nyserial.3 contains the following 200 entries:
    queueKey=0; region=/Trade; operation=CREATE; eventKey=0; value=PDX[26084582,example.client.domain.Trade]{id=0}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030003|1;sequenceID=0]
    queueKey=1; region=/Trade; operation=CREATE; eventKey=5; value=PDX[26084582,example.client.domain.Trade]{id=5}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030003|1;sequenceID=5]
    ...
  Queue for dispatcher nyserial.4 contains the following 200 entries:
    queueKey=0; region=/Trade; operation=CREATE; eventKey=1; value=PDX[26084582,example.client.domain.Trade]{id=1}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030004|1;sequenceID=1]
    queueKey=1; region=/Trade; operation=CREATE; eventKey=6; value=PDX[26084582,example.client.domain.Trade]{id=6}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1030004|1;sequenceID=6]
    ...
```

### Parallel GatewaySender
**Get Queue Region**
The parallel GatewaySender Region is retrieved directly from the Cache like:

```java
PartitionedRegion region = (PartitionedRegion) this.cache.getRegion(sender.getId() + ParallelGatewaySenderQueue.QSTRING);
```

**Get Primary and Secondary LocalDataSets**
To get the primary LocalDataSet, use the code like:

```java
Map<Long,GatewayQueueEvent> primaryData = PartitionRegionHelper.getLocalPrimaryData(region);
```

There isn’t an existing way to get the secondary LocalDataSet. To get it, use a method like:

```java
private Map<Long,GatewayQueueEvent> getLocalSecondaryData(PartitionedRegion region) {
 Set<Integer> primaryBucketIds = region.getDataStore().getAllLocalPrimaryBucketIds();
 Set<Integer> allBucketIds = new HashSet<>(region.getDataStore().getAllLocalBucketIds());
 allBucketIds.removeAll(primaryBucketIds);
 return new LocalDataSet(region, allBucketIds);
}
```

**Get Queue Entries**
Once the LocalDataSet has been retrieved, its entries can be gotten using the methods in the serial GatewaysSender case [here](https://medium.com/@boglesby_2508/logging-apache-geode-gatewaysender-queue-events-e7e19937a542#2112).

**Example Output**
Each server’s log file will contain messages for its primary and secondary queues like:

```
[info 2020/06/01 12:46:46.802 HST <ServerConnection on port 57163 Thread 2> tid=0x87] 
The queue for parallel GatewaySender ny contains the following 342 primary entries:
  queueKey=113; region=/Trade; operation=CREATE; eventKey=54; value=PDX[26084582,example.client.domain.Trade]{id=54}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x10000|1;sequenceID=54;bucketID=0]
  queueKey=117; region=/Trade; operation=CREATE; eventKey=58; value=PDX[26084582,example.client.domain.Trade]{id=58}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x10004|1;sequenceID=58;bucketID=4]
  ...
[info 2020/06/01 12:46:46.884 HST <ServerConnection on port 57163 Thread 2> tid=0x87] 
The queue for parallel GatewaySender ny contains the following 331 secondary entries:
  queueKey=116; region=/Trade; operation=CREATE; eventKey=57; value=PDX[26084582,example.client.domain.Trade]{id=57}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x10003|1;sequenceID=57;bucketID=3]
  queueKey=118; region=/Trade; operation=CREATE; eventKey=59; value=PDX[26084582,example.client.domain.Trade]{id=59}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x10005|1;sequenceID=59;bucketID=5]
  ...
```

**Get Primary and Secondary BucketRegions**
To get the local primary BucketRegions, use code like:

```java
Set<BucketRegion> primaryBucketRegions = region.getDataStore().getAllLocalPrimaryBucketRegions();
```
There isn’t an existing way to get the secondary BucketRegions. To get them, use a method like:

```java
private Set<BucketRegion> getAllLocalSecondaryBucketRegions(PartitionedRegion region) {
 Set<BucketRegion> primaryBucketRegions = region.getDataStore().getAllLocalPrimaryBucketRegions();
 Set<BucketRegion> allBucketRegions = new HashSet<>(region.getDataStore().getAllLocalBucketRegions());
 allBucketRegions.removeAll(primaryBucketRegions);
 return allBucketRegions;
}
```

**Get Queue Entries by Bucket**
To get the contents, stream the BucketRegions and for each BucketRegion get its contents like:

```java
private String getContents(Set<BucketRegion> bucketRegions, String header) {
 return bucketRegions
  .stream()
  .sorted(Comparator.comparingInt(BucketRegion::getId))
  .map(br -> getBucketRegion(br))
  .collect(Collectors.joining("\n\n", header, ""));
}
private String getBucketRegion(BucketRegion bucketRegion) {
 return getContents(bucketRegion, getHeader(bucketRegion));
}
```

Each BucketRegion’s entries can be gotten using the methods in the serial GatewaysSender case [here](https://medium.com/@boglesby_2508/logging-apache-geode-gatewaysender-queue-events-e7e19937a542#2112).

**Example Output**
Each server’s log file will contain messages for its primary and secondary queues like:

```
[info 2020/06/01 12:47:56.665 HST <ServerConnection on port 57163 Thread 3> tid=0x88] 
The queue for parallel GatewaySender ny contains the following 342 primary entries grouped by bucket:
Bucket 0 contains the following 9 entries:
    queueKey=113; region=/Trade; operation=CREATE; eventKey=54; value=PDX[26084582,example.client.domain.Trade]{id=54}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x10000|1;sequenceID=54;bucketID=0]
    queueKey=226; region=/Trade; operation=CREATE; eventKey=165; value=PDX[26084582,example.client.domain.Trade]{id=165}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x10000|1;sequenceID=165;bucketID=0]
    ...
  Bucket 4 contains the following 10 entries:
    queueKey=117; region=/Trade; operation=CREATE; eventKey=58; value=PDX[26084582,example.client.domain.Trade]{id=58}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x10004|1;sequenceID=58;bucketID=4]
    queueKey=230; region=/Trade; operation=CREATE; eventKey=169; value=PDX[26084582,example.client.domain.Trade]{id=169}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x10004|1;sequenceID=169;bucketID=4]
    ...
  Bucket 10 contains the following 6 entries:
    queueKey=123; region=/Trade; operation=CREATE; eventKey=93; value=PDX[26084582,example.client.domain.Trade]{id=93}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1000a|1;sequenceID=93;bucketID=10]
    queueKey=236; region=/Trade; operation=CREATE; eventKey=210; value=PDX[26084582,example.client.domain.Trade]{id=210}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1000a|1;sequenceID=210;bucketID=10]
    ...
  Bucket 13 contains the following 6 entries:
    queueKey=126; region=/Trade; operation=CREATE; eventKey=96; value=PDX[26084582,example.client.domain.Trade]{id=96}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1000d|1;sequenceID=96;bucketID=13]
    queueKey=239; region=/Trade; operation=CREATE; eventKey=213; value=PDX[26084582,example.client.domain.Trade]{id=213}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1000d|1;sequenceID=213;bucketID=13]
    ...
  ...
[info 2020/06/01 12:47:56.679 HST <ServerConnection on port 57163 Thread 3> tid=0x88] 
The queue for parallel GatewaySender ny contains the following 331 secondary entries grouped by bucket:
Bucket 3 contains the following 9 entries:
    queueKey=116; region=/Trade; operation=CREATE; eventKey=57; value=PDX[26084582,example.client.domain.Trade]{id=57}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x10003|1;sequenceID=57;bucketID=3]
    queueKey=229; region=/Trade; operation=CREATE; eventKey=168; value=PDX[26084582,example.client.domain.Trade]{id=168}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x10003|1;sequenceID=168;bucketID=3]
    ...
  Bucket 5 contains the following 9 entries:
    queueKey=118; region=/Trade; operation=CREATE; eventKey=59; value=PDX[26084582,example.client.domain.Trade]{id=59}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x10005|1;sequenceID=59;bucketID=5]
    queueKey=231; region=/Trade; operation=CREATE; eventKey=284; value=PDX[26084582,example.client.domain.Trade]{id=284}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x10005|1;sequenceID=284;bucketID=5]
    ...
  Bucket 8 contains the following 6 entries:
    queueKey=121; region=/Trade; operation=CREATE; eventKey=91; value=PDX[26084582,example.client.domain.Trade]{id=91}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x10008|1;sequenceID=91;bucketID=8]
    queueKey=234; region=/Trade; operation=CREATE; eventKey=287; value=PDX[26084582,example.client.domain.Trade]{id=287}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x10008|1;sequenceID=287;bucketID=8]
    ...
  Bucket 12 contains the following 6 entries:
    queueKey=125; region=/Trade; operation=CREATE; eventKey=95; value=PDX[26084582,example.client.domain.Trade]{id=95}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1000c|1;sequenceID=95;bucketID=12]
    queueKey=238; region=/Trade; operation=CREATE; eventKey=212; value=PDX[26084582,example.client.domain.Trade]{id=212}; possibleDuplicate=false; eventId=EventID[xxx.xxx.x.xx(client:loner):57269:e48f0f72:client;threadID=0x1000c|1;sequenceID=212;bucketID=12]
    ...
  ...
```

## Future
A function like this as part of a larger feature that also can clear a GatewaySender queue and remove individual events from it would be a very useful addition to Apache Geode.