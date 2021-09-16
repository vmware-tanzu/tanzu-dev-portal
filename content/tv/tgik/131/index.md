---
aliases:
- '0131'
date: '2020-09-11 20:00:00'
description: 'TGI Kubernetes 131: No mo'' yolo with Validating Admission Controllers'
draft: 'False'
episode: '131'
lastmod: '2020-10-02'
minutes: 120
publishdate: '2020-04-01T00:00:00-07:00'
title: 'TGI Kubernetes 131: No mo'' yolo with Validating Admission Controllers'
type: tv-episode
youtube: RVDK0m2XQeg
---

Join Cora Iberkleid and Paul Czarkowski in creating a ValidatingAdmissionWebhook controller to understand the basics of using Kubernetes webhooks and custom admission controllers to improve governance over the resources in your cluster.


Admission controllers act as gatekeepers that intercept requests to the Kubernetes API. They can accept, reject, or change a request, thereby ensuring that resources meet any criteria you need to enforce. Want to make sure containers have the right resource limits? The LimitRanger admission controller is your friend.  Need to inject config into pods? Look no further than the PodPreset admission controller. Want to do something entirely customized? The MutatingAdmissionWebhook and ValidatingAdmissionWebhook admission controllers are here for you. We'll play with this last one in the next session of TGI Kubernetes.


- 00:00:00 - Welcome to TGIK!
- 00:04:27 - Week in Review
- 00:19:50 - What are Admission Controllers?
- 00:30:57 - Validating Admission Controller webhook
- 01:14:29 - Mutating Admission Controller webhook


Episode GitHub URL: https://github.com/vmware-tanzu/tgik/tree/master/episodes/131