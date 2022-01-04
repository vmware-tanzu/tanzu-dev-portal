---
date: 2020-06-23
description: A look at how the two commands expands Git's vocabulary to specifically
  deal with a single aspect of the repository.
featured: false
lastmod: '2020-09-17'
tags:
- Git
team:
- Ray Chuan Tay
title: 'Git Switch and Restore: an Improved User Experience'
---

If you're like me and you've worked with Git for some time, you might have a couple of commands committed to your memory—from `git commit` for recording your changes, to `git log` for sensing "where" you are.

I have found `git checkout` to be a command that I reach for pretty frequently, as it performs more than one operation. But a single command doing more than one thing might produce a suboptimal user experience for someone learning Git. I can almost picture an [XKCD](http://xkcd.com) strip:

> Learner: What do I run to change the branch I'm on?<br>
> You: Use `git checkout <branch>`.<br>
> Learner: What can I run to discard changes to a file?<br>
> You: Use...`git checkout <file>`.<br>
> Learner: OK...

Even if you have the commands memorized, there have likely been times when you had to pause after typing a `git checkout` command while you tried to match it with the operation you had in mind (e.g., "I just typed git checkout ... to do X, but I thought git checkout does Y, does this really do what I want?")

Let's take a look at what `git checkout` can do, and an alternative (or two) that can make for a friendlier user experience in Git.

### Quick, what does `git checkout` do?

Perhaps you were trying something out and made some changes to the files in your local Git repository, and you now want to discard those changes. You can do so by calling `git checkout` with one file path or more:

```bash
$ git checkout app.js
```

The above sets the specified files paths to their content [^content-trees] in the **_index_**. If instead you'd like to set the files to their content in a **_tree_**, like a branch or a commit, specify it before the file paths. If it happens that the branch shares a name with the file, pass the `--` to separate the two. [^checkout-overwrites-index]

```bash
$ git checkout wip app.js
$ git checkout wip -- app.js
```

In other words, `git checkout <filepath>` sets `<filepath>` to its contents in the index; if `<tree>` is provided, `git checkout <tree> <filepath>` sets `<filepath>` to its contents in `<tree>`.

[^checkout-overwrites-index]: Note that the changes will be staged after running the command - or to use Git parlance, the index is overwritten.
[^content-trees]: I used "contents of files", when it is more accurate to talk about the "working tree" as something separate from the index. The ["Three Trees" section](https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified#_the_three_trees) of the freely available Pro Git book explains what they are (with diagrams!)

### Branches

Say you want to return to a branch that you had been working on previously—`wip`. You can run the below to set it to be the branch you're on and "checkout" [^old-checkout-desc] its files:

```bash
$ git checkout wip
```

You might have encountered:

```bash
$ git checkout -
```

This checks out the last branch you were on, much like how `cd -` in your shell changes you back to the last directory you were in.

[^old-checkout-desc]: That the `git checkout` command does a "checkout" of branches or files was in fact the description used in its documentation in earlier versions of Git, like in [v1.7.0](https://github.com/git/git/blob/v1.7.0/Documentation/git-checkout.txt).

Let's add that our list of what `git checkout` does:

- When given a file path, `git checkout <filepath>` sets `<filepath>` to its contents in the index; if `<tree>` is provided, `git checkout <tree> <filepath>` sets `<filepath>` to its contents in `<tree>`.
- When given a branch, `git checkout <branch>` sets the branch we're on to `<branch>`.

However, instead of saying "setting the branch we're on," it's more accurate to say that `git checkout` sets `HEAD` to point to `<branch>`. As the concept of `HEAD` is pretty important, let's take a look at what `HEAD` is before continuing our exploration of `git checkout`.

### What is HEAD?

One of Git's roles is to track content, and it helps us to know what changes we have. But how does Git determine when a file has changed?

`HEAD` plays a role in this. By setting `HEAD` to, for example, a branch, as in the second operation we looked at, Git would report changes by comparing it against the contents of the branch that `HEAD` points to [^head-simple]. Both `HEAD` and the branch would reference the same commit.

![Commit history illustration with HEAD and branches](images/HEAD-diagram.svg#diagram)

[^head-simple]: When determining what has changed, `HEAD` isn't the only factor—it depends on how you ask Git for changes. For example, `git diff` uses the index as the point of comparison, so even if your files didn't match their content in `HEAD` but had been staged, you'd get an empty output. It's also important to note that Git doesn't deal with changes or deltas; each commit is a complete snapshot of your files.

### Detached HEAD

In addition to setting `HEAD` to point to a named branch, you can also point it to a commit, which brings us to another `git checkout` operation. For example, let's say you see a page to be laid out weirdly, even though you remember it being pixel-perfect when you last worked on it about a week ago, with commit `f7884`. To confirm your hypothesis, you can explore your project's state as-of commit `f7884` and set the contents of the files in your Git repository correspondingly via:

```bash
$ git checkout f7884
```

Apart from setting the contents of your files, it also sets `HEAD` to point to the commit `f7884`, unlike a branch in the second operation we looked at:

![Commit history illustration in detached HEAD state](images/detached-HEAD.svg#diagram)

This is known as a _detached HEAD_ state. (In fact, you can perform the equivalent operation by invoking `git checkout` with the `--detach` argument). If you were to make a new commit while in this state, `HEAD` would advance accordingly, but these commits would not be reachable through the usual Git references, like branches and tags. For example, if you were in this state and made a new commit to add padding to a header, here's what your Git history would look like:

![Commit history illustration of new commits in detached HEAD state](images/detached-HEAD-commit.svg#diagram)

If you were to switch away to another branch, and not point a reference to your new commit, there is a chance your new commit will be lost through garbage collection. [^git-checkout]

[^git-checkout]: The [detached HEAD](https://git-scm.com/docs/git-checkout#_detached_head) section of the `git checkout` documentation gives some commands you can use to "recover" from this situation.

### An alternative (or two)

Phew, there are quite a few things that `git checkout` can do!

- When given a file path, `git checkout <filepath>` sets `<filepath>` to its contents in the index; if `<tree>` is provided, `git checkout <tree> <filepath>` sets `<filepath>` to its contents in `<tree>`.
- When given a branch, `git checkout <branch>` sets `HEAD` to point to `<branch>`.
- When given a commit, `git checkout <commit>` sets `HEAD` to point to `<commit>`.

That's not all it can do; there are other possible variations through its long/short options, perhaps as a result of Git's growth from its open source contributors.[^git-growth] But generally, we see that `git checkout` deals with two aspects of the Git repository:

<ol type="A">
  <li>Changing <code>HEAD</code> to point to a branch or a commit, and</li>
  <li>Setting the contents of files.</li>
</ol>

Granted, these aspects are intertwined, with B being a corollary of A. For example, if you were switching a branch (aspect A), you'd probably also want Git to set the content of your files to reflect their state in the branch you were switching to (aspect B). But the business of changing the contents of files while leaving `HEAD` unchanged, like in [the first operation](#quick-what-does-git-checkout-do), does come across as distinct from [the second](#branches) and [the third](#detached-head), where `HEAD` gets changed to point to something else, like a branch or a commit. Having a Git command for "setting the contents of files" and a separate command for "changing `HEAD`" would make for a better user experience, both to someone new to Git looking for a rule of thumb ("for X operation, use command X"), and to an experienced user of Git ("&lt;types command X from heart and reads it&gt;—yup, reads like what I want to do").

Enter `git restore` and `git switch`.

![https://giphy.com/gifs/drone-cut-satisfy-Eeqkz0EAtAdvq](images/banana-slice.gif)

Now let's run through the three operations again to see how these two commands are used.

[^git-growth]:
    In a [2011 interview on Geek Time](https://www.youtube.com/watch?v=qs_xS1Y6nGc&t=12m48s) by the Google Open Source Programs Office, Junio C Hamano, the maintainer of Git, responds to the criticism that Git is hard to use:

    "Another thing is because the system wasn’t really designed, but grew organically. So somebody came up with an idea of doing one thing. 'Oh, this is a good idea, a good feature; let’s add it to this command as this option name'. And the option name he chooses just gets stuck, but after a few months, somebody else notices, 'Oh, this is a similar mode of operation with that existing command.'"

    (This author bears **some** blame for expanding the plethora of options `git checkout` takes, having [contributed the `-B` option](https://github.com/git/git/commit/02ac98374eefbe4a46d4b53a8a78057ad8ad39b7), the "forced" counterpart to `git checkout -b <branch>`.)

    A summary of the interview can be found on the [Google Open Source blog](https://opensource.googleblog.com/2011/03/geek-time-with-junio-c-hamano.html). ([Via an InfoQ post also on the introduction of git switch and restore](https://www.infoq.com/news/2019/08/git-2-23-switch-restore/).)

1. _When given a file path, `git checkout <filepath>` sets one or more `<filepath>` to its contents in the index._

   Use `git restore` to set the contents of files, but not to change what `HEAD` points to:

   ```bash
   $ git restore <filepath>
   ```

   As a mnemonic, think back to our example - we wanted to _restore_ the contents of `<filepath>` to the index and discard changes to those files.

   For the variation where we'd set the files to their content in a tree (`git checkout <tree> <filepath>`), use the `--source` argument to `git restore`:

   ```bash
   $ git restore --source <tree> <filepath>
   ```

2. _When given a branch, `git checkout <branch>` sets `HEAD` to point to `<branch>`._

   Use `git switch` to set `HEAD` to point to a branch:

   ```bash
   $ git switch <filepath>
   ```

   A useful mnemonic would be to think that we are **_switching_** to a branch.

3. _When given a commit, `git checkout <commit>` sets `HEAD` to point to `<commit>`._

   Similarly use `git switch`, but you have to specify `--detach`. This helps to call out that you are putting your repository in detached `HEAD` state.

```bash
$ git switch --detach <commit>
```

### Sign me up - where can I use them?

Both `git switch` and `git restore` were introduced in Git v2.23 [released in August 2019](https://github.com/git/git/blob/master/Documentation/RelNotes/2.23.0.txt#L61), so you should be able to use them on a machine with an up-to-date installation of Git, without having to install an additional piece of software. Indeed, you may already have encountered references to `git switch` and `git restore` in the documentation for `git checkout`, and in the advice printed by Git when entering detached `HEAD` state, among others.

### A Rosetta Stone

To help you get started with `git switch` and `git restore`, here's a mapping from a `git checkout` invocation you may already be using in your daily workflow to a `git switch` or `git restore` invocation:

| git checkout                                                            | Change HEAD to: | Which files are changed?     | git switch/restore                       |
| ----------------------------------------------------------------------- | --------------- | ---------------------------- | ---------------------------------------- |
| `git checkout <filepath>`<br>`git checkout -- <filepath>`               | no change       | Files listed in `<filepath>` | `git restore <filepath>`                 |
| `git checkout <tree> <filepath>`<br>`git checkout <tree> -- <filepath>` | no change       | Files listed in `<filepath>` | `git restore --source <tree> <filepath>` |
| `git checkout <branch>`                                                 | `<branch>`      | All files in repo            | `git switch <branch>`                    |
| `git checkout <commit>`<br>`git checkout --detach <commit>`             | `<commit>`      | All files in repo            | `git switch --detach <commit>`           |

### #12SwitchRestoresSansCheckOuts Challenge

Here's my challenge to you: start using `git switch` and `git restore`! To make things fun, once you've used them 12 times or more, post a screenshot as proof with the tag [#12SwitchRestoresSansCheckOuts](https://twitter.com/search?q=%2333SwitchRestoresSansCheckOuts). Here's [my take on it](https://twitter.com/rctay/status/1275486248333795328).

If you've feedback on these commands, feel free to drop an email to the Git mailing list where development happens; see [this note](https://github.com/git/git/blob/todo/MaintNotes) for details.

I hope this improved user experience will be a part of your daily workflow—better yet, of your muscle memory.

*Many thanks to [Dave Barnes](https://github.com/davebarnes97) and [Liza](https://github.com/lizanys) for reading early versions of this post!*

### Further reading

- The [documentation page](https://git-scm.com/docs/git-checkout) for `git checkout` has a full list of the options it takes; it's also where [detached HEAD](https://git-scm.com/docs/git-checkout#_detached_head) is explained.
- The Github blog covers this same topic their [Highlights from Git 2.23](https://github.blog/2019-08-16-highlights-from-git-2-23/) post.

### Endnotes