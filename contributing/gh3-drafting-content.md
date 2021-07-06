# Tanzu Developer Center Contribution Guide


## Drafting Content

These processes will walk you through writing your content in markdown, and filling out the Hugo [front matter](https://gohugo.io/content-management/front-matter/) tags.


### I would like some tips on drafting the body of my content

1. **Fill out the front matter block after the initial content has been drafted**. This way you will have a better idea of what title, description, and tags to fill in.
   
2. **Utilize the outline provided in the starter template**. In the previous step, you created a starter template for your content. These are minimal starters, but best practice is to start with these 

3. **Start Headings with Level 2 (<`##`)**. The level 1 Heading will render from the title in the front matter, so subsequent headings should be level 2 or lower. 

4. Utilize the [VMware style guide](https://www.vmware.com/content/dam/brand/photography-only/guidelines/writing-and-naming/editorial-style-guide/marketing-editorial-style-guide.pdf) (**VMware employees only**) and the [TDC style guide](https://docs.google.com/document/d/1XsGW4hqRaPgSo7Ihh0-C8e6VjDbkVlWL7G6GgVK1SeQ/edit) (**VMware employees only**). These will help with how to format things like lists, how to format in-line code, code blocks, proper names, etc. And this will make editing easier in later steps.

5. **Content should typically be written in second person (the "you" voice)**. Guides should be written as a 1:1 interaction. Therefore "you/your" is preferred to "we/our" or "me/my".

3.  **For dates in the future**. It is okay to use a date in the future for a publish date. However this will have implications for previewing the content locally (see [testing content for more information on this](gh5-testing-content.md). 

6. **Check in regularly with the team at [#tanzu-developer-center](https://vmware.slack.com/archives/C011DRHHDTL)**. Ask any questions you may have. Get feedback on your content. Or just confirm your current status. 

7. **Outline and write or build content as normal**. With these tips, you are ready to draft your content. Good luck!


### I need help with adding images to my content
1. **Add images to the correct directory**. All images are stored under the `static/images` directory, and should conform to the format `/static/images/content-type/topic/post-name/image.png`. So for example, an ArgoCD guide would have images in `static/images/guides/ci-cd/argocd-gs/image1.png`. 
   
2. **Place diagrams or screenshots in a different directory**. Diagrams will have a boarder placed around them during render. As will screenshots. Place any diagrams in the lowest level directory called `diagrams`. To expand on the above example, a diagram should be placed in `static/images/guides/ci-cd/argocd-gs/diagrams/diagram1.png`. And for screenshots, `static/images/guides/ci-cd/argocd-gs/screenshots/diagram1.png`.

3. **Link to these images in your content piece**. Links to images should be of the format `![info text here](images/content-type/topic/post-name/image.png)`. More information on formatting image links can be found in the [Tanzu Developer Center Style Guide](ref-styleguide.md).


### I need help filling out the front matter

1. **For blog posts** - Blog posts require a title, date, and author. Here is an example frontmatter section for a blog post:

```
---
date: 2020-08-11
description: How does Python look in the cloud-native world of today?
title: 'Hello Python, My Old Friend: Revisiting Python in a Cloud-Native Climate'
tags:
- Kubernetes
- Python
- Buildpacks
team:
- Brian McClain
topics:
- Python
---
```

2. **For guides** - There are three special front matter fields that can be used in Guides to control how they appear in the sidebar tree navigation. The left side navigation can contain two levels worth of content with each entry capable of containing articles contained underneath. To define what appears where, use the following fields:

    * `subsection`: defines a Guide as a subsection that can contain one or more guides under it
    * `parent`: defines the parent subsection for a Guide that should appear under it
    * `linkTitle`: This is a native, Hugo-supported field to specify a "short" title. This is what will appear in the sidebar tree menu, but the title will still appear on the page (and for SEO purposes).

Here is an example frontmatter section for a guide:

```
---
date: '2020-04-16'
description: Discover how to use pack, a CLI tool that builds container images locally
  on your developer machine using Cloud Native Buildpacks
linkTitle: Getting Started with `pack`
metaTitle: Getting Started with the `pack` CLI
parent: Cloud Native Buildpacks
patterns:
- Deployment
tags:
- Buildpacks
team:
- Bryan Friedman
title: Getting Started with the `pack` CLI using Cloud Native Buildpacks
topics:
- Containers
---
```

4. **For videos** - Make sure to set `youtube_id` in the front matter to the string that appears after `/watch?v=` in the video's URL, along with a title, description, and other taxonomy metadata. Here is an example frontmatter section for a video:

```
---
date: '2020-05-06'
description: Deploying Kubeapps for your cluster and installing an example application.
patterns:
- Deployment
tags:
- Kubernetes
- Kubeapps
- Helm
team:
- Tiffany Jernigan
title: Getting Started with Kubeapps
topics:
- Kubernetes
youtube_id: 9HsWsoDd1fM
---
```

3. **For samples** - Along with a `title`, `description`, and other taxonomy metadata in the front matter, code sample pages require the full URL to a public GitHub repository in the `repo` parameter. They also require a boolean value for `readme` that will determine whether to fetch (at build-time) and render the README content from that repo (true) or to render the content of the page itself instead (false). Here is an example frontmatter section for a code sample:

```
---
date: '2020-04-21'
description: Simple Event Driven Microservices with Spring Cloud Stream
patterns:
- Eventing
readme: true
repo: https://github.com/benwilcock/spring-cloud-stream-demo
summary:
- Simple Event Driven Microservices with Spring Cloud Stream
tags:
- Spring
- Microservices
- Event Streaming
- Spring Cloud Stream
team:
- Ben Wilcock
title: Spring Cloud Stream Demo
topics:
- Spring
- Messaging and Integration
- Microservices
- Event Streaming
---
```

---

| Previous Step | Next Step |
| ------------- | --------- |
| **[Getting set up](gh2-env-setup.md)** | **[Editing Content](gh4-editing-content.md)** |
