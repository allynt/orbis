- orbis_data_scopes.json: set of DEFAULT data scopes for OrbisRole, loaded by "./server/orbis/migrations/0006_auto_20200103_1016.py"

  To generate data scope fixture: `docker-compose exec server pipenv run ./server/manage.py dumpdata --indent 2 --natural-primary --natural-foreign astrosat_users.userrole orbis.datascope orbis.roleaccess orbis.owneraccess > server/orbis/fixtures/orbis_data_scopes.json`
