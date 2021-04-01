---
dev_practice: true
title: "Simplifying Your Release Process with ShipIt"
description: "Simplifying Your Release Process with ShipIt"
lastmod: 2021-02-04T15:41:33-05:00
draft: false
tags: ["Delivery", "Developer", "CI/CD", "Tools"]
image: "default-cover-dev.jpg"
length: "As needed"
---
Created by: VMware alumni [Walter Scarborough](https://www.linkedin.com/in/walter-scarborough-6b039049/)
and [Anne LoVerso](https://www.linkedin.com/in/anneloverso/)

Written by: [Dmitriy Dubson](https://www.linkedin.com/in/ddubson1/) & [Erica Dohring](https://www.linkedin.com/in/erica-dohring-11ba0937/)

## Problem this solves

As a project grows it scope, it's something hard to remember all the agreed upon pre-push
steps like linting, running all tests, checking for compilation errors, etc. Shipit simplifies
this cognitive load for new and existing developers by centralizing all your steps in 1, easy to
reference spot.

_Caveat_: we've typically seen this work best with a team that is <=5 pairs and
doing [trunk-based development](https://trunkbaseddevelopment.com/) in a single codebase.
Other solutions may be a better fit if this doesn't sound
like your team.

## Solution

The following is a template based on a technical stack using NodeJS, ESLint

```bash
#!/usr/bin/env bash

set -e

# Navigate to the root of the working git repo
cd $(git rev-parse --show-toplevel)

# Run linter
npm run lint --fix

# check if any uncommited changes are present
changed_files=$(git status --porcelain | wc -l)
if [ $changed_files -ne 0 ]; then
  git status
  echo
  echo "^^^YOU GOT SOME UNCOMMITTED CHANGES IN 'ERE"
  echo
  exit 1
fi

function print_success {
  echo "Shipped it!"                                                                   
}

# build, run tests, git push, and print success statement
npm run build && npm run test && git push && print_success
```

### Pros

- You only have to remember 1 encapsulated step rather than many
- Makes onboarding cognitively overwhelming


### Cons
- This script can start to get slow, making folks less likely to use it. Possible solutions include experimenting with
  a pull request model > trunk-based development, parallelizing the script, or increasing the speed of your current steps.


## Read More
- VMware Alumni Anne's [Original Blog Post](https://medium.com/@AnneLoVerso/ship-it-a-humble-script-for-low-risk-deployment-1b8ba99994f7)
- See [a sample of Shipit in the wild](https://github.com/newjersey/d4ad/blob/master/scripts/ship-it.sh) from Anne LoVerso's open source, living, breathing codebase here