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
  activeLayersSelector,
  dataSourcesSelector,
  selectDataToken,
} from 'data-layers/data-layers.slice';
import FeatureDetail from './feature-detail.component';

import infrastructureIconAtlas from './layers/hourglass/infrastructure/iconAtlas.svg';
import infrastructureIconMapping from './layers/hourglass/infrastructure/iconMapping.json';
import peopleIconAtlas from './layers/hourglass/people/iconAtlas.svg';
import peopleIconMapping from './layers/hourglass/people/iconMapping.json';
import { LAYER_IDS } from './map.constants';
import { useMap } from 'MapContext';

const dataUrlFromId = (id, sources) => {
  const source = sources.find(source => source.source_id === id);
  if (!source) return;
  return source.data && typeof source.data === 'string'
    ? source.data
    : source.metadata.url;
};

const MAX_ZOOM = 20;

const Map = () => {
  const { setMap, setDeck } = useMap();
  const dispatch = useDispatch();
  const accessToken = useSelector(mapboxTokenSelector);
  const authToken = useSelector(selectDataToken);
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
  const [pickedObject, setPickedObject] = useState();

  useEffect(() => {
    if (selectedBookmark) {
      const {
        center: [longitude, latitude],
        zoom,
      } = selectedBookmark;
      dispatch(
        setViewport({
          ...viewport,
          longitude,
          latitude,
          zoom,
          transitionDuration: 2000,
          transitionInterpolator:
            viewport.transitionInterpolator || new FlyToInterpolator(),
        }),
      );
    }
    dispatch(onBookmarkLoaded());
  }, [selectedBookmark, viewport, dispatch]);

  const handleLayerClick = info => {
    if (info.object.properties.cluster) {
      if (info.object.properties.expansion_zoom <= MAX_ZOOM)
        dispatch(
          setViewport({
            ...viewport,
            longitude: info.object.geometry.coordinates[0],
            latitude: info.object.geometry.coordinates[1],
            zoom:
              info.object.properties.expansion_zoom >= MAX_ZOOM
                ? MAX_ZOOM
                : info.object.properties.expansion_zoom,
            transitionDuration: 1000,
            transitionInterpolator:
              viewport.transitionInterpolator || new FlyToInterpolator(),
          }),
        );
      else setPickedObject(info.objects);
    } else setPickedObject([info.object]);
  };

  const dataRequest = (url = '') =>
    new Promise(async (resolve, reject) => {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) reject(response.status);
      resolve(response.json());
    });

  const layers = [
    ...[
      LAYER_IDS.astrosat.hourglass.scotlandInfrastructure.v1,
      LAYER_IDS.astrosat.hourglass.walesInfrastructure.v1,
      LAYER_IDS.astrosat.hourglass.northernIrelandInfrastructure.v1,
    ].map(
      id =>
        new GeoJsonClusteredIconLayer({
          id,
          data: dataRequest(dataUrlFromId(id, sources)),
          visible: activeLayers[id]?.visible,
          pickable: true,
          iconMapping: infrastructureIconMapping,
          iconAtlas: infrastructureIconAtlas,
          getPosition: feature => feature.geometry.coordinates,
          getIcon: feature =>
            feature.properties.cluster ? 'cluster' : feature.properties.type,
          getIconSize: 60,
          getIconColor: [246, 190, 0],
          getTextSize: 32,
          getTextColor: [51, 63, 72],
          clusterRadius: 40,
          maxZoom: MAX_ZOOM,
          onClick: handleLayerClick,
        }),
    ),
    new GeoJsonClusteredIconLayer({
      id: LAYER_IDS.astrosat.covid.hourglass.latest,
      data: dataRequest(
        dataUrlFromId(LAYER_IDS.astrosat.covid.hourglass.latest, sources),
      ),
      visible: activeLayers[LAYER_IDS.astrosat.covid.hourglass.latest]?.visible,
      pickable: true,
      iconMapping: peopleIconMapping,
      iconAtlas: peopleIconAtlas,
      getPosition: feature => feature.geometry.coordinates,
      getIcon: feature => {
        if (feature.properties.cluster) {
          return feature.properties.expansion_zoom > MAX_ZOOM
            ? 'group'
            : 'cluster';
        }
        return feature.properties.Type;
      },
      getIconSize: feature => (feature.properties.cluster ? 60 : 15),
      getIconColor: [246, 190, 0],
      getTextSize: 32,
      getTextColor: feature =>
        feature.properties.expansion_zoom > MAX_ZOOM
          ? [0, 0, 0, 0]
          : [51, 63, 72],
      clusterRadius: 20,
      maxZoom: MAX_ZOOM,
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
        ref={ref => ref && setDeck(ref.deck)}
        controller
        viewState={viewport}
        onViewStateChange={({ viewState }) => dispatch(setViewport(viewState))}
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
        {pickedObject && (
          <Popup
            longitude={pickedObject[0].geometry.coordinates[0]}
            latitude={pickedObject[0].geometry.coordinates[1]}
            onClose={() => setPickedObject(undefined)}
            captureScroll
          >
            <FeatureDetail features={pickedObject} />
          </Popup>
        )}
        / <NavigationControl className={styles.navigationControl} />
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
