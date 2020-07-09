import React, { useEffect, useState } from 'react';

import { LayersIcon, Button, LoadMask } from '@astrosat/astrosat-ui/';

import DeckGL from '@deck.gl/react';
import { useDispatch, useSelector } from 'react-redux';
import { StaticMap } from 'react-map-gl';
import { GeoJsonClusteredIconLayer } from './geo-json-clustered-icon-layer';

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

import 'mapbox-gl/dist/mapbox-gl.css';
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
    setLayers(currentLayers => {
      const newLayers = currentLayers.filter(
        layer =>
          !!selectedLayers.find(
            selectedLayer => selectedLayer.name === layer.id,
          ),
      );
      const infraLayer = selectedLayers.find(
        layer => layer.name === 'scotland-infrastructure',
      );
      if (infraLayer) {
        newLayers.push(
          new GeoJsonClusteredIconLayer({
            id: infraLayer.name,
            data: infraLayer.data,
            iconMapping: infrastructureIconMapping,
            iconAtlas: infrastructureIconAtlas,
            getPosition: d => d.geometry.coordinates,
            getIcon: d => d.properties.type,
            getIconSize: 60,
            getIconColor: [246, 190, 0],
            getTextSize: 32,
            getTextColor: [51, 63, 72],
            clusterRadius: 40,
          }),
        );
      }
      const peopleLayer = selectedLayers.find(layer => layer.name === 'people');
      if (peopleLayer) {
        newLayers.push(
          new GeoJsonClusteredIconLayer({
            id: peopleLayer.name,
            data: peopleLayer.data,
            iconMapping: peopleIconMapping,
            iconAtlas: peopleIconAtlas,
            getPosition: d => d.geometry.coordinates,
            getIcon: d => d.properties.Type,
            getIconSize: d => (d.properties.cluster ? 60 : 15),
            getIconColor: [246, 190, 0],
            getTextSize: 32,
            getTextColor: [51, 63, 72],
            clusterRadius: 20,
          }),
        );
      }
      return newLayers;
    });
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
