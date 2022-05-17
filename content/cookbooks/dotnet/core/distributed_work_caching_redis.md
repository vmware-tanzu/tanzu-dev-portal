+++
date = "2017-01-12T12:35:38-05:00"
title = "Redis Cache in .NET Core"
glyph = "fa-file-text-o"
tags = ["redis", "caching", "distributed", "batch"]
categories = ["recipes"]
summary = "Caching Distributed Work Output with Redis"
taxonomy = ["CLIENT", "DOT_NET"]
+++

When you discovered the need for a way to store data in a way that is cloud-native, distributed, and would work to allow multiple instances of multiple services to share appropriate data without chances of data corruption or collision.

The use of **Redis** as a cache for interim work output is a common pattern in microservice ecosystems. Because of how common this pattern is, we wrote a blog post about it that describes the pattern in general terms. You can find the blog post [on Medium](https://medium.com/@KevinHoffman/caching-distributed-work-output-in-redis-with-asp-net-core-7d77695e6757).
