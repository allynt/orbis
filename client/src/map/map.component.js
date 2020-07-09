import React, { useEffect, useState } from 'react';

import { LayersIcon, Button, LoadMask } from '@astrosat/astrosat-ui/';

import DeckGL from '@deck.gl/react';
import { useDispatch, useSelector } from 'react-redux';
import { StaticMap } from 'react-map-gl';
import { ClusteredIconLayer } from './clustered-icon-layer';

import {
  isLoaded as onBookmarkLoaded,
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

import infrastructureIconAtlas from './layers/hourglass/infrastructure/iconAtlas.svg';
import infrastructureIconMapping from './layers/hourglass/infrastructure/iconMapping.json';
import peopleIconAtlas from './layers/hourglass/people/iconAtlas.svg';
import peopleIconMapping from './layers/hourglass/people/iconMapping.json';

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
    dispatch(onBookmarkLoaded());
  }, [selectedBookmark, dispatch]);

  useEffect(() => {
    const newLayers = layers
      ? layers.filter(
          layer =>
            !!selectedLayers.find(
              selectedLayer => selectedLayer.name === layer.id,
            ),
        )
      : [];
    const infraLayer = selectedLayers.find(
      layer => layer.name === 'health-infrastructure',
    );
    if (infraLayer) {
      newLayers.push(
        new ClusteredIconLayer({
          id: infraLayer.name,
          data: infraLayer.data.features,
          iconMapping: infrastructureIconMapping,
          iconAtlas: infrastructureIconAtlas,
          getPosition: d => d.geometry.coordinates,
          getIcon: d => d.properties.type,
          getIconSize: 60,
          getIconColor: [246, 190, 0],
          getTextSize: 32,
          getTextColor: [51, 63, 72],
          clusterRadius: 40,
          sizeMinPixels: 6,
        }),
      );
    }
    const peopleLayer = selectedLayers.find(
      layer => layer.name === 'population-information',
    );
    if (peopleLayer) {
      newLayers.push(
        new ClusteredIconLayer({
          id: peopleLayer.name,
          data: peopleLayer.data.features,
          iconMapping: peopleIconMapping,
          iconAtlas: peopleIconAtlas,
          getPosition: d => d.geometry.coordinates,
          getIcon: d => d.properties.Type,
          getIconSize: d => (d.properties.cluster ? 60 : 15),
          getIconColor: [246, 190, 0],
          getTextSize: 32,
          getTextColor: [51, 63, 72],
          clusterRadius: 20,
          sizeMinPixels: 6,
        }),
      );
    }
    setLayers(newLayers);
  }, [selectedLayers]);

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
