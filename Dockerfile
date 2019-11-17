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

# Install backend deps
COPY --chown=app:app ./server/Pipfile ./server/Pipfile.lock $APP_HOME/server/
RUN cd $APP_HOME/server && pipenv install --dev

COPY --chown=app:app . $APP_HOME

# Start client and backend dev servers
COPY --chown=root:root run-client.sh /etc/service/client/run
COPY --chown=root:root run-server.sh /etc/service/server/run

# necessary to have permission to remove nginx support
USER root
RUN rm -rf /etc/service/nginx

# The baseimage requires ultimately running as root
USER root
