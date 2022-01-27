FROM 339570402237.dkr.ecr.eu-west-1.amazonaws.com/company/astrosat/base:focal-python38-node16

USER app

ENV PIPENV_DONT_LOAD_ENV=1
ENV PIPENV_NO_SPIN=1
ENV PIPENV_VENV_IN_PROJECT=1

# All services default off, must be enabled at runtime
ENV ENABLE_CELERY=0
ENV ENABLE_DJANGO=0
ENV ENABLE_UWSGI=0

WORKDIR $APP_HOME

# Install backend deps
# Note that we copy Pipfile from the server directory to the root directory.  This
# is so that the virtual environment that is created there is not overwritten when
# mounting the server volume in docker-compose.  This means that there are 2 copies
# of the Pipfile; it is the one in $APP_HOME and _not_ $APP_HOME/server that is used.
COPY --chown=app:app ./server/Pipfile* $APP_HOME/
RUN cd $APP_HOME && pipenv install --dev
ENV PIPENV_PIPFILE=$APP_HOME/Pipfile

COPY --chown=root:root run-django.sh $APP_HOME/
COPY --chown=root:root run-celery.sh $APP_HOME/
COPY --chown=root:root run-uwsgi.sh $APP_HOME/

USER root

# run startup script as per https://github.com/phusion/baseimage-docker#running_startup_scripts
RUN mkdir -p /etc/my_init.d
COPY startup.sh /etc/my_init.d/startup.sh
