---
date: 2020-08-19
description: Writing your commit messages first keeps you and your pair focused between
  the feature you are currently trying to implement and whatever current change you
  are making that could be a smaller, more atomic pushable commit.
featured: false
lastmod: '2020-09-17'
tags:
- Git
team:
- Eric Tsiliacos
title: How — and Why — to Write Commit Messages First
---

You’re halfway through delivering your feature and you decide to take a look at your diff. Doing so gives you a sinking feeling in your stomach, because you see a lot more changes than you were expecting, some of which were refactorings, like renames or structural changes you wish were separated into their own commits. Teasing apart these smaller commits can be messy and would take too much effort at this point. But if you’d tried to preemptively break them apart at random, you’d have run the risk of overengineering your work or creating unnecessary changes.

Writing commit messages first can help pairs navigate between feature delivery and what could be smaller, more atomic commits. It’s analogous to working from “stories” off a backlog or trying to get the next failing test to pass. If you or your pair gets lost in the weeds, pointing back to the story provides a direct and egoless way to get back on track. In test-driven development, pairs stay focused by thinking about small, incremental, falsifiable functionality one failing test at a time. Writing commit messages first can help pairs articulate the space between a feature story and individual tests. 

## How to Write Commit Messages First

You can use a command line tool such as [Stacker](https://github.com/ericTsiliacos/stacker) to keep track of your commit messages, or simply use pencil and paper. The first commit message is easy to write and provides a frictionless start. A lot of thought usually goes into the title or description of a story, so it provides the perfect level of abstraction to communicate the overall “why” for the actual changes needed to deliver the feature. Write down the commit message before changing any code, and work from the assumption that all necessary changes will be committed with this message. When you come across a piece of code that, for example, needs structural changes to make your feature possible, stash or delete your current changes. Then write down the commit message that describes the change you wish was already present so that you can [“make the change easy... then make the easy change.”](https://twitter.com/KentBeck/status/250733358307500032) The new commit message is causally related to the original commit message in the sense that by working from the original commit message, we naturally discover a smaller commit.

Recursively repeat this process with the new commit message as your latest goal until you arrive at work you can commit using the message you wrote beforehand. Unwind to the previously recorded commit message as the next goal until you arrive at delivering the original feature, but now with the minimal necessary changes. Let’s sketch out a short example:

We pick up a story from the top of our backlog that asks us to show the user relevant data. We record our commit message first:  

> “Display relevant data to the user.”

As we attempt to figure out where we should make our changes, we find ourselves in a legacy application missing many tests. We then discover a file named apiClient.js, the responsibility of which is to know where and how to fetch data to be displayed to the user. It would appear that our changes would include swapping out the URL path in order to fetch the relevant data.

```javascript
import get from “http”;

export default () = ({
	execute: async () => 
	{
	    const data = await get(“/path/to/irrelevant/data”);
		// ...
	}
});
```

In order to effectively make changes to this code, we’ll need to back it with tests. So we put aside our current task and write a new commit message that reflects the desired state of the code.

> “Backfill apiClient.js missing tests.”

As we attempt to write unit tests, we find that it’s difficult due to the statically imported HTTP client. We decide that the production code would benefit from having the HTTP client parameterized, so we stash our changes and write down the following new commit message:

> “Parameterize http client from client.js.”

At this point, our commit messages would look something like:

```
parameterize http client from client.js
 └─┬ backfill apiClient.js missing tests
   └─┬ display relevant data to the user
```

We are able to complete our latest goal using an IDE shortcut, commit using the recorded message, and push the commit independently of our other work. We pick up from the previous commit message and repeat this process until we’ve finished our feature.

## Why to Write Commit Messages First

Conceptually, we’ve articulated a slimmed-down version of the [“Mikado Method”](http://mikadomethod.info/) or [“Git Stash-Driven Development,”](https://dzone.com/articles/git-stash-driven-development) but what’s important to understand are the affordances of writing our commit messages first. They’re important because, at any moment, you or your pair can take a step back and ask “why” your changes are relevant by looking at the previously recorded commit message, and “what” is needed from the current commit message. It keeps you and your pair accountable. In particular, it forces you to ask whether the current changes really reflect the commit message that you’ve written. When we write our commit messages after our changes, we often mix in work that isn’t relevant to the commit message or we begin to find it difficult to describe our changes. 

We can use the concepts of cohesion and coupling to help us determine whether or not we currently have a pushable commit or if we should wait for subsequent commits to squash into a single one. A revertible commit exhibits higher cohesion. If reverting to the currently unpushed commit would leave dead code, failing tests, a broken application, or an unreleasable product, then the set of changes do not form a unified whole relative to the rest of the application. The smallest unit of change should be able to stand on its own. A pickable commit, meanwhile, exhibits lower coupling. We need to determine if the commit can be cherry-picked without needing other commits to come along with it that aren’t already pushed. We want to be able to decompose our changes in such a way as to make them shareable. 

Writing our commit messages first while also thinking about their relative cohesion, and coupling via revertibility and pickability, provides us with a framework for how to think about commit decomposition.