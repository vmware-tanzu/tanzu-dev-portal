---
type: "tv-episode"
title: "{{ video.title }}"
description: "{{ video.title }}"
episode: "{{ video.episode }}"
aliases: ["/{{ video.episode }}"]
publishdate: "2020-04-01T00:00:00-07:00"
date: "{{ video.publishDate }}"
episode_image: "{{ video.image }}"
images: ["{{ video.image }}"]
youtube: "{{ video.videoId }}"
live: "{{video.live}}"
---

{{ video.description }}