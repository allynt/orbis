import React, { useEffect, useState, useCallback } from 'react';

import { LayersIcon, Button, LoadMask } from '@astrosat/astrosat-ui/';

import DeckGL, { FlyToInterpolator, GeoJsonLayer } from 'deck.gl';
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
import { selectMapStyle, selectedMapStyleSelector } from './map.slice';
import { mapboxTokenSelector, mapStylesSelector } from 'app.slice';

import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './map.module.css';
import {
  activeLayersSelector,
  dataSourcesSelector,
  selectDataToken,
  setLayers,
} from 'data-layers/data-layers.slice';
import FeatureDetail from './feature-detail.component';

import infrastructureIconAtlas from './layers/hourglass/infrastructure/iconAtlas.svg';
import infrastructureIconMapping from './layers/hourglass/infrastructure/iconMapping.json';
import peopleIconAtlas from './layers/hourglass/people/iconAtlas.svg';
import peopleIconMapping from './layers/hourglass/people/iconMapping.json';
import { LAYER_IDS } from './map.constants';
import { useMap } from 'MapContext';
import { easeInOutCubic } from 'utils/easingFunctions';
import { interpolateGreens } from 'd3-scale-chromatic';

const dataUrlFromId = (id, sources) => {
  const source = sources.find(source => source.source_id === id);
  if (!source) return;
  return source.data && typeof source.data === 'string'
    ? source.data
    : source.metadata.url;
};

const average = array =>
  array.reduce((sum, element) => sum + element.value, 0) / array.length;

const rgbStringToArray = string => {
  const values = string.match(/(\d)+/g);
  return values.map(str => +str);
};

const MAX_ZOOM = 20;

const Map = () => {
  const { setMap, setDeck, viewState, setViewState } = useMap();
  const dispatch = useDispatch();
  const accessToken = useSelector(mapboxTokenSelector);
  const authToken = useSelector(selectDataToken);
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
  const [data, setData] = useState({});

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

  const dataRequest = useCallback(
    url =>
      url &&
      new Promise(async (resolve, reject) => {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) reject(response.status);
        resolve(response.json());
      }),
    [authToken],
  );

  useEffect(() => {
    const fetchData = async layerId => {
      const dataSet = await dataRequest(dataUrlFromId(layerId, sources));
      setData({ ...data, [layerId]: dataSet });
    };
    for (let layerId of activeLayers) {
      if (!data[layerId]) {
        fetchData(layerId);
      }
    }
  }, [activeLayers, sources, dataRequest, data]);

  const handleLayerClick = info => {
    if (info.object.properties.cluster) {
      if (info.object.properties.expansion_zoom <= MAX_ZOOM)
        setViewState({
          longitude: info.object.geometry.coordinates[0],
          latitude: info.object.geometry.coordinates[1],
          zoom:
            info.object.properties.expansion_zoom >= MAX_ZOOM
              ? MAX_ZOOM
              : info.object.properties.expansion_zoom,
          transitionDuration: 1000,
          transitionEasing: easeInOutCubic,
          transitionInterpolator: new FlyToInterpolator(),
        });
      else setPickedObject(info.objects);
    } else setPickedObject([info.object]);
  };

  const layers = [
    ...[
      LAYER_IDS.astrosat.hourglass.scotlandInfrastructure.v1,
      LAYER_IDS.astrosat.hourglass.walesInfrastructure.v1,
      LAYER_IDS.astrosat.hourglass.northernIrelandInfrastructure.v1,
    ].map(
      id =>
        new GeoJsonClusteredIconLayer({
          id,
          data: data[id],
          visible: activeLayers?.includes(id),
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
      data: data[LAYER_IDS.astrosat.covid.hourglass.latest],
      visible: activeLayers?.includes(
        LAYER_IDS.astrosat.covid.hourglass.latest,
      ),
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
    new GeoJsonLayer({
      id: LAYER_IDS.astrosat.rice.paddiesHealth.latest,
      data: data[LAYER_IDS.astrosat.rice.paddiesHealth.latest],
      stroked: false,
      filled: true,
      extruded: true,
      getFillColor: paddy => [
        ...rgbStringToArray(interpolateGreens(average(paddy.properties.ndvi))),
        200,
      ],
      getElevation: paddy => average(paddy.properties.lai_cab),
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
