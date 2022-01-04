---
Date: '2020-05-19T00:00:00-07:00'
Description: A Deep Dive Into Creating Production Ready Containers
Draft: false
PublishDate: '2020-04-01T00:00:00-07:00'
aliases:
- /tv/tanzu-tuesdays/7
date: '2020-06-03'
episode: '7'
explicit: 'no'
guests:
- Cora Iberkleid
hosts:
- Bob Brindley
- Tiffany Jernigan
- Paul Czarkowski
lastmod: '2020-10-09'
title: Creating Production Ready Containers With Cora Iberkleid
truncate: ''
twitch: vmwaretanzu
type: tv-episode
youtube: K6O1iQf9eW4
---

As developers, we’ve become adept at packaging our applications, whether on our local machines or in a CI/CD toolchain, relying on mature tools like Maven, Gradle, npm, pip, Composer, and others. But as Kubernetes becomes the runtime platform of choice, packaging our apps is not quite enough. We must now package all of the dependencies as well, including any middleware, runtime, even the OS, into images - the new unit of deployment. What are some of the ways we can tackle this challenge? What are the advantages of one over the other? In this talk we’ll cover a few different approaches for building images: Dockerfile, Jib, and Paketo. By the end of this session, you’ll understand some of the challenges and considerations and be well positioned to start building images easily and maintain them over time.