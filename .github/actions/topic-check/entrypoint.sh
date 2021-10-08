#!/bin/sh

#set -e
#set -x
set -o pipefail

if [[ -z "$GITHUB_WORKSPACE" ]]; then
  echo "Set the GITHUB_WORKSPACE env variable."
  exit 1
fi

if [[ -z "$GITHUB_REPOSITORY" ]]; then
  echo "Set the GITHUB_REPOSITORY env variable."
  exit 1
fi

cd $GITHUB_WORKSPACE
pwd
ls -a .github/actions

echo "--> Run the check"
ruby ./.github/actions/topic-check/src/topic-check.rb -s . -t topics.yaml