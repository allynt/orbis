import React, { useEffect, useState } from 'react';

import { LayersIcon, Button, LoadMask } from '@astrosat/astrosat-ui/';

import DeckGL from '@deck.gl/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StaticMap,
  NavigationControl,
  _MapContext as MapContext,
} from 'react-map-gl';
import { GeoJsonClusteredIconLayer } from './deck.gl/custom-layers/geo-json-clustered-icon-layer';

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
import {
  activeLayersSelector,
  dataSourcesSelector,
} from 'data-layers/data-layers.slice';

import infrastructureIconAtlas from './layers/hourglass/infrastructure/iconAtlas.svg';
import infrastructureIconMapping from './layers/hourglass/infrastructure/iconMapping.json';
import peopleIconAtlas from './layers/hourglass/people/iconAtlas.svg';
import peopleIconMapping from './layers/hourglass/people/iconMapping.json';
import { LAYER_IDS } from './map.constants';

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
  const sources = useSelector(dataSourcesSelector);
  const activeLayers = useSelector(activeLayersSelector);

  useEffect(() => {
    dispatch(onBookmarkLoaded());
  }, [selectedBookmark, dispatch]);

  const layers = [
    ...[
      LAYER_IDS.astrosat.hourglass.scotlandInfrastructure.v1,
      LAYER_IDS.astrosat.hourglass.walesInfrastructure.v1,
      LAYER_IDS.astrosat.hourglass.northernIrelandInfrastructure.v1,
    ].map(
      id =>
        new GeoJsonClusteredIconLayer({
          id,
          data: sources.find(source => source.source_id === id)?.data,
          visible: activeLayers[id]?.visible,
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
    ),
    new GeoJsonClusteredIconLayer({
      id: LAYER_IDS.astrosat.hourglass.people.v1,
      data: sources.find(
        source => source.source_id === LAYER_IDS.astrosat.hourglass.people.v1,
      )?.data,
      visible: activeLayers[LAYER_IDS.astrosat.hourglass.people.v1]?.visible,
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
  ];

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
        layers={layers}
        ContextProvider={MapContext.Provider}
      >
        <StaticMap
          reuseMap
          mapboxApiAccessToken={accessToken}
          mapStyle={selectedMapStyle?.uri}
        />
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
