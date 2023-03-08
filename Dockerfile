FROM node:16-alpine3.17

ENV HUGO_VERSION=0.107.0

COPY . /tdc/

RUN apk update 
RUN apk add make git docker docker-compose libc6-compat dpkg 
RUN wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb
RUN dpkg -i --force-architecture hugo_extended_${HUGO_VERSION}_linux-amd64.deb 

EXPOSE 1313 8888


CMD [ "/bin/sh" ]