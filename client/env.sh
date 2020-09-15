#!/bin/sh

OUTPUT="/home/app/client/build/env-config.js"
INPUT="/home/app/client/.env"

echo "window._env_ = {" > $OUTPUT
awk -F '=' '{ print $1 ": \"" (ENVIRON[$1] ? ENVIRON[$1] : $2) "\"," }' $INPUT >> $OUTPUT
echo "}" >> $OUTPUT
