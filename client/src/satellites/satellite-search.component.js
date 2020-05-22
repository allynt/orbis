import React, { useEffect, useState, useCallback } from 'react';

import { bbox, lineString } from '@turf/turf';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';
import Detail from '@astrosat/astrosat-ui/dist/containers/detail';

import {
  fetchSavedSatelliteSearches,
  deleteSavedSatelliteSearch,
  setCurrentSatelliteSearchQuery,
} from './satellites.slice';

import useMap from '../map/use-map.hook';

import DrawAoiIcon from '@astrosat/astrosat-ui/dist/icons/draw-aoi-icon';
import SatelliteSearchForm from './satellite-search-form.component';
import SavedSearchList from './saved-search-list.component';
import { useMapEvent } from 'map/use-map-event.hook';
import { getGeometryAreaKmSquared } from 'utils/geometry';

import styles from './satellite-search.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';

const AOI_DRAW_MODE = 'RectangleMode';
const BBOX_NO_OF_POINTS = 5;

const SatelliteSearch = ({ map, satellites, setVisiblePanel, setSelectedMoreInfo, toggleMoreInfoDialog }, ref) => {
  const dispatch = useDispatch();

  const savedSearches = useSelector(state => state.satellites.satelliteSearches);
  const currentSearchQuery = useSelector(state => state.satellites.currentSearchQuery);
  const maximumAoiArea = useSelector(state => state.app.config.maximumAoiArea);

  const [geometry, setGeometry] = useState(null);
  const [isAoiMode, setIsAoiMode] = useState(false);

  const getDraw = useCallback(() => {
    const control = map?._controls.find(ctrl => ctrl.changeMode);
    const feature = control?.getAll().features[0];
    return [control, feature];
  }, [map]);

  const chooseSearchQuery = search => dispatch(setCurrentSatelliteSearchQuery(search));
  const deleteSavedSearchQuery = id => dispatch(deleteSavedSatelliteSearch(id));

  useEffect(() => {
    const [drawCtrl] = getDraw();
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
  }, [isAoiMode, getDraw]);

  useEffect(() => {
    const [drawControl, feature] = getDraw();
    if (feature) {
      const featureArea = getGeometryAreaKmSquared(feature.geometry.coordinates[0]);
      const isTooLarge = featureArea > maximumAoiArea;
      if (drawControl && isTooLarge) {
        drawControl.setFeatureProperty(feature.id, 'error', 'true');
      }
    }
  }, [geometry, getDraw, maximumAoiArea]);

  const setGeometryToMapBounds = useCallback(() => {
    // Get the map's bbox from the bounds.
    const bounds = map.getBounds();
    const northWestCoord = bounds.getNorthWest();
    const northEastCoord = bounds.getNorthEast();
    const southEastCoord = bounds.getSouthEast();
    const southWestCoord = bounds.getSouthWest();
    const newGeometry = [
      [northWestCoord.lng, northWestCoord.lat],
      [northEastCoord.lng, northEastCoord.lat],
      [southEastCoord.lng, southEastCoord.lat],
      [southWestCoord.lng, southWestCoord.lat],
      [northWestCoord.lng, northWestCoord.lat],
    ];

    setGeometry(newGeometry);
  }, [map]);

  // Set geometry to the viewbox as long as there's no drawn feature
  useMapEvent(
    map,
    'move',
    () => {
      const [drawControl, feature] = getDraw();
      if (!feature) setGeometryToMapBounds();
      return () => drawControl.deleteAll();
    },
    [],
  );

  useEffect(() => {
    if (map) {
      if (!geometry) {
        setGeometryToMapBounds();
      }
    }
  }, [map, geometry, setGeometryToMapBounds]);

  useEffect(() => {
    const [drawCtrl] = getDraw();

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
  }, [getDraw, map]);

  useEffect(() => {
    if (!savedSearches) {
      dispatch(fetchSavedSatelliteSearches());
    }
  }, [savedSearches, dispatch]);

  // If the current search query changes, redraw the AOI on map
  useMap(
    map,
    mapInstance => {
      if (currentSearchQuery?.aoi) {
        const { aoi } = currentSearchQuery;
        setGeometry(aoi);
        const line = lineString(aoi);
        mapInstance.fitBounds(bbox(line), { padding: 275, offset: [100, 0] });
        const [drawCtrl] = getDraw();
        if (drawCtrl) {
          drawCtrl.deleteAll();
          const feature = {
            type: 'Feature',
            drawType: 'AOI',
            properties: {
              drawType: 'AOI',
              fillOpacity: 0.5,
              fillColor: 'green',
            },
            geometry: {
              type: 'Polygon',
              coordinates: [aoi],
            },
          };
          drawCtrl.add(feature);
        }

        return () => {
          if (drawCtrl) {
            drawCtrl.deleteAll();
          }
        };
      }
    },
    [currentSearchQuery],
  );

  return (
    <div className={styles.search} ref={ref}>
      {savedSearches && savedSearches.length > 0 ? (
        <div>
          <Detail title="Saved Searches">
            <SavedSearchList
              savedSearches={savedSearches}
              setCurrentSearchQuery={chooseSearchQuery}
              deleteSavedSatelliteSearch={deleteSavedSearchQuery}
            />
          </Detail>
        </div>
      ) : (
        <p>There are no saved AOI yet</p>
      )}
      <div className={styles.drawAOI} onClick={() => setIsAoiMode(true)}>
        <DrawAoiIcon classes={[styles.icon]} />
        <Button theme="link" classNames={[styles.button]}>
          Draw AOI
        </Button>
      </div>

      <SatelliteSearchForm
        satellites={satellites}
        geometry={geometry}
        setVisiblePanel={setVisiblePanel}
        setSelectedMoreInfo={setSelectedMoreInfo}
        toggleMoreInfoDialog={toggleMoreInfoDialog}
      />
      <div className={sideMenuStyles.buttons}>
        <Button
          classNames={[sideMenuStyles.button]}
          theme="tertiary"
          onClick={() => console.log('Task Satellite Button Clicked')}
        >
          Task Satellite
        </Button>
      </div>
    </div>
  );
};

export default React.memo(React.forwardRef(SatelliteSearch));
