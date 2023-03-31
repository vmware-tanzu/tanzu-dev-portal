---
Date: '2023-03-31T08:00:00-07:00'
Description: "Software Defined Cloud Dev Environments with the Devfile"
PublishDate: '2023-03-31T00:00:00-07:00'
date: '2023-03-31'
episode: '41'
explicit: 'no'
guests:
- Mario Loriedo
hosts:
- Whitney Lee
youtube: "eGFdEXw9eLE"
lastmod: '2020-10-09'
title: "Software Defined Cloud Dev Environments with the Devfile"
twitch: vmwaretanzu
type: tv-episode
---

The Devfile is a specification that allows users to declaratively include the development environment information as part of their application. Devfiles can be used to automate and simplify the development process. This can be done by adopting existing devfiles that are available in the public community registry, or by authoring your own devfiles to record custom instructions for how to configure and run your development environment.

It is in the best interest of developers that the industry starts to settle on a unified dev environment configuration format. Currently, vendors of remote cloud-based development environment solutions such as GitHub Codespaces and GitPod are building proprietary solutions for hosting and operating development environments using a similar, yet slightly different environment configuration file (devcontainer.json and gitpod.yaml). A big challenge for the Devfile is to ensure that it doesn't become "yet another configuration file". Instead, we want it to relate and align with any neighboring configuration files used for CI/CD runs or infrastructure provisioning. A Devfile should be able to give developers an inner dev loop that is in sync with the outer dev loop, yet still provide enough flexibility for developers to experiment and have personal tooling preferences.

\\(^-^)/
