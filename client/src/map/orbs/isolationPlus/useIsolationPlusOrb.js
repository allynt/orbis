import { interpolateBlues } from 'd3-scale-chromatic';
import CustomMVTLayer from 'map/deck.gl/custom-layers/custom-mvt-layer';
import { LAYER_IDS } from '../../map.constants';

const rgbStringToArray = string => {
  const values = string.match(/(\d)+/g);
  return values.map(str => +str);
};

export const useIsolationPlusOrb = (data, sources, authToken) => {
  const layers = [
    new CustomMVTLayer({
      id: LAYER_IDS.astrosat.isolationPlus.ahah.v0,
      data: data[LAYER_IDS.astrosat.isolationPlus.ahah.v0],
      authToken,
      visible: !!sources?.find(
        source => source.source_id === LAYER_IDS.astrosat.isolationPlus.ahah.v0,
      ),
      uniqueIdProperty: 'LSOA code',
      filled: true,
      getFillColor: d => [
        ...rgbStringToArray(
          interpolateBlues(d.properties['IMD: Income decile'] / 10),
        ),
        150,
      ],
      autoHighlight: true,
      pickable: true,
    }),
  ];

  return { layers, mapComponents: [], sidebarComponents: {} };
};

useIsolationPlusOrb.id = 'test';
