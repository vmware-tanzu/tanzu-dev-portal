---
type: "tv-episode"
Description: "Spring Boot loves Tanzu Observability with Madhura Bhave & Stéphane Nicoll"
aliases: ["/tv/tanzu-tuesdays/57"]
hosts: ["Tiffany Jernigan"]
guests: ["Madhura Bhave","Stéphane Nicoll"]
Date: "2021-06-15T12:00:00-07:00"
PublishDate: "2020-01-04T00:00:00-07:00"
minutes: 60
episode: "57"
explicit: "no"
title: "Spring Boot loves Tanzu Observability with Madhura Bhave & Stéphane Nicoll"
youtube: "ay8UaYOOmCQ"
truncate: ""
twitch: "vmwaretanzu"
draft: false

---

As application developers we spend a lot of time thinking of ways to improve the efficiency of our web application. We could completely rewrite it, leverage more concurrency and even add reactive features. But how do we know if it is more efficient if we don't measure and track relevant metrics? Once the application is pushed to production, we might also need to monitor the status of external services that the application relies on. For easy consumption of such metrics, being able to visualize them on a dashboard may make understanding the application behavior easier. In this talk, we will cover how metrics collected by a Spring Boot application can be sent to Tanzu Observability (Wavefront) using the Wavefront Spring Boot starter. Using a WebFlux demo application, we will go over out-of-the-box metrics, add custom metrics and look at how a slow remote service can be detected. We will also look at sending trace data to Wavefront.