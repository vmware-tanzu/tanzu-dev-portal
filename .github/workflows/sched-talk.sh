#!/bin/bash

export API_KEY=${YT_API_KEY}
export PLAYLIST_ID="PLAdzTan_eSPRNuA52_34wh5VTBC-0Rz7U"
export EPISODES_PATH="content/tv/talk/"
export IMG_PATH_PREFIX="static/"
export IMAGES_REL_PATH="images/tv/episodes/talk/"
export TEMPLATE_FILE=".github/actions/youtube-episodes/src/template.md"
export TITLE_PREFIX="Tanzu Talk"
export TITLE_SUFFIX=", "

if [[ -z "${API_KEY}" ]]; then
    echo "please provide YT_API_KEY"
    exit 1
fi

./.github/actions/youtube-episodes/src/main.py
