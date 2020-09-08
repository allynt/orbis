#!/bin/sh

OUTPUT="./env-config.js"
echo "window._env_ = {" > $OUTPUT
awk -F '=' '{ print $1 ": \"" (ENVIRON[$1] ? ENVIRON[$1] : $2) "\"," }' ./.env >> $OUTPUT
echo "}" >> $OUTPUT
