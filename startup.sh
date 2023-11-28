#!/bin/bash
set -euo pipefail

# startup script to determine which service(s) to run at container startup

# generate ASCII banner
figlet -t "ORBIS Server"

cd "${APP_HOME}"

if [[ "${ENABLE_CELERY}" -eq 1 ]]; then
    echo -e "\n### STARTING CELERY ###\n"
    mkdir -p /etc/service/celery
    cp run-celery.sh /etc/service/celery/run
fi

if [[ "${ENABLE_DJANGO}" -eq 1 ]]; then
    if [[ "${SYS_ENV:?Error: SYS_ENV is not set!}" == "deployment" ]]; then
        echo -e "\n### ERROR: Cannot start django runserver in deployed environment ###\n"
    else
        echo -e "\n### STARTING DJANGO ###\n"
        mkdir -p /etc/service/django
        cp run-django.sh /etc/service/django/run
    fi
fi

if [[ "${ENABLE_UWSGI}" -eq 1 ]]; then
    echo -e "\n### STARTING UWSGI ###\n"
    mkdir -p /etc/service/uwsgi
    cp run-uwsgi.sh /etc/service/uwsgi/run
else
    # Disable nginx service (enabled by default in deployment image)
    if [[ "${SYS_ENV:-unknown}" == "deployment" ]]; then
      rm -r /etc/service/nginx
    fi
fi
