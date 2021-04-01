---
dev_practice: true
title: "Switch Drivers"
description: "Seamless Remote Pairing with Switch-Drivers and Cuckoo"
lastmod: 2021-01-13T13:13:09-05:00
draft: false
tags: ["Delivery", "Developer", "Pair Programming", "Remote", "Tools"]
image: "default-cover-dev.jpg"
length: "As needed"
---
Created by: [Dmitriy Dubson](https://www.linkedin.com/in/ddubson1/)

Written by: [Dmitriy Dubson](https://www.linkedin.com/in/ddubson1/) & [Erica Dohring](https://www.linkedin.com/in/erica-dohring-11ba0937/)

## Problem This Solves

- Switching drivers has friction (social and # steps)
- Remote driving on your pair's machine is laggy

Remote controlling during remote pairing can be frustrating at times. There is often substaintial lag when the internet 
is slow and unstable. It can be socially awkward to ask to switch if your pair seems in the zone and the switching 
process sometimes takes a lot of manual steps. The switch-drivers script below combined with the timer removes the 
need to wonder when it's time to switch and reduces all manual steps in switching

## Solution

[Switch Driver's script](https://github.com/ddubson/.scripts/blob/main/switch-drivers.md)

This script allows the driver to quickly and easily to hand off the current code off to their remote pair. The script internally...

1. Saves the current git diff into a work-in-progress (WIP) commit
1. Provides the driver the git command that they can hand off to the navigator to quickly get the latest code and continue driving.

This script prevents you from pushing to your main or master.

Pairs excellently with [Cuckoo Timer](https://cuckoo.team/). We like to swap every ~15 minutes.

### Pros

- You get to use your own machine setup when it's your turn to drive (yay, shortcuts)
- Less likely to slip into bystander mode, consistently engaged

### Cons

- Lots of WIP commits. Might not play nicely with pre-commit hooks (you might be able to tweak the script and override 
  this, but extra work)

## Resources
- [Lighting Talk](https://vmware.zoom.us/rec/share/x9FuT1gz8N2tUn2lv5jgFgAaLYXGJbBahSNdcQuz5QpUt3PLDX6g2sZXQEpQFzr1.XTri1uEa6QGLtqXi)
PW=6%fz6=M1
