FROM 339570402237.dkr.ecr.eu-west-1.amazonaws.com/company/astrosat/base:python36-node10

USER app
# ENV APP_HOME=/app/home

WORKDIR $APP_HOME

# Install client deps
COPY --chown=app:app ./client/.npmrc ./client/.yarnrc ./client/package.json $APP_HOME/client/
RUN cd $APP_HOME/client && npm install

COPY --chown=root:root nginx.conf /etc/nginx/nginx.conf

# Install backend deps
COPY --chown=app:app ./Pipfile ./Pipfile.lock $APP_HOME/server/
RUN cd $APP_HOME/server && pipenv install

# Install client code
COPY --chown=app:app ./client/ $APP_HOME/client/

# Install server code
COPY --chown=app:app ./server/ $APP_HOME/server/

# Install uwsgi runner
COPY --chown=root:root run-uwsgi.sh /etc/service/uwsgi/run
# Install nginx runner
COPY --chown=root:root run-nginx.sh /etc/service/nginx/run

HEALTHCHECK --start-period=120s CMD curl -sf http://127.0.0.1/healthcheck/?format=json
EXPOSE 80

# The baseimage requires ultimately running as root
USER root

# LABEL project "orbis"

# ARG COMMIT_HASH="undefined"
# ARG GIT_BRANCH="undefined"
# ENV COMMIT_HASH=$COMMIT_HASH
# ENV GIT_BRANCH=$GIT_BRANCH

# ENV PROJECT_DIR=/opt/orbis
# ENV SERVER_DIR=$PROJECT_DIR/server
# ENV PYTHONPATH=/usr/local/bin:$SERVER_DIR

# ENV MANAGE_PY=$SERVER_DIR/manage.py
# ENV DJANGO_SETTINGS_MODULE=core.settings

# WORKDIR $PROJECT_DIR

# COPY Pipfile Pipfile.lock $PROJECT_DIR/

# RUN apt update && apt install -y postgresql-client python3-gdal && \
#   rm -rf /var/lib/apt/lists/* && \
#   pip3 install --upgrade pip && \
#   pip3 install --upgrade pipenv && \
#   pipenv install --system --dev


# ENTRYPOINT ["./docker-entrypoint.sh"]
# CMD ["-w"]

# EXPOSE 8888:8888

# COPY . .
