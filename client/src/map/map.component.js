import { LayersIcon, Button, LoadMask } from '@astrosat/astrosat-ui/';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isLoaded,
  selectedBookmarkSelector,
  isLoadingSelector as bookmarksLoadingSelector,
} from '../bookmarks/bookmark.slice';
import MapStyleSwitcher from '../mapstyle/mapstyle-switcher.component';
import layoutStyles from './map-layout.module.css';
import {
  selectMapStyle,
  viewportSelector,
  selectedMapStyleSelector,
} from './map.slice';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';
import { mapboxTokenSelector, mapStylesSelector } from 'app.slice';

const Map = () => {
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
        <div className={layoutStyles.loadMask} data-testid="load-mask">
          <LoadMask />
        </div>
      )}
      <DeckGL controller initialViewState={viewport}>
        <StaticMap
          reuseMap
          mapboxApiAccessToken={accessToken}
          mapStyle={selectedMapStyle?.uri}
        />
      </DeckGL>
      <Button
        theme="secondary"
        onClick={() => setIsMapStyleSwitcherVisible(!isMapStyleSwitcherVisible)}
        className={layoutStyles.mapStyleButton}
      >
        <LayersIcon title="layers" classes={layoutStyles.icon} />
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
