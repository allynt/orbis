import { paddiesHealthLayer } from './paddies-health';
import { LAYER_IDS } from 'map/map.constants';

export const useRiceOrb = (data, activeLayers) => {
  const layers = [
    paddiesHealthLayer({
      id: LAYER_IDS.astrosat.rice.paddiesHealth.latest,
      data: data[LAYER_IDS.astrosat.rice.paddiesHealth.latest],
      visible: activeLayers?.includes(
        LAYER_IDS.astrosat.rice.paddiesHealth.latest,
      ),
    }),
  ];

  return { layers, mapComponents: [] };
};
useRiceOrb.id = 'rice';
