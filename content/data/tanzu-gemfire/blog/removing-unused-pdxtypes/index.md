---
date: 2020-04-28
description: A short description of the blog post
lastmod: '2021-04-22'
team:
- Barry Oglesby
title: Removing Unused PdxTypes from an Apache Geode Distributed System
type: blog
---

## Introduction
   Portable Data Exchange (PDX) is Apache Geode’s data serialization protocol for cross-language objects and JSON data. When a PDX-serializable object is serialized for the first time, a PdxType is generated for it. The PdxType represents the data structure of that object and is used to serialize and deserialize it.
   
   PdxTypes can proliferate in the TypeRegistry especially with unstructured JSON data. The structure of a class is the same for every instance of that class. The same is not necessarily true of JSON data. If uniquely-structured JSON data is added to a Region, it generates a PdxType specific to it. If that data is then deleted, its PdxType remains in the TypeRegistry and becomes an unused orphan.
   
   This article describes a way to remove unused PdxTypes from the Distributed System.
   
   For additional information regarding PDX serialization, see the Apache Geode documentation [here](https://geode.apache.org/docs/guide/112/developing/data_serialization/gemfire_pdx_serialization.html).


## PdxType Examples
Several examples of JSON data and the PdxType generated for each is shown below. Each field in the JSON data becomes a PdxField in the PdxType. A PdxField describes the field name, type and the location in the data containing the field’s value.

![img](images/removing-unused-pdxtypes-diagram.png#diagram)

This is a very simple example of multiple PdxTypes being created for similar unstructured JSON data. In this case, the best thing to do is to standardize the JSON address on one format and convert all JSON to that format before storing it in a Region.
In a more complex case, PdxTypes can proliferate pretty easily, many of which become unused if the JSON data is removed or becomes more standardized. The **RemoveUnusedPdxTypesFunction** below shows a way to remove any unused PdxTypes.

## Implementation
All source code described in this article as well as an example usage is available [here](https://github.com/boglesby/remove-unused-pdxtypes).
The **RemoveUnusedPdxTypesFunction**:
* Gets a copy of all PdxTypes
* Iterates each input region’s PdxInstance values
* For each PdxInstance value, recursively removes all in use PdxTypes from the copy
* Deletes any remaining PdxTypes in the copy from the PdxTypes region

### Get All PdxTypes
The PdxTypes are stored in a replicated Region called PdxTypes. EnumInfo instances (which represent Enums in PDX) are also stored in that Region. This method filters those out and returns just the PdxTypes.

```java
private Map getAllPdxTypes() {
 return this.cache.getRegion("PdxTypes").entrySet()
  .stream()
  .filter(entry -> entry.getValue() instanceof PdxType)
  .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
}
```

### Recursively Remove All In-use PdxTypes
This method iteratively removes all in-use PdxTypes from the input object by getting the PdxType from the object as a PdxInstanceImpl and removing it from the collection. It then iterates each field of the PdxInstanceImpl and recursively calls the method on the field’s value. Collections and Maps are iterated separately, but every object ends up in the first conditional.

```java
private void removeInUsePdxTypes(Map<Integer,PdxType> allPdxTypesCopy, Object parent, String objFieldName, Object obj) {
 if (obj instanceof PdxInstanceImpl) {
  PdxInstanceImpl pdxInstance = (PdxInstanceImpl) obj;
  PdxType pdxType = pdxInstance.getPdxType();
  allPdxTypesCopy.remove(pdxType.getTypeId());
  for (PdxField field : pdxType.getFields()) {
   String fieldName = field.getFieldName();
   Object fieldValue = pdxInstance.readField(fieldName);
   removeInUsePdxTypes(allPdxTypesCopy, obj, fieldName, fieldValue);
  }
 } else if (obj instanceof Collection) {
  ((List) obj).forEach(value -> removeInUsePdxTypes(allPdxTypesCopy, obj, objFieldName, value));
 } else if (obj instanceof Map) {
  ((Map) obj).forEach((key, value) -> {
   removeInUsePdxTypes(allPdxTypesCopy, obj, objFieldName, key);
   removeInUsePdxTypes(allPdxTypesCopy, obj, objFieldName, value);
  });
 }
}
```

### Delete Remaining PdxTypes
Any PdxTypes remaining in the collection are removed from the Region using removeAll like:

```java
this.cache.getRegion("PdxTypes").removeAll(allPdxTypesCopy.keySet());
```

## Caveats and Comments
Here are a few caveats and comments:
* The Function has been tested mainly with JSON data not Java objects.
* The Function should be run on a backup or an offline Distributed System that has been backed up, not on a live system.
* The Function assumes each data Region’s values are PdxInstances which is always the case with JSON data.
* If the Cache contains Java objects, PDX read-serialized must be true so that only PdxInstances are being checked.
* The Function has a simulate parameter so that a dry run can be made.
* Based on the cases supported by Apache Geode’s JSONFormatter, the Function handles PdxInstances, Collections and primitives. It also has been modified to handle Maps. It currently does not handle arrays, but support for those could be added fairly easily.
* The Function must be executed on only one server so that unused PdxTypes only in one primary PartitionedRegion bucket are aren’t removed accidentally.
* The in-memory TypeRegistry is invalid after the Function runs, so the Distributed System needs to be restarted.

## Future
   The concepts in this Function can become the implementation of a gfsh command that removes unused PdxTypes from an offline Distributed System. In order to provide this behavior for an online Distributed System, the Function would have to be modified to use the TypeRegistry so that proper locking is done around access to the PdxTypes Region. Also, the TypeRegistry would have to be enhanced to be able to delete PdxTypes from itself as well as the PdxTypes Region.