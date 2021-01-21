import React, { useCallback, useEffect, useState } from 'react';

import {
  Button,
  ClickAwayListener,
  LayersIcon,
  LoadMask,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { FlyToInterpolator } from '@deck.gl/core';
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
import { NavigationControl } from './controls/navigation-control.component';
import {
  mapStylesSelector,
  selectedMapStyleSelector,
  selectMapStyle,
} from './map.slice';
import { useOrbs } from './orbs/useOrbs';

/** @type {React.CSSProperties} */
const TOP_MAP_CSS = {
  position: 'absolute',
  top: 0,
  pointerEvents: 'none',
};

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
  mapStyleButton: {
    position: 'absolute',
    padding: '0.5rem',
    bottom: '8rem',
    right: '2rem',
    zIndex: 10,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.main,
    fontSize: '0.875rem',
    minWidth: 'unset',
    '&:hover': {
      backgroundColor: theme.palette.background.default,
    },
  },
  scaleControl: {
    position: 'absolute',
    right: props =>
      props.selectedMapStyle?.id === 'satellite' ? '22.25rem' : '19.25rem',
    zIndex: 1,
    bottom: '0.25em',
  },
}));

const Map = () => {
  const { mapRef, deckRef, viewState, setViewState } = useMap();
  const dispatch = useDispatch();
  const accessToken = useSelector(mapboxTokenSelector);
  const selectedBookmark = useSelector(selectedBookmarkSelector);
  const bookmarksLoading = useSelector(bookmarksLoadingSelector);
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
        open={bookmarksLoading}
      />
      <ClickAwayListener onClickAway={() => setMapStyleSwitcherVisible(false)}>
        <div>
          <Button
            className={styles.mapStyleButton}
            onClick={() => setMapStyleSwitcherVisible(cur => !cur)}
          >
            <LayersIcon fontSize="inherit" />
          </Button>
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
