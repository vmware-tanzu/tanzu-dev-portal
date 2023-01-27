---
Date: '2023-03-02T11:00:00-08:00'
Description: "Why You Don't Need to Worry About Scaling Your Spring Web App"
PublishDate: '2023-01-18T00:00:00-08:00'
date: '2023-03-02'
episode: '10'
explicit: 'no'
calendar: true
guests:
- Marco Behler
hosts:
- Cora Iberkleid
lastmod: '2020-10-09'
title: "Why You Don't Need to Worry About Scaling Your Spring Web App"
twitch: vmwaretanzu
linktwitchyoutubechannels: 'yes'
type: tv-episode
---

When writing a new Spring web app, teams often have some nagging scaling doubts:
<ul>
<li>How many users can my app simultaneously handle?</li>
<li>How fast will my @RestControllers dash out those JSON responses?</li>
<li>How much memory, CPU, or I/O does my application need?</li> 
<li>How much money do I need to spend on hosting?</li>
</ul>
Surprisingly, there's very little advice out there on how to sensibly approach these questions in a practical way—apart from simply autoscaling random Kubernetes pods into oblivion. 
 
In this #almostnoslides session, we're going to use an IDE, a pen tablet, and a few libraries to get a deep, practical understanding of the following:
<ul>
<li>Throughput and latency: How to (reliably) find out how many users your Spring app can handle</li>
<li>CPU/memory/IO: How much (or how little) your app actually needs</li>
<li>Hosting: What server your app needs</li>
</ul>

By the end of this talk, you'll have learned solid load-testing processes and skills that make you never worry about scaling your Spring web apps again.
