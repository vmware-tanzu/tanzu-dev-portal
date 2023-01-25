---
Date: '2023-03-16T11:00:00-08:00'
Description: "Seamlessly Adopt GraalVM Native Image in Your Applications"
PublishDate: '2023-01-18T00:00:00-08:00'
date: '2023-03-16'
episode: '14'
explicit: 'no'
calendar: true
guests:
- Christian Wimmer
hosts:
- DaShaun Carter
lastmod: '2020-10-09'
title: "Seamlessly Adopt GraalVM Native Image in Your Applications"
twitch: vmwaretanzu
linktwitchyoutubechannels: 'yes'
type: tv-episode
---

GraalVM Native Image requires the reachability metadata to determine whether reflectively accessed parts of a program need to be included in the executable. When switching to Spring Native, providing metadata for third-party libraries might require modifications to your application and can lead to errors. In previous versions of Spring and GraalVM, this could be challenging, but don’t worry—we’ve greatly simplified this task.

In this talk, we explain how to make the transition to Spring Native seamless with the tools we developed. First, we show how to write code to make additional metadata for reflective calls unnecessary. Then, we show how the Native Build Tools help you verify the third-party dependencies whose metadata is incomplete and download the missing metadata from the shared metadata repository. Finally, we show how to effortlessly run native tests and maintain the metadata for your application.