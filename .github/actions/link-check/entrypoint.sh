#!/bin/bash

LINE='##############################'
MSGS='####### start action #########'

LOCAL_HOST="http://localhost:1313"
MAX_WAIT_TIME=600 # 5 min

echo ${LINE}
echo "${MSGS}"
echo ${LINE}

eval hugo server "${HUGO_OPTIONS}" > /dev/null &
for i in $(seq 0 ${MAX_WAIT_TIME}); do # 5 min
    sleep 0.5
    IS_SERVER_RUNNING=$(curl -LI ${LOCAL_HOST} -o /dev/null -w '%{http_code}' -s)
    if [[ "${IS_SERVER_RUNNING}" == "200" ]]; then
        eval muffet "${MUFFET_OPTIONS}" ${LOCAL_HOST} && exit 0 || exit 1
    fi
done

echo "error: time out $((${MAX_WAIT_TIME}/2)) sec" && exit 1
