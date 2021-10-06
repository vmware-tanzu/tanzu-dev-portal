---
data-featured: false
date: 2021-09-12
description: This article provides an example of a compact view of the primary and secondary bucket locations per server and redundancy zone.
lastmod: '2021-09-12'
team:
- Barry Oglesby
title: Logging Apache Geode PartitionedRegion Primary and Secondary Bucket Locations
type: blog
---

## Introduction
An Apache Geode [PartitionedRegion](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/PartitionedRegion.java) partitions its entries into buckets among all the servers where it is defined. Properties that affect the number and location of the buckets include [`total-num-buckets`](https://geode.apache.org/docs/guide/114/developing/partitioned_regions/configuring_bucket_for_pr.html) and [`redundant-copies`](https://geode.apache.org/docs/guide/114/developing/partitioned_regions/set_pr_redundancy.html). The `total-num-buckets` configures the number of buckets across all the members of the DistributedSystem. The `redundant-copies` configures the number of copies of each bucket. The primary bucket is hosted on one server, and if `redundant-copies` is greater than zero, the secondary buckets are hosted on other servers.

In addition, the [`redundancy-zone`](https://geode.apache.org/docs/guide/114/developing/partitioned_regions/set_redundancy_zones.html) property helps determine where buckets are located. If two redundancy zones are defined and `redundant-copies` is one (meaning 2 copies of each bucket), then the primary bucket will be in a member in one zone, and the secondary bucket will be in a member in the other zone.

This article is a companion to my [Logging Apache Geode PartitionedRegion Entry Details Per Bucket](data/tanzu-gemfire/blog/logging-partitionedregion-entry-details-per-bucket) article. It provides an example of a compact view of the primary and secondary bucket locations per server and redundancy zone.

## Implementation

All source code described in this article as well as an example usage is available [here](https://github.com/boglesby/log-redundancy-zone-buckets).

The [`GetBucketIdsFunction`](https://github.com/boglesby/log-redundancy-zone-buckets/blob/master/server/src/main/java/example/server/function/GetBucketIdsFunction.java) is executed on each server and:  

- Gets the PartitionedRegion for the input region name
- Gets the member’s redundancy zone
- Gets the configured number of buckets for the PartitionedRegion
- Gets the list of local bucket ids for the PartitionedRegion
- Gets the list of local primary bucket ids for the PartitionedRegion
- Creates and returns a [`ServerBucketIds`](https://github.com/boglesby/log-redundancy-zone-buckets/blob/master/server/src/main/java/example/domain/ServerBucketIds.java) object containing these values

The [`GetBucketIdsResultCollector`](https://github.com/boglesby/log-redundancy-zone-buckets/blob/master/client/src/main/java/example/client/function/GetBucketIdsResultCollector.java) created on the client combines each `ServerBucketIds` object into an [`AllBucketIds`](https://github.com/boglesby/log-redundancy-zone-buckets/blob/master/client/src/main/java/example/domain/AllBucketIds.java) object.

The `AllBucketIds` object contains:
- All bucket ids per server
- Primary bucket ids per server
- All bucket ids per redundancy zone
- Primary bucket ids per redundancy zone
- Total number of bucket ids
- Total number of primary bucket ids
- Missing bucket ids per redundancy zone
- Extra bucket ids per redundancy zone


### Execute the `GetBucketIdsFunction`
The `GetBucketIdsFunction` `execute` method first gets the PartitionedRegion. The PartitionedRegion provides the configured number of buckets. Its [`PartitionedRegionDataStore`](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/cache/PartitionedRegionDataStore.java) provides the local bucket ids and the local primary bucket ids. The redundancy zone is retrieved from the [`DistributionConfig`](https://github.com/apache/geode/blob/723429f291f48f309acc3407f1405339ddbcfc20/geode-core/src/main/java/org/apache/geode/distributed/internal/DistributionConfig.java#L2793). Finally, the Function creates and returns the `ServerBucketIds` object.

```java
public void execute(FunctionContext<Object[]> context) {
  // Get the region name
  Object[] arguments = context.getArguments();
  String regionName = (String) arguments[0];
  context.getCache().getLogger().info("GetBucketIdsFunction getting bucket ids for regionName=" + regionName);

  // Get the region
  PartitionedRegion region = (PartitionedRegion) context.getCache().getRegion(regionName);

  // Create the data structure
  String redundancyZone = ((InternalDistributedSystem) context.getCache().getDistributedSystem()).getConfig().getRedundancyZone();
  int configuredNumberOfBuckets = region.getTotalNumberOfBuckets();
  List<Integer> allBucketIds = new ArrayList<>(region.getDataStore().getAllLocalBucketIds());
  List<Integer> primaryBucketIds = new ArrayList<>(region.getDataStore().getAllLocalPrimaryBucketIds());
  ServerBucketIds ids = new ServerBucketIds(regionName, redundancyZone, configuredNumberOfBuckets, allBucketIds, primaryBucketIds);

  // Return result
  context.getResultSender().lastResult(ids);
}
```

### Process the `ServerBucketIds` Result
The `GetBucketIdsResultCollector` `addResult` method is called on the client when the `ServerBucketIds` result from each server is received. The method calls `AllBucketIds` process to process the `ServerBucketIds` object like:

```java
public void addResult(DistributedMember server, ServerBucketIds serverBucketIds) {
  this.allBucketIds.process(server.getName(), serverBucketIds);
}
```

The `AllBucketIds` process method sets the region name, configured number of buckets and the redundancy zones per server. In addition, it updates the bucket ids per server and redundancy zone.
```java
public void process(String server, ServerBucketIds serverBucketIds) {
  this.regionName = serverBucketIds.getRegionName();
  this.configuredNumberOfBuckets = serverBucketIds.getConfiguredNumberOfBuckets();
  this.redundancyZonesPerServer.put(server, serverBucketIds.getRedundancyZone());
  updateBucketsPerServer(server, serverBucketIds);
  updateBucketsPerRedundancyZone(serverBucketIds);
}
```
The `AllBucketIds` `updateBucketsPerServer` method:
- Sorts each server’s bucket ids and primary bucket ids
- Updates all bucket ids per server and primary bucket ids per server
- Increments the total number of bucket and primary ids

```java
private void updateBucketsPerServer(String server, ServerBucketIds serverBucketIds) {
  // Sort and add all bucket ids
  Collections.sort(serverBucketIds.getAllBucketIds());
  this.allBucketIdsPerServer.put(server, serverBucketIds.getAllBucketIds());
  this.totalNumberOfBucketIds += serverBucketIds.getTotalNumberOfBucketIds();

  // Sort and add primary bucket ids
  Collections.sort(serverBucketIds.getPrimaryBucketIds());
  this.primaryBucketIdsPerServer.put(server, serverBucketIds.getPrimaryBucketIds());
  this.totalNumberOfPrimaryBucketIds += serverBucketIds.getTotalNumberOfPrimaryBucketIds();
}
```

The `AllBucketIds` `updateBucketsPerRedundancyZone` method:
- Gets the server’s redundancy zone
- Adds the server’s bucket ids to the redundancy zone bucket ids
- Adds the server’s primary bucket ids to the redundancy zone primary bucket ids
- Sorts the redundancy zone bucket ids and primary bucket ids

```java
private void updateBucketsPerRedundancyZone(ServerBucketIds serverBucketIds) {
  // Sort and add all bucket ids
  String redundancyZone = serverBucketIds.getRedundancyZone();
  List<Integer> redundancyZoneAllBucketIds = this.allBucketIdsPerRedundancyZone.computeIfAbsent(redundancyZone, k -> new ArrayList<>());
  redundancyZoneAllBucketIds.addAll(serverBucketIds.getAllBucketIds());
  Collections.sort(redundancyZoneAllBucketIds);

  // Sort and add primary bucket ids
  List<Integer> redundancyZonePrimaryBucketIds = this.primaryBucketIdsPerRedundancyZone.computeIfAbsent(redundancyZone, k -> new ArrayList<>());
  redundancyZonePrimaryBucketIds.addAll(serverBucketIds.getPrimaryBucketIds());
  Collections.sort(redundancyZonePrimaryBucketIds);
}
```

### Display the Results
The `AllBucketIds` `getDisplayString` method builds the message containing the primary and secondary bucket locations per server and redundancy zone like:

```java
public String getDisplayString() {
  StringBuilder builder = new StringBuilder();
  builder
   .append("Region: ")
   .append(this.regionName)
   .append("\nConfigured Number of Buckets: ")
   .append(this.configuredNumberOfBuckets);

  // Add all bucket ids per server
  addAllServerBucketIds(builder);

  // Add primary bucket ids per server
  addPrimaryServerBucketIds(builder);

  // Add all bucket ids per redundancy zone
  addAllRedundancyZoneBucketIds(builder);

  // Add primary bucket ids per redundancy zone
  addPrimaryRedundancyZoneBucketIds(builder);

  // Add missing bucket ids in each redundancy zone
  addMissingBucketsInRedundancyZone(builder);

  // Add extra bucket ids in each redundancy zone
  addExtraBucketsInRedundancyZone(builder);

  return builder.toString();
}
```

## Client Logging Output

Executing the `GetBucketIdsFunction` will cause the client to log a message like this showing the primary and secondary bucket locations per server and redundancy zone:

```text
Region: Customer
Configured Number of Buckets: 113
The 6 servers contain the following 226 bucket ids:
         Server server-1-a in zone zoneA contains 38 bucket ids: [1, 3, 9, 10, 18, 19, 22, 23, 29, 32, 34, 35, 37, 40, 43, 50, 51, 55, 61, 63, 68, 72, 73, 76, 79, 81, 85, 88, 89, 91, 93, 96, 99, 103, 106, 108, 109, 112]
         Server server-1-b in zone zoneB contains 38 bucket ids: [1, 4, 6, 10, 12, 14, 16, 17, 19, 24, 31, 33, 34, 39, 43, 45, 47, 49, 53, 58, 62, 66, 67, 68, 71, 72, 75, 81, 82, 83, 92, 95, 96, 98, 99, 100, 105, 111]
         Server server-2-a in zone zoneA contains 38 bucket ids: [0, 5, 6, 7, 8, 12, 14, 17, 20, 25, 30, 31, 36, 41, 42, 45, 47, 49, 52, 53, 59, 62, 64, 66, 69, 71, 74, 77, 82, 83, 86, 87, 90, 94, 98, 101, 102, 107]
         Server server-3-a in zone zoneA contains 37 bucket ids: [2, 4, 11, 13, 15, 16, 21, 24, 26, 27, 28, 33, 38, 39, 44, 46, 48, 54, 56, 57, 58, 60, 65, 67, 70, 75, 78, 80, 84, 92, 95, 97, 100, 104, 105, 110, 111]
         Server server-2-b in zone zoneB contains 37 bucket ids: [2, 5, 9, 11, 20, 22, 23, 26, 27, 30, 35, 37, 40, 41, 44, 48, 51, 52, 54, 60, 61, 65, 73, 74, 78, 84, 86, 87, 88, 89, 90, 93, 94, 101, 103, 107, 112]
         Server server-3-b in zone zoneB contains 38 bucket ids: [0, 3, 7, 8, 13, 15, 18, 21, 25, 28, 29, 32, 36, 38, 42, 46, 50, 55, 56, 57, 59, 63, 64, 69, 70, 76, 77, 79, 80, 85, 91, 97, 102, 104, 106, 108, 109, 110]
The 6 servers contain the following 113 primary bucket ids:
         Server server-1-a in zone zoneA contains 18 primary bucket ids: [1, 3, 10, 18, 22, 35, 37, 40, 51, 55, 61, 63, 68, 73, 81, 93, 103, 109]
         Server server-1-b in zone zoneB contains 19 primary bucket ids: [4, 6, 12, 19, 24, 34, 43, 49, 62, 67, 72, 75, 82, 83, 92, 96, 99, 100, 111]
         Server server-2-a in zone zoneA contains 19 primary bucket ids: [0, 5, 8, 14, 17, 20, 31, 36, 42, 45, 47, 53, 66, 71, 77, 87, 90, 98, 102]
         Server server-3-a in zone zoneA contains 19 primary bucket ids: [2, 13, 16, 21, 26, 28, 33, 39, 46, 48, 56, 58, 65, 70, 80, 84, 95, 97, 105]
         Server server-2-b in zone zoneB contains 19 primary bucket ids: [9, 11, 23, 27, 30, 41, 44, 52, 54, 60, 74, 78, 86, 88, 89, 94, 101, 107, 112]
         Server server-3-b in zone zoneB contains 19 primary bucket ids: [7, 15, 25, 29, 32, 38, 50, 57, 59, 64, 69, 76, 79, 85, 91, 104, 106, 108, 110]
The 2 redundancy zones contain the following bucket ids:
        Zone zoneB contains 113 bucket ids: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]
        Zone zoneA contains 113 bucket ids: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]
The 2 redundancy zones contain the following primary bucket ids:
        Zone zoneB contains 57 primary bucket ids: [4, 6, 7, 9, 11, 12, 15, 19, 23, 24, 25, 27, 29, 30, 32, 34, 38, 41, 43, 44, 49, 50, 52, 54, 57, 59, 60, 62, 64, 67, 69, 72, 74, 75, 76, 78, 79, 82, 83, 85, 86, 88, 89, 91, 92, 94, 96, 99, 100, 101, 104, 106, 107, 108, 110, 111, 112]
        Zone zoneA contains 56 primary bucket ids: [0, 1, 2, 3, 5, 8, 10, 13, 14, 16, 17, 18, 20, 21, 22, 26, 28, 31, 33, 35, 36, 37, 39, 40, 42, 45, 46, 47, 48, 51, 53, 55, 56, 58, 61, 63, 65, 66, 68, 70, 71, 73, 77, 80, 81, 84, 87, 90, 93, 95, 97, 98, 102, 103, 105, 109]
The 2 redundancy zones contain the following missing bucket ids:
        Zone zoneB has 0 missing bucket ids: []
        Zone zoneA has 0 missing bucket ids: []
The 2 redundancy zones contain the following extra bucket ids:
        Zone zoneB has 0 extra bucket ids: []
        Zone zoneA has 0 extra bucket ids: []
```

## Future
A [gfsh](https://geode.apache.org/docs/guide/114/tools_modules/gfsh/chapter_overview.html) command and Function that provides PartitionedRegion primary and secondary bucket locations per server and redundancy zone like this example would be a useful addition to Apache Geode.



