FROM python:3.8.0-slim

LABEL "name"="Series Generator"
LABEL "maintainer"="John Harris"
LABEL "version"="0.0.1"

WORKDIR /app
COPY src /app

RUN pip install -r requirements.txt

ENTRYPOINT [ "python", "/app/main.py" ]