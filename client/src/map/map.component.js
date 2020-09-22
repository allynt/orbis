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
import React, { useEffect, useState, useCallback } from 'react';
import {
  NavigationControl,
  StaticMap,
  _MapContext as MapContext,
} from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';
import { useOrbs } from './orbs/useOrbs';
import styles from './map.module.css';
import { selectedMapStyleSelector } from './map.slice';
import { Geocoder } from './geocoder/geocoder.component';
import { MapboxLayer } from '@deck.gl/mapbox';

const Map = () => {
  const { mapRef, deckRef, viewState, setViewState } = useMap();
  const dispatch = useDispatch();
  const accessToken = useSelector(mapboxTokenSelector);
  const selectedBookmark = useSelector(selectedBookmarkSelector);
  const bookmarksLoading = useSelector(bookmarksLoadingSelector);
  const selectedMapStyle = useSelector(selectedMapStyleSelector);
  const { layers, mapComponents, preLabelLayers, postLabelLayers } = useOrbs();

  const [glContext, setGlContext] = useState();

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

  const onMapLoad = useCallback(() => {
    const map = mapRef.current.getMap();
    const deck = deckRef.current.deck;
    var styleLayers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style
    let firstSymbolId;
    for (var i = 0; i < styleLayers.length; i++) {
      if (styleLayers[i].type === 'symbol') {
        firstSymbolId = styleLayers[i].id;
        break;
      }
    }
    preLabelLayers.forEach(id =>
      map.addLayer(
        new MapboxLayer({
          id,
          deck,
        }),
        firstSymbolId,
      ),
    );
    postLabelLayers.forEach(id =>
      map.addLayer(
        new MapboxLayer({
          id,
          deck,
        }),
      ),
    );
  }, [mapRef, deckRef, preLabelLayers, postLabelLayers]);

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
      <DeckGL
        ref={deckRef}
        controller
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        layers={layers}
        ContextProvider={MapContext.Provider}
        onWebGLInitialized={setGlContext}
        glOptions={{
          /* To render vector tile polygons correctly */
          stencil: true,
          preserveDrawingBuffer: true,
        }}
      >
        <StaticMap
          width="100%"
          height="100%"
          ref={mapRef}
          gl={glContext}
          reuseMaps
          preserveDrawingBuffer
          mapboxApiAccessToken={accessToken}
          mapStyle={selectedMapStyle}
          onLoad={onMapLoad}
        />
        {mapComponents}
        <NavigationControl className={styles.navigationControl} />
      </DeckGL>
    </>
  );
};

export default React.memo(Map);
