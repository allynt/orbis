import * as colorSchemes from 'd3-scale-chromatic';
import CustomMVTLayer from 'map/deck.gl/custom-layers/custom-mvt-layer';
import { LAYER_IDS } from '../../map.constants';
import { RadioPicker } from './radio-picker/radio-picker.component';
import { useSelector } from 'react-redux';
import { propertySelector, colorSchemeSelector } from './isolation-plus.slice';

const rgbStringToArray = string => {
  const values = string.match(/(\d)+/g);
  return values.map(str => +str);
};

export const useIsolationPlusOrb = (data, sources, authToken) => {
  const ahahSource = sources?.find(
    source => source.source_id === LAYER_IDS.astrosat.isolationPlus.ahah.v0,
  );

  const ahahSelectedProperty = useSelector(state =>
    propertySelector(state, LAYER_IDS.astrosat.isolationPlus.ahah.v0),
  );

  const colorScheme = useSelector(colorSchemeSelector);

  const layers = [
    new CustomMVTLayer({
      id: LAYER_IDS.astrosat.isolationPlus.ahah.v0,
      data: data[LAYER_IDS.astrosat.isolationPlus.ahah.v0],
      authToken,
      visible: !!ahahSource,
      minZoom: ahahSource?.metadata.minZoom,
      maxZoom: ahahSource?.metadata.maxZoom,
      uniqueIdProperty: ahahSource?.metadata.uniqueIdProperty,
      pickable: true,
      autoHighlight: true,
      filled: true,
      getFillColor: d => [
        ...rgbStringToArray(
          colorSchemes[colorScheme](d.properties[ahahSelectedProperty] / 10),
        ),
        150,
      ],
      updateTriggers: {
        getFillColor: [ahahSelectedProperty],
      },
    }),
  ];

  return {
    layers,
    mapComponents: [],
    sidebarComponents: {
      [LAYER_IDS.astrosat.isolationPlus.ahah.v0]: RadioPicker,
    },
  };
};

useIsolationPlusOrb.id = 'test';
