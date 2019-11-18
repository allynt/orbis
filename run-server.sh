#!/bin/bash
set -euo pipefail

until echo > /dev/tcp/db/5432; do sleep 1; done

cd $APP_HOME/server

setuser app pipenv run ./manage.py migrate

# This check is here as the client runs in a separate container.
# For Django to serve the frontent, it must first be built
# `cd client && yarn build`. During development, once the containers
# are running, if you want the latest frontent code accessible via
# the server, you must first do `cd client && yarn build`, then collect
# the distribution e.g. `cd server && manage.py collectstatic`
if [ -d $APP_HOME/client/build/static ]; then
  setuser app pipenv run ./manage.py collectstatic --no-input --link
fi

exec /sbin/setuser app pipenv run ./manage.py runserver 0.0.0.0:8000
