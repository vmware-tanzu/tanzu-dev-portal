FROM node:lts-alpine

LABEL "name"="Markdown Spell Checker"
LABEL "maintainer"="Paul Czarkowski"
LABEL "version"="0.0.1"

LABEL "com.github.actions.name"="Markdown Spell Checker"
LABEL "com.github.actions.description"="Markdown Spell Checker"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="green"

COPY entrypoint.sh /entrypoint.sh
COPY custom_dict.txt /custom_dict.txt

ENTRYPOINT ["/entrypoint.sh"]
