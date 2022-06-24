#!/bin/bash

#set -e
#set -x
set -o pipefail
shopt -s extglob

if [[ -z "$GITHUB_WORKSPACE" ]]; then
  echo "Set the GITHUB_WORKSPACE env variable."
  exit 1
fi

if [[ -z "$GITHUB_REPOSITORY" ]]; then
  echo "Set the GITHUB_REPOSITORY env variable."
  exit 1
fi

cd $GITHUB_WORKSPACE

# Find team members with template bio pages and igore them in the spelcheck
MEMBERS=( $(find content/team -type f -name '_index.template' | sed -r 's|/[^/]+$||' | sort | uniq) )
IGNORE_MEMBERS=""
for m in "${MEMBERS[@]}"
do
  IGNORE_MEMBERS="$IGNORE_MEMBERS !($m/_index.md)"
done

echo $IGNORE_MEMBERS


echo "--> spellcheck markdown files"
IGNORE_REGEX="[0-9a-f]{7} (?=.*[0-9])[0-9A-Za-z_\-]{11}" # GitHub hashes and YouTube IDs
IGNORE_FILES="!(content/tv/tgik/**/index.md) !(content/tv/talk/**/index.md) $IGNORE_MEMBERS" # Don't worry about TGIK/Tanzu Talk episodes for now as they scrape from YT
spellchecker -q --no-suggestions -l en-US -f 'content/**/*.md' $IGNORE_FILES -i $IGNORE_REGEX --frontmatter-keys title Title description Description -d custom_dict.txt --plugins frontmatter spell syntax-urls indefinite-article repeated-words
