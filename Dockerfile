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

WORKDIR $APP_HOME

# Install client deps
COPY --chown=app:app ./client/.npmrc ./client/.yarnrc ./client/package.json $APP_HOME/client/
RUN cd $APP_HOME/client && npm install

COPY --chown=root:root nginx.conf /etc/nginx/nginx.conf

# Install backend deps
COPY --chown=app:app ./server/Pipfile ./server/Pipfile.lock $APP_HOME/server/
RUN cd $APP_HOME/server && pipenv install --dev

# Install client code
COPY --chown=app:app ./client/ $APP_HOME/client/

# Install server code
COPY --chown=app:app ./server/ $APP_HOME/server/

# Install uwsgi runner
COPY --chown=root:root run-development.sh /etc/service/uwsgi/run
# Install nginx runner
# COPY --chown=root:root run-nginx.sh /etc/service/nginx/run

HEALTHCHECK --start-period=120s CMD curl -sf http://127.0.0.1/healthcheck/?format=json
EXPOSE 80

# The baseimage requires ultimately running as root
USER root
