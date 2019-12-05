FROM 339570402237.dkr.ecr.eu-west-1.amazonaws.com/company/astrosat/base:python36-node10

USER app

# Some explanation is necessary here I feel.
# We need a GitHub token here, to install node dependencies, so
# we pass it in as an `argument`. we then reference the arg as an
# `environment variable`. When using `docker-compose`, the argument is
# read in from your local environment and passed to this Dockerfile when
# building the container.
ARG TOKEN
ENV GITHUB_REGISTRY_TOKEN=$TOKEN

ENV PIPENV_VENV_IN_PROJECT=1
ENV PIPENV_DONT_LOAD_ENV=1

WORKDIR $APP_HOME

# Install backend deps
COPY --chown=app:app ./server/Pipfile* $APP_HOME/
RUN cd $APP_HOME && pipenv install --dev

# Install backend code
COPY --chown=app:app ./server $APP_HOME/server

# Start backend dev server
COPY --chown=root:root run-server.sh /etc/service/server/run

# necessary to have permission to remove nginx support
USER root
RUN rm -rf /etc/service/nginx

# The baseimage requires ultimately running as root
USER root
