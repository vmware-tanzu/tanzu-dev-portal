---
title: Event Streaming
linkTitle: Event Streaming
weight: 8
topic: Event Streaming
icon: streaming
description: >
    Event streaming enables services to simply emit “events” that are open for any interested services to consume.
menu:
    main:
        parent: "topics"
        weight: 8
---

Event streaming can be thought of as flipping the flow of requests in the opposite direction. Instead of a standard call-response cadence to communicate with each other, services simply emit an “event”—any significant change-of-state—that is open for any interested services to consume. Some frameworks like [Spring Cloud Stream](/guides/event-streaming/scs-what-is/) ease the integration with these messaging services.