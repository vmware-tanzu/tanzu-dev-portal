GET_FILE_NAME= $(word $2,$(subst ., ,$1))
HUGO_PROD := 0.107.0
HUGO_LOCAL := $(shell hugo version | awk -F v '{print substr($$2,1,7)}')
CONTEXT ?= dev
ifeq "$(CONTEXT)" "production"
DEPLOY_URL := https://tanzu.vmware.com/developer
else
ifeq "$(CONTEXT)" "deploy-preview"
DEPLOY_URL := $(DEPLOY_PRIME_URL)/developer
else
DEPLOY_URL := http://localhost:1313/developer
endif
endif
DEV_CONTAINER_NAME := "tdc-dev"
DEV_CONTAINER_TAGS := "tdc:dev"
DEV_CONTAINER_DIR := $$(pwd)
SUBMODULE_STATUS := $(strip $(shell git submodule status | head -1 | cut -c 1-7))
SUBMODULE_HASH := efdc5b

.PHONY: help
#help: @ List available tasks on this project
help:
	@echo $$(for i in {1..100}; do printf -; done); echo Available Rules:
	@grep -E '[a-zA-Z\.\-]+:.*?@ .*$$' $(MAKEFILE_LIST) | tr -d '#' | sort | \
	awk 'BEGIN {FS = ":.*?@ "}; \
	{printf "\t\033[32m%-30s\033[0m %s\n", $$1, $$2}'
	@echo $$(for i in {1..100}; do printf -; done);

.PHONY: clean-submodule
#clean-submodule: @ Deletes submodule files for fresh initialization
clean-submodule:
	@echo "Removing modules"
	@rm -rf .git/modules
	@rm -rf themes/docsy
	@mkdir themes/docsy

.PHONY: git-submodule
#git-submodule: @ Initializes and recursively updates git submodules
git-submodule:
	@echo Checking submodule status...
ifeq ($(SUBMODULE_STATUS),$(SUBMODULE_HASH))
	@echo Submodules are initialized
else
	@echo Initializing git submodules...
	@git submodule update -f --init --recursive
endif

.PHONY: npm
#npm: @ Runs npm ci for clean install of dependencies from package-lock.json
npm: git-submodule
	@echo Checking for node dependencies...
	@if [ ! -d node_modules ]; then \
		echo "Installing node dependencies..."; \
		npm ci; \
	else \
		npm ls; \
		echo Node dependencies are installed and verified; \
	fi

.PHONY: hugo-version-check
#hugo-version-check: @ Checks system version of hugo 
hugo-version-check:
ifeq ($(HUGO_LOCAL),$(HUGO_PROD))
	@echo hugo $(HUGO_LOCAL) validated
else
	@echo $@ failure: Your hugo version \($(HUGO_LOCAL)\) does not match production \($(HUGO_PROD)\) 
	@echo run \'brew upgrade hugo\' or download and install the extended version from the releases page (https://github.com/gohugoio/hugo/releases/tag/v0.107.0).
	@exit 1
endif

.PHONY: preview
#preview: @ Preview a local site
preview: hugo-version-check npm
	ulimit -n 65535; hugo server -b ${DEPLOY_URL} --bind 0.0.0.0

.PHONY: preview-ip
#preview-ip: @ Preview a local site using an IP
preview-ip: npm
	ulimit -n 65535; hugo server --panicOnWarning --bind 0.0.0.0 -b http://${MYIP}:1313/developer

.PHONY: build
#build: @ Build site into `public` directory
build: hugo-version-check npm
	hugo -b ${DEPLOY_URL}

.PHONY: test
#test: @ Runs act to simulate a github pull request test suite
test: npm
	act pull_request

.PHONY: clean
#clean: @ Clean hugo build files and docker files
clean:
	@if [ -d public ]; then \
	  echo Cleaning hugo build directories and files; \
	  rm -rf public; \
	fi
	@catthehacker_status=$$(docker image ls ghcr.io/catthehacker/ubuntu --format "{{.Tag}}"); \
	if [ -n "$$catthehacker_status" ]; then \
	  if [ "$$catthehacker_status" == "act-latest" ]; then \
	    echo Cleaning hugo build directories and files; \
	    docker rmi -f ghcr.io/catthehacker/ubuntu:act-latest; \
	  fi; \
	fi
	@if [ -n "$$(docker images -q "act-github-actions-*")" ]; then docker rmi $$(docker images -q "act-github-actions-*"); fi
	@if [ -n "$$(docker images -q ruby:3.0-alpine)" ]; then docker rmi ruby:3.0-alpine; fi 
	@if [ -n "$$(docker images -q alpine:3.16.0)" ]; then docker rmi alpine:3.16.0; fi 
	@echo Files and images cleaned up.

