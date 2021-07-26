---
date: '2021-07-12'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: User Interfaces
weight: 180
---

Traditional Java Enterprise Edition (EE) web applications evolved through many model-view-controller technology stacks, including templating engines such as Java Server Pages (JSP), Java Server Faces (JSF), Apache Struts, or Portlets. Each of these stacks tried to tackle the separation between server-based business logic and the views themselves while attempting to break up the UI into modular components. The modular components are tightly coupled to an underlying heavyweight server environment. Applications that use these view technologies are often prime candidates for more extensive modernization efforts, as they tend to crystalize in monolithic web applications with many functions and layers.

Depending on the current state of the application and the amount of refactoring the team wants to take on, we suggest porting the existing JSP or similar view templates over to deploy an application in a TAS Tomcat container. This provides a simple and non-intrusive way to get one of these technologies running on the platform.

Regarding other technologies such as Portlets or thick-client desktop applications, we typically peel out the underlying business logic into web services and access them through a new set of user interfaces. Modern web application development has moved towards frameworks such as React and Angular leveraging JavaScript to call back-end services. Your company may already be looking into building full-stack [balanced teams](/outcomes/application-development/balanced-teams/) developing a new generation of front-ends.

#### Homework

- List and evaluate the user interface and view technologies your applications use now.
- Have a team conversation on your vision, teaming, and technologies for future user experiences.