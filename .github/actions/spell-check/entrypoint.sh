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
npm install --global spellchecker-cli retext-syntax-urls retext-indefinite-article retext-repeated-words remark-frontmatter

echo "--> spellcheck markdown files"
spellchecker -q --no-suggestions -l en-US -f 'content/**/*.md' -i "[0-9a-f]{7}" "[0-9A-Za-z_\-]{11}" --frontmatter-keys description -d custom_dict.txt --plugins frontmatter spell syntax-urls indefinite-article repeated-words
