import React, { useEffect, useState, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button, /* Detail, */ DrawAoiIcon } from '@astrosat/astrosat-ui';

import {
  fetchSavedSatelliteSearches,
  deleteSavedSatelliteSearch,
  setCurrentSatelliteSearchQuery,
} from './satellites.slice';

import SatelliteSearchForm from './satellite-search-form.component';
import SavedSearchList from './saved-search-list.component';
import { getGeometryAreaKmSquared } from 'utils/geometry';

import styles from './satellite-search.module.css';
// import sideMenuStyles from '../control-panel/control-panel.module.css';

const AOI_DRAW_MODE = 'RectangleMode';
const BBOX_NO_OF_POINTS = 5;

const SatelliteSearch = (
  {
    map,
    satellites,
    setVisiblePanel,
    setSelectedMoreInfo,
    toggleMoreInfoDialog,
  },
  ref,
) => {
  const dispatch = useDispatch();

  const savedSearches = useSelector(
    state => state.satellites.satelliteSearches,
  );
  const maximumAoiArea = useSelector(state => state.app.config.maximumAoiArea);

  const [geometry, setGeometry] = useState(null);
  const [isAoiMode, setIsAoiMode] = useState(false);

  const getDraw = useCallback(() => {
    const control = map?._controls.find(ctrl => ctrl.changeMode);
    const feature = control?.getAll().features[0];
    return [control, feature];
  }, [map]);

  const chooseSearchQuery = search =>
    dispatch(setCurrentSatelliteSearchQuery(search));
  const deleteSavedSearchQuery = id => dispatch(deleteSavedSatelliteSearch(id));

  // Put the draw control into AOI Draw mode.
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

  // Set AOI to have exceeded max AOI.
  useEffect(() => {
    const [drawControl, feature] = getDraw();
    if (feature) {
      const featureArea = getGeometryAreaKmSquared(
        feature.geometry.coordinates[0],
      );
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

  // Set geometry to map bounds if null
  useEffect(() => {
    if (map) {
      if (!geometry) {
        setGeometryToMapBounds();
      }
    }
  }, [map, geometry, setGeometryToMapBounds]);

  // Setup what to do when the AOI is drawn.
  useEffect(() => {
    if (map) {
      map.on('draw.create', event => {
        const feature = event.features[0];

        // Only set the geometry for Satellite Search AOI features.
        if (feature && feature.properties.drawType === 'AOI') {
          const coordinates = feature.geometry.coordinates;
          if (coordinates[0].length === BBOX_NO_OF_POINTS) {
            setGeometry(coordinates[0]);
          }
        }
      });

      return () => map?._controls.find(ctrl => ctrl.changeMode)?.deleteAll();
    }
  }, [map]);

  useEffect(() => {
    if (!savedSearches) {
      dispatch(fetchSavedSatelliteSearches());
    }
  }, [savedSearches, dispatch]);

  return (
    <div className={styles.search} ref={ref}>
      {savedSearches && savedSearches.length > 0 ? (
        <div>
          {/* <Detail title="Saved Searches">
            <SavedSearchList
              savedSearches={savedSearches}
              setCurrentSearchQuery={chooseSearchQuery}
              deleteSavedSatelliteSearch={deleteSavedSearchQuery}
            />
          </Detail> */}
        </div>
      ) : (
        <p>There are no saved AOI yet</p>
      )}
      <div className={styles.drawAOI} onClick={() => setIsAoiMode(true)}>
        <DrawAoiIcon classes={styles.icon} title="draw-area-icon" />
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
      {/* <div className={sideMenuStyles.buttons}> */}
      <Button
        // classNames={[sideMenuStyles.button]}
        theme="tertiary"
        onClick={() => console.log('Task Satellite Button Clicked')}
      >
        Task Satellite
      </Button>
      {/* </div> */}
    </div>
  );
};

export default React.memo(React.forwardRef(SatelliteSearch));