.PHONY: spell
#spell: @ Runs act to perform spellcheck
spell: npm
	act -j spell-check

.PHONY: netlify-dev
#netlify-dev: @ (Netlify Use Only) Command used for Netlify dev local builds
netlify-dev:
	@echo Netlify Dev building with ${CONTEXT} context
	hugo server -w -b ${DEPLOY_URL}

.PHONY: netlify-deploy
#netlify-deploy: @ (Netlify Use Only) Command used for Netlify deployments
netlify-deploy: npm 
	@echo Force install submodule update
	@git submodule update -f --init --recursive
	hugo -F -b ${DEPLOY_URL}
	cp public/developer/_redirects public/redirects

.PHONY: dev-container
#dev-container: @ Builds image, starts a new container, and connects to bash shell
dev-container:
	@echo Building Docker $(DEV_CONTAINER_TAGS) image...
	@docker build -t ${DEV_CONTAINER_TAGS} .
	@echo Creating Docker $(DEV_CONTAINER_NAME) container...
	@docker run --name $(DEV_CONTAINER_NAME) -v "$(DEV_CONTAINER_DIR)":/tdc -v /var/run/docker.sock:/var/run/docker.sock -i -t -p 1313:1313 -p 8888:8888 $(DEV_CONTAINER_TAGS) 

.PHONY: dev-container.start
#dev-container.start: @ Starts the dev container in docker
dev-container.start:
	@echo Starting $(DEV_CONTAINER_NAME) in docker...
	@docker start $(DEV_CONTAINER_NAME) > /dev/null

.PHONY: dev-container.stop
#dev-container.stop: @ Stops the dev container in docker
dev-container.stop:
	@docker stop $(DEV_CONTAINER_NAME) > /dev/null
	@echo "$(DEV_CONTAINER_NAME) container stopped."

.PHONY: dev-container.status
#dev-container.status: @ Show the status of dev container in docker
dev-container.status:
	@docker ps -af name=$(DEV_CONTAINER_NAME) --format "{{.Names}}\t{{.Status}}"

.PHONY: dev-container.shell
#dev-container.shell: @ Starts a bash shell in the dev container
dev-container.shell: dev-container.start
	@docker exec -it $(DEV_CONTAINER_NAME) /bin/bash

.PHONY: dev-container.connect
#dev-container.connect: @ Connects to a running dev container
dev-container.connect:
	@docker attach $(DEV_CONTAINER_NAME)

.PHONY: dev-container.pr-test
#dev-container.pr-test: @ Runs pull requests tests locally in the dev container
dev-container.pr-test: dev-container.start
	@echo Running PR checks with act using dev container...
	@docker exec -it $(DEV_CONTAINER_NAME) make test
	

.PHONY: dev-container.delete
#dev-container.delete: @ Removes dev container and image
dev-container.delete: dev-container.stop
	@docker rm $(DEV_CONTAINER_NAME)
	@docker rmi $(DEV_CONTAINER_TAGS)

#guide.wi: @ Creates a what-is guide. example: make guide.wi.spring.spring-boot-what-is
guide.wi.%:
	hugo new guides/$(call GET_FILE_NAME,$*,1)/$(call GET_FILE_NAME,$*,2).md -k guide-what-is

#guide.gs: @ Creates a getting started guide. example: make guide.gs.spring.spring-boot-gs
guide.gs.%:
	hugo new guides/$(call GET_FILE_NAME,$*,1)/$(call GET_FILE_NAME,$*,2).md -k guide-gs

#blog: @ Creates a blog post. example: make blog.writing-makefiles
blog.%:
	hugo new blog/$(call GET_FILE_NAME,$*,1).md -k blog-post

#sample: @ Creates a sample. example: make sample.example-makefile
sample.%:
	hugo new samples/$(call GET_FILE_NAME,$*,1).md -k sample

#video: @ Creates a video. example: make video.demo-writing-makefiles
video.%:
	hugo new videos/$(call GET_FILE_NAME,$*,1).md -k video

#practice: @ Creates a new agile practice. example: make practice.makefile-workshop
practice.%:
	hugo new practices/$(call GET_FILE_NAME,$*,1)/index.md -k practices

#team: @ Creates a new team page. example: make team.firstname-lastname
team.%:
	@hugo new team/$(call GET_FILE_NAME,$*,1)/index.md -k team-member
	@mkdir content/team/$(call GET_FILE_NAME,$*,1)/images

#audit: @ Runs a content audit on all guides and blogs. example: make audit
audit:
	cd .github/actions/audit/src && bundle install
	mkdir audit
	ruby .github/actions/audit/src/audit.rb -s . -o audit/audit.csv -t audit/tags.csv --topics audit/topics.csv --errors audit/errors.csv
