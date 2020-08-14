FROM python:3.8.0-slim

LABEL "name"="Fetch TGIK Episodes"
LABEL "maintainer"="Bryan Friedman"
LABEL "version"="0.0.1"

LABEL "com.github.actions.name"="Fetch TGIK Episodes"
LABEL "com.github.actions.description"="Fetch TGIK Episodes"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="green"

WORKDIR /app

COPY src/requirements.txt ./
RUN pip install -r requirements.txt
COPY src /app

CMD [ "python", "main.py" ]