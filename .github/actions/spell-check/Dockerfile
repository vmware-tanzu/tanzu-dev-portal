FROM node:lts-alpine

LABEL "name"="Markdown Spell Checker"
LABEL "maintainer"="Paul Czarkowski"
LABEL "version"="0.0.1"

LABEL "com.github.actions.name"="Markdown Spell Checker"
LABEL "com.github.actions.description"="Markdown Spell Checker"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="green"

RUN apk add --no-cache bash

RUN npm install --global spellchecker-cli retext-syntax-urls retext-indefinite-article retext-repeated-words remark-frontmatter

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
