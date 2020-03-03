
* orbis_data_scopes.json: set of DEFAULT data scopes for OrbisRole, loaded by "./server/orbis/migrations/0006_auto_20200103_1016.py"

  To generate data scope fixture: `docker-compose exec  server pipenv run ./server/manage.py dumpdata --indent 2 --natural-primary --natural-foreign astrosat_users.userrole orbis.datascope orbis.roleaccess orbis.owneraccess > server/orbis/fixtures/orbis_data_scopes.json`

* orbis_satellites.json: set of DEFAULT satellites for ORBIS

  To generate satellites fixture: `docker-compose exec server pipenv run ./server/manage.py dumpdata --indent 2 --natural-primary --natural-foreign orbis.satellite orbis.satelliteresolution orbis.satellitevisualisation > server/orbis/fixtures/orbis_satellites.json`

  Note that this uses natural keys for the satellite->visualisations relationship.

  Note also that this fixture can take advantage of astrosat_core's custom `loaddata --media` management command option.
  This will attempt to copy the corresponding media files (in this case, SatelliteVisualition.thumbnail) to the appropriate storage location.
