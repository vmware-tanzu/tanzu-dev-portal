.DEFAULT_GOAL := help
.PHONY: test preview theme spell

word-dot = $(word $2,$(subst ., ,$1))

#help: @ List available tasks on this project
help:
	@echo "user tasks:"
	@grep -E '[a-zA-Z\.\-]+:.*?@ .*$$' $(MAKEFILE_LIST)| tr -d '#' | awk 'BEGIN {FS = ":.*?@ "}; {printf "\t\033[32m%-30s\033[0m %s\n", $$1, $$2}'
	@echo

#theme: @ runs git module to update the theme
theme:
	git submodule update --init --recursive

#preview: @ preview hugo
preview: theme
	hugo server -b http://localhost:1313/developer

#test: @ runs act to simulate a github pull request test suite
test:
	act pull_request

#spell: @ runs act to perform spellcheck
spell:
	act -j spell-check

#guide.wi: @ creates a what-is guide. example: make guide.wi.spring.spring-boot-what-is
guide.wi.%:
	hugo new guides/$(call word-dot,$*,1)/$(call word-dot,$*,2).md -k guide-what-is

#guide.gs: @ creates a getting started guide. example: make guide.gs.spring.spring-boot-gs
guide.gs.%:
	hugo new guides/$(call word-dot,$*,1)/$(call word-dot,$*,2).md -k guide-gs

#blog: @ creates a blog post. example: make blog.writing-makefiles
blog.%:
	hugo new blog/$(call word-dot,$*,1).md -k blog-post

#sample: @ creates a sample. example: make sample.example-makefile
sample.%:
	hugo new samples/$(call word-dot,$*,1).md -k sample

#video: @ creates a video. example: make video.demo-writing-makefiles
video.%:
	hugo new videos/$(call word-dot,$*,1).md -k video