
FROM phusion/baseimage:jammy-1.0.1

# Create the app user
# Best practice is that processes within containers shouldn't run as root
# because there are often bugs found in the Linux kernel which allows container-escape exploits by "root" users inside
# the container. So we run our services as this user instead.
ENV APP_HOME=/home/app
RUN useradd -ms /bin/bash app && usermod -aG www-data app

# install dependencies...
RUN install_clean build-essential software-properties-common \
    python3 python3-dev python3-setuptools python3-wheel python3-pip \
    python3-venv python3-gdal python-is-python3 \
    postgresql-client python3-psycopg2 \
    libcairo2-dev libgdal-dev \
    curl git gpg htop less nginx vim \
    figlet toilet 
RUN python -m pip install -U pip
RUN pip install -U pipenv

ENV PIPENV_DONT_LOAD_ENV=1
ENV PIPENV_NO_SPIN=1
ENV PIPENV_VENV_IN_PROJECT=1

# set all services to be off (0); they can be explicitly enabled (1) at runtime
ENV ENABLE_CELERY=0
ENV ENABLE_DJANGO=0
ENV ENABLE_UWSGI=0

USER app
WORKDIR $APP_HOME

# Install backend deps
# Note that we copy Pipfile from the server directory to the root directory.  This
# is so that the virtual environment that is created there is not overwritten when
# mounting the server volume in docker-compose.  This means that there are 2 copies
# of the Pipfile; it is the one in $APP_HOME and _not_ $APP_HOME/server that is used.
COPY --chown=app:app ./server/Pipfile* $APP_HOME/
RUN cd $APP_HOME && pipenv install --dev
ENV PIPENV_PIPFILE=$APP_HOME/Pipfile

# copy runtime scripts...
COPY --chown=root:root run-django.sh $APP_HOME/
COPY --chown=root:root run-celery.sh $APP_HOME/
COPY --chown=root:root run-uwsgi.sh $APP_HOME/

# run startup script as per https://github.com/phusion/baseimage-docker#running_startup_scripts
USER root
RUN mkdir -p /etc/my_init.d
COPY startup.sh /etc/my_init.d/startup.sh