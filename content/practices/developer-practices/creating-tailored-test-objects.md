---
dev_practice: true
title: "Creating Tailored Test Objects"
lastmod: 2021-03-10T09:53:00-05:00
draft: false
tags: ["Delivery", "Developer", "Testing"]
description: "Setting Up Your Test Objects to Avoid Future Pain"
image: "default-cover-dev.jpg"
length: "As needed"
---
Written By: [Toby Rumans](https://www.linkedin.com/in/toby-rumans-b4395631)

## Problem This Solves

- Unrelated tests have to change every time you add a new field to your objects
- Your test setup gets bloated with irrelevant details

It's easy to make test objects for your present that make your future more complex. This recipe focuses on how to setup your test objects to reduce complexity in the future and make your tests easier to understand.

While the examples used in this post are all Kotlin, the concepts can mostly be used across all languages.

It happens over and over again in testing. You make your class, now you need an instance of it for your tests either to mock or pass in. What often happens are a few different approaches. Take the following data class:

```kotlin
data class SomeThinger(
    val aProperty: String,
    val anotherProperty: String
)
```

Somewhere in your tests, you need to make one of these things. Sometimes you'll instantiate the object:

```kotlin
@Test
fun myTest() {
    val expected = SomeThinger(
        aProperty="some-value",
        anotherProperty="some-other-value"
    )
    
    result = subject.doSomeThings()
    
    assertThat(result.aProperty).isEqualTo(expected.aProperty)
}
```

This can be fine and works to get started. A few problems exist though:

- You're setting up test data your assertions don't care about (`anotherProperty="some-other-value"`).
- If you add another field to SomeThinger, you either have to make it optional or update all your tests with the new field.

## Solutions

Ideally, we want our test objects to do as little setup as is possible. It helps future us understand what this test cares about a lot more easily. I'm going to show 2 different ways to accomplish this.

### Solution #1 - Use a generic make function
My favorite way is to have a function that utilizies reflection and generics to create an instanceof whatever type you desire. If we had such a function, our data class would stay the same, but our test would now look like this:

```kotlin
fun myTest() {
    val expected = make<SomeThinger>().copy(
        aProperty="some-value"
    )
    
    result = subject.doSomeThings()
    
    assertThat(result.aProperty).isEqualTo(expected.aProperty)
    
}
```

Now we only have to setup the data we care about. We need to `.copy()` because we can't make a completely generic constructor for any object, but we can provide sensible defaults. Now that we see the awesomeness, here's a make function for Kotlin:

```kotlin
package makers

import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID
import kotlin.reflect.KClass

inline fun <reified T> make(): T {
    return makeInstanceOfClass(T::class) as T
}

fun makeInstanceOfClass(clazz: KClass<*>): Any? {
    val primitive = makePrimitiveOrNull(clazz)
    if (primitive != null) {
        return primitive
    }

    val constructors = clazz.constructors
        .sortedBy { it.parameters.size }

    for (constructor in constructors) {
        val arguments = constructor.parameters
            .map { param ->
                param.takeUnless { it.type.isMarkedNullable }
                    ?.let { makeInstanceOfClass(it.type.classifier as KClass<*>) }
            }
            .toTypedArray()

        try {
            return constructor.call(*arguments)
        } catch (e: Throwable) {
        }
    }

    throw NoUsableConstructor(clazz)
}

private fun makePrimitiveOrNull(clazz: KClass<*>): Any? = when (clazz) {
    Int::class -> 0
    Long::class -> 0L
    Double::class -> 0.0
    String::class -> ""
    Boolean::class -> false
    UUID::class -> UUID.randomUUID()
    List::class -> emptyList<Any>()
    Set::class -> emptySet<Any>()
    Map::class -> emptyMap<Any, Any>()
    LocalDate::class -> LocalDate.now()
    LocalDateTime::class -> LocalDateTime.now()
  
    else -> null
}

class NoUsableConstructor(clazz: KClass<*>) : Error("Could not find a constructor for class: ${clazz.simpleName}")
```

#### Pros
* Updating class constructors does not cause compilation errors
* Easily limit test data setup to only what's relevant
* One function handles many many different classes you'll need for testing
* Provides sensible defaults for most data types without extra configuration
* Can extend `makePrimitiveOrNull` to add custom classes or Enum classes
* Easy to use everywhere

#### Cons
* Only works with classes that can be copied
* Reflection could slow down your test suite


### Solution #2 - Using individual make functions
Sometimes generics won't work. Sometimes your language doesn't do a good job of it (looking at you golang), or sometimes you don't have a reasonable way to implement the reflection necessary. If generics won't work for you, I'd recommend writing and maintaining `make` functions for all classes you work with in tests. In the above example, you could do something like this:

```kotlin
fun makeSomeThinger(
    aProperty: String = "",
    anotherProperty: String = "",
): SomeThinger = SomeThinger(
    aProperty = anotherProperty,
    anotherProperty = anotherProperty
)
```

Which would change our test code to look more like this:

```kotlin
fun myTest() {
   val expected = makeSomeThinger(
        aProperty = "some-value"
    )
    
    result = subject.doSomeThings()
    
    assertThat(result.aProperty).isEqualTo(expected.aProperty)
}
```

Some things to keep in mind that work well for `make` functions:

- Use them for every object you're using in a test. This takes discipline to create them every time.
- Provide defaults for all arguments to create an object.
- The defaults should be the simplest possible value to meet the criteria of the argument. For instance, a nullable type should pass `null`, an integer should be `0` etc. Remember, our goal is to ensure the test setup signals what is significant to look for in this test. If our defaults are to smart, it's harder to know when they're relevant.
- Even if you're asserting against something that would work as a default value (checking a blank string for example), it's good to add that to your test to signal to folks that this test cares about that piece of data.


#### Pros
- Updating class constructors does not cause compilation errors
- Easily limit test data setup to only what's relevant
- Works with any class in your system

#### Cons
- Requires discipline to maintain (you have to write every make function).
- Easy to get into trouble by setting defaults that are too smart. For example, if you always default a users first name to Alex, it's easier to write tests that expect Alex as the first name value without actually setting that data up in the test. In most every case, a test assertion should not work as a result of the default data from the `make` function. You should strive to be able to update your defaults and have 0 failures in your system