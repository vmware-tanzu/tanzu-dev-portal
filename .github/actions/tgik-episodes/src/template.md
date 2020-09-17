---
type: "tv-episode"
title: "{{ video.title }}"
description: "{{ video.title }}"
episode: "{{ video.episode }}"
aliases: ["/{{ video.episode }}"]
publishdate: "2020-04-01T00:00:00-07:00"
date: "{{ video.date }}"
minutes: 120
episode_banner: "{{ video.image }}"
episode_image: "{{ video.image }}"
images: ["{{ video.image }}"]
youtube: "{{ video.videoId }}"
---

{{ video.description }}