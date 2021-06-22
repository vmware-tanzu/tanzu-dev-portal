---
title: User Interfaces
weight: 180
layout: single
team:
 - VMware Tanzu Labs
---


Traditional JEE web applications have gone through a number of model-view-controller technology stacks, including templating engines such as JSP, Java Server Faces, Apache Struts, and Portlets. Each of these has tried to tackle the separation between server-based business logic and the views themselves, and several also attempt to break up the UI into composable components. All of them are tightly-coupled to an underlying heavyweight server environment. Applications that use these view technologies are often prime candidates for bigger modernization efforts, as they tend to be found in monolithic web applications with many functions and layers.

Depending on the current state of the app and the amount of refactoring your team wants to take on, we may look to port the existing JSP or similar view templates over to run in the PCF-deployed tomcat container running your application. This provides a simple and non-intrusive way to get one of these technologies running on the platform. For other technologies such as Portlets or thick-client desktop applications, we’ll need to peel out the underlying business logic into web services and that access these through a new set of user interfaces. Modern web application development has moved towards frameworks such as React and Angular to build these front-ends using JavaScript to talk with the back-end services, and your company may already be looking into how to build balanced full-stack teams that can contribute these kinds of front-ends.


#### Homework

- [x] Evaluate what kinds of user interface and view technologies your app uses now

- [x] Have a conversation with your team about the vision for who builds and maintains the user experience going forward

