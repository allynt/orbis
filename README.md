# orbis

- [orbis](#orbis)
  - [Overview](#overview)
  - [Features](#features)
  - [Development](#development)
    - [How to install](#how-to-install)
    - [Environment variables](#environment-variables)
    - [How to start](#how-to-start)
    - [Troubleshooting](#troubleshooting)
      - [Server 500 on /api/data/sources](#server-500-on-apidatasources)
        - [Connecting to local instance of data-sources-directory](#connecting-to-local-instance-of-data-sources-directory)
      - [Unable to register/login due to missing documents](#unable-to-registerlogin-due-to-missing-documents)
    - [Testing](#testing)
      - [End-to-End Testing](#end-to-end-testing)
    - [Backups](#backups)
  - [Releases](#releases)
    - [Setup GitHub Token](#setup-github-token)
    - [Releasing Code](#releasing-code)
    - [Manage hung release](#manage-hung-release)
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

## Development

Orbis uses other API micro-services to provide data to the frontend e.g. `data-sources-directory`. While developing, you will normally want to interact with the `testing` version. For this, you will need to be on the **VPN**. You will need a developer `$PROJ_ROOT/server/.env.local` file so orbis starts up correctly e.g.

```bash
# secret key...
DJANGO_SECRET_KEY="mydjangosecretkey"

# domain...
DJANGO_SITE_DOMAIN="localhost:8000"

# third-party access..
DJANGO_MAPBOX_TOKEN=mymapboxtoken

DJANGO_TRACKING_ID=mygoogletrackingid

# remote media...
DJANGO_MEDIA_STORAGE="S3"
DJANGO_MEDIA_BUCKET="orbis-testing-media"

DJANGO_DATA_SOURCES_DIRECTORY_URL="https://api.testing.data-sources-directory.astrosat.net"

DJANGO_DATA_TOKEN_SECRET="mydjangodatatokensecret"

DJANGO_COPERNICUS_USERNAME="myusername"
DJANGO_COPERNICUS_PASSWORD="mypassword"

DJANGO_OLSP_URL="https://testing.olsp.astrosat.net"
```

### How to install

```bash
$ django-admin.py startproject \
  --template=https://github.com/marksmall/django-project-template/archive/master.zip \
  --extension=py,md,template,json \
  project_name
$ for f in `ls -a .env* *.template`; do mv $f ${f%.*}; done
$ pipenv install
```

This will scaffold a new Django/React project, ran inside Docker containers. `project_name` should be the name you want to give to your project. The name you give your project will be interpolated through the files with the **extensions**, named in the command.

### Environment variables

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

### How to start

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
$ docker-compose exec server pipenv run server/manage.py force_group_membership --groups admingroup coreadmingroup --username <superuser>
```

To view all API endpoints, navigate to "localhost:8000/api/swagger"

### Troubleshooting

#### Server 500 on /api/data/sources

This is one of the most common errors you will get, usually it is because you have forgot to turn on the **VPN**, so do check that is on, first. If it is on, then go to data-sources-directory in testing `https://api.testing.data-sources-directory.astrosat.net/admin`. If you can see the login page, your local version of orbis, should be able to query it's API.

Sometimes access issues can be caused by a problem with the **VPN**. So you can continue to to develop, even when there is a VPN issue, we suggest switching to using the **staging** micro-services e.g. `data-sources-directory`, as these are not hidden behind the VPN. To do this you will need to update your local `$PROJ_ROOT/server/.env.local` file. This file specifies URLs to other micro-services used by orbis. So, if we take `data-sources-directory` as an example, we would update 2 settings:

```bash
DJANGO_DATA_SOURCES_DIRECTORY_URL=""
DJANGO_DATA_TOKEN_SECRET=""
```

The URL to use would be `https://staging.data-sources-directory.astrosat.net`. The **token secret** is a bit harder, you need to query the **Kubernetes cluster** to get this secret information. As long as you have `kubectl` setup correctly, then you can query different environments for their secrets e.g.

```bash
$ kubectl get secret --context staging data-sources-directory-staging-environment-secrets -o json | jq '.data | with_entries(.value |= @base64d)'
$ kubectl get secret --context staging data-sources-directory-staging-primary-deployment-secrets -o json | jq '.data | with_entries(.value |= @base64d)'
```

> **NOTE**: If you need to query any other (non production) environments, it is a simple case of changing any reference to `staging` with the environment you are interested in.

The output from the `kubectl` command, will include the `data token`, copy/paste that to the Django env variable in `.env.local` file. Restart your docker containers and once they are all up and running, you should get a successful response from `/api/data/sources` when you go to the **map**.

##### Connecting to local instance of data-sources-directory

Instead of connecting to the TESTING instance of **data-sources-directory** via the VPN, you can run a local instance of **data-sources-directory** and connect to that (b/c you are actively developing **data-sources-directory** or the TESTING environment is unavailable).  The local instance of **data-sources-directory** can be started using docker-compose as usual.  There is already configuration setup to allow network communication from a local instance of **orbis** to a local instance of **data-sources-directory** across different docker-compose files.  As above, you will have to update the settings in you ".env.local" file but this time the value would be:

```bash
DJANGO_DATA_SOURCES_DIRECTORY_URL="http://dsd-server:8000"
```
#### Unable to register/login due to missing documents

In order to authenticate with **ORBIS** certain key `Documents` must exist in the db:

* "customer_terms" - T&C document that must be agreed when creating a customer
* "user_terms" - T&C document that must be agreed when creating an (invited) user
* "general_terms" - T&C document that is linked to from the *User Profile* view
* "general_privacy" - the one-and-only privacy document

### Testing

#### End-to-End Testing

We use [Cypress](https://www.cypress.io/) to run our End-to-End tests. We augment Cypress with the [Cypress Cucumber Preprocessor](https://github.com/TheBrainFamily/cypress-cucumber-preprocessor). This allows us to use the `cucumber`/`gherkin` syntax to write **Feature** files. The idea is, **BAs** write the **Feature** files to define the requirements of the app, while the **developers** take these and implement a solution to each **Scenario**. Running and passing the tests, is proof, we have developed what was asked for.

### Backups

Database dumps can be created using the `dbbackup` and `mediabackup` management commands.  This will create dumps named `/tmp/orbis/backups/<db-name>-<uuid>-<timestamp>.psql` (for the db content) and `/tmp/orbis/backups/<db-name>-<uuid>-<timestamp>.tar` (for the media storage).  These dumps can be restored using the `dbrestore` and `mediarestore` management commands.  

By default, b/c most of our apps use PostGIS, a non-binary dump will be created.  If a different format is preferred then a custom connector can be defined in "settings.py":

```
DBBACKUP_CONNECTORS = DATABASES
DATABASES["default"]["CONNECTOR"] = "dbbackup.db.postgresql.PgDumpBinaryConnector"
```

If any errors ocurr during the restore command, a (non-binary) dump can be edited by hand and passed directly to the database using psql: `psql -h localhost -U <db-user> -d <db-name> -a -f <db-dump>`.

The workflow for creating dumps remotely and restoring them locally is as follows:

1. generate a dump of the remote database: `kubectl exec -it <remote-pod> -- bash -c "cd server && pipenv run ./manage.py dbbackup"`
2. generate a dump of the remote media storage: `kubectl exec -it <remote-pod> -- bash -c "cd server && pipenv run ./manage.py mediabackup"`
3. copy those dumps to the local filesystem: `kubectl cp <remote-pod>:/tmp/orbis/backups/ ./backups`
4. copy the db dump into the local docker db container: `docker cp ./backups/<db-dump> orbis_orbis-db_1:/tmp/dump.psql`
5. copy the media dump into the local docker server container: `docker cp ./backups/<media-dump> orbis_orbis-server_1:/tmp/media.tar`
6. restore the db dump: `docker-compose exec orbis-db psql -h localhost -U <db-user> -d <db-name> -a -f /tmp/dump.psql` (where &lt;db-user&gt; etc. are defined in the ".env" file)
7. restore the media dump: `docker-compose exec orbis-server pipenv run ./server/manage.py mediarestore -I /tmp/dump.tar --noinput`
8. you may have to update the permissions on your media directory after this: `sudo find <media-dir> -exec chmod 777 {} \;`

* _Note that this will overwrite any existing data in your local database - including users._

## Releases

Automated releases will only work if you adhere to the [Angular Commit Guidlines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)

It can be useful to create a file called `~/.gitmessage` and add it as config to your `~/.gitconfig` file e.g.

```Javascript
  [commit]
    template = ~/.gitmessage
```

Content of `~/.gitmessage`

```bash
  feat(frontend): Some Title text

  Describe why you did what you did

  IssueID #
```

This scaffolds the message in your editor of choice, when committing code. You then amend the message as appropriate for your commit.

### Setup GitHub Token

**NOTE:** This is a one time setup you need to do:

1. Log into GitHub.
1. Click **Settings** from your profile drop-down in top-right of github.
1. Click **Developer settings** from left-side menu
1. Click **Personal access tokens**
1. Click **Generate new token**, enter your password to confirm it is you
1. Give the token a name e.g. **Astrosat Release Token**
1. Click **repo** checkbox to give full access
1. Click **Generate token** button
1. Save token locally, **NOTE:** you will not be able to see the value again
1. In `.bashrc` add `export GITHUB_REGISTRY_TOKEN='????????'`

### Releasing Code

One you have a token setup (see previous [section](#setup-github-token)), you can run releases.

Follow these steps to produce a release of the application:

```bash
cd client
yarn install
yarn release
```

**NOTE:** This must be done in the `master` branch and it must be up-to-date with the remote.

**PROBLEM:** One thing I see a lot, is that the command never completes. It does do most things through to completion, but for some reason the **Github release** page is **not published**.

```text
I tend to kill the process and manually publish the release in GitHub, in these situations. It seems fine.
```

### Manage hung release

1. Kill the running `yarn release` process in the terminal, simple `CTRL + C`, should suffice.
2. Check that all new commits have been pushed, e.g. CHANGELOG updates.
3. Select **Edit** button for the draft release of interest, from https://github.com/astrosat/orbis/releases
4. Scroll down and click **Publish release** button.

### Deploying to environments

Since the release command pushed code to the `master` branch, it will automatically be re-built and deployed to the `testing` environment.

1. The `testing` environment should be checked by the developer(s) to ensure no new bugs have been introduced, if satisfied.
1. Then update `staging` e.g. `gort gh deploy <app> staging <tag>` as in `gort gh deploy orbis staging v1.0.0`.
1. Announce to the wider team in Slack that the release has been deployed to `staging` and is ready for final review, if you get **sign-off** by management.
1. Update `production` with the same tagged version e.g. `gort gh deploy <app> production <tag>`

### Release Strategy

`semantic-release` has been configured via **plugins** to do the following:

- Analyze **Angular style** commit messages
- Generate `CHANGELOG.md` entry
- Increment version in `package.json`
- Commit changes
- Create tag of the form v1.1.1
- Create GitHub release
- **Do NOT** publish to npm registry
