import React from 'react';

import { Button, Typography } from '@astrosat/astrosat-ui';

import SatelliteSearchForm from './satellite-search-form/satellite-search-form.component';
import SavedSearchList from './saved-search-list/saved-search-list.component';

/**
 * @param {{
 *  satellites: import('typings/satellites').Satellite[]
 *  savedSearches: import('typings/satellites').SavedSearch[]
 *  currentSearch: Partial<import('typings/satellites').SavedSearch>
 *  aoi?: number[][]
 *  aoiTooLarge?: boolean
 *  onDrawAoiClick: React.MouseEventHandler<HTMLButtonElement>
 *  onSearch: (search: Pick<import('typings/satellites').SavedSearch, "satellites" | "end_date" | "start_date" | "tiers">) => void
 *  onSearchReload: (search: import('typings/satellites').SavedSearch) => void
 *  onSearchDelete: (search: import('typings/satellites').SavedSearch) => void
 *  onInfoClick: (info: {type: string, data: any}) => void
 * }} props
 */
const SatelliteSearch = ({
  satellites,
  savedSearches,
  currentSearch,
  aoi,
  aoiTooLarge = false,
  onDrawAoiClick,
  onSearch,
  onSearchReload,
  onSearchDelete,
  onInfoClick,
}) => {
  return (
    <>
      {savedSearches && savedSearches.length > 0 ? (
        <SavedSearchList
          savedSearches={savedSearches}
          onReloadClick={onSearchReload}
          onDeleteClick={onSearchDelete}
        />
      ) : (
        <Typography>There are no saved AOI yet</Typography>
      )}
      <Button color="secondary" onClick={onDrawAoiClick}>
        Draw your AOI
      </Button>

      <SatelliteSearchForm
        satellites={satellites}
        aoi={aoi}
        aoiTooLarge={aoiTooLarge}
        currentSearch={currentSearch}
        onSubmit={onSearch}
        onInfoClick={onInfoClick}
      />
    </>
  );
};

export default SatelliteSearch;

/* 
const AOI_DRAW_MODE = 'RectangleMode';
const BBOX_NO_OF_POINTS = 5;

const [geometry, setGeometry] = useState(null);
  const [isAoiMode, setIsAoiMode] = useState(false);

const getDraw = useCallback(() => {
    const control = map?._controls.find(ctrl => ctrl.changeMode);
    const feature = control?.getAll().features[0];
    return [control, feature];
  }, [map]);

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
*/
