import React, { useEffect, useState } from 'react';

import { LayersIcon, Button, LoadMask } from '@astrosat/astrosat-ui/';

import DeckGL from '@deck.gl/react';
import { IconLayer } from '@deck.gl/layers';
import { useDispatch, useSelector } from 'react-redux';
import { StaticMap } from 'react-map-gl';

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

import styles from './map.module.css';
import { selectActiveLayers } from 'data-layers/data-layers.slice';

import iconAtlas from './layers/hourglass/infrastructure/iconAtlas.png';
import iconMapping from './layers/hourglass/infrastructure/iconMapping.json';

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
  const selectedLayers = useSelector(selectActiveLayers);
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    dispatch(isLoaded());
  }, [selectedBookmark, dispatch]);

  useEffect(() => {
    const newLayers = layers.filter(
      layer =>
        !!selectedLayers.find(selectedLayer => selectedLayer.name === layer.id),
    );
    const infraLayer = selectedLayers.find(
      layer => layer.name === 'health-infrastructure',
    );
    if (infraLayer) {
      newLayers.push(
        new IconLayer({
          id: infraLayer.name,
          data: infraLayer.data.features,
          iconMapping,
          iconAtlas,
          getIcon: d => d.properties.type,
          getPosition: d => d.geometry.coordinates,
          getSize: 60,
        }),
      );
    }
    setLayers(newLayers);
  }, [selectedLayers, layers]);

  console.log(layers[0]?.id);

  return (
    <>
      {bookmarksLoading && (
        <div className={styles.loadMask} data-testid="load-mask">
          <LoadMask />
        </div>
      )}
      <DeckGL controller initialViewState={viewport} layers={layers}>
        <StaticMap
          reuseMap
          mapboxApiAccessToken={accessToken}
          mapStyle={selectedMapStyle?.uri}
        />
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
