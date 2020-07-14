import React, { useEffect, useState } from 'react';

import { LayersIcon, Button, LoadMask } from '@astrosat/astrosat-ui/';

import DeckGL, { FlyToInterpolator } from 'deck.gl';
import { useDispatch, useSelector } from 'react-redux';
import {
  StaticMap,
  NavigationControl,
  Popup,
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
  setViewport,
} from './map.slice';
import { mapboxTokenSelector, mapStylesSelector } from 'app.slice';

import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './map.module.css';
import {
  layersSelector,
  selectDataSources,
} from 'data-layers/data-layers.slice';
import FeatureDetail from './feature-detail.component';

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
  const sources = useSelector(selectDataSources);
  const layers = useSelector(layersSelector);
  const [pickedObject, setPickedObject] = useState();

  useEffect(() => {
    dispatch(onBookmarkLoaded());
  }, [selectedBookmark, dispatch]);

  const handleLayerClick = d =>
    d.object.properties.cluster
      ? dispatch(
          setViewport({
            ...viewport,
            longitude: d.object.geometry.coordinates[0],
            latitude: d.object.geometry.coordinates[1],
            zoom: d.object.properties.expansion_zoom,
            transitionDuration: 1000,
            transitionInterpolator: new FlyToInterpolator(),
          }),
        )
      : setPickedObject(d.object);

  const deckGlLayers = [
    ...[
      'astrosat/hourglass/scotland-infrastructure/v1',
      'astrosat/hourglass/wales-infrastructure/v1',
      'astrosat/hourglass/northern-ireland-infrastructure/v1',
    ].map(
      id =>
        new GeoJsonClusteredIconLayer({
          id,
          data: sources.find(source => source.source_id === id)?.data,
          visible: layers[id]?.visible,
          pickable: true,
          iconMapping: infrastructureIconMapping,
          iconAtlas: infrastructureIconAtlas,
          getPosition: d => d.geometry.coordinates,
          getIcon: d => d.type,
          getIconSize: 60,
          getIconColor: [246, 190, 0],
          getTextSize: 32,
          getTextColor: [51, 63, 72],
          clusterRadius: 40,
          onClick: handleLayerClick,
        }),
    ),
    new GeoJsonClusteredIconLayer({
      id: 'astrosat/hourglass/people/v1',
      data: sources.find(
        source => source.source_id === 'astrosat/hourglass/people/v1',
      )?.data,
      visible: layers['astrosat/hourglass/people/v1']?.visible,
      pickable: true,
      iconMapping: peopleIconMapping,
      iconAtlas: peopleIconAtlas,
      getPosition: d => d.geometry.coordinates,
      getIcon: d => d.Type,
      getIconSize: d => (d.properties.cluster ? 60 : 15),
      getIconColor: [246, 190, 0],
      getTextSize: 32,
      getTextColor: [51, 63, 72],
      clusterRadius: 20,
      onClick: handleLayerClick,
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
        layers={deckGlLayers}
        ContextProvider={MapContext.Provider}
      >
        <StaticMap
          reuseMap
          mapboxApiAccessToken={accessToken}
          mapStyle={selectedMapStyle?.uri}
        />
        {pickedObject && (
          <Popup
            longitude={pickedObject.geometry.coordinates[0]}
            latitude={pickedObject.geometry.coordinates[1]}
            onClose={() => setPickedObject(undefined)}
            captureScroll
          >
            <FeatureDetail features={[pickedObject]} />
          </Popup>
        )}
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
