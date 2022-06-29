---
type: "tv-episode"
title: "Tanzu Talk: What is DevSecOps? Part One: A Secure Software Supply Chain"
description: "Tanzu Talk: What is DevSecOps? Part One: A Secure Software Supply Chain"
episode: "134"
aliases: ["0134"]
publishdate: "2020-04-01T00:00:00-07:00"
date: "2022-05-24 11:50:29"
minutes: 120
youtube: "0fRYNaeGW_k"
draft: "False"
---

Read about the other two parts, and more details here: https://tanzu.vmware.com/content/blog/devops-vs-devsecops?utm_campaign=devrel&utm_source=cote&utm_content=VideoSeries01_SSC

I’ve been trying to figure out what exactly the Sec in DevSecOps is for a couple years no, I think I’ve got something. Three things in fact. Keep in mind that DevSecOps isn’t all of security, it’s just a small subset that focuses on the software you write and run.

Anyhow, here’s the first.

A “secure software supply chain.” That’s a fancy word for trusting and validating the code goes into your apps, the builds. This is code your write, other services you use, and nowadays external services you might rely on. Not only that, but the tools that you and your developers use to put together the apps. Source control, collaboration, and project management tools: everything is a target!

To figure out what to do here, chart out every single activity that happens from idea to coding to a person using that feature. What are you doing to secure each step? And pay close attention to the arrows in between the boxes, that’s where a lot gets hidden.

Once you’ve verified this, you’ll need to document it and make sure it obeys the policies you have in place. Most all organizations have their own security policy and also external policy, such as laws and regulations, they need to follow. You’ve got to document it!

There’s more to it, or course. To read what I think DevSecOps, check out my write-up, and look for the other two tiny videos on DevSecOps: https://tanzu.vmware.com/content/blog/devops-vs-devsecops?utm_campaign=devrel&utm_source=cote&utm_content=VideoSeries01_SSC