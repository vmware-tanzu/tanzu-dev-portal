---
Date: '2022-04-07T18:00:00-07:00'
Description: "Pilot"
aliases:
- /tv/cloud-native-crew/1
draft: false
episode: '1'
explicit: 'no'
guests:
- Rob Rose
hosts:
- Cora Iberkleid
- DaShaun Carter
- Josh Long
lastmod: '2022-4-19'
minutes: 60
title: "Pilot"
truncate: ''
twitch: vmwaretanzu
youtube: "PzFp7_6heaY"
type: tv-episode
---

Integration testing for distributed containerized applications poses new challenges in terms of practices, tools, and environments for developers who want to carry out more prod-like integration testing earlier in the development lifecycle.  In-memory databases are useful but cannot provide the level of assurance needed as you test against a real database. This option is also limited to data services, but not all services provide an in-memory alternative. Testcontainers is a framework for instantiating standalone containers for any number of services to test against. The framework offers some out-of-the-box options, but you can also provide your own image, and even your own Dockerfile to instantiate the service of your choice. In this talk, we’ll explore testcontainers and push the boundaries in order to explore how they may be used in conjunction with Cloud Native Buildpacks. This approach has the added benefit of ensuring that all testing is carried out on the same container stack.