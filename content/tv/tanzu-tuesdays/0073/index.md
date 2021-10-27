---
Date: '2021-11-02T09:00:00-07:00'
Description: "Prod-Like Integration Testing for Distributed Containerized Applications"
aliases:
- /tv/tanzu-tuesdays/73
<<<<<<< HEAD
  draft: false
  episode: '73'
  explicit: 'no'
  guests:
- Cora Iberkleid
- Maria Gabriella Brodi
  hosts:
- Tiffany Jernigan
- Whitney Lee
- Leigh Capili
  lastmod: '2021-11-02'
  minutes: 60
  title: "Prod-Like Integration Testing for Distributed Containerized Applications"
  truncate: ''
  twitch: vmwaretanzu
  youtube: ""
  type: tv-episode
=======
draft: true
episode: '73'
explicit: 'no'
guests:
- Cora Iberkleid
- Maria Gabriella (Gabry) Brodi
hosts:
- Tiffany Jernigan
- Whitney Lee
- Leigh Capili
lastmod: '2021-11-02'
minutes: 60
title: "Prod-Like Integration Testing for Distributed Containerized Applications"
truncate: ''
twitch: vmwaretanzu
youtube: ""
type: tv-episode
>>>>>>> bfc276c0 (Add text for 0073)
---

Integration testing for distributed containerized applications poses new challenges in terms of practices, tools, and environments for developers who want to carry out more prod-like integration testing earlier in the development lifecycle.  In-memory databases are useful but cannot provide the level of assurance needed as you test against a real database. This option is also limited to data services, but not all services provide an in-memory alternative. Testcontainers is a framework for instantiating standalone containers for any number of services to test against. The framework offers some out-of-the-box options, but you can also provide your own image, and even your own Dockerfile to instantiate the service of your choice. In this talk, we’ll explore testcontainers and push the boundaries in order to explore how they may be used in conjunction with Cloud Native Buildpacks. This approach has the added benefit of ensuring that all testing is carried out on the same container stack.