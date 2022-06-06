#!/bin/sh

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' 


# Spellcheck
./test/spellcheck.sh
RSLT_SPELL=$?

# Broken links
./test/links.sh
RSLT_LINKS=$?

# Print results
if [ $RSLT_SPELL -eq 0 ]; then
    echo -e "Spellcheck: ${GREEN}PASSED${NC}"
else
    echo -e "Spellcheck: ${RED}FAILED${NC}"
fi

if [ $RSLT_LINKS -eq 0 ]; then
    echo -e "Link Check: ${GREEN}PASSED${NC}"
else
    echo -e "Link Check: ${RED}FAILED${NC}"
fi