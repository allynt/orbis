# orbis

- [orbis](#orbis)
  - [Overview](#overview)
  - [Features](#features)
  - [How to install](#how-to-install)
  - [Environment variables](#environment-variables)
  - [How to start](#how-to-start)
  - [Testing](#testing)
    - [End-to-End Testing](#end-to-end-testing)

## Overview

This is a simple **Django 2.0+** project template with my preferred setup. It is setup so Django acts as an **API** to a **ReactJS client**. Django wraps the client application in a **Template View**, utilizing Django's auth decorator.

## Features

- Django 2.0+
- Uses [Pipenv](https://github.com/kennethreitz/pipenv) - the officially recommended Python packaging tool from Python.org.
- Development, Staging and Production settings with [django-configurations](https://django-configurations.readthedocs.org).
- Get value insight and debug information while on Development with [django-debug-toolbar](https://django-debug-toolbar.readthedocs.org).
- Collection of custom extensions with [django-extensions](http://django-extensions.readthedocs.org).
- HTTPS and other security related settings on Staging and Production.
- PostgreSQL database support with psycopg2.

## How to install

```bash
$ django-admin.py startproject \
  --template=https://github.com/marksmall/django-project-template/archive/master.zip \
  --extension=py,md,template,json \
  project_name
$ for f in `ls -a .env* *.template`; do mv $f ${f%.*}; done
$ pipenv install
```

This will scaffold a new Django/React project, ran inside Docker containers. `project_name` should be the name you want to give to your project. The name you give your project will be interpolated through the files with the **extensions**, named in the command.

## Environment variables

These are common between environments. The `ENVIRONMENT` variable loads the correct settings, possible values are: `DEVELOPMENT`, `STAGING`, `PRODUCTION`.

```bash
ENVIRONMENT=DEVELOPMENT
DJANGO_SECRET_KEY=dont-tell-eve
DJANGO_DEBUG=yes
```

These settings(and their default values) are only used on staging and production environments.

```bash
DJANGO_SESSION_COOKIE_SECURE=yes
DJANGO_SECURE_BROWSER_XSS_FILTER=yes
DJANGO_SECURE_CONTENT_TYPE_NOSNIFF=yes
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=yes
DJANGO_SECURE_HSTS_SECONDS=31536000
DJANGO_SECURE_REDIRECT_EXEMPT=
DJANGO_SECURE_SSL_HOST=
DJANGO_SECURE_SSL_REDIRECT=yes
DJANGO_SECURE_PROXY_SSL_HEADER=HTTP_X_FORWARDED_PROTO,https
```

## How to start

Starting the project starts 3 separate **Docker containers** (in order):

1. Database
1. Client front-end
1. Server api

```bash
$ cd client && yarn install
$ cd ..
$ docker-compose up --build
$ docker-compose exec server pipenv run server/manage.py createsuperuser
$ docker-compose exec server pipenv run server/manage.py force_verification --username <superuser>
```

To view all API endpoints, navigate to "localhost:8000/api/swagger"

## Testing

### End-to-End Testing

We use [Cypress](https://www.cypress.io/) to run our End-to-End tests. We augment Cypress with the [Cypress Cucumber Preprocessor](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor). This allows us to use the `cucumber`/`gherkin` syntax to write **Feature** files. The idea is, **BAs** write the **Feature** files to define the requirements of the app, while the **developers** take these and implement a solution to each **Scenario**. Running and passing the tests, is proof, we have developed what was asked for.
