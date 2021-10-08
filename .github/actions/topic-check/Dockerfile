FROM ruby:alpine AS builder

RUN apk add --update \
  build-base \
  libxml2-dev \
  libxslt-dev \
  ruby-dev \
  gcc \
  make \
  libc-dev

LABEL "name"="Validate Topic and Subtopic Metadata"
LABEL "maintainer"="Brian McClain"
LABEL "version"="0.0.1"

LABEL "com.github.actions.name"="Validate Topic and Subtopic Metadata"
LABEL "com.github.actions.description"="Validate Topic and Subtopic Metadata"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="green"

COPY entrypoint.sh /entrypoint.sh

CMD ["/entrypoint.sh"]