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
echo "--> Install spellchecker"
npm install spellchecker-cli retext-syntax-urls retext-indefinite-article retext-repeated-words

echo "--> spellcheck markdown files"
./node_modules/spellchecker-cli/bin/spellchecker -f 'content/**/*.md' -d custom_dict.txt --plugins sspell yntax-urls indefinite-article repeated-words