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

COPY --chown=app:app . $APP_HOME

# Install client deps
RUN cd $APP_HOME/client && yarn install

# Install backend deps
RUN cd $APP_HOME/server && pipenv install --dev

# Start client and backend dev servers
COPY --chown=root:root run-client.sh /etc/service/client/run
COPY --chown=root:root run-server.sh /etc/service/server/run

# necessary to have permission to remove nginx support
USER root
RUN rm -rf /etc/service/nginx

# The baseimage requires ultimately running as root
USER root























# # syntax=docker/dockerfile:experimental


# FROM 339570402237.dkr.ecr.eu-west-1.amazonaws.com/company/astrosat/base:python36-node10

# # USER app

# # Secret echoed out for demonstration; don't do this with actually sensitive values
# COPY --chown=app:app ./client/package.json ./client/yarn.lock ./client/.npmrc ./client/.yarnrc $APP_HOME/client/
# RUN --mount=type=secret,id=GITHUB_REGISTRY_TOKEN,dst=/tmp/github-registry-token.txt cat /tmp/github-registry-token.txt
# RUN --mount=type=secret,id=GITHUB_REGISTRY_TOKEN,dst=/tmp/github-registry-token.txt cd client && export GITHUB_REGISTRY_TOKEN="$(cat /tmp/github-registry-token.txt)" && yarn install
# # RUN --mount=type=secret,id=GITHUB_REGISTRY_TOKEN,dst=/tmp/file_containing_secrets.txt cat /tmp/file_containing_secrets.txt
# # RUN cat /tmp/file_containing_secrets.txt

# # FROM 339570402237.dkr.ecr.eu-west-1.amazonaws.com/company/astrosat/base:python36-node10

# # # USER app

# # # Some explanation is necessary here I feel.
# # # We need a GitHub token here, to install node dependencies, so
# # # we pass it in as an `argument`. we then reference the arg as an
# # # `environment variable`. When using `docker-compose`, the argument is
# # # read in from your local environment and passed to this Dockerfile when
# # # building the container.
# # # ARG TOKEN
# # # ENV GITHUB_REGISTRY_TOKEN=$TOKEN
# # # ENV APP_HOME=/home/app
# # WORKDIR $APP_HOME

# # # Copy and install dependencies separately, so the
# # # layer can be cached in future runs.
# # COPY --chown=app:app ./client/package.json ./client/yarn.lock ./client/.npmrc ./client/.yarnrc $APP_HOME/client/
# # RUN --mount=type=secret,id=GITHUB_REGISTRY_TOKEN,dst=/tmp/github-registry-token.txt cat /tmp/github-registry-token.txt
# # RUN cat /tmp/github-registry-token.txt
# # # RUN --mount=type=secret,id=GITHUB_REGISTRY_TOKEN,dst=/tmp/github-registry-token.txt cd client && yarn install

# # # COPY --chown=app:app ./server/Pipfile ./server/Pipfile.lock $APP_HOME/server/
# # # RUN cd server && pipenv install --dev

# # # COPY --chown=app:app . $APP_HOME

# # # # Install client deps
# # # # RUN cd $APP_HOME/client && yarn install

# # # # Install backend deps
# # # # RUN cd $APP_HOME/server && pipenv install --dev

# # # # Start client and backend dev servers
# # # COPY --chown=root:root run-client.sh /etc/service/client/run
# # # COPY --chown=root:root run-server.sh /etc/service/server/run

# # # # necessary to have permission to remove nginx support
# # # USER root
# # # RUN rm -rf /etc/service/nginx

# # # # The baseimage requires ultimately running as root
# # # USER root
