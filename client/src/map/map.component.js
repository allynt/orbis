import React, { useCallback } from 'react';

import { LoadMask, makeStyles } from '@astrosat/astrosat-ui';

import {
  AmbientLight,
  LightingEffect,
  _SunLight as SunLight,
} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import ReactMapGl, { ScaleControl } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import { useDispatch, useSelector } from 'react-redux';

import { mapboxTokenSelector } from 'app.slice';
import { isLoadingSelector as bookmarksLoadingSelector } from 'bookmarks/bookmarks.slice';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from 'MapContext';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { isDrawingAoiSelector } from 'satellites/satellites.slice';
import { useSatellitesLayers } from 'satellites/useSatellitesLayers';

import { ButtonControls } from './controls/button-controls.component';
import { ExtrusionScaleSlider } from './controls/extrusion-scale-slider/extrusion-scale-slider.component';
import { NavigationControl } from './controls/navigation-control/navigation-control.component';
import { isLoadingSelector, selectedMapStyleSelector } from './map.slice';
import {
  extrudedModeSelector,
  extrusionScaleSelector,
  setExtrusionScale,
} from './orbs/layers.slice';
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
  scaleControl: {
    position: 'absolute',
    right: '25rem',
    zIndex: 1,
    bottom: '1.25em',
  },
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

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const dirLight = new SunLight({
  timestamp: Date.UTC(2019, 7, 1, 10),
  color: [255, 255, 255],
  intensity: 1.0,
});

const lightingEffect = new LightingEffect({ ambientLight, dirLight });
lightingEffect.shadowColor = [0, 0, 0, 0.5];

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
  const {
    drawAoiLayer,
    scenesLayer,
    selectedSceneLayer,
  } = useSatellitesLayers();
  const isDrawingAoi = useSelector(isDrawingAoiSelector);

  const handleGeocoderSelect = useCallback(
    newViewState => setViewState(newViewState),
    [setViewState],
  );

  const handleExtrusionScaleChange = useCallback(
    value => dispatch(setExtrusionScale(value)),
    [dispatch],
  );

  const handleViewStateChange = ({ viewState: { width, height, ...rest } }) => {
    setViewState(rest);
  };

  const getBottomMapCursor = useCallback(({ isDragging, isHovering }) => {
    if (isHovering) return 'pointer';
    return isDragging ? 'grabbing' : 'grab';
  }, []);

  const getTopMapCursor = useCallback(
    cursorState => {
      if (drawingToolsEnabled && editableLayer?.state?.cursor)
        return editableLayer?.state?.cursor;
      if (drawAoiLayer) return drawAoiLayer?.state?.cursor;
      return getBottomMapCursor(cursorState);
    },
    [drawAoiLayer, drawingToolsEnabled, editableLayer, getBottomMapCursor],
  );

  const mapProps = {
    ...viewState,
    width: '100%',
    height: '100%',
    reuseMaps: true,
    preserveDrawingBuffer: true,
    mapboxApiAccessToken: accessToken,
  };

  const topMapIsController = drawingToolsEnabled || isDrawingAoi;

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

      <DeckGL
        ref={bottomDeckRef}
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
        effects={[lightingEffect]}
        glOptions={{
          preserveDrawingBuffer: true,
        }}
      >
        <ReactMapGl
          key="bottom"
          ref={bottomMapRef}
          mapStyle={selectedMapStyle?.bottomMapStyle}
          attributionControl={false}
          {...mapProps}
        />
      </DeckGL>

      <ReactMapGl
        key="top"
        ref={topMapRef}
        style={{ pointerEvents: 'none' }}
        mapStyle={selectedMapStyle?.topMapStyle}
        {...mapProps}
      >
        <DeckGL
          ref={topDeckRef}
          controller={topMapIsController}
          viewState={viewState}
          onViewStateChange={handleViewStateChange}
          layers={[drawAoiLayer, editableLayer]}
          getCursor={getTopMapCursor}
          style={{ pointerEvents: topMapIsController ? 'all' : 'none' }}
          glOptions={{
            preserveDrawingBuffer: true,
          }}
        />
        <NavigationControl onViewStateChange={handleViewStateChange} />
        <div className={styles.scaleControl}>
          <ScaleControl unit="metric" />
        </div>
        <Geocoder
          mapRef={topMapRef}
          mapboxApiAccessToken={accessToken}
          position="top-right"
          marker={false}
          onViewportChange={handleGeocoderSelect}
        />
        <React.Suspense fallback={<div>Loading...</div>}>
          {mapComponents}
        </React.Suspense>
      </ReactMapGl>
    </div>
  );
};

export default React.memo(Map);
