---
title: Twelve-Factor Apps
weight: 10
layout: single
team:
 - VMware Tanzu Labs
---

Cloud native app development has centered around the twelve factors originally described by the team behind the Heroku platform. The website [https://12factor.net](https://12factor.net/) provides a great bootstrapped understanding of how a cloud native application deals with things like logging, application state, and integration with external systems.

Sometimes it’s enough to refactor and update an existing legacy application with only a handful of these factors in order to get it running on a cloud platform like PCF, gaining the operational benefits of the platform without the large investment of a far-reach modernization effort. Pay specific attention to [externalizing config](https://12factor.net/config), [converting integrations into backing services](https://12factor.net/backing-services), [keeping your processes stateless](https://12factor.net/processes), and [logging to standard input and output](https://12factor.net/logs).


For more info on cloud native apps check out the free ebook [Beyond the 12-Factor App](https://content.pivotal.io/ebooks/beyond-the-12-factor-app), where Kevin Hoffman introduces three additional factors including API-first development, security, and telemetry that weren’t covered in the original set but are often required for apps to run well in the cloud.


#### Homework

- [x] Read about the twelve factors at [https://12factor.net](https://12factor.net/) 

#### Additional resources

- [ ] Read [Beyond the 12-Factor App](https://content.pivotal.io/ebooks/beyond-the-12-factor-app) 

