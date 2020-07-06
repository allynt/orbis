import React, { useEffect, useState, useRef } from 'react';

import { LayersIcon, Button, LoadMask } from '@astrosat/astrosat-ui/';

import DeckGL from '@deck.gl/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StaticMap,
  NavigationControl,
  _MapContext as MapContext,
} from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';

import {
  isLoaded,
  selectedBookmarkSelector,
  isLoadingSelector as bookmarksLoadingSelector,
} from '../bookmarks/bookmark.slice';
import MapStyleSwitcher from '../mapstyle/mapstyle-switcher.component';
import {
  selectMapStyle,
  viewportSelector,
  selectedMapStyleSelector,
} from './map.slice';
import { mapboxTokenSelector, mapStylesSelector } from 'app.slice';

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './map.module.css';

const Map = () => {
  const mapRef = useRef();
  const dispatch = useDispatch();
  const accessToken = useSelector(mapboxTokenSelector);
  const viewport = useSelector(viewportSelector);
  const selectedBookmark = useSelector(selectedBookmarkSelector);
  const bookmarksLoading = useSelector(bookmarksLoadingSelector);
  const mapStyles = useSelector(mapStylesSelector);
  const selectedMapStyle = useSelector(selectedMapStyleSelector);
  const [isMapStyleSwitcherVisible, setIsMapStyleSwitcherVisible] = useState(
    false,
  );

  useEffect(() => {
    dispatch(isLoaded());
  }, [selectedBookmark, dispatch]);
  return (
    <>
      {bookmarksLoading && (
        <div className={styles.loadMask} data-testid="load-mask">
          <LoadMask />
        </div>
      )}
      <DeckGL
        controller
        initialViewState={viewport}
        ContextProvider={MapContext.Provider}
      >
        <StaticMap
          ref={mapRef}
          reuseMap
          mapboxApiAccessToken={accessToken}
          mapStyle={selectedMapStyle?.uri}
        />
        <Geocoder mapRef={mapRef} mapboxApiAccessToken={accessToken} />
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
