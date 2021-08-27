---
date: 2021-08-09
description: This article describes how to display historical and current statistics for Apache Geode.
lastmod: '2021-08-09'
team:
- Barry Oglesby
title: Displaying Current and Historical Apache Geode Statistics
type: blog
---

## Introduction
Apache Geode produces a variety of statistics in each member of the DistributedSystem. See my article [here](/data/tanzu-gemfire/blog/most-useful-statistics) for the most useful ones.

There are several ways to display these statistics. The main way to display historical statistics (contained in a gfs archive file) is to use the [Visual Statistics Display](https://gemtalksystems.com/products/vsd/) (vsd) tool. See the documentation [here](https://gemfire.docs.pivotal.io/910/gemfire/tools_modules/vsd/chapter_overview.html) for additional details on vsd.

The main way to display current statistics (from the members in a running DistributedSystem) is to access the JMX MBeans, although not all statistics are available via JMX. See the documentation [here](https://gemfire.docs.pivotal.io/910/geode/managing/management/mbean_architecture.html) for additional details on JMX. Any JMX tool (e.g. JConsole or VisualVM) can be used to access the MBeans.

Other ways to display both current and historical statistics include:
- The [`SystemAdmin`](https://github.com/apache/geode/blob/develop/geode-core/src/main/java/org/apache/geode/internal/SystemAdmin.java) class for historical statistics
- A custom Function for current statistics

This article describes both of these ways to display the statistics.


## SystemAdmin Class
The `SystemAdmin` class can be used to show historical statistics from a `gfs` archive file.

The scripts described in this article are available [here](https://github.com/boglesby/display-statistics/tree/master/bin).

### The systemadmin.sh Script
The `SystemAdmin` class can be invoked using the [`systemadmin.sh`](https://github.com/boglesby/display-statistics/blob/master/bin/systemadmin.sh) script.

```
java -classpath $GEODE/lib/geode-dependencies.jar org.apache.geode.internal.SystemAdmin $1 "$2" $3
```

Several examples of using the *`systemadmin.sh`* script to display specific statistics are shown below.

To display the Old Gen heap memory statistics, execute the *`systemadmin.sh`* script like:
```
./systemadmin.sh stats "CMS Old Gen-Heap memory:VMMemoryPoolStats" -archive=statistics.gfs

CMS Old Gen-Heap memory, 88564, VMMemoryPoolStats: "2021/05/14 16:14:05.539 BST" samples=14161
  currentInitMemory bytes: samples=14161 min=263066746880 max=263066746880 average=263066746880 stddev=0 last=263066746880
  currentMaxMemory bytes: samples=14161 min=263066746880 max=263066746880 average=263066746880 stddev=0 last=263066746880
  currentUsedMemory bytes: samples=14161 min=123510506056 max=231922758152 average=222792276714.19 stddev=23211544176.04 last=231712971624
  currentCommittedMemory bytes: samples=14161 min=263066746880 max=263066746880 average=263066746880 stddev=0 last=263066746880
  collectionUsedMemory bytes: samples=14161 min=123510506056 max=231834174104 average=220675613269.88 stddev=29138569249.97 last=231718281520
  collectionUsageThreshold bytes: samples=14161 min=1 max=1 average=1 stddev=0 last=1
  collectionUsageExceeded exceptions/sec: samples=14160 min=0 max=1 average=0.01 stddev=0.08 last=0
  usageThreshold bytes: samples=14161 min=0 max=0 average=0 stddev=0 last=0
  usageExceeded exceptions/sec: samples=14160 min=0 max=0 average=0 stddev=0 last=0
```

To display the garbage collection statistics, execute the *`systemadmin.sh`* script like:

```
./systemadmin.sh stats :VMGCStats -archive=statistics.gfs

ConcurrentMarkSweep, 88564, VMGCStats: "2021/05/09 00:16:08.677 BST" samples=488895
  collections operations/sec: samples=488894 min=0 max=1 average=0.01 stddev=0.09 last=0
  collectionTime milliseconds/sec: samples=488894 min=0 max=615.28 average=2.26 stddev=21.29 last=0

ParNew, 88564, VMGCStats: "2021/05/09 00:16:08.677 BST" samples=488895
  collections operations/sec: samples=488894 min=-1 max=2 average=0.05 stddev=0.23 last=0
  collectionTime milliseconds/sec: samples=488894 min=0 max=1421 average=3.01 stddev=22.94 last=0
```

To display all the distribution statistics, execute the *`systemadmin.sh`* script like:
```
./systemadmin.sh stats :DistributionStats -archive=statistics.gfs

distributionStats, 88564, DistributionStats: "2021/05/09 00:16:08.677 BST" samples=488895
  sentMessages messages/sec: samples=488894 min=-1 max=2064 average=57.92 stddev=110.7 last=0.16
  commitMessages messages/sec: samples=488894 min=-1 max=970 average=22.12 stddev=74.5 last=0.08
  commitWaits messages/sec: samples=488894 min=0 max=958 average=0.12 stddev=8.92 last=0
  sentMessagesTime nanoseconds/sec: samples=488894 min=0 max=0 average=0 stddev=0 last=0
  sentMessagesMaxTime milliseconds: samples=488895 min=0 max=0 average=0 stddev=0 last=0
  broadcastMessages messages/sec: samples=488894 min=0 max=0 average=0 stddev=0 last=0
  broadcastMessagesTime nanoseconds/sec: samples=488894 min=0 max=0 average=0 stddev=0 last=0
  ...
```

To display a specific distribution statistic like `replyWaitsInProgress`, execute the *`systemadmin.sh`* script like:
```
./systemadmin.sh stats :DistributionStats.replyWaitsInProgress -archive=statistics.gfs

distributionStats, 88564, DistributionStats: "2021/05/09 00:16:08.677 BST" samples=488895
  replyWaitsInProgress operations: samples=488895 min=0 max=16 average=0.06 stddev=0.38 last=2
```
To display all the operating system statistics, execute the *`systemadmin.sh`* script like:
```
./systemadmin.sh stats :LinuxSystemStats -archive=statistics.gfs

server1, 88564, LinuxSystemStats: "2021/05/09 00:16:08.677 BST" samples=488895
  allocatedSwap megabytes: samples=488895 min=2047 max=2047 average=2047 stddev=0 last=2047
  bufferMemory megabytes: samples=488895 min=2 max=315 average=44.02 stddev=49.95 last=23
  sharedMemory megabytes: samples=488895 min=0 max=0 average=0 stddev=0 last=0
  cpuActive %: samples=488895 min=1 max=100 average=20.8 stddev=9.8 last=7
  cpuIdle %: samples=488895 min=0 max=99 average=79.2 stddev=9.8 last=93
  cpuNice %: samples=488895 min=0 max=1 average=0 stddev=0 last=0
  cpuSystem %: samples=488895 min=0 max=81 average=0.15 stddev=1.36 last=0
  cpuUser %: samples=488895 min=0 max=95 average=19.34 stddev=9.63 last=6
  ...
```
To display a specific operating system statistic like `freeMemory`, execute the *`systemadmin.sh`* script like:
```
./systemadmin.sh stats :LinuxSystemStats.freeMemory -archive=statistics.gfs

server1, 88564, LinuxSystemStats: "2021/05/14 16:14:05.539 BST" samples=14161
  freeMemory megabytes: samples=14161 min=538 max=8968 average=3189.96 stddev=3667.73 last=8528
```

### The displaystatistics.sh Script
All of the most useful statistics described in my article [here](/data/tanzu-gemfire/blog/most-useful-statistics) can be displayed using the [*`displaystatistics.sh`*](https://github.com/boglesby/display-statistics/blob/master/bin/displaystatistics.sh) script. Several of the functions from that script are shown below.

The `get_stat` function retrieves a statistic from the archive file.

```shell
function get_stat {
  local stat_line=`./systemadmin.sh stats $2 -archive=$1`
  echo "$stat_line"
}
```
The `log_stat` function shows the minimum, maximum and last values for a single statistic.
```shell
function log_stat {
  RESULT=`get_stat $1 $2`
  STAT=`echo $RESULT | awk '{print $14}'`
  UNIT=`echo $RESULT | awk '{print $15}'`
  MIN=`echo $RESULT | awk '{print $17}'`
  MAX=`echo $RESULT | awk '{print $18}'`
  LAST=`echo $RESULT | awk '{print $21}'`
  echo $STAT $UNIT $MIN $MAX $LAST
}
```

The `log_stats` function shows the minimum, maximum and last values for multiple statistics.
```shell
function log_stats {
  RESULT=`get_stat $1 $2`
  for i in $RESULT;
  do
    INFO_INDEX=`echo $i | awk '{print index($1, "info")}'`
    if [ "$INFO_INDEX" -eq 0 ]; then
      STAT_INDEX=`echo $i $2 | awk '{print index($1, "$2")}'`
      if [ "$STAT_INDEX" -eq 0 ]; then
        STAT_NAME=`echo $i | awk '{print $1}'`
        if [[ "$STAT_NAME" =~ $3 ]]; then
          UNIT=`echo $i | awk '{print $2}'`
          MIN=`echo $i | awk '{print $4}'`
          MAX=`echo $i | awk '{print $5}'`
          LAST=`echo $i | awk '{print $8}'`
          echo -e '\t'$STAT_NAME $UNIT $MIN $MAX $LAST
        fi
      fi
    else
      TYPE=`echo $2 | awk -F: '{print $1}'`
      echo $TYPE
    fi
  done
}
```
An example of using the `displaystatistics.sh` script is shown below.

```
./displaystatistics.sh statistics.gfs

-------
VMStats
-------
fdLimit fds: max=524288
fdsOpen fds: min=418 max=2888 last=1583
processCpuTime nanoseconds/sec: min=0 max=11751004016.06 last=1003550185.29
threads threads: min=43 max=2528 last=1183

-----------------
VMMemoryPoolStats
-----------------
CMS Old Gen-Heap memory
  currentMaxMemory bytes: min=263066746880 max=263066746880 last=263066746880
  currentUsedMemory bytes: min=0 max=262917264456 last=192262082880

---------
VMGCStats
---------
ConcurrentMarkSweep
  collections operations/sec: min=0 max=1 last=0
  collectionTime milliseconds/sec: min=0 max=615.28 last=0

ParNew
  collections operations/sec: min=-1 max=2 last=0
  collectionTime milliseconds/sec: min=0 max=1421 last=0

-----------
StatSampler
-----------
delayDuration milliseconds: min=0 max=5926 last=992
jvmPauses jvmPauses/sec: min=0 max=0.17 last=0.02

--------------------
ResourceManagerStats
--------------------
heapCriticalEvents events: min=0 max=2 last=2
evictionStartEvents events: min=0 max=2 last=2

----------------
LinuxSystemStats
----------------
cachedMemory megabytes: min=169276 max=201563 last=197102
freeMemory megabytes: min=536 max=32922 last=4470
physicalMemory megabytes: max=484558
cpus items: min=16 max=16 last=16
cpuActive %: min=1 max=100 last=7
loadAverage1 threads: min=0.44 max=25.79 last=1.66
loadAverage5 threads: min=0.41 max=11.16 last=2.51
loadAverage15 threads: min=1.04 max=6.02 last=2.64
recvBytes bytes/sec: min=0 max=157383286 last=79554.84
recvDrops packets/sec: min=0 max=0 last=0
xmitBytes bytes/sec: min=0 max=283933613 last=48239.58
xmitDrops packets/sec: min=0 max=0 last=0

-----------------
DistributionStats
-----------------
nodes nodes: min=2 max=3 last=3
functionExecutionThreads threads: min=1 max=48 last=11
functionExecutionQueueSize messages: min=0 max=0 last=0
highPriorityThreads threads: min=2 max=9 last=4
highPriorityQueueSize messages: min=0 max=0 last=0
partitionedRegionThreads threads: min=1 max=1 last=1
partitionedRegionQueueSize messages: min=0 max=0 last=0
processingThreads threads: min=1 max=373 last=3
overflowQueueSize messages: min=0 max=0 last=0
replyTimeouts timeouts/sec: min=0 max=0 last=0
replyWaitsInProgress operations: min=0 max=16 last=2
receiversTO threads: min=1 max=60 last=16
sendersTO sockets: min=0 max=209 last=18
senderTimeouts expirations/sec: min=-1 max=83 last=0.02
suspectsReceived messages/sec: min=0 max=0.02 last=0.02
suspectsSent messages/sec: min=0 max=0 last=0

----------------
CacheServerStats
----------------
currentClients clients: min=0 max=114 last=100
currentClientConnections sockets: min=0 max=1919 last=660
closeConnectionRequests operations/sec: min=-1 max=202 last=0.03
connectionsTimedOut connections/sec: min=0 max=50 last=0.12
threadQueueSize connections: min=0 max=0 last=0

--------------
CachePerfStats
--------------
cacheListenerCallsInProgress operations: min=0 max=0 last=0
cacheWriterCallsInProgress operations: min=0 max=0 last=0
loadsInProgress operations: min=0 max=0 last=0
```

## Custom Function
The current value of any statistic in a running DistributedSystem member is available via Java API. A custom Function can be written that logs or retrieves the current value of any statistic.

All source code described in this article as well as an example usage is available [here](https://github.com/boglesby/display-statistics).

### GetStatisticValueFunction
The [*`GetStatisticValueFunction`*](https://github.com/boglesby/display-statistics/blob/master/server/src/main/java/example/server/function/GetStatisticValueFunction.java) gets the value for a specific statistic.

It can be easily modified to return all the statistics values:
- For a member
- For a specific category (e.g. DistributionStats) in a member
- For a specific category and instance (e.g. VMMemoryPoolStats — CMS Old Gen heap memory) in a member

The `getStatisticValue` method:
- Gets all the statistics for the input `typeName` (e.g. PartitionedRegionStats)
- Filters those for the input `textId` (e.g. /Trade)
- Returns the value for the first occurrence of the input statistic (e.g dataStoreEntryCount) or -1 if none

Its parameters are:

- `statisticsFactory` — the `InternalDistributedSystem` instance
- `typeName` — the statistic category
- `textId` — the statistic instance
- `statistic` — the desired statistic

```java
private Number getStatisticValue(StatisticsFactory statisticsFactory, String typeName,
  String textId, String statistic) {
  // Get the statistics for the type
  StatisticsType type = statisticsFactory.findType(typeName);
  Statistics[] statisticsByType = statisticsFactory.findStatisticsByType(type);
  
  // Filter the statistics by the textId (instance)
  // and get the first occurrence of the statistic in that instance
  return Arrays.stream(statisticsByType)
    .filter(statistics -> statistics.getTextId().equals(textId))
    .map(statistics -> statistics.get(statistic))
    .findFirst()
    .orElse(-1);
}
```
To log the value of the CMS Old Gen heap memory `currentUsedMemory` statistic, execute the `GetStatisticValueFunction` like:

```
./runclient.sh get-statistic VMMemoryPoolStats 'CMS Old Gen-Heap memory' currentUsedMemory

2021-06-12 19:23:03.762  INFO 6100 --- [  main] example.client.Client : Starting Client ...
...  
2021-06-12 19:23:09.623  INFO 6100 --- [  main] example.client.Client : Started Client in 6.573 seconds (JVM running for 7.227)
2021-06-12 19:23:09.676  INFO 6100 --- [  main] example.client.Client : 
Statistic value for category=VMMemoryPoolStats; type=CMS Old Gen-Heap memory;statistic=currentUsedMemory
  member=192.168.1.8(server-1:5909)<v1>:41001; value=35,393,776
  member=192.168.1.8(server-2:5910)<v2>:41002; value=35,444,256
  member=192.168.1.8(server-3:5911)<v3>:41003; value=35,266,648
```

To log the value of the Trade region `dataStoreBytesInUse` statistic, execute the `GetStatisticValueFunction` like:
```
./runclient.sh get-statistic PartitionedRegionStats /Trade dataStoreBytesInUse

2021-06-12 19:25:11.157  INFO 6139 --- [  main] example.client.Client : Starting Client ...
... 
2021-06-12 19:25:17.032  INFO 6139 --- [  main] example.client.Client : Started Client in 6.562 seconds (JVM running for 7.303)
2021-06-12 19:25:17.098  INFO 6139 --- [  main] example.client.Client : 
Statistic value for category=PartitionedRegionStats; type=/Trade;statistic=dataStoreBytesInUse
  member=192.168.1.8(server-1:5909)<v1>:41001; value=7,258,774
  member=192.168.1.8(server-2:5910)<v2>:41002; value=7,340,782
  member=192.168.1.8(server-3:5911)<v3>:41003; value=7,257,758
```

To log the value of the Trade region `dataStoreEntryCount` statistic, execute the `GetStatisticValueFunction` like:
```
./runclient.sh get-statistic PartitionedRegionStats /Trade dataStoreEntryCount

2021-06-12 19:26:35.074  INFO 6156 --- [  main] example.client.Client : Starting Client ...
...
2021-06-12 19:26:40.653  INFO 6156 --- [  main] example.client.Client : Started Client in 6.278 seconds (JVM running for 6.901)
2021-06-12 19:26:40.714  INFO 6156 --- [  main] example.client.Client : 
Statistic value for category=PartitionedRegionStats; type=/Trade;statistic=dataStoreEntryCount
  member=192.168.1.8(server-1:5909)<v1>:41001; value=6,642
  member=192.168.1.8(server-2:5910)<v2>:41002; value=6,717
  member=192.168.1.8(server-3:5911)<v3>:41003; value=6,641
```

### LogAllStatisticValuesFunction
The [`LogAllStatisticValuesFunction`](https://github.com/boglesby/display-statistics/blob/master/server/src/main/java/example/server/function/LogAllStatisticValuesFunction.java) logs all the statistic categories, instances and values.

It can easily be modified to log the statistics values for:
- A specific category (e.g. `DistributionStats`)
- A specific category and instance (e.g. `VMMemoryPoolStats` — CMS Old Gen heap memory)

The `logAllStatistics` method:
- Gets all the categories of statistics
- Sorts them by name
- Adds each category to the builder

```java
private void logAllStatistics(Cache cache) {
  // Get the statistics
  InternalDistributedSystem ids = (InternalDistributedSystem) cache.getDistributedSystem();
  StringBuilder builder = new StringBuilder();
  List<Statistics> statsList = ids.getStatisticsManager().getStatsList();

  // Add the header
  addHeader(ids, builder, statsList);

  // Add the statistics
  statsList.stream()
    .sorted(Comparator.comparing(statistics -> statistics.getType().getName()))
    .forEach(statistics -> addStatistics(builder, statistics));

  // Log the results
  cache.getLogger().info(builder.toString());
}
```

The `addStatistics` method:
- Gets all the individual statistics for each category
- Sorts them by name
- Adds each statistic to the builder

```java
private void addStatistics(StringBuilder builder, Statistics statistics) {
  // Add statistics header
  StatisticsType type = statistics.getType();
  addStatisticsHeader(builder, statistics, type);

  // Add statistics
  Arrays.stream(type.getStatistics())
    .sorted(Comparator.comparing(StatisticDescriptor::getName))
    .forEach(statisticDescriptor -> addStatistic(builder, statistics, statisticDescriptor));
  builder.append("\n");
}
```

The `addStatistic` method adds each statistic name and value to the builder.
```java
private void addStatistic(StringBuilder builder, Statistics statistics, StatisticDescriptor descriptor) {
  builder
    .append("\n\t")
    .append(descriptor.getName())
    .append("=")
    .append(NumberFormat.getInstance().format(statistics.get(descriptor.getName())))
    .append(" ")
    .append(descriptor.getUnit());
}
```
A truncated example is shown below.

```text
CachePerfStats.RegionStats-partition-Trade statistics:
  creates=6,732 operations
  entries=6,732 entries
  updates=3,353 operations

CacheServerStats.192.168.1.17-0.0.0.0/0.0.0.0:57999 statistics:
  currentClientConnections=1 sockets
  currentClients=1 clients
  putRequests=3,427 operations
  putResponses=3,427 operations
  receivedBytes=3,917,529 bytes
  sentBytes=229,793 bytes

DistributionStats.distributionStats statistics:
  processedMessages=8,276 messages
  receivedBytes=4,515,304 bytes
  receivedMessages=8,276 messages
  replyWaitsCompleted=4,070 operations
  sentBytes=31,715,422 bytes
  sentMessages=10,386 messages

FunctionStatistics.GetStatisticValueFunction statistics:
  functionExecutionCalls=2 operations
  functionExecutionsCompleted=2 operations

FunctionStatistics.LogAllStatisticValuesFunction statistics:
  functionExecutionCalls=5 operations
  functionExecutionsCompleted=4 operations

PartitionedRegionStats./Trade statistics:
  bucketCount=76 buckets
  dataStoreBytesInUse=7,357,150 bytes
  dataStoreEntryCount=6,732 entries
  primaryBucketCount=38 buckets
  putsCompleted=3,427 operations

StatSampler.statSampler statistics:
  delayDuration=999 milliseconds

VMGCStats.ParNew statistics:
  collectionTime=283 milliseconds
  collections=2 operations

VMGCStats.ConcurrentMarkSweep statistics:
  collectionTime=4,527 milliseconds
  collections=3 operations

VMMemoryPoolStats.CMS Old Gen-Heap memory statistics:
  currentMaxMemory=724,828,160 bytes
  currentUsedMemory=21,330,872 bytes

VMStats.vmStats statistics:
  cpus=4 cpus
  freeMemory=924,641,576 bytes
  maxMemory=1,038,876,672 bytes
  threads=72 threads
  totalMemory=1,038,876,672 bytes
```
## Conclusion
This article has shown several ways to display both current and historical statistics.