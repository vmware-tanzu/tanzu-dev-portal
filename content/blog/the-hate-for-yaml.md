---
date: 2021-01-19
description: YAML gets a lot of hate, but is it more nuanced than that?
lastmod: '2021-05-19'
patterns:
- Deployment
tags:
- Kubernetes
- API
- Development
team:
- Brian McClain
title: 'The Hate for YAML: The Hammer or the Nail?'
weight: 1
---

Those four letters that strike dread in the hearts of every Kubernetes user. That short acronym that pierces like a knife in the dark. The aura of terror that follows it, enveloping everyone and everything as its reach seems to grow to the ends of time itself.

YAML.

Alright, maybe that’s a bit dramatic, but there’s no doubt that YAML has developed a reputation for being a pain, namely due to the combination of semantics and empty space that gets deserialized to typed values by a library that you hope follows the same logic as others. This has fostered frustration among developers and operators no matter what the context. But is the issue as simple as “YAML is a pain”? Or is it a bit more nuanced than that?

Last year, at [Software Circus: Nightmares on Cloud Street](https://www.softwarecircus.io/), [Joe Beda](https://twitter.com/jbeda) gave a talk on this very subject titled [I’m Sorry About The YAML](https://www.youtube.com/watch?v=8PpgqEqkQWA). In it, he explores the factors that contribute to YAML’s reputation, or the so-called “two wolves” inside the hatred of YAML—the frustration with YAML itself and the problem that it’s being used to solve—and how they contribute to each other.
## The Problem with the Hammer
Beda starts by talking about YAML itself, both writing it and reading it. Of course, the first thing that comes to mind is the meaningful use of blank space. Opinions run high in this discussion, as it’s a situation with which Python developers are intimately familiar. Indeed, there’s a very real scenario where missing a couple of spaces can drastically change your data while still being valid YAML. Consider the following two examples:

```yaml
foo:
  bar: a
  baz: b
```

```yaml
foo:
  bar: a
baz: b
```

It’s easy to spot the difference in such a small example, but potentially even easier to overlook two missing spaces when this YAML is hundreds or thousands of lines long. To be fair, this issue isn't completely unique to YAML. In JSON for example, you could easily place a key in a wrong node, or misspell a key in an array of objects. Both of these can of course be mitigated with tools such as schema validators.

There is some behavior that isn’t as obvious, though. Take the following YAML, for example:

```yaml
country_codes:
  united_states: us
  ireland: ie
  norway: no
```

Let’s try loading it using the standard library in Ruby, which will parse the YAML and then print it out as JSON.

```ruby
require 'yaml'

doc = <<-ENDYAML
country_codes:
  united_states: us
  ireland: ie
  norway: no
ENDYAML

puts YAML.load(doc)
```

```bash
{"country_codes"=>{"united_states"=>"us", "ireland"=>"ie", "norway"=>false}}
```

This is what Beda calls the “Norway Problem.” YAML’s specification doesn’t require quoting strings, which can cause some unintended behavior from any given library in your language of choice. In the [official YAML specification](https://yaml.org/type/bool.html), “no” is a valid value to represent a boolean that is “false”. And it isn’t limited to just this niche case. Consider the following:

```yaml
version: 1.2.0
```

```bash
{"version"=>"1.2.0"}
```

It makes sense that this is being parsed as a string. After all, what else could it be interpreted as? Well, what if we represent the same thing, but in a slightly different way?

```yaml
version: 1.2
```

```bash
{"version"=>1.2}
```

With no schema validation or context, the YAML specification clearly states that this should be [interpreted as a float](https://yaml.org/type/float.html). You and I probably even agree that both of these scenarios make sense, but this ambiguity leaves a non-zero margin of error, especially when you put it in the context of something as complex as Kubernetes.
## YAML’s Attack Surface
Things can also get tricky when you start deserializing anything more complex than a 1:1 representation of data and logic. 

In YAML, you can reference one structure from another, which is very, very handy when you know that values from one portion of a YAML document will need to be referenced later. For example:

```yaml
name: &speaker Joe Beda
presentation:
    name: Nightmare on Cloud Street
    speaker: *speaker
```

This YAML defined the anchor “speaker” with the value “Joe Beda”, which is then referenced later in the line ` speaker: *speaker`. When this YAML is expanded, this becomes:

```yaml
name: "Joe Beda"
presentation: 
  name: "Nightmare on Cloud Street"
  speaker: "Joe Beda"

```

But as they say, “With great power comes a great opportunity for someone with malicious intent to exploit.” Take a look at the following:

```yaml
a: &a ["a", "a", "a"]
b: &b [*a,*a,*a]
c: &c [*b, *b, *b]
```

This is a little weird to look at, but try to think it through. We’ve set the anchor “a” to an array containing three values. Then we give the anchor “b” a value that references the anchor “a”, three times. We then reference the “b” anchor three more times in “c” anchor. If you run this through the Ruby code from earlier to translate it to JSON, we get the following:

```json
{"a"=>["a", "a", "a"],
 "b"=>[["a", "a", "a"], ["a", "a", "a"], ["a", "a", "a"]],
 "c"=>
  [[["a", "a", "a"], ["a", "a", "a"], ["a", "a", "a"]],
   [["a", "a", "a"], ["a", "a", "a"], ["a", "a", "a"]],
   [["a", "a", "a"], ["a", "a", "a"], ["a", "a", "a"]]]}
```

This is a play on a fairly old trick that utilizes recursion to expand a rather small amount of data into something that’s magnitudes larger. You can see that by the third line of our YAML, we turned an array with three items into one with one with 27. This issue was addressed in Kubernetes directly in [CVE-2019-11253](https://github.com/kubernetes/kubernetes/issues/83253) to prevent a maliciously crafted piece of YAML from crashing the kube-apiserver.

## The Problem with the Nail

Beda did mention there was a second wolf in this conversation, and with it comes the nuance of YAML’s use in the context of Kubernetes.

First and foremost, Kubernetes resources can be complex, and in turn make the YAML very verbose. Another word that could be used is “explicit.” In machine-to-machine communication, explicitness is great. It doesn’t matter if it’s 100 lines of YAML or 1,000, the difference when being parsed and passed around to different machines and APIs, all while making sure those APIs are responsible for making too many assumptions, is completely negligible. That YAML has to come from somewhere, though, and often that “somewhere” is actually “someone.” Such explicitness means an additional burden of complexity for the user.

Kubernetes also does _a lot_. In fact, it can solve so many problems that it can actually make the simpler problems harder. Beda gives a great analogy referencing a popular word processor that often received complaints for being too “bloated.” People would say, “It has all of these features and I only ever use 20 percent of them.” Beda describes the research the development team undertook to figure out how users leveraged those features: They concluded that while any individual user would only leverage a small percentage of features—say, 10 percent—different collections of users would leverage a different 10 percent, and most features actually received significant usage. 

The same can be said for Kubernetes. It has a long tail of features and fields in the YAML that users are writing, which some may find too verbose, explicit, or repetitive. While you may not use those features, they may be well-utilized by others.

So with your YAML written, you head to the command line, run `kubectl apply`, and don’t receive any errors. Everything must be perfect! Well, maybe not. Even with valid YAML, any of the above scenarios could lead to the Kubernetes API server initially accepting something, but then as different pods and containers are stood up and volumes are claimed, one fat-fingered configuration throws it all out the window. And that means your development loop is now significantly longer than you’d initially expected, a frustrating experience to say the least.

## How Do We Improve?

As Beda notes, “There are no silver bullets” to this problem. There are a lot of opinions, but at the end of the day, there’s no one-size-fits-all solution. Maybe if it were something that was focused on in the early days of Kubernetes the conversation would be different, but hindsight truly is 20/20.

That said, with such a strong community, you have a seemingly limitless choice of tools and solutions. From generators to validators to templating systems, it feels like a new option is appearing every day.

Beda also points out a common trap that some can fall into: mixing up config and code. That is, the difference between using an existing solution such as YAML vs. writing your own DSL. It’s really easy to say that something as complex as Kubernetes could have its own language to create and configure objects, but now you’ve layered a whole new complexity onto an existing one. 

He references a short, but relevant, piece by Mike Hadlow titled [The Configuration Complexity Clock](http://mikehadlow.blogspot.com/2012/05/configuration-complexity-clock.html) in which Hadlow walks through, from start to finish, what happens in a case such as this, and expands on it. Basically, if you create your own configuration DSL, you’ve traded a common general purpose language with a widely known skill set for something that nobody knows. You’ve also traded a potential fleet of testing tools for ones you now need to write yourself. Meanwhile, if you hide concepts, you’re potentially limiting features on one hand. On the other hand, if you’re embracing them, you’re no better off than you were at the start.

Beda instead advocates embracing the tools that have emerged organically from the Kubernetes community itself. He also points out the benefit of taking a Unix-like toolchain mindset of breaking down a problem into smaller chunks and feeding each one into the next. If an individual doesn’t like a piece of the chain, they can replace it with a similar solution of their own. For example, [Carvel](https://carvel.dev/) aims to accomplish this approach, providing a collection of single-purpose, composable tools that you can chain together. If you'd like to learn more about Carvel, there's a great [TGIK episode](/tv/tgik/142/) that covers the different tools and how they can work together. 

So what’s the verdict? Is YAML the worst thing in the world? Is the hate overblown? Well, it’s your opinion and yours alone, just be sure to really reflect on why, exactly, you hold that opinion. Beda’s talk made me realize just how nuanced the common jokes about the pain of YAML really are, so if you have a spare half hour, be sure to [watch it](https://www.youtube.com/watch?v=8PpgqEqkQWA). Even if you’re a diehard YAML advocate, he still does a great job of putting into words the things that likely haven't even crossed many people’s minds. 

{{< youtube 8PpgqEqkQWA >}}