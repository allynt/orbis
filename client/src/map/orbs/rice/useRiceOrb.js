import { paddiesHealthLayer } from './paddies-health';
import { LAYER_IDS } from 'map/map.constants';

export const useRiceOrb = (data, activeLayers) => {
  const layers = [
    paddiesHealthLayer(
      LAYER_IDS.astrosat.rice.paddiesHealth.latest,
      data[LAYER_IDS.astrosat.rice.paddiesHealth.latest],
      activeLayers?.includes(LAYER_IDS.astrosat.rice.paddiesHealth.latest),
    ),
  ];

  return { layers, mapComponents: [] };
};
