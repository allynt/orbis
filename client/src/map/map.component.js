import { LoadMask } from '@astrosat/astrosat-ui';
import { mapboxTokenSelector } from 'app.slice';
import {
  isLoaded as onBookmarkLoaded,
  isLoadingSelector as bookmarksLoadingSelector,
  selectedBookmarkSelector,
} from 'bookmarks/bookmark.slice';
import { setLayers } from 'data-layers/data-layers.slice';
import DeckGL, { FlyToInterpolator } from 'deck.gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from 'MapContext';
import React, { useCallback, useEffect, useRef } from 'react';
import ReactMapGl, {
  NavigationControl,
  _MapContext as MapContext,
} from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';
import { useOrbs } from './orbs/useOrbs';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { selectedMapStyleSelector } from './map.slice';
import Geocoder from 'react-map-gl-geocoder';
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
  const selectedMapStyle = useSelector(selectedMapStyleSelector);
  const geocoderContainerRef = useRef();
  const { layers, mapComponents } = useOrbs();

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
    newViewState => {
      setViewState(newViewState);
    },
    [setViewState],
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
        {mapComponents}
      </ReactMapGl>
    </>
  );
};

export default React.memo(Map);
