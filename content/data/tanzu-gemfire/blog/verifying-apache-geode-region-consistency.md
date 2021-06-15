---
date: 2020-06-11
description: 'Apache Geode provides a mechanism to asynchronously distribute batches
  of events between two disparate DistributedSystems called a WAN topology. The events
  are stored in queues in the local DistributedSystem before being batched and distributed.
  The default behavior can be changed with the gemfire.GatewaySender.REMOVE_FROM_QUEUE_ON_EXCEPTION
  java system property. Setting this property to false will cause all batches of events
  to be retried indefinitely until they succeed. The default behavior can cause a
  Region’s data in each site to become inconsistent. This article describes a way
  to verify that a Region’s data in two WAN sites is consistent.      '
lastmod: '2021-04-22'
team:
- Barry Oglesby
title: Verifying Apache Geode Region Consistency in Different Distributed Systems
type: blog
---

## Introduction
Apache Geode provides a mechanism to asynchronously distribute batches of events between two disparate DistributedSystems called a [WAN topology](https://geode.apache.org/docs/guide/12/topologies_and_comm/multi_site_configuration/chapter_overview.html). The events are stored in queues in the local DistributedSystem before being batched and distributed.

If a connection cannot be made to the remote WAN site, the events remain in the GatewaySender’s queue until such time as a connection can be made. At that time, events are batched and sent to the remote site. Once an acknowledgement has been received by the GatewaySender for those events, they are removed from the queue. Whether the events are successfully applied in the remote site is not taken into account. Any exceptions that occur in the remote site are logged in both sites, but once the acknowledgement is received, the events are removed from the queue. This decision was made mainly to prevent issues in the remote site (e.g. memory pressure, partitions offline, etc.) from cascading back to and affecting the local site.

The default behavior can be changed with the ***gemfire.GatewaySender.REMOVE_FROM_QUEUE_ON_EXCEPTION*** java system property. Setting this property to false will cause all batches of events to be retried indefinitely until they succeed.
 
The default behavior can cause a Region’s data in each site to become inconsistent. This article describes a way to verify that a Region’s data in two WAN sites is consistent.

## Implementation
All source code described in this article is available [here](https://github.com/boglesby/verify-wan-consistency).

The **WanVerificationService** is instantiated with a Region name, a Pool connected to site 1 and a Pool connected site 2. It:
* creates a proxy Region connected to site 1 and gets the keySet for the Region on that site
* creates a proxy Region connected to site 2 and gets the keySet for the Region on that site
* compares the keySets for equality
* iterates site 1 keySet and for each key compares the value in site 1 to the value in site 2
* if the keySets aren’t equal, iterates site 2 keySet and for each key compares the value in site 1 to the value in site 2. Note: if the keySets are equal, this step is not necessary. Also, this step could be improved by getting the keys in site 2 that are not in site 1 and comparing just those values.
* logs the result

The keySet comparison is done using equals.

The value comparison is done using a **ValueComparator** which defines one method called compare. The default implementation of compare uses equals, so if the value class implements equals, the default implementation will work fine. But, if the value class does not implement equals, then a non-default **ValueComparator** will be required to compare the two values.

The resulting comparison is logged. This behavior could be enhanced with a callback that allows the user to take some action to repair the sites.

### Create Proxy Region and Get keySet
The getKeySet method:
* creates a proxy Region connected to the input site
* gets the keySet for the Region on that site using keySetOnServer
* closes the Region

The getKeySet method is invoked for each site.

```java
private Set getKeySet(String regionName, String siteName) {
 Region region = createRegion(regionName, siteName);
 Set keySet = region.keySetOnServer();
 closeRegion(region);
 return keySet;
}
```

The createRegion method creates a proxy Region connected to a specific site.

```java
private Region createRegion(String regionName, String siteName) {
 return ((ClientCache) this.cache)
  .createClientRegionFactory(ClientRegionShortcut.PROXY)
  .setPoolName(siteName)
  .create(regionName);
}
```

Unfortunately, a Region can only be connected to one Pool (and thus one site), and once the Region is connected to that Pool, it can’t be changed. So, to repeatedly connect to one site then the other, the Region must constantly be closed and recreated. Luckily this is an inexpensive operation.

The closeRegion method is used to close a proxy Region. It also closes the ClientMetadataService which clears its known server-to-bucket layout.

```java
private void closeRegion(Region region) {
 region.close();
 ((InternalCache) this.cache).getClientMetadataService().close();
}
```

### Compare keySets
The compareKeySets method:
* compares the keySets using equals
* If the keySets are not equal, the differences are determined using removeIf with the contains predicate
* builds up the StringBuilder with the results

```java
private boolean compareKeySets(Set site1Keys, Set site2Keys) {
 this.builder
  .append("\n\n==============")
  .append("\nComparing keys")
  .append("\n==============");
 boolean allKeysAreEqual = site1Keys.equals(site2Keys);
 if (allKeysAreEqual) {
  this.builder.append("\nAll ").append(site1Keys.size()).append(" keys are equal");
 } else {
  this.builder.append("\nAll keys are not equal. Site 1 contains ").append(site1Keys.size()).append(" keys. Site 2 contains ").append(site2Keys.size())
   .append(" keys.");
  Set site1Differences = new HashSet(site1Keys);
  site1Differences.removeIf(site2Keys::contains);
  this.builder.append("\nSite 1 contains these ").append(site1Differences.size()).append(" keys not found in site 2: ").append(site1Differences);
  Set site2Differences = new HashSet(site2Keys);
  site2Differences.removeIf(site1Keys::contains);
  this.builder.append("\nSite 2 contains these ").append(site2Differences.size()).append(" keys not found in site 1: ").append(site2Differences);
 }
 return allKeysAreEqual;
}
```

### Compare Values in Each Site
The compareAllValues method iterates the keySet and, for each key, invokes compareSingleValues to compare the value in each site.

```java
private void compareAllValues(String regionName, ValueComparer valueComparer, Set keys, int fromSite, int toSite) {
 this.builder
  .append("\n\n=============================================")
  .append("\nComparing values in site ")
  .append(fromSite)
  .append(" to those in site ")
  .append(toSite)
  .append("\n=============================================");
 this.allValuesAreEqual = true;
 keys.forEach(key -> compareSingleValues(regionName, valueComparer, key));
 if (this.allValuesAreEqual) {
  this.builder
   .append("\nAll values in site ")
   .append(fromSite)
   .append(" are equal to those in site ")
   .append(toSite);
 }
}
```

To compare the value in each site, the compareSingleValues method:
* creates a proxy Region connected to site 1
* gets the value for the key in site 1
* closes the Region to site 1
* repeats the above steps for site 2
* compares the values using the **ValueComparer**
* builds up the StringBuilder with the results

```java
private void compareSingleValues(String regionName, ValueComparer valueComparer, Object key) {
 // Get the value in site 1
 Region site1Region = createRegion(regionName, this.site1Pool.getName());
 Object site1Value = site1Region.get(key);
 closeRegion(site1Region);
// Get the value in site 2
 Region site2Region = createRegion(regionName, this.site2Pool.getName());
 Object site2Value = site2Region.get(key);
 closeRegion(site2Region);
// Compare the values
 boolean valuesAreEqual;
 if (site1Value == null && site2Value == null) {
  valuesAreEqual = true;
 } else if (site1Value == null) {
  valuesAreEqual = valueComparer.compare(site2Value, site1Value);
 } else {
  valuesAreEqual = valueComparer.compare(site1Value, site2Value);
 }
if (!valuesAreEqual) {
  this.builder
   .append("\nValues are not equal for key=")
   .append(key)
   .append("; site1Value=")
   .append(site1Value)
   .append("; site2Value=")
   .append(site2Value);
  this.allValuesAreEqual = false;
 }
}
```

### Log the Result
Some examples of the results logged are shown below.

If the keys in both sites are equal, but the values are not, a message like below is logged:

```
Verifying entries for region=Trade
==============
Comparing keys
==============
All 20 keys are equal
============================================
Comparing values in site 1 to those in site 2
=============================================
Values are not equal for key=0; site1Value=Trade(id=0, cusip=MRK, shares=12, price=202.65); site2Value=Trade(id=0, cusip=PFE, shares=11, price=682.45)
Values are not equal for key=1; site1Value=Trade(id=1, cusip=UNH, shares=51, price=995.72); site2Value=Trade(id=1, cusip=BAC, shares=69, price=882.05)
Values are not equal for key=2; site1Value=Trade(id=2, cusip=CMCSA, shares=83, price=684.68); site2Value=Trade(id=2, cusip=TM, shares=98, price=143.51)
Values are not equal for key=3; site1Value=Trade(id=3, cusip=V, shares=42, price=346.58); site2Value=Trade(id=3, cusip=GOOGL, shares=93, price=467.43)
Values are not equal for key=4; site1Value=Trade(id=4, cusip=AXP, shares=53, price=244.85); site2Value=Trade(id=4, cusip=PG, shares=66, price=270.92)
```

If the keys in both sites are not equal, a message like below is logged:

```
Verifying entries for region=Trade
==============
Comparing keys
==============
All keys are not equal. Site 1 contains 10 keys. Site 2 contains 10 keys.
Site 1 contains these 10 keys not found in site 2: [0, 12, 2, 14, 4, 16, 6, 18, 8, 10]
Site 2 contains these 10 keys not found in site 1: [11, 1, 13, 3, 15, 5, 17, 7, 19, 9]
=============================================
Comparing values in site 1 to those in site 2
=============================================
Values are not equal for key=0; site1Value=Trade(id=0, cusip=CRM, shares=44, price=921.92); site2Value=null
Values are not equal for key=12; site1Value=Trade(id=12, cusip=UNH, shares=56, price=846.28); site2Value=null
Values are not equal for key=2; site1Value=Trade(id=2, cusip=BAC, shares=78, price=939.22); site2Value=null
Values are not equal for key=14; site1Value=Trade(id=14, cusip=TM, shares=34, price=708.74); site2Value=null
Values are not equal for key=4; site1Value=Trade(id=4, cusip=V, shares=96, price=242.98); site2Value=null
...
=============================================
Comparing values in site 2 to those in site 1
=============================================
Values are not equal for key=11; site1Value=null; site2Value=Trade(id=11, cusip=PFE, shares=57, price=85.83)
Values are not equal for key=1; site1Value=null; site2Value=Trade(id=1, cusip=CRM, shares=81, price=796.38)
Values are not equal for key=13; site1Value=null; site2Value=Trade(id=13, cusip=INTC, shares=75, price=412.98)
Values are not equal for key=3; site1Value=null; site2Value=Trade(id=3, cusip=FB, shares=33, price=64.32)
Values are not equal for key=15; site1Value=null; site2Value=Trade(id=15, cusip=CVS, shares=18, price=893.04)
...
```

## Caveats
The **WanVerificationService** should be run when the sites are not active and the queues are empty. Any events in the queues or in-flight between sites are ignored, so if the sites are active or the queues contain events, the results might incorrectly show differences which may not exist.

The **WanVerificationService** calls the Region get method on each key in each site. If the Region defines a CacheLoader, it will be invoked if the value is null for that key.


## Future
A service like this built into Apache Geode would be useful.

The service should also provide a callback for unequal values so that the application can take some action to repair the sites (e.g. applying the value in one site to the other).

There are a number of Apache Geode enhancements that would be helpful in this scenario including the ability to:
* change a client Region’s Pool so that it can easily switch between sites
* connect a client Region to two Pools simultaneously and to choose on which to invoke an operation
* connect a client Region to two Pools simultaneously in a primary / secondary arrangement
* automatically or manually failover and failback between Pools