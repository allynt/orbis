import React, { useEffect, useState } from 'react';

import { bbox, lineString } from '@turf/turf';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Detail from '@astrosat/astrosat-ui/dist/containers/detail';

import { fetchSavedSatellites } from './satellites.actions';
import useMap from '../map/use-map.hook';

import { ReactComponent as DrawAoiIcon } from './draw-aoi.svg';
import SatelliteSearchForm from './satellite-search-form.component';
import SavedSearchList from './saved-search-list.component';

import styles from './satellite-search.module.css';

const AOI_DRAW_MODE = 'RectangleMode';
const BBOX_NO_OF_POINTS = 5;

const SatelliteSearch = ({ map, satellites, setVisiblePanel, setSelectedMoreInfo, toggleMoreInfoDialog }, ref) => {
  const dispatch = useDispatch();

  const [geometry, setGeometry] = useState(null);

  const savedSearches = useSelector(state => state.satellites.satelliteSearches);
  const selectedSatelliteSearch = useSelector(state => state.satellites.selectedSatelliteSearch);

  const [isAoiMode, setIsAoiMode] = useState(false);

  useMap(
    map,
    mapInstance => {
      const drawCtrl = mapInstance._controls.find(ctrl => ctrl.changeMode);
      if (drawCtrl && isAoiMode) {
        // Delete any existing AOI polygon.
        drawCtrl.deleteAll();
        // Enable draw mode
        drawCtrl.changeMode(AOI_DRAW_MODE, {});
      }
      return () => {
        // Reset local state variable.
        setIsAoiMode(false);
      };
    },
    [isAoiMode]
  );

  useEffect(() => {
    let drawCtrl = null;
    if (map) {
      // Get the map's bbox from the bounds.
      const bounds = map.getBounds();
      const northWestCoord = bounds.getNorthWest();
      const northEastCoord = bounds.getNorthEast();
      const southEastCoord = bounds.getSouthEast();
      const southWestCoord = bounds.getSouthWest();
      const geometry = [
        [northWestCoord.lng, northWestCoord.lat],
        [northEastCoord.lng, northEastCoord.lat],
        [southEastCoord.lng, southEastCoord.lat],
        [southWestCoord.lng, southWestCoord.lat],
        [northWestCoord.lng, northWestCoord.lat]
      ];

      setGeometry(geometry);

      drawCtrl = map._controls.find(ctrl => ctrl.changeMode);
    }

    if (drawCtrl) {
      map.on('draw.create', () => {
        const feature = drawCtrl.getAll().features[0];
        // Only set the geometry for Satellite Search AOI features.
        if (feature && feature.properties.drawType === 'AOI') {
          const coordinates = feature.geometry.coordinates;
          if (coordinates[0].length === BBOX_NO_OF_POINTS) {
            setGeometry(coordinates[0]);
          }
        }
      });
      // Remove any drawn polygons when changing view
      return () => drawCtrl.deleteAll();
    }
  }, []);

  useEffect(() => {
    if (!savedSearches) {
      dispatch(fetchSavedSatellites());
    }
  }, [savedSearches]);

  useMap(
    map,
    mapInstance => {
      if (selectedSatelliteSearch?.aoi) {
        const { aoi } = selectedSatelliteSearch;
        const line = lineString(aoi);
        mapInstance.fitBounds(bbox(line), { padding: 275, offset: [100, 0] });
        const drawCtrl = mapInstance._controls.find(ctrl => ctrl.changeMode);
        drawCtrl.deleteAll();
        const feature = {
          type: 'Feature',
          drawType: 'AOI',
          properties: {
            drawType: 'AOI',
            fillOpacity: 0.5,
            fillColor: 'green'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [aoi]
          }
        };
        drawCtrl.add(feature);
        return () => drawCtrl.deleteAll();
      }
    },
    [selectedSatelliteSearch]
  );

  return (
    <div className={styles.search} ref={ref}>
      {savedSearches ? (
        <div>
          <Detail title="Saved Searches">
            <SavedSearchList savedSearches={savedSearches} />
          </Detail>
        </div>
      ) : (
        <p>There are no saved AOI yet</p>
      )}
      <div className={styles.drawAOI} onClick={() => setIsAoiMode(true)}>
        <DrawAoiIcon className={styles.icon} />
        <Button theme="link" classNames={[styles.button]}>
          Draw AOI
        </Button>
      </div>

      <SatelliteSearchForm
        satellites={satellites}
        geometry={geometry}
        selectedSatelliteSearch={selectedSatelliteSearch}
        setVisiblePanel={setVisiblePanel}
        setSelectedMoreInfo={setSelectedMoreInfo}
        toggleMoreInfoDialog={toggleMoreInfoDialog}
      />
    </div>
  );
};

SatelliteSearch.propTypes = {};

export default React.memo(React.forwardRef(SatelliteSearch));
