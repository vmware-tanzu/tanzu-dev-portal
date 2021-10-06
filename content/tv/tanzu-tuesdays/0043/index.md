---
Date: '2021-02-23T13:00:00-08:00'
Description: Modern Application Configuration in Tanzu with Craig Walls
PublishDate: '2020-01-04T00:00:00-07:00'
aliases:
- /tv/tanzu-tuesdays/43
date: '2021-02-22'
draft: false
episode: '43'
explicit: 'no'
guests:
- Craig Walls
hosts:
- Tiffany Jernigan
- Paul Czarkowski
lastmod: '2021-02-24'
title: Modern Application Configuration in Tanzu with Craig Walls
truncate: ''
twitch: vmwaretanzu
type: tv-episode
youtube: dk5hYtZYntc
---

Historically, application configuration has been managed internal to an application deployment, in environment variables, or in files placed in the filesystem of the running application. As applications evolved into microservices, however, that approach become inadequate. Centralized configuration, including application-specific and shared configuration, versioning and rollback capabilities, and auditing became necessary. As more applications and microservices are becoming containerized and deployed in Kubernetes, configuration continues to be challenging. While Kubernetes offers configuration via ConfigMaps and Secrets, there's no clear way to manage the properties going into those resources.  In this Tanzu Tuesday session, we'll explore the Tanzu Configuration Service, a means of managing configuration in a Kubernetes-native way using ConfigMaps, but that also offers the benefits afforded in a centralized configuration option.