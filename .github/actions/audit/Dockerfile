FROM ruby:alpine AS builder

RUN apk add --update \
  build-base \
  libxml2-dev \
  libxslt-dev \
  ruby-dev \
  gcc \
  make \
  libc-dev

COPY src/Gemfile ./

RUN bundle install

LABEL "name"="Generate Audit Report"
LABEL "maintainer"="John Harris"
LABEL "version"="0.0.1"

LABEL "com.github.actions.name"="Generate Audit Report"
LABEL "com.github.actions.description"="Generate Audit Report"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="green"

CMD ["ruby", "./.github/actions/audit/src/audit.rb", "--source", ".", "--output", "audit-output.csv"]