import { LAYER_IDS } from 'map/map.constants';
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  selectDataToken,
  activeLayersSelector,
  dataSourcesSelector,
} from 'data-layers/data-layers.slice';
import { MAX_ZOOM } from './hourglass/constants';
import { useMap } from 'MapContext';
import { easeInOutCubic } from 'utils/easingFunctions';
import { FlyToInterpolator } from 'deck.gl';
import infrastructureLayer from './hourglass/infrastructure';
import peopleLayer from './hourglass/people';
import paddiesHealthLayer from './rice/paddies-health';

const dataUrlFromId = (id, sources) => {
  const source = sources.find(source => source.source_id === id);
  if (!source) return;
  return source.data && typeof source.data === 'string'
    ? source.data
    : source.metadata.url;
};

export const useLayers = () => {
  const { setViewState, setPickedObject } = useMap();
  const authToken = useSelector(selectDataToken);
  const sources = useSelector(dataSourcesSelector);
  const activeLayers = useSelector(activeLayersSelector);
  const [data, setData] = useState({});

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
  return { layers };
};
