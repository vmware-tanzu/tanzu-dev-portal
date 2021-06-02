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

echo "--> Run bundle install"
cd .github/actions/audit/src && bundle install && cd ../../../../

echo "--> Run the audit"
ruby ./.github/actions/audit/src/audit.rb --source . --output audit-output.csv