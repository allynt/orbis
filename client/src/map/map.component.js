import React, { useCallback, useEffect, useState } from 'react';

import { Button, LayersIcon, LoadMask } from '@astrosat/astrosat-ui';

import DeckGL, { FlyToInterpolator } from 'deck.gl';
import ReactMapGl, {
  NavigationControl,
  ScaleControl,
  _MapContext as MapContext,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Geocoder from 'react-map-gl-geocoder';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useDispatch, useSelector } from 'react-redux';

import { mapboxTokenSelector } from 'app.slice';
import {
  isLoaded as onBookmarkLoaded,
  isLoadingSelector as bookmarksLoadingSelector,
  selectedBookmarkSelector,
} from 'bookmarks/bookmark.slice';
import { setLayers } from 'data-layers/data-layers.slice';
import MapStyleSwitcher from 'map-style/map-style-switcher/map-style-switcher.component';
import { useMap } from 'MapContext';
import {
  mapStylesSelector,
  selectedMapStyleSelector,
  selectMapStyle,
} from './map.slice';
import { useOrbs } from './orbs/useOrbs';

import styles from './map.module.css';

/** @type {React.CSSProperties} */
const TOP_MAP_CSS = {
  position: 'absolute',
  top: 0,
  pointerEvents: 'none',
};

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
    <>
      {bookmarksLoading && (
        <div className={styles.loadMask} data-testid="load-mask">
          <LoadMask />
        </div>
      )}
      <Button
        theme="secondary"
        className={styles.mapStyleButton}
        onClick={() => setMapStyleSwitcherVisible(cur => !cur)}
      >
        <LayersIcon classes={styles.icon} />
      </Button>
      {mapStyleSwitcherVisible && (
        <MapStyleSwitcher
          mapStyles={mapStyles}
          selectedMapStyle={selectedMapStyle.id}
          selectMapStyle={handleMapStyleSelect}
        />
      )}
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
        <NavigationControl className={styles.navigationControl} />
        <div
          className={styles.scaleControl}
          style={{
            right:
              selectedMapStyle?.id === 'satellite' ? '20.25em' : '17.25rem',
          }}
        >
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
    </>
  );
};

export default React.memo(Map);
