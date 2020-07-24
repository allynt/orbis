import React, { useCallback, useEffect, useState } from 'react';

import { Button, LayersIcon, LoadMask } from '@astrosat/astrosat-ui/';

import DeckGL, { FlyToInterpolator } from 'deck.gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  NavigationControl,
  Popup,
  StaticMap,
  _MapContext as MapContext,
} from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';

import { mapboxTokenSelector, mapStylesSelector } from 'app.slice';
import {
  activeLayersSelector,
  dataSourcesSelector,
  selectDataToken,
  setLayers,
} from 'data-layers/data-layers.slice';
import { useMap } from 'MapContext';
import { easeInOutCubic } from 'utils/easingFunctions';
import {
  isLoaded as onBookmarkLoaded,
  isLoadingSelector as bookmarksLoadingSelector,
  selectedBookmarkSelector,
} from 'bookmarks/bookmark.slice';
import MapStyleSwitcher from 'mapstyle/mapstyle-switcher.component';
import FeatureDetail from './feature-detail.component';
import { MAX_ZOOM } from './layers/hourglass/constants';
import infrastructureLayer from './layers/hourglass/infrastructure';
import peopleLayer from './layers/hourglass/people';
import paddiesHealthLayer from './layers/rice/paddies-health';
import { LAYER_IDS } from './map.constants';
import styles from './map.module.css';
import { selectedMapStyleSelector, selectMapStyle } from './map.slice';

const dataUrlFromId = (id, sources) => {
  const source = sources.find(source => source.source_id === id);
  if (!source) return;
  return source.data && typeof source.data === 'string'
    ? source.data
    : source.metadata.url;
};

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
    ].map(id =>
      infrastructureLayer(
        id,
        data[id],
        activeLayers?.includes(id),
        handleLayerClick,
      ),
    ),
    peopleLayer(
      LAYER_IDS.astrosat.covid.hourglass.latest,
      data[LAYER_IDS.astrosat.covid.hourglass.latest],
      activeLayers?.includes(LAYER_IDS.astrosat.covid.hourglass.latest),
      handleLayerClick,
    ),
    paddiesHealthLayer(
      LAYER_IDS.astrosat.rice.paddiesHealth.latest,
      data[LAYER_IDS.astrosat.rice.paddiesHealth.latest],
      activeLayers?.includes(LAYER_IDS.astrosat.rice.paddiesHealth.latest),
    ),
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
