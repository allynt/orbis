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
import React, { useEffect } from 'react';
import ReactMapGl, {
  NavigationControl,
  _MapContext as MapContext,
} from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';
import { useOrbs } from './orbs/useOrbs';
import styles from './map.module.css';
import { selectedMapStyleSelector } from './map.slice';
import { Geocoder } from './geocoder/geocoder.component';

const Map = () => {
  const { mapRef, deckRef, viewState, setViewState } = useMap();
  const dispatch = useDispatch();
  const accessToken = useSelector(mapboxTokenSelector);
  const selectedBookmark = useSelector(selectedBookmarkSelector);
  const bookmarksLoading = useSelector(bookmarksLoadingSelector);
  const selectedMapStyle = useSelector(selectedMapStyleSelector);
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

  const handleGeocoderSelect = feature => {
    const [longitude, latitude] = feature.center;
    setViewState({
      ...viewState,
      longitude,
      latitude,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  return (
    <>
      {bookmarksLoading && (
        <div className={styles.loadMask} data-testid="load-mask">
          <LoadMask />
        </div>
      )}

      <Geocoder
        className={styles.geocoder}
        mapboxApiAccessToken={accessToken}
        onSelect={handleGeocoderSelect}
      />
      <ReactMapGl
        key="bottom"
        ref={mapRef}
        width="100%"
        height="100%"
        {...viewState}
        onViewStateChange={({ viewState: { width, height, ...rest } }) => {
          setViewState(rest);
        }}
        reuseMaps
        preserveDrawingBuffer
        mapboxApiAccessToken={accessToken}
        mapStyle={selectedMapStyle?.bottomMapStyle}
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
        {mapComponents}
        <NavigationControl className={styles.navigationControl} />
      </ReactMapGl>
      <ReactMapGl
        key="top"
        style={{ position: 'absolute', top: '0px', pointerEvents: 'none' }}
        width="100%"
        height="100%"
        {...viewState}
        mapboxApiAccessToken={accessToken}
        mapStyle={selectedMapStyle?.topMapStyle}
      />
    </>
  );
};

export default React.memo(Map);
