import { FlyToInterpolator } from 'deck.gl';
import { LAYER_IDS, MAX_ZOOM } from 'map/map.constants';
import { useMap } from 'MapContext';
import React, { useState } from 'react';
import { Popup } from 'react-map-gl';
import { easeInOutCubic } from 'utils/easingFunctions';
import FeatureDetail from '../../../components/feature-detail/feature-detail.component';

import { infrastructureLayer } from './infrastructure-layer';
import { peopleLayer } from './people-layer';
import { PopulationInformation } from './people-layer/people-component/population-information.component';
import { pickBy } from 'lodash';

const INFRASTRUCTURE_LAYER_IDS = [
  LAYER_IDS.astrosat.hourglass.scotlandInfrastructure.v1,
  LAYER_IDS.astrosat.hourglass.walesInfrastructure.v1,
  LAYER_IDS.astrosat.hourglass.northernIrelandInfrastructure.v1,
];

const PEOPLE_LAYER_IDS = [
  LAYER_IDS.astrosat.covid.hourglass.latest,
  LAYER_IDS.astrosat.covid.commonWeal.latest,
];

const sidebarComponents = {
  ...PEOPLE_LAYER_IDS.reduce(
    (obj, layerId) => ({ ...obj, [layerId]: PopulationInformation }),
    {},
  ),
};

export const useActionForHelpOrb = (data, activeSources) => {
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
              (_, key) =>
                !key.toLowerCase().includes('type') &&
                !key.toLowerCase().includes('pk'),
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
    ...PEOPLE_LAYER_IDS.map(id =>
      peopleLayer({
        id,
        data: data[id],
        visible: !!activeSources?.find(source => source.source_id === id),
        onClick: handleLayerClick,
      }),
    ),
  ];

  return {
    layers,
    mapComponents,
    sidebarComponents,
  };
};
useActionForHelpOrb.id = 'hourglass';
