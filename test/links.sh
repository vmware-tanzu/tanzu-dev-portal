#!/bin/sh

set -o pipefail

LOCAL_HOST="http://localhost:1313/developer"
MAX_WAIT_TIME=600 # 5 min

HUGO_OPTIONS="-b $LOCAL_HOST"
MUFFET_OPTIONS="-t 30 -c 5 -e 'https?' --exclude='/developer/get-workshop'" 

echo "--> Start hugo server"
eval hugo server "${HUGO_OPTIONS}" > /dev/null &
echo -n "--> Wait for hugo server to start..."
for i in $(seq 0 ${MAX_WAIT_TIME}); do # 5 min
    sleep 0.5
    IS_SERVER_RUNNING=$(curl -LI ${LOCAL_HOST} -o /dev/null -w '%{http_code}' -s)
    if [[ "${IS_SERVER_RUNNING}" == "200" ]]; then
        echo "server started."
        echo "--> Check for broken links"
        eval muffet "${MUFFET_OPTIONS}" ${LOCAL_HOST} | tee /tmp/output.txt
        if [ $? -eq 0 ]; then
            echo "--> No broken links! "
            exit 0
        else
            echo "--> Broken links found:"
            grep 404 /tmp/output.txt
            exit 1
        fi
    fi
done

echo "error: time out" && exit 1