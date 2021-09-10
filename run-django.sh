#!/bin/bash
set -euo pipefail

until echo > /dev/tcp/db/5432; do sleep 1; done

cd $APP_HOME

setuser app pipenv run ./server/manage.py migrate
setuser app pipenv run ./server/manage.py createcachetable
setuser app pipenv run ./server/manage.py update_site --domain localhost:8000
setuser app pipenv run ./server/manage.py collectstatic --no-input --link

exec /sbin/setuser app pipenv run ./server/manage.py runserver 0.0.0.0:8000
