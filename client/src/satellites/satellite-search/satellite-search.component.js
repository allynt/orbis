import React, { useEffect, useState, useCallback } from 'react';

import { Button, Typography } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { RESULTS } from 'satellites/satellites.component';
import { getGeometryAreaKmSquared } from 'utils/geometry';

import {
  fetchSavedSatelliteSearches,
  deleteSavedSatelliteSearch,
  setCurrentSatelliteSearchQuery,
  fetchSatelliteScenes,
} from '../satellites.slice';
import SatelliteSearchForm from './satellite-search-form/satellite-search-form.component';
import SavedSearchList from './saved-search-list/saved-search-list.component';

const AOI_DRAW_MODE = 'RectangleMode';
const BBOX_NO_OF_POINTS = 5;

/**
 * @param {{
 *  map: any
 *  satellites: import('typings/satellites').Satellite[]
 *  setVisiblePanel: (panel: string) => void
 *  onInfoClick: (info: {type: string, data: any}) => void
 * }} props
 */
const SatelliteSearch = ({ map, satellites, setVisiblePanel, onInfoClick }) => {
  const dispatch = useDispatch();

  const savedSearches = useSelector(
    state => state.satellites.satelliteSearches,
  );
  const currentSearch = useSelector(
    state => state.satellites.currentSearchQuery,
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
    <>
      {savedSearches && savedSearches.length > 0 ? (
        <SavedSearchList
          savedSearches={savedSearches}
          onReloadClick={chooseSearchQuery}
          onDeleteClick={({ id }) => deleteSavedSearchQuery(id)}
        />
      ) : (
        <Typography>There are no saved AOI yet</Typography>
      )}
      <Button color="secondary" onClick={() => setIsAoiMode(true)}>
        Draw your AOI
      </Button>

      <SatelliteSearchForm
        satellites={satellites}
        geometryTooLarge={
          geometry && getGeometryAreaKmSquared(geometry) > maximumAoiArea
        }
        currentSearch={currentSearch}
        onSubmit={search => {
          const newSearch = { ...search, aoi: geometry };
          dispatch(setCurrentSatelliteSearchQuery(newSearch));
          dispatch(fetchSatelliteScenes(newSearch));
          setVisiblePanel(RESULTS);
        }}
        onInfoClick={onInfoClick}
      />
    </>
  );
};

export default SatelliteSearch;
