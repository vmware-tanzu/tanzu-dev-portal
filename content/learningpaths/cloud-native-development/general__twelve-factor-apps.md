---
date: '2021-07-12'
lastmod: '2021-07-12'
layout: single
team:
- VMware Tanzu Labs
title: Twelve-Factor Apps
weight: 10
---

Cloud native app development centers around the twelve factors initially described by the team behind the Heroku platform. The website [https://12factor.net](https://12factor.net/) provides a great understanding of how a cloud native application deals with aspects like logging, application state, and integration with external systems.

Sometimes, you only need a handful of these factors to get it running on a cloud platform like VMware Tanzu Application Service (TAS) to refactor and update an existing legacy application. This allows for the operational benefits of the platform without the large investment of a far-reaching modernization effort. Not every application should become its better self. For the sake of effectiveness, we align the extent of modernization efforts with their concrete business benefits.

Pay specific attention to these factors:
* [externalizing config](https://12factor.net/config)
* [converting integrations into backing services](https://12factor.net/backing-services)
* [keeping your processes stateless](https://12factor.net/processes)
* [logging to standard input and output](https://12factor.net/logs).

For more information on cloud native apps, check out the free book by Kevin Hoffman, [Beyond the Twelve-Factor App](https://content.pivotal.io/ebooks/beyond-the-12-factor-app). In it, he introduces three additional factors including API-first development, security, and telemetry not covered in the original set, but often required for apps to run well in the cloud.

## Homework

- Read about the twelve factors at [https://12factor.net](https://12factor.net/).

## Additional resources

- Read the [Beyond the Twelve-Factor App](https://content.pivotal.io/ebooks/beyond-the-12-factor-app) book.