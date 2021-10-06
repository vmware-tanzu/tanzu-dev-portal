---
type: "tv-episode"
title: "{{ video.title | replace('"', '') }}"
description: "{{ video.title | replace('"', '') }}"
episode: "{{ video.episode }}"
aliases: ["{{ '%04d' % (video.episode | int ) }}"]
publishdate: "2020-04-01T00:00:00-07:00"
date: "{{ video.date }}"
minutes: 120
youtube: "{{ video.videoId }}"
draft: "{{ video.draft | default('False') }}"
---

{{ video.description }}
