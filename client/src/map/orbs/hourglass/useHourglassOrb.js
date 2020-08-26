import { FlyToInterpolator } from 'deck.gl';
import { LAYER_IDS } from 'map/map.constants';
import { useMap } from 'MapContext';
import React, { useState } from 'react';
import { Popup } from 'react-map-gl';
import { easeInOutCubic } from 'utils/easingFunctions';
import FeatureDetail from '../../../components/feature-detail/feature-detail.component';
import { MAX_ZOOM } from './constants';
import { infrastructureLayer } from './infrastructure-layer';
import { HealthInfrastructure } from './infrastructure-layer/infrastructure-component/health-infrastructure.component';
import { peopleLayer } from './people-layer';
import { PopulationInformation } from './people-layer/people-component/population-information.component';
import { pickBy } from 'lodash';

const INFRASTRUCTURE_LAYER_IDS = [
  LAYER_IDS.astrosat.hourglass.scotlandInfrastructure.v1,
  LAYER_IDS.astrosat.hourglass.walesInfrastructure.v1,
  LAYER_IDS.astrosat.hourglass.northernIrelandInfrastructure.v1,
];

const sidebarComponents = {
  ...INFRASTRUCTURE_LAYER_IDS.reduce(
    (obj, layerId) => ({ ...obj, [layerId]: HealthInfrastructure }),
    {},
  ),
  [LAYER_IDS.astrosat.covid.hourglass.latest]: PopulationInformation,
};

export const useHourglassOrb = (data, activeSources) => {
  const { setViewState } = useMap();
  const [pickedObjects, setPickedObjects] = useState([]);

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
      else setPickedObjects(info.objects);
    } else setPickedObjects([info.object]);
  };

  const mapComponents = [
    pickedObjects.length && (
      <Popup
        longitude={pickedObjects[0]?.geometry.coordinates[0]}
        latitude={pickedObjects[0]?.geometry.coordinates[1]}
        onClose={() => setPickedObjects([])}
        captureScroll
      >
        <FeatureDetail
          features={pickedObjects.map(obj =>
            pickBy(
              obj.properties,
              (_, key) => !key.toLowerCase().includes('type'),
            ),
          )}
          title={
            pickedObjects[0].properties.Type
              ? 'User Details'
              : 'Infrastructure Details'
          }
        />
      </Popup>
    ),
  ];

  const layers = [
    ...INFRASTRUCTURE_LAYER_IDS.map(id =>
      infrastructureLayer({
        id,
        data: data[id],
        visible: !!activeSources?.find(source => source.source_id === id),
        onClick: handleLayerClick,
      }),
    ),
    peopleLayer({
      id: LAYER_IDS.astrosat.covid.hourglass.latest,
      data: data[LAYER_IDS.astrosat.covid.hourglass.latest],
      visible: !!activeSources?.find(
        source =>
          source.source_id === LAYER_IDS.astrosat.covid.hourglass.latest,
      ),
      onClick: handleLayerClick,
    }),
  ];

  return {
    layers,
    mapComponents,
    sidebarComponents,
    preLabelLayers: [],
    postLabelLayers: [
      ...INFRASTRUCTURE_LAYER_IDS,
      LAYER_IDS.astrosat.covid.hourglass.latest,
    ],
  };
};
useHourglassOrb.id = 'hourglass';
