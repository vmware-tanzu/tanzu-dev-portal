---
type: "tv-episode"
title: "TGI Kubernetes 169: Exploring CSI idempotency and leaky resources"
description: "TGI Kubernetes 169: Exploring CSI idempotency and leaky resources"
episode: "169"
aliases: ["0169"]
publishdate: "2020-04-01T00:00:00-07:00"
date: "2021-10-01 20:00:00"
minutes: 120
youtube: "3LusmXq57Og"
draft: "False"
---

Join xing and jay as we explore how CSI providers and Kubernetes controllers deal with idempotency and resource leaking for volumes and snapshots.

- 00:00:01 welcome to TGIK with xing ! episode 169
- 00:01:00 News of the week
- 00:10:00 CSI controller service RPC
- 00:15:00 CreateVolume should be idempotent, so should most other things
- 00:17:00 Create volume names returns an ID
- 00:24:00 Volume UIDs and handles, AWS, Vsphere
- 00:27:00 DeleteVolume succeeds, even if a volume isnt there
- 00:36:00 AWS EBS csi driver idempotency support and parameter mismatches
- 00:51:00 Demo of deleting PVs, deletion timestamps, vSan leaked storage example