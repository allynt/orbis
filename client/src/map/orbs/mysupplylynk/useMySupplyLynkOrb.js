import React from 'react';

import { LAYER_IDS } from 'map/map.constants';

export const useMySupplyLynkOrb = (data, activeSources) => {
  const SUPPLYLYNK_LAYER_IDS = [LAYER_IDS.astrosat.mySupplyLynk.latest];

  const handleLayerClick = () => {};

  // const layers = [...SUPPLYLYNK_LAYER_IDS.map(id => {})];

  let layers = [];
  let mapComponents = [];
  let sidebarComponents = [];

  return { layers, mapComponents, sidebarComponents };
};
