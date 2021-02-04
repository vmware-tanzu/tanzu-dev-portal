# VMware Tanzu Developer Center

## Building the Site

The VMware Tanzu Developer Center uses [Hugo](https://gohugo.io/) to build the site from Markdown files. You'll need to [get Hugo](https://gohugo.io/getting-started/installing/) if you want to build and run the site locally.

### Run locally

To install the latest version of `hugo` you can use `brew install hugo` if you are on a Mac. However, this site currently requires a specific version (0.69.2) to build successfully. To install this version of `hugo`, use one of the following two commands:

Using `brew`:
```
wget "https://raw.githubusercontent.com/Homebrew/homebrew-core/5c50ad9cf3b3145b293edbc01e7fa88583dd0024/Formula/hugo.rb"
brew install hugo.rb
# To keep this version around if you upgrade
brew pin hugo
```

Or to directly download:
```
wget "https://github.com/gohugoio/hugo/releases/download/v0.69.2/hugo_extended_0.69.2_Linux-64bit.tar.gz"
tar -zxvf "hugo_extended_0.69.2_Linux-64bit.tar.gz"
mv ./hugo /usr/local/bin/
```

Now you're ready to build locally:

```
git clone https://github.com/vmware-tanzu-private/tanzu-dev-portal
cd tanzu-dev-portal
make preview
```

A preview of the dev portal will be available at: [http://localhost:1313/developer](http://localhost:1313/developer).

### Run tests locally

> Note: requires Docker to be running (On Mac OS X requires Docker Desktop 2.4 or newer)

1. Install [act](https://github.com/nektos/act#installation) (`brew install act`)
2. Run `make test`

### Publish to Staging

After running and testing locally, opened Pull Requests will be automatically staged by Netlify.

## Contributing Content

You may contribute content by creating a branch (or fork) and submitting a pull request. Content should be written in Markdown with metadata included in the front matter. Here are some guidelines to get you started:

### Hugo Archetypes
You can use the [Archetypes](https://gohugo.io/content-management/archetypes/) feature of Hugo to create new content as follows:

#### Create a new Guide
Use one of the following commands to create either a "What Is...?" or "Getting Started" guide. Guides should be written in second person (the "you" voice).

To create a *What Is* Guide `guides/spring/what-is-spring-boot.md` run:

```
make guide.wi.spring.spring-boot-what-is
```

to create a *Getting Started* Guide `guides/spring/spring-boot-gs.md` run:

```
make guide.gs.spring.spring-boot-gs
```


#### Create a new blog post
The following command will create a blog post. Blog posts require a title, date, and author (see more about authors in the Taxonomy section above). If you use a future date for publishing, you will need to use the `-F` flag to see the post when running `hugo` or `hugo server` to build the site on your local machine.

To create a blog post `blog/my-post.md`
```
make blog.my-post
```

#### Create a new Code Sample
The following command will create a code sample. Along with a title, description, and other taxonomy metadata in the front matter, code sample pages require the full URL to a public GitHub repository in the `repo` parameter and a boolean value for `readme` that will determine whether to fetch (at build-time) and render the README content from that repo (`true`) or to render the content of the page itself instead (`false`).

To create a code sample `samples/my-sample.md`:

```
make sample.my-sample
```

#### Create a new Video
Your video should be uploaded to the VMwareTanzu YouTubechannel first. For help with this reach out in the #tanzu-dev-portal channel. Once on YouTube, run the following command and make sure to set `youtube_id` in the front matter to the string that appears after `/watch?v=` in the video's URL, along with a title, description, and other taxonomy metadata.

To create a new video `videos/my-video.md`:

```
make video.my-video
```

### Guides Navigation
There are three special front matter fields that can be used in Guides to control how they appear in the sidebar tree navigation. The left side navigation can contain two levels worth of content with each entry capable of containing articles contained underneath. To define what appears where, use the following fields:

* `subsection`: defines a Guide as a subsection that can contain one or more guides under it
* `parent`: defines the parent subsection for a Guide that should appear under it
* `linkTitle`: This is a native, Hugo-supported field to specify a "short" title. This is what will appear in the sidebar tree menu, but the `title` will still appear on the page (and for SEO purposes).

### Images
All images are stored under `static/images`. Images should be placed in the directory that matches the content that they'll be displayed in (ie. a Spring guide would have images in `static/images/guides/spring`). Finally, an image placed in `diagrams` will have a border added around it for visibility. If the image is not a diagram, they should be placed in `screenshots`.

### Taxonomies
Hugo defines [Taxonomies](https://gohugo.io/content-management/taxonomies/) that may be used in the front matter of Markdown documents. This site uses the following taxonomies

#### Team
Use the `team` taxonomy to attribute one or more authors to a piece of content.

#### Topics
Topics should always be included in the `topics` section of the front matter, must be one of the following options and must appear exactly as follows:

- Agile
- CI-CD
- Containers
- Event Streaming
- Kubernetes
- Messaging and Integration
- Microservices
- Python
- Reactive
- Serverless
- Spring

#### Patterns
Patterns may be added in a `patterns` section of the front matter and must refer to the title of an existing section within the `patterns` directory under `content`.

#### Tags
Tags may appear in a `tags` section of the front matter. Usually tags refer to a specific technology within a topic such as `Spring Boot` within `Spring`.

#### Featured Content
Content may be tagged as `featured: true` along with a `weight` in the front matter to appear in the Featured section on the home page. Only three will appear at once.

### Shortcodes

Hugo allows the use of [shortcodes](https://gohugo.io/content-management/shortcodes/) in Markdown files to render specific templates for content like YouTube videos and Tweets. Use them as follows to add to your content.

#### YouTube

```{{< youtube id="YOUR_VIDEO_ID" class="youtube-video-shortcode" >}}```

`YOUR_VIDEO_ID` should be replaced with the 11-character GUID from your video which appears after the `?v=` parameter in the URL. Please be sure to include the class as shown.

#### Twitter

```{{< tweet YOUR_TWEET_ID >}}```

`YOUR_TWEET_ID` should be replaced with the ID that appears after `/status/` in the tweet's URL.

### Markdown Tricks

- For an &ndash; (--) use two hyphens in a row
- For an &mdash; (---) use three hyphens in a row
