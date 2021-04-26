.DEFAULT_GOAL := help
.PHONY: test preview build theme spell node_modules

word-dot = $(word $2,$(subst ., ,$1))

#help: @ List available tasks on this project
help:
	@echo "user tasks:"
	@grep -E '[a-zA-Z\.\-]+:.*?@ .*$$' $(MAKEFILE_LIST)| tr -d '#' | awk 'BEGIN {FS = ":.*?@ "}; {printf "\t\033[32m%-30s\033[0m %s\n", $$1, $$2}'
	@echo

#theme: @ runs git module to update the theme
theme:
	git submodule update --init --recursive

#npm: @ runs npm install to install dependencies
npm: theme
	npm install

#preview: @ preview hugo
preview: npm
	hugo server -b http://localhost:1313/developer

#build: @ build site into `public` directory
build: npm
	hugo -b https://localhost:1313/developer

#test: @ runs act to simulate a github pull request test suite
test: npm
	act pull_request

#spell: @ runs act to perform spellcheck
spell: npm
	act -j spell-check

#function-config: @ sets the function config variables during build
function-config:
ifeq ($(CONTEXT), production)
	awk -v a="${CONTEXT}" '{gsub(/CONTEXT_PLACEHOLDER/,a)}1' netlify/functions/util/config.js.ph | awk -v a="${URL}" '{gsub(/DEPLOY_PRIME_URL_PLACEHOLDER/,a)}1' >> netlify/functions/util/config.js.ph2
else
	awk -v a="${CONTEXT}" '{gsub(/CONTEXT_PLACEHOLDER/,a)}1' netlify/functions/util/config.js.ph | awk -v a="${DEPLOY_PRIME_URL}" '{gsub(/DEPLOY_PRIME_URL_PLACEHOLDER/,a)}1' >> netlify/functions/util/config.js.ph2
endif
	awk -v a="${SENTRY_DSN_AUTH_START}" '{gsub(/SENTRY_DSN_AUTH_START/,a)}1' netlify/functions/util/config.js.ph2 | awk -v a="${SENTRY_DSN_AUTH_CALLBACK}" '{gsub(/SENTRY_DSN_AUTH_CALLBACK/,a)}1' | awk -v a="${SENTRY_DSN_GET_WORKSHOP}" '{gsub(/SENTRY_DSN_GET_WORKSHOP/,a)}1' >> netlify/functions/util/config.js
	


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

#practice: @ creates a new agile practice. example: make practice.makefile-workshop
practice.%:
	hugo new practices/$(call word-dot,$*,1)/index.md -k practices

#audit: @ runs a content audit on all guides and blogs. example: make audit
audit:
	cd scripts/audit && bundle install
	ruby scripts/audit/audit.rb -s . -o scripts/audit/audit.csv -t scripts/audit/tags.csv --topics scripts/audit/topics.csv --errors scripts/audit/errors.csv
