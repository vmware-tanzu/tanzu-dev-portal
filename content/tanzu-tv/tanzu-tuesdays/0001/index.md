+++
Type = "tanzu-tv"
Show = "tanzu-tuesdays"
Description = "The threads are revolting! viva la reactive revolution!"
aliases = ["/0001"]
author = "paulczar"
hosts = ["bob","tiffany","paulczar"]
guests = ["joshlong"]
Date = "2020-04-07"
PublishDate = "2020-04-07"
episode = "0001"
# 320x180 for image / banner
# wget -O content/episode/0001/youtube.jpg https://img.youtube.com/vi/DMBdPJNOpSk/mqdefault.jpg
episode_image = "tanzu-tv/tanzu-tuesdays/0001/youtube.jpg"
episode_banner = "tanzu-tv/tanzu-tuesdays/0001/youtube.jpg"
explicit = "no"
images = ["tanzu-tv/tanzu-tuesdays/0001/episode.jpg"]
title = "Reactive Revolution with Josh Long"
youtube = "DMBdPJNOpSk"
truncate = ""
twitch = "makejarnotwar"

+++

Microservices and big-data increasingly confront us with the limitations of traditional input/output. In traditional IO, work that is IO-bound dominates threads. This wouldn’t be such a big deal if we could add more threads cheaply, but threads are expensive on the JVM, and most other platforms. Even if threads were cheap and infinitely scalable, we’d still be confronted with the faulty nature of networks. Things break, and they often do so in subtle, but non-exceptional ways. Traditional approaches to integration bury the faulty nature of networks behind overly simplifying abstractions. We need something better.

Spring Framework 5 is here ! It introduces the Spring developer to a growing world of support for reactive programming across the Spring portfolio, starting with a new Netty-based web runtime, component model and module called Spring WebFlux, and then continuing to Spring Data Kay, Spring Security 5.0, Spring Boot 2.0 and Spring Cloud Finchley. Sure, it sounds like a lot, but don’t worry! Join me, your guide, Spring developer advocate Josh Long, and we’ll explore the wacky, wonderful world of Reactive Spring together.