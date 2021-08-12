---
date: '2020-05-07'
description: Explore the basics of Representational State Transfer (REST) APIs, a
  software style that provides architectural constraints used for creating web services.
lastmod: '2021-03-07'
metaTitle: Understanding the Basics of REST
patterns:
- API
subsection: Basics of REST
tags:
- Microservices
- API
- REST
team:
- Tiffany Jernigan
- Brian McClain
title: Basics of REST
topics:
- Microservices
weight: 2
oldPath: "/content/guides/microservices/basics-of-rest.md"
aliases:
- "/guides/microservices/basics-of-rest"
level1: Modern App Basics
level2: Modern Development Concepts
---

So what is [REST](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)? At a high level REST, or REpresentational State Transfer, is an architectural style for distributed hypermedia systems. It was created from a combination of other architectural styles and enlists several constraints. Roy Fielding, its creator, said that "REST provides a set of architectural constraints that, when applied as a whole, emphasizes scalability of component interactions, generality of interfaces, independent deployment of components, and intermediary components to reduce interaction latency, enforce security, and encapsulate legacy systems." 

This guide will cover:
- REST HTTP requests
- REST HTTP responses
- Constraints needed for an API to be RESTful

## Requests
The client has to make a request to the server to get or modify data on the server. A request contains the following:
- HTTP verb
- headers
- path: to a resource
- [optional] message body: data

Consider the example of a todo list. An example request could look like this:
```
GET /todos
Accept: application/json
```

### HTTP Methods/Verbs
HTTP methods, or verbs, define what kind of operation to perform on a resource. Some of the primary ones used with RESTful APIs are:
- `GET`: get a resource or collection of resources
- `POST`: create a new resource
- `PUT`: update a resource
- `PATCH`: partially modify a resource
- `DELETE`: delete a resource

