# orbis

- [orbis](#orbis)
  - [Overview](#overview)
  - [Features](#features)
  - [How to install](#how-to-install)
  - [Environment variables](#environment-variables)
  - [How to start](#how-to-start)
  - [Testing](#testing)
    - [End-to-End Testing](#end-to-end-testing)
  - [Release](#release)
    - [Deploying to environments](#deploying-to-environments)
    - [Release Strategy](#release-strategy)

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

## Release

Follow these steps to produce a release of the application:

```bash
cd client
yarn install
yarn release
```

**NOTE:** This must be done in the `master` branch and your `master` branch must be up-to-date with the remote.

**PROBLEM:** One thing I see a lot, is that the command never completes. It does do most things through to completion, but for some reason the Github release page is not **published**.

```text
I tend to kill the process and manually publish the release in GitHub.
```

1. Select **Edit** button for the draft release of interest, from https://github.com/astrosat/orbis/releases
2. Scoll down and click **Publish release** button.

### Deploying to environments

Since the release command pushed code to the `master` branch, it will be automatically re-built and deployed to the `testing` environment. 

1. The `testing` environment should be checked by the developer(s) to ensure no new bugs have been introduced, If satisfied.
2. Then update `staging` e.g. `gort gh deploy <app> staging <tag>` as in `gort gh deploy orbis staging v1.0.0`.
3. Announce to the wider team in Slack that the release has been deployed to `staging` and is ready for final review, if you get **sign-off**.
4. Update `production` with the same tagged version e.g. `gort gh deploy <app> production <tag>`

### Release Strategy

`semantic-release` has been configured via **plugins** to do the following:

- Analyze **Angular style** commit messages
- Generate `CHANGELOG.md` entry
- Increment version in `package.json`
- Commit changes
- Create tag of the form v1.1.1
- Create GitHub release
- **Do NOT** publish to npm registry
