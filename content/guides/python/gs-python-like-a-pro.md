---
title:  "Managing Your Python Developer Environment Like A Pro: Installing Python"
featured: true
sortTitle: "Python Like A Pro - Installing Python"
weight: 2
description: "Create a stress free development environment for all your Python projects."
topics:
- Python
tags:
- Python
- Development
patterns:
- Deployment
team:
- Ben Wilcock
---
### Why do you need this guide?

The [2019 Python Developers Survey][survey] found that 66% of Python developers get their Python interpreter either from their operating system or from a downloaded installer. They also found that the vast majority use Python3, but 10% still actively use Python2.

This is fine. [Python 2 is no longer supported][sunset], but many of those still using Python2 will have requirements that they can't satisfy any other way --- such as maintaining legacy code. 

As a professional Python developer, you'll be called upon to work on a wide variety of projects. So successfully juggling old and new versions of Python --- on the same machine, at the same time --- is an important skill to master. 

In this guide, you'll learn which tools help you control your Python development environment, so that it doesn't control you!

### Before You Begin

There's a vast array of different OS and packaging choices out there. In this guide, you'll see how to control a Linux environment. In the [Python Survey][survey], this OS was shown to be the most popular amongst Python Developers. [Ubuntu 20.04 LTS][ubuntu] is used because it's the latest line of the most popular Linux distro and forms the basis of the [Windows Subsystem for Linux][wsl], which is available to most Windows 10 users. On Mac OS, most of the tools shown can be added either directly or via Homebrew.

When following this guide, it helps if you're starting from a fresh Python system. That way, your existing Python installs can't cause issues or confusion as you follow the steps below. If your system isn't clean, try these steps on a new Ubuntu virtual machine first, so you know what to expect.

If you'd prefer to watch a video on this topic, scroll down to the bottom of the page.

### Installing Python Like A Pro

Getting a great Python developer environment will make your life so much easier.

#### What You Should NOT Do

Don't use your 'system' version of Python and don't use the Python installer. For the casual hack, these options are okay, but if you want to do Python 'like a pro,' you should probably avoid these techniques. Neither of them allows you to switch easily between Python versions, and the more Python code you write as your career progresses, the more likely it is that you'll need to switch between versions.

This issue or advice isn't unique to Python, by the way. Java has precisely the same challenges.

#### What You Should Do

Seek out [pyenv][pyenv]. Pyenv is an open-source command-line tool that's easy to install and takes care of the messy business of installing and managing multiple Python versions.

Pyenv lets you:

 - install multiple versions of Python at the same time.
 - change your global version at any time.
 - use different Python versions 'per-project'.
 - override your Python version with an environment variable.
 - search for commands present in multiple versions of Python at once.

#### Step 1: Getting Your System Ready

Ubuntu 20.04 ships with version 3.8.2 of Python pre-installed as the 'system' version of Python. You'll want to keep this, but it's helpful to make it respond to all `python` commands. By default, it will only respond to `python3`. To fix this, you can install the `python-is-python3` command like so:

```bash
sudo apt install python-is-python3`
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

First of all, to see the full list of available Python versions --- there are a lot --- type the following command.

```bash
pyenv versions
```

Let's install the very latest version of Python --- which is 3.8.5 --- using the following command:

```bash
pyenv install 3.8.5
```

Pyenv will now download, build, and install the requested version of Python. To activate this version globally throughout your system type:

```bash
pyenv global 3.8.5
```

#### Step 4: Switching Back To 'System' Python 

To switch back to your system version of Python, you can use the special 'system' keyword to switch back to your default version like this:

```bash
pyenv global system
```

And that's it. You can now install and switch between many different versions of Python like a pro!

### Keep Learning

To find out more about what pyenv can do for you, check out the [website][pyenv] or try `pyenv --help`. To get help on a specific command type `pyenv <command> --help`.

Need to bundle your Python apps into rock-solid professional-grade Docker containers? Try our simple [Python buildpack guide][cnb].

If you prefer a video, you can watch how to install Python like a pro below:

{{< youtube nXbe6Hmb_k0 >}}

---
[survey]: https://www.jetbrains.com/lp/python-developers-survey-2019/
[wsl]: https://ubuntu.com/wsl
[ubuntu]: https://ubuntu.com/download/desktop
[sunset]: https://www.python.org/doc/sunset-python-2/
[pyenv]: https://github.com/pyenv/pyenv
[pyenv-installer]: https://github.com/pyenv/pyenv-installer
[pyenv-prereqs]: https://github.com/pyenv/pyenv/wiki/Common-build-problems