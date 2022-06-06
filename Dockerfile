FROM node:18-alpine3.15

WORKDIR /home

ENV HUGO_VERSION='0.82.0'
ENV MUFFET_VERSION='2.4.4'

# Add required packages (libc6-compat required to get hugo to work)
RUN apk add --no-cache curl libc6-compat git

# Install Hugo
ENV HUGO_NAME="hugo_extended_${HUGO_VERSION}_Linux-64bit"
ENV HUGO_URL="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_NAME}.tar.gz"
RUN wget "${HUGO_URL}" && \
    tar -zxvf "${HUGO_NAME}.tar.gz" && \
    mv ./hugo /usr/local/bin/

# Install spellchecker
RUN npm install --global spellchecker-cli retext-syntax-urls retext-indefinite-article retext-repeated-words remark-frontmatter --loglevel verbose

# Install muffet
ENV MUFFET_NAME="muffet_${MUFFET_VERSION}_Linux_x86_64"
ENV MUFFET_URL="https://github.com/raviqqe/muffet/releases/download/v${MUFFET_VERSION}/${MUFFET_NAME}.tar.gz"
RUN wget "${MUFFET_URL}" && \
    tar -zxvf "${MUFFET_NAME}.tar.gz" && \
    mv muffet /usr/local/bin

WORKDIR /home/tdc