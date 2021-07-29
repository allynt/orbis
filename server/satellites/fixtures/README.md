- satellites_satellites.json: set of DEFAULT satellites for ORBIS

  To generate satellites fixture: `docker-compose exec server pipenv run ./server/manage.py dumpdata --indent 2 --natural-primary --natural-foreign satellites.satellite satellites.satellitevisualisation > server/satellites/fixtures/satellites_satellites.json`

  Note that this uses natural keys for the satellite->visualisations relationship.

  Note also that this fixture can take advantage of astrosat_core's custom `loaddata --media` management command option.

  This will attempt to copy the corresponding media files (in this case, SatelliteVisualition.thumbnail) to the appropriate storage location.
