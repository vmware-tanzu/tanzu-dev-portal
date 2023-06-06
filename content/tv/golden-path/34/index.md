---
Date: '2023-05-25T11:00:00-07:00'
date: '2023-05-25'
Description: Auto-Remediating Code at Scale with Lossless Semantic Tree and Generative AI
title: Auto-Remediating Code at Scale with Lossless Semantic Tree and Generative AI
PublishDate: '2023-04-04T00:00:00-07:00'
episode: '34'
explicit: 'no'
calendar: true
guests:
- Sam Snyder
- Justine Gehring
hosts:
- Cora Iberkleid
twitch: vmwaretanzu
linktwitchyoutubechannels: 'yes'
youtube: UGsfmKUCJzQ
type: tv-episode
---

The software industrial revolution has arrived. Software is now 80% open source and third-party and 20% proprietary code that stitches it together into business-critical applications. We are challenged with the ongoing evolution of increasingly large and diversely composed codebases and ecosystems. Dependencies change frequently and evolve at their own pace. Security vulnerabilities can be introduced at any time by anyone. Not updating regularly leads to critical bugs, performance, and security issues.

In this talk, we’ll address the need for automation—both rules-based and AI-driven—to remediate the unwieldy, assembled codebase. We’ll introduce the Lossless Semantic Tree (LST), a technology leap from the common Abstract Syntax Tree. The LST delivers full fidelity of codebase knowledge that results in 100% accurate style-preserving code transformations. The semantic-based data of the LST is manipulated by rule-based transformation recipes (programs) from OpenRewrite, an open source, automated refactoring tech and ecosystem born at Netflix in 2016. 

We’ll also show you how this system can benefit from the suggestive authorship of generative code AI. We can leverage the OpenAI API to assist with code transformations in OpenRewrite recipes—and we’ll cover the downsides of generative AI for this use. We will also show how OpenAI can be used to process the LST, performing in-code classification problems and providing natural language descriptions of errors.