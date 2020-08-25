import React from 'react';

import { infrastructureLayer } from '../hourglass/infrastructure-layer';

import { LAYER_IDS } from 'map/map.constants';

export const useMySupplyLynkOrb = (data, activeSources) => {
  const SUPPLYLYNK_LAYER_IDS = [LAYER_IDS.astrosat.mySupplyLynk.latest];

  const handleLayerClick = () => {};

  const layers = [
    ...SUPPLYLYNK_LAYER_IDS.map(id =>
      infrastructureLayer({
        id,
        data: data[id],
        visible: !!activeSources?.find(source => source.source_id === id),
        onClick: handleLayerClick,
      }),
    ),
  ];

  let mapComponents = [];
  let sidebarComponents = [];

  return { layers, mapComponents, sidebarComponents };
};
