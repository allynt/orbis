import { FlyToInterpolator } from 'deck.gl';
import { LAYER_IDS } from 'map/map.constants';
import { easeInOutCubic } from 'utils/easingFunctions';
import { MAX_ZOOM } from './constants';
import { infrastructureLayer } from './infrastructure-layer';
import { peopleLayer } from './people-layer';
import { useMap } from 'MapContext';
import { Popup } from 'react-map-gl';
import React, { useState } from 'react';
import FeatureDetail from './feature-detail/feature-detail.component';

export const useHourglassOrb = (data, activeLayers) => {
  const { setViewState } = useMap();
  const [pickedObject, setPickedObject] = useState();

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

  const mapComponents = [
    pickedObject && (
      <Popup
        longitude={pickedObject[0].geometry.coordinates[0]}
        latitude={pickedObject[0].geometry.coordinates[1]}
        onClose={() => setPickedObject(undefined)}
        captureScroll
      >
        <FeatureDetail features={pickedObject} />
      </Popup>
    ),
  ];

  const layers = [
    ...[
      LAYER_IDS.astrosat.hourglass.scotlandInfrastructure.v1,
      LAYER_IDS.astrosat.hourglass.walesInfrastructure.v1,
      LAYER_IDS.astrosat.hourglass.northernIrelandInfrastructure.v1,
    ].map(id =>
      infrastructureLayer({
        id,
        data: data[id],
        visible: activeLayers?.includes(id),
        onClick: handleLayerClick,
      }),
    ),
    peopleLayer({
      id: LAYER_IDS.astrosat.covid.hourglass.latest,
      data: data[LAYER_IDS.astrosat.covid.hourglass.latest],
      visible: activeLayers?.includes(
        LAYER_IDS.astrosat.covid.hourglass.latest,
      ),
      onClick: handleLayerClick,
    }),
  ];

  return { layers, mapComponents };
};
useHourglassOrb.id = 'hourglass';
