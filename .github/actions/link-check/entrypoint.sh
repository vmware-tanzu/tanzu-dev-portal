#!/bin/bash

LOCAL_HOST="http://localhost:1314/developer"
MAX_WAIT_TIME=600 # 5 min

# Provide default options if none are provided
HUGO_OPTIONS="${HUGO_OPTIONS:=-b http://localhost/developer -p 1314}"
MUFFET_OPTIONS="${MUFFET_OPTIONS:=-t 30 -e 'https?' -e 'https?:\/\/localhost.*' -e '/developer/get-workshop'}"

# Ensure that the git log can be pulled
git config --global --add safe.directory /github/workspace

echo "--> Start hugo server"
eval hugo server "${HUGO_OPTIONS}" > /dev/null &
echo -n "--> Wait for hugo server to start..."
for i in $(seq 0 ${MAX_WAIT_TIME}); do # 5 min
    sleep 0.5
    IS_SERVER_RUNNING=$(curl -LI ${LOCAL_HOST} -o /dev/null -w '%{http_code}' -s)
    if [[ "${IS_SERVER_RUNNING}" == "200" ]]; then
        echo "server started."
        echo "--> Check for broken links"
        eval muffet "${MUFFET_OPTIONS}" ${LOCAL_HOST} | tee output.txt
        if [ ${PIPESTATUS[0]} -eq 0 ]; then
            echo "--> No broken links! "
            exit 0
        else
            echo "--> Broken links found:"
            grep 404 output.txt
            exit 1
        fi
    fi
done

echo "error: time out $((${MAX_WAIT_TIME}/2)) sec" && exit 1