### HTTP Headers
The client uses headers to pass along request information to the server. Requests can have an `Accept` request HTTP header which specifies what content type the client can accept from the server. The values are of the media, or [MIME type](https://www.iana.org/assignments/media-types/media-types.xhtml). The simplest MIME types are of the format `type/subtype`. For example, this could be `text/html` which is for a text file containing HTML. Or `application/json` for a JSON file. To see a list of common `Accept` values check out the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types).

### Path
Requests need to contain a path to the resource it is trying to perform the HTTP request on. In the above example, that is `/todos`. This is the resource that you are looking to read from or write to. 

One important thing to note is the difference between addressing a collection and an individual item in that collection. The path `/todos` would be addressing all of the items on the todo list. A `POST` to this path could create a new item on that list, and a request to `GET /todos` would return all items. On the other hand, `GET /todos/2` would return just the second item on the todo list. 

## Response
After the client sends a request to the server, the server sends a response back to the client. This response consists of a:
status code
headers
message body: data

For the previous request:

```
GET /todos
Accept: application/json
```

The response could contain the following for a successful request:

```
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
[
    {
        "name": "pay rent",
        "due": 1589031653,
        "completed": false
    },
    {
        "name": "get groceries",
        "due": 1588869295,
        "completed": true
    }
]
```

### HTTP Headers
The responses have a `Content-Type` entity header which specifies the MIME type of the resource. Its value should match one of the `Accept` types sent by the client. In the above example, both the `Content-Type` and `Accept` header values are `application/json`.

Headers can contain information on a wide array of topics including how to handle the TCP connection, authentication, caching, and more. Some REST APIs may have headers specific to them, but there’s also some headers that have a [universal definition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers).

### Response Status Code
One of the return values in a response is a response status code. Each code has a specific designation; for example, `200` is `OK` and means the request was successful. The response code categories are as follows:
- `1XX`: Informational
- `2XX`: Successful
- `3XX`: Redirects
- `4XX`: Client Errors
- `5XX`: Server Errors

To see the detailed list of response codes and their meaning, check out the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

### Body
The body contains the data the client requested in the MIME type specified in the `Content-Type` header. In the example above, the body of the response is:

```json
[
    {
        "name": "pay rent",
        "due": 1589031653,
        "completed": false
    },
    {
        "name": "get groceries",
        "due": 1588869295,
        "completed": true
    }
]
```

## Constraints
In order to create RESTful APIs, they need to adhere to six style constraints:
1. Client-Server Separation
2. Stateless
3. Cache
4. Uniform Interface
5. Layered System
6. [Optional] Code-On-Demand

### Client-Server
First, there needs to be a separation of client and server. This means that the client and server each need to work independent of each other. Their only form of interaction is when a client makes requests and a server sends a response whenever it receives a request. One of the benefits is that the client and server can each be updated or modified independently without affecting the other.

For example, if you make a call to a restaurant to place a takeout order, the only interaction is you asking for a specific item and them responding with an ok or saying they don’t have it.

### Stateless
Next, the client and server communication needs to be stateless: the server and client don't need to know the state of the other. The server doesn't store state from the client and therefore the client can't depend on it. Therefore the client needs to send everything the server would need to process a request every time and any storing needs to happen client-side. 

To continue with the analogy, when you make your call, you don’t need to know what the restaurant has in stock, and they don’t need to know what you want until you order. Additionally, you’re responsible for keeping track of what you like to order, not the restaurant.

### Cache
Cache constraints require that the response be labeled as cacheable or non-cacheable. If it's cacheable, then the client can choose to use this data for future requests that are equivalent. For instance, if the data is valid for a set time, the cached data will be used instead of making a request to the server.

For your takeout call, the restaurant may tell you that a specific item is not available until a certain date. You can then remember to not order it again if you make another request before that date.

### Uniform Interface
As mentioned, the client and server are independent of each other, meaning they evolve and change independently. For this reason, it’s imperative that the interface between the client and server expect some commonality in their communication. This constraint can actually be broken down even further:

1. **Resource-Based**: This is two-fold: First, individual resources should be identifiable in the request. Often this is done in the path of the URI of the request. For example, `/todos/2` would directly address the `todo` item with the ID of `2`. Second, the presentation of the resource does not necessarily need to match the internal representation by the server. The `todo` item may be returned as JSON, but more realistically the server is storing this in a database in another format.
2. **Manipulate Resources Through Representations**: When the client receives a resource, the representation of that resource contains enough information to update or delete it. This could be seen as the flip-side of the “stateless” constraint. Using the same example of a todo list, if a client requests all items in a todo list, each of those items would likely include an ID so that it could be individually addressed.
3. **Self-Descriptive Messages**: Each message or resource should include enough information so that the client knows how to process that message. For example, if a client has requested a resource that’s returned as JSON, the response should also include a `Content-Type` header with the value `application/json`.
4. **Hypermedia as the Engine of Application Sate**: AKA [“HATEOAS”](https://en.wikipedia.org/wiki/HATEOAS). This could be a whole conversation on it’s own, and it’s encouraged to read on this topic as well, but in short each response should include related links that the client can use to discover other actions and resources. Continuing the ToDo example, requesting an individual todo item may include links to the list that it is a part of.

### Layered System
Layered system constraints are used to scope hierarchical layers based on behavior and have each layer be unable to have visibility past the layer it is interacting with. That’s to say, a client may send a request to a server, which in turn may send a request to a data service, which sends a request to an authentication service. All of this is invisible to the client and the client can not and should not distinguish between a direct request to the data or one that has multiple requests server-side. This is also true for infrastructure and operational components such as proxies and load balancers. Introducing these components to the server architecture should require no updates from the client.

## [Optional] Code-On-Demand
This constraint states that a server can extend the functionality of a client by providing it executable code. Probably the most common example of this is client-side scripting with JavaScript, but this can take many forms. While this keeps clients simpler and smaller, it also reduces visibility of features and can introduce ambiguity. Because of this, while the absence of other constraints may mean a service isn’t actually RESTful, this constraint is optional.

## Conclusion
Well, this is the end of this coverage of the basics of REST. Reading Roy Fielding's REST [dissertation](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) is a great place to start if you haven't already. If you’d like to start building your own REST APIs and are a Spring developer, be sure to check out [Building a REST API with Spring Boot](/guides/spring/spring-build-api) to see these principles in action!