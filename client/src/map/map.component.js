import React, { useCallback, useEffect, useState } from 'react';

import {
  ButtonGroup,
  ClickAwayListener,
  LayersIcon,
  LoadMask,
  makeStyles,
  Slide,
} from '@astrosat/astrosat-ui';

import {
  AmbientLight,
  _SunLight as SunLight,
  FlyToInterpolator,
  LightingEffect,
} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapGl, {
  ScaleControl,
  _MapContext as MapContext,
} from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useDispatch, useSelector } from 'react-redux';

import { mapboxTokenSelector } from 'app.slice';
import {
  isLoaded as onBookmarkLoaded,
  isLoadingSelector as bookmarksLoadingSelector,
  selectedBookmarkSelector,
} from 'bookmarks/bookmarks.slice';
import { setLayers } from 'data-layers/data-layers.slice';
import MapStyleSwitcher from 'map-style/map-style-switcher/map-style-switcher.component';
import { useMap } from 'MapContext';
import { NavigationControl } from './controls/navigation-control/navigation-control.component';
import {
  isLoadingSelector,
  mapStylesSelector,
  selectedMapStyleSelector,
  selectMapStyle,
} from './map.slice';
import { useOrbs } from './orbs/useOrbs';
import { setState as setIsolationPlusState } from './orbs/slices/isolation-plus.slice';
import { MapControlButton } from './controls/map-control-button.component';
import {
  extrudedModeSelector,
  extrusionScaleSelector,
  setExtrusionScale,
  toggleExtrudedMode,
} from './orbs/orbReducer';
import clsx from 'clsx';
import { ExtrusionScaleSlider } from './controls/extrusion-scale-slider/extrusion-scale-slider.component';

/** @type {React.CSSProperties} */
const TOP_MAP_CSS = {
    position: 'absolute',
    top: 0,
    pointerEvents: 'none',
  },
  ISOMETRIC_PITCH = 35;

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
  selected: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.main,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  scaleControl: {
    position: 'absolute',
    right: props =>
      props?.selectedMapStyle?.id === 'satellite' ? '22.25rem' : '19.25rem',
    zIndex: 1,
    bottom: '0.25em',
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
  _shadow: true,
});

const lightingEffect = new LightingEffect({ ambientLight, dirLight });
lightingEffect.shadowColor = [0, 0, 0, 0.5];

const Map = () => {
  const { mapRef, deckRef, viewState, setViewState } = useMap();
  const extrudedMode = useSelector(state => extrudedModeSelector(state?.orbs));
  const extrusionScale = useSelector(state =>
    extrusionScaleSelector(state?.orbs),
  );
  const dispatch = useDispatch();
  const accessToken = useSelector(mapboxTokenSelector);
  const selectedBookmark = useSelector(selectedBookmarkSelector);
  const bookmarksLoading = useSelector(bookmarksLoadingSelector);
  const mapLoading = useSelector(isLoadingSelector);
  const mapStyles = useSelector(mapStylesSelector);
  const selectedMapStyle = useSelector(selectedMapStyleSelector);
  const { layers, mapComponents } = useOrbs();
  const [mapStyleSwitcherVisible, setMapStyleSwitcherVisible] = useState(false);
  const styles = useStyles({ selectedMapStyle });

  useEffect(() => {
    if (selectedBookmark) {
      const {
        center: [longitude, latitude],
        zoom,
        layers,
        orbs,
      } = selectedBookmark;
      setViewState({
        ...viewState,
        longitude,
        latitude,
        zoom,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
      });
      dispatch(setLayers(layers || []));
      dispatch(setIsolationPlusState(orbs?.isolationPlus || {}));
      dispatch(onBookmarkLoaded());
    }
  }, [selectedBookmark, viewState, setViewState, dispatch]);

  const handleGeocoderSelect = useCallback(
    newViewState => setViewState(newViewState),
    [setViewState],
  );
  const handleMapStyleSelect = useCallback(
    mapStyle => dispatch(selectMapStyle(mapStyle)),
    [dispatch],
  );

  const handleExtrudedModeButtonClick = () => {
    setViewState({
      ...viewState,
      pitch: !extrudedMode ? ISOMETRIC_PITCH : 0,
      transitionDuration: 750,
      transitionInterpolator: new FlyToInterpolator(),
    });
    dispatch(toggleExtrudedMode());
  };

  const handleExtrusionScaleChange = value =>
    dispatch(setExtrusionScale(value));

  const mapProps = {
    ...viewState,
    width: '100%',
    height: '100%',
    reuseMaps: true,
    preserveDrawingBuffer: true,
    mapboxApiAccessToken: accessToken,
  };

  return (
    <div className={styles.map}>
      <LoadMask
        data-testid="load-mask"
        className={styles.loadMask}
        open={bookmarksLoading || mapLoading}
      />
      <div className={styles.extrusionSlider}>
        <Slide in={extrudedMode} direction="up">
          <ExtrusionScaleSlider
            value={extrusionScale}
            onChange={handleExtrusionScaleChange}
            mapStyle={selectedMapStyle?.id}
          />
        </Slide>
      </div>
      <ClickAwayListener onClickAway={() => setMapStyleSwitcherVisible(false)}>
        <div>
          <ButtonGroup className={styles.buttonControls} orientation="vertical">
            <MapControlButton
              className={clsx({ [styles.selected]: extrudedMode })}
              aria-selected={extrudedMode}
              onClick={handleExtrudedModeButtonClick}
            >
              3D
            </MapControlButton>
            <MapControlButton
              onClick={() => setMapStyleSwitcherVisible(cur => !cur)}
            >
              <LayersIcon fontSize="inherit" />
            </MapControlButton>
          </ButtonGroup>
          <MapStyleSwitcher
            open={mapStyleSwitcherVisible}
            mapStyles={mapStyles}
            selectedMapStyle={selectedMapStyle?.id}
            selectMapStyle={handleMapStyleSelect}
          />
        </div>
      </ClickAwayListener>
      <ReactMapGl
        key="bottom"
        ref={mapRef}
        onViewStateChange={({ viewState: { width, height, ...rest } }) => {
          setViewState(rest);
        }}
        mapStyle={selectedMapStyle?.bottomMapStyle}
        {...mapProps}
      >
        <DeckGL
          ref={deckRef}
          viewState={viewState}
          layers={layers}
          effects={[lightingEffect]}
          ContextProvider={MapContext.Provider}
          glOptions={{
            preserveDrawingBuffer: true,
          }}
        />
        <NavigationControl />
        <div className={styles.scaleControl}>
          <ScaleControl unit="metric" />
        </div>
      </ReactMapGl>
      <ReactMapGl
        key="top"
        style={TOP_MAP_CSS}
        mapStyle={selectedMapStyle?.topMapStyle}
        attributionControl={false}
        {...mapProps}
      >
        <Geocoder
          mapRef={mapRef}
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
