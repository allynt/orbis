import chroma from 'chroma-js';
import CustomMVTLayer from 'map/deck.gl/custom-layers/custom-mvt-layer';
import { useSelector } from 'react-redux';
import { LAYER_IDS } from '../../map.constants';
import { colorSchemeSelector, propertySelector } from './isolation-plus.slice';
import { RadioPicker } from './radio-picker/radio-picker.component';

export const useIsolationPlusOrb = (data, sources, authToken) => {
  const ahahSource = sources?.find(
    source => source.source_id === LAYER_IDS.astrosat.isolationPlus.ahah.v0,
  );
  const ahahSelectedProperty = useSelector(state =>
    propertySelector(state, LAYER_IDS.astrosat.isolationPlus.ahah.v0),
  );

  const colorScheme = useSelector(colorSchemeSelector);
  const colorScale = chroma
    .scale(colorScheme)
    .domain([
      ahahSource?.metadata.properties[ahahSelectedProperty].min,
      ahahSource?.metadata.properties[ahahSelectedProperty].max,
    ]);

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
        ...colorScale(d.properties[ahahSelectedProperty]).rgb(),
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
