import React, { useCallback } from 'react';

import { LoadMask, makeStyles } from '@astrosat/astrosat-ui';

import { useDispatch, useSelector } from 'react-redux';

import { mapboxTokenSelector } from 'app.slice';
import { isLoadingSelector as bookmarksLoadingSelector } from 'bookmarks/bookmarks.slice';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapStylesSelector } from 'map/map.slice';
import { useMap } from 'MapContext';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { isDrawingSatelliteAoiSelector } from 'satellites/satellites.slice';
import { useSatellitesLayers } from 'satellites/useSatellitesLayers';

import { transformOSDataRequests } from '../map-style/mapStyle.utils';
import { BottomMap } from './bottom-map.component';
import { ButtonControls } from './controls/button-controls.component';
import { ExtrusionScaleSlider } from './controls/extrusion-scale-slider/extrusion-scale-slider.component';
import { isLoadingSelector, selectedMapStyleSelector } from './map.slice';
import {
  extrudedModeSelector,
  extrusionScaleSelector,
  setExtrusionScale,
} from './orbs/layers.slice';
import { TopMap } from './top-map.component';
import { useSelectionTools } from './useSelectionTools';

const useStyles = makeStyles(theme => ({
  map: {
    position: 'relative',
    width: '100%',
    height: '100%',
    '& .mapboxgl-ctrl-geocoder': {
      position: 'absolute',
      right: '2rem',
      zIndex: 1,
      top: '0.5rem',
      backgroundColor: theme.palette.background.default,
      boxShadow: theme.shadows[2],
      '&--icon': {
        fill: theme.palette.primary.main,
      },
      '&--button': {
        backgroundColor: 'transparent',
      },
      '&--input': {
        outline: 'none',
        color: theme.palette.text.primary,
      },
      '&--input:focus': {
        outline: 'none',
        color: theme.palette.text.primary,
      },
      '& .suggestions': {
        backgroundColor: theme.palette.background.default,
        '& > .active > a': {
          backgroundColor: theme.palette.secondary.light,
        },
        '& > li > a:hover': {
          backgroundColor: theme.palette.secondary.light,
        },
      },
      '&--suggestion': {
        color: theme.palette.text.primary,
      },
    },
    '& .mapboxgl-ctrl-bottom-left, & .mapboxgl-ctrl-top-left': {
      paddingLeft: '2rem',
    },
    '& .mapboxgl-ctrl-bottom-right, & .mapboxgl-ctrl-top-right': {
      paddingRight: '2rem',
    },
  },
  loadMask: {
    zIndex: 1000,
  },
  buttonControls: { position: 'absolute', right: '2rem', bottom: '8rem' },
  extrusionSlider: {
    position: 'absolute',
    zIndex: 1,
    width: '25%',
    maxWidth: theme.typography.pxToRem(500),
    bottom: `calc(0px + ${theme.spacing(4)})`,
    left: '50%',
    transform: 'translateX(-50%)',
  },
}));

/**
 * @param {{
 *   mapComponents: JSX.Element[]
 *   layers: any[]
 * } & import('drawing-tools/types').DrawingToolsProps} props
 */
const Map = ({
  mapComponents,
  layers,
  editableLayer,
  drawingToolsEnabled,
  setDrawingToolsEnabled,
  drawMode,
  setDrawMode,
  isDrawingAoi,
  drawAoiLayer,
}) => {
  const {
    topMapRef,
    bottomMapRef,
    topDeckRef,
    bottomDeckRef,
    viewState,
    setViewState,
    updateViewState,
  } = useMap();
  const mapStyles = useSelector(mapStylesSelector);
  const extrudedMode = useSelector(state => extrudedModeSelector(state?.orbs));
  const extrusionScale = useSelector(state =>
    extrusionScaleSelector(state?.orbs),
  );
  const dispatch = useDispatch();
  const accessToken = useSelector(mapboxTokenSelector);
  const bookmarksLoading = useSelector(bookmarksLoadingSelector);
  const mapLoading = useSelector(isLoadingSelector);
  const selectedMapStyle = useSelector(selectedMapStyleSelector);
  const styles = useStyles();
  const { selectionLayer } = useSelectionTools();

  const { drawSatelliteAoiLayer, scenesLayer, selectedSceneLayer } =
    useSatellitesLayers();
  const isDrawingSatelliteAoi = useSelector(isDrawingSatelliteAoiSelector);

  const handleExtrusionScaleChange = useCallback(
    value => dispatch(setExtrusionScale(value)),
    [dispatch],
  );

  const handleViewStateChange = useCallback(
    ({ viewState: { width, height, ...rest } }) => {
      setViewState(rest);
    },
    [setViewState],
  );

  const getBottomMapCursor = useCallback(({ isDragging, isHovering }) => {
    if (isHovering) return 'pointer';
    return isDragging ? 'grabbing' : 'grab';
  }, []);

  const getTopMapCursor = useCallback(
    cursorState => {
      if (drawingToolsEnabled && editableLayer?.state?.cursor)
        return editableLayer?.state?.cursor;
      if (isDrawingAoi && drawAoiLayer?.state?.cursor) {
        return drawAoiLayer?.state?.cursor;
      }
      if (drawSatelliteAoiLayer) {
        return drawSatelliteAoiLayer?.state?.cursor;
      }
      return getBottomMapCursor(cursorState);
    },
    [
      isDrawingAoi,
      drawAoiLayer,
      drawSatelliteAoiLayer,
      drawingToolsEnabled,
      editableLayer,
      getBottomMapCursor,
    ],
  );

  const topMapIsController =
    drawingToolsEnabled || isDrawingSatelliteAoi || isDrawingAoi;

  const transformRequest = url => transformOSDataRequests(url, mapStyles);

  return (
    <div className={styles.map}>
      <LoadMask
        data-testid="load-mask"
        className={styles.loadMask}
        open={bookmarksLoading || mapLoading}
      />
      <div className={styles.extrusionSlider}>
        <ExtrusionScaleSlider
          open={extrudedMode}
          value={extrusionScale}
          onChange={handleExtrusionScaleChange}
          mapStyle={selectedMapStyle?.id}
        />
      </div>

      <ButtonControls
        drawMode={drawMode}
        drawingToolsEnabled={drawingToolsEnabled}
        selectedMapStyleId={selectedMapStyle?.id}
        setDrawMode={setDrawMode}
        setDrawingToolsEnabled={setDrawingToolsEnabled}
        updateViewState={updateViewState}
      />
      <BottomMap
        deckRef={bottomDeckRef}
        mapRef={bottomMapRef}
        controller={!topMapIsController}
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        layers={[
          ...(layers ?? []),
          scenesLayer,
          selectedSceneLayer,
          selectionLayer,
        ]}
        getCursor={getBottomMapCursor}
        mapStyle={selectedMapStyle?.bottomMapStyle}
        mapboxApiAccessToken={accessToken}
        transformRequest={transformRequest}
      />
      <TopMap
        mapStyle={selectedMapStyle?.topMapStyle}
        mapRef={topMapRef}
        deckRef={topDeckRef}
        controller={topMapIsController}
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        getCursor={getTopMapCursor}
        mapComponents={mapComponents}
        mapboxApiAccessToken={accessToken}
        editableLayer={editableLayer}
        drawAoiLayer={drawAoiLayer}
        drawSatelliteAoiLayer={drawSatelliteAoiLayer}
        transformRequest={transformRequest}
      />
    </div>
  );
};

export default React.memo(Map);
