import { Button, LayersIcon, LoadMask } from '@astrosat/astrosat-ui/';
import { mapboxTokenSelector, mapStylesSelector } from 'app.slice';
import {
  isLoaded as onBookmarkLoaded,
  isLoadingSelector as bookmarksLoadingSelector,
  selectedBookmarkSelector,
} from 'bookmarks/bookmark.slice';
import { setLayers } from 'data-layers/data-layers.slice';
import DeckGL, { FlyToInterpolator } from 'deck.gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from 'MapContext';
import MapStyleSwitcher from 'mapstyle/mapstyle-switcher.component';
import React, { useEffect, useState } from 'react';
import {
  NavigationControl,
  StaticMap,
  _MapContext as MapContext,
} from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';
import { useOrbs } from './orbs/useOrbs';
import styles from './map.module.css';
import { selectedMapStyleSelector, selectMapStyle } from './map.slice';

const Map = () => {
  const { setMap, setDeck, viewState, setViewState } = useMap();
  const dispatch = useDispatch();
  const accessToken = useSelector(mapboxTokenSelector);
  const selectedBookmark = useSelector(selectedBookmarkSelector);
  const bookmarksLoading = useSelector(bookmarksLoadingSelector);
  const mapStyles = useSelector(mapStylesSelector);
  const selectedMapStyle = useSelector(selectedMapStyleSelector);
  const [isMapStyleSwitcherVisible, setIsMapStyleSwitcherVisible] = useState(
    false,
  );
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

  return (
    <>
      {bookmarksLoading && (
        <div className={styles.loadMask} data-testid="load-mask">
          <LoadMask />
        </div>
      )}
      <DeckGL
        ref={ref => ref && setDeck(ref.deck)}
        controller
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        layers={layers}
        ContextProvider={MapContext.Provider}
      >
        <StaticMap
          ref={ref => ref && setMap(ref.getMap())}
          preserveDrawingBuffer
          reuseMap
          mapboxApiAccessToken={accessToken}
          mapStyle={selectedMapStyle?.uri}
        />
        {mapComponents}
        <NavigationControl className={styles.navigationControl} />
      </DeckGL>
      <Button
        theme="secondary"
        onClick={() => setIsMapStyleSwitcherVisible(!isMapStyleSwitcherVisible)}
        className={styles.mapStyleButton}
      >
        <LayersIcon title="layers" classes={styles.icon} />
      </Button>
      {isMapStyleSwitcherVisible && (
        <MapStyleSwitcher
          mapStyles={mapStyles}
          selectedMapStyle={selectedMapStyle}
          selectMapStyle={mapStyle => dispatch(selectMapStyle(mapStyle))}
        />
      )}
    </>
  );
};

export default React.memo(Map);
