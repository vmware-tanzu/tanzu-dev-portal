---
date: '2022-10-13'
lastmod: '2022-10-13'
layout: single
team:
- Matthew Wei
- Asif Sajjad
- Tyson McNulty
title: Collaboration When Releasing a Thin Slice to Production
weight: 60
tags: []
---

If you’ve been following this series and are reading this right now, congratulations, you have made it to the final lesson in the series! Now we will look at the collaboration within a balanced team when releasing a thin slice to production. 

By the time a complete thin slice is released to production, each of the individual services should have all been validated as to whether or not they perform the functions needed and that the functions meet the needs of the user. Some of the services and the connections between them should have already been released into production or a production-like environment to validate their functionality.

Releasing a thin slice to production should therefore only be a validation of the entire system on whether or not all the new architecture will achieve the desired outcomes. The individual components within the thin slice should have been tested and validated previously.


## Architects

As new services are pushed into production, architects are concerned with the performance of the system and whether or not the new architecture is behaving as expected according to the design.

While an architect’s role is not primarily a testing role, they can step in and help check out whether or not the system is working as expected. This could include validating questions such as:



* Does the system work as per the business requirements?
* How well does the system model the business process in the event storm?
* What, if any, missed requirements or business processes were not satisfied and will require additional work?
* What, if any, enhancements or modifications can be made to make the business process or the system better?
* How well is the system performing compared to the old system?

💁 Tip: In order to answer some of these questions, it is important to have set SLOs and SLIs during earlier stages so that you have clear targets to measure against. A dashboard for the system SLO and SLI will make it easier to measure and determine how well the system is performing according to the design.

Architects may find enhancements or improvements to improve the system’s efficiency. These should be discussed with product management to prioritize the work. Architects can give recommendations on how to prioritize the enhancement work and discuss with the development and product teams. For example, the enhancement can be rolled into the next thin slice as it directly impacts the system design. Alternatively, the enhancements can be slated as a separate slice by itself or grouped together with other enhancements to be completed later if they don’t impact the system design. After discussing the options, the product manager should prioritize the work with input and recommendations from the architects and development team.


## Developers

During this stage, aside from pushing the code to production, the developers should be double checking that all the tests are passing and are monitoring the performance of the new services in production. 

Prior to releasing the software, the unit tests and automated tests should have all passed. The initial performance test should also have been completed in lower environments (development, testing and integration) to make sure that the code is performing to expectations. Developers should make sure that these tests have passed and check with the product manager that there are no concerns before deploying code to production.

💁 Tip: A dashboard for the system SLOs and SLIs will make it easier to measure and determine how well the system is performing according to the design. Including unit tests and automated test results in the dashboard will make it easier for the team to spot any concerns with deploying to production. Here’s an [example](https://docs.vmware.com/en/VMware-Tanzu-Service-Mesh/services/slos-with-tsm/images/GUID-45F7A488-E917-4360-AA2D-BB09E7D88673-low.png) of a reliability dashboard.

![Example of a reliability dashboard](/learningpaths/swift-practice/images/image2.png)

Once code is deployed into production, developers should monitor the performance of the system to see whether or not the new code has adversely affected production. Developers should also run through sanity checks or smoke tests to make sure that the code is working as expected and behaves the same as when it was in a lower environment.


## Product

When the thin slice is released to production, the team will finally see whether or not all the new services and the new architecture achieve the desired outcomes. Using the success metrics established when this thin slice is identified, a product manager should be monitoring the application as well as feedback from users on whether or not the new system actually solves the problem.

User feedback can be collected in various forms, including:



* User interviews
* Pairing up with a user in their daily routine while using the new system
* User surveys
* In-app feedback
* Bug tickets and feature requests

💁 Tip: It is vital to have fast feedback loops throughout the product development lifecycle. By the time the team releases a thin slice, getting feedback on the entire system should not feel like establishing a new process. That is: be sure to prioritize, include, and, if necessary, build feedback systems into the software.

Measuring the success metrics of the thin slice should lead a product manager to one of the following conclusions:



1. The assumptions were correct and the system is fulfilling customer needs
2. The assumptions were correct and the system is generally meeting customer needs with some enhancements needed
3. The assumptions were correct, but the system is not fulfilling customer needs
4. The assumptions were incorrect and we discovered that there was another reason that caused the problems faced by the customer

Using these metrics and analysis of "usefulness," a product manager can discuss next steps with the team. This ranges from continuing on the same modernization path with the next slice of functionality, taking a quick break to enhance the current slice and retest before moving on to the next slice, or pivoting from the current plan and revisiting the problem statement to create a more accurate description of the problem to be solved.


## Modernization Is More than Just Rewriting Software

Oftentimes, we view modernization efforts as a project in which we are just replicating the existing system with the existing functionalities and logic in a new environment with updated technology stacks. This can be the extent of your modernization, but it also means that the modernized systems will inherit a lot of the same issues, constraints, and bugs that existed within the legacy system.

Rather than focusing on getting features and components released to production in the fastest time frame possible, we propose that by understanding your business events and needs first, you’ll create a modernized system that will more closely resemble those events and needs. In order to deliver the right product and with the right functionality, it’s important that a balanced team is involved through the entire modernization process. Employing the Swift Method bridges the gap between separating the technical spaghetti code that’s melted together over a long time with the business need to deliver value to the customer in short, iterative cycles.
