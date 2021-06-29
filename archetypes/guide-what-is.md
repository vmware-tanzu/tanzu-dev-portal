---
title:  "{{ (replace .Name "-" " ") | title }}?"
linkTitle: "{{ replace (replace .Name "what-is-" "") "-" " " | title }}"
subsection: {{ replace (replace .Name "what-is-" "") "-" " " | title }}
weight: 1
topics:
- 
tags:
- {{ replace (replace .Name "what-is-" "") "-" " " | title }}
# Author(s)
team:
-
date: "{{ now.Format "2006-01-02" }}"
lastmod: "{{ now.Format "2006-01-02" }}"
---

Intro text...

## Why Is It Important? 

...

## How Does It Work? 

...

## How Can I Use It?

...