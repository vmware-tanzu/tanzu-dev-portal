---
date: '2020-08-14'
description: Learn how to install different versions of Python at the same time and
  switch between them with ease using the open-source command line tool Pyenv.
lastmod: '2021-03-07'
linkTitle: Installing Python
metaTitle: How to Install Python
patterns:
- Deployment
tags:
- Python
- Development
team:
- Ben Wilcock
title: 'Python Like A Pro: How to Install Python'
topics:
- Python
oldPath: "/content/guides/python/gs-python-like-a-pro.md"
aliases:
- "/guides/python/gs-python-like-a-pro"
level1: Building Modern Applications
level2: Frameworks and Languages
---

### Why do you need this guide?

As a professional Python developer, you'll be asked to work on a wide variety of projects. The tools you'll use to do that work may need to change on a project-by-project basis. One day you may be maintaining some legacy code written in Python 2; the next day, you may be prototyping in the very latest version of Python 3.

And here lies the problem. The [2019 Python Developers Survey][survey] found that 66% of Python developers get their Python interpreter either from their operating system or from a downloaded installer. For these developers, switching between Python versions is not easy and could result in a broken system.

So in this guide, you'll learn how to install many different versions of Python at the same time and discover how to switch between them with ease.

### Before You Begin

There's a lot of different OS and package management choices out there.  But in the [Python Survey][survey] mentioned earlier, Linux was shown to be the most popular OS. [Ubuntu 20.04][ubuntu] has been chosen as the baseline for this guide because it's the latest LTS of the most popular Linux distribution. Ubuntu is also used in the [Windows Subsystem for Linux][wsl], so it's available to most Windows 10 based developers. On Mac OS, most of the tools shown here can be added via Homebrew.

When following this guide, it helps if you're starting from a clean system. That way, any existing or additional Python installs can't cause issues or confusion as you follow the steps below. If your system isn't clean, try following this guide in a new Ubuntu virtual machine first, just so you know what to expect.

Finally, if you'd prefer to watch a video on this guide, scroll down to the bottom of the page and hit 'play.'

### Installing Python Like A Pro

Having the ability to install and switch between Python versions in seconds --- without affecting your operating system --- will make your job much easier. Fortunately, there's a tool that can help.

[Pyenv][pyenv] is an open-source command-line tool that's easy to install and takes care of the messy business of installing and managing multiple Python versions.

Pyenv lets you:

 - install multiple versions of Python at the same time.
 - change your global version at any time.
 - use different Python versions 'per-project'.
 - override your Python version with an environment variable.
 - search for commands present in multiple versions of Python at once.

Follow the steps below to install the `pyenv` tool on your system.

#### Step 1: Getting Your System Ready

Ubuntu 20.04 ships with version 3.8.2 of Python pre-installed as the 'system' version of Python. You'll want to keep this, but it's helpful to make it respond to all `python` commands. By default, it will only respond to `python3`. To fix this, you can install the `python-is-python3` command like so:

```bash
sudo apt install python-is-python3
```

If you're not using Ubuntu 20.04, your system may already respond to the command `python`.

#### Step 2: Installing Pyenv

Installation is simple. A script in the open-source [pyenv-installer][pyenv-installer] project installs everything you need onto your computer.

```bash
curl https://pyenv.run | bash
```

After the script has run, you'll need to add the following lines to the bottom of your `.bashrc` file. 

```bash
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

> If you're new to Linux, you can do this by opening the Terminal application and typing `nano .bashrc`. Nano uses arrows to navigate, `ctrl-o` to write the changes out, and `ctrl-x` to quit.

Once that's done, close your terminal session (type `exit`) and then open a new terminal. 

Next, we need to add some system libraries so that Pyenv can build Python directly from the Python source code. This list may change from time to time, so always check for the latest advice in the [Pyenv Wiki][pyenv-prereqs].

```bash
sudo apt-get install -y build-essential libssl-dev zlib1g-dev libbz2-dev \
libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev \
xz-utils tk-dev libffi-dev liblzma-dev python-openssl git
```

You can check if your installation is ready with the following command:

```bash
pyenv doctor
```

If this command reports, `"Congratulations! You are ready to build pythons!"` then you're good to go.

#### Step 3: Installing Python 3.8.5

First of all, to see the full list of the available Python versions --- there are a lot --- type the following command.

```bash
pyenv install --list
```

Let's install the very latest version of Python --- which is 3.8.5 --- using the following command:

```bash
pyenv install 3.8.5
```

Pyenv will now download, build, and install the requested version of Python. 

Finally, tell `pyenv` to rehash its list of 'shims' to make sure the new version of Python you just added is ready for use. Shims are the programs `pyenv` uses to redirect your Python calls. Rehashing instructs `pyenv` to install shims for all Python binaries known to `pyenv`.

```bash
pyenv rehash
```


#### Step 4: Switching Between Python Versions

Now that Python 3.8.5 is installed, let's take a look at the Python versions that `pyenv` reports are available for use:

```bash
pyenv versions
```

Your versions list might look something like this:

```bash
* system (set by /home/ben/.pyenv/version)
  3.8.5
```

The `*` next to 'system' tells you that the system version of Python is currently the global default. To change the global default to the 3.8.5 release that you just installed, type:

```bash
pyenv global 3.8.5
```

To check which version of Python your system is now using globally, ask Python for its version number like so:

```bash
python -V
```

The answer should be 'Python 3.8.5.'

To switch back to your system version of Python, you can use the special 'system' keyword like this:

```bash
pyenv global system
```

And that's it. You can now install and switch between many different versions of Python any time you like!

### Keep Learning

To find out more about what pyenv can do for you, check out the [website][pyenv] or try `pyenv --help`. To get help on a specific command type `pyenv <command> --help`.

If you liked this guide, you might find these others in our 'Python Like A Pro' series useful:

- [Managing Python Project Dependencies Like A Pro!][gs-pyenv-venv]
- [Managing Python Global Packages Like A Pro][gs-pipx]
- [Build Python Docker Containers Like A Pro!][gs-cnb]
- [Run Python In Production Like A Pro!][gs-cf]

Here's the video to accompany this guide:

{{< youtube nXbe6Hmb_k0>}}

---
[survey]: https://www.jetbrains.com/lp/python-developers-survey-2019/
[wsl]: https://ubuntu.com/wsl
[ubuntu]: https://ubuntu.com/download/desktop
[sunset]: https://www.python.org/doc/sunset-python-2/
[pyenv]: https://github.com/pyenv/pyenv
[pyenv-installer]: https://github.com/pyenv/pyenv-installer
[pyenv-prereqs]: https://github.com/pyenv/pyenv/wiki/Common-build-problems
[cnb]: /guides/python/cnb-gs-python

[gs-pyenv]: /guides/python/gs-python-like-a-pro
[gs-pyenv-venv]: /guides/python/gs-managing-python-packages
[gs-pipx]: /guides/python/gs-python-installing-global-packages
[gs-cnb]: /guides/python/cnb-gs-python
[gs-cf]: /guides/python/cf-gs