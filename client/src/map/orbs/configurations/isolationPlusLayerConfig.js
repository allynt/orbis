import { DataFilterExtension } from '@deck.gl/extensions';
import { isEqual } from 'lodash';
import { ColorScale } from 'utils/color';

import {
  filterRangeSelector,
  pickedInfoSelector,
  propertySelector,
  setPickedInfo,
} from '../slices/isolation-plus.slice';

const configuration = ({
  id,
  data,
  activeSources,
  dispatch,
  orbState,
  authToken,
}) => {
  const source = activeSources?.find(source => source.source_id === id);
  const selectedProperty = propertySelector(orbState);
  const selectedPropertyMetadata = source?.metadata?.properties?.find(
    property => property.name === selectedProperty.name,
  );
  const pickedInfo = pickedInfoSelector(orbState);
  const filterRange = filterRangeSelector(orbState);
  const colorScale =
    selectedPropertyMetadata &&
    new ColorScale({
      color: selectedPropertyMetadata?.application?.orbis?.display?.color,
      domain: [selectedProperty?.min, selectedProperty?.max],
      reversed:
        selectedPropertyMetadata?.application?.orbis?.display
          ?.colormap_reversed,
      clip: (selectedPropertyMetadata?.clip_min ||
        selectedPropertyMetadata?.clip_max) && [
        selectedPropertyMetadata.clip_min || selectedPropertyMetadata.min,
        selectedPropertyMetadata.clip_max || selectedPropertyMetadata.max,
      ],
      format: 'array',
    });

  return {
    id,
    data,
    authToken,
    visible: !!source && selectedProperty.source_id === id,
    minZoom: source.metadata.minZoom,
    maxZoom: source.metadata.maxZoom,
    uniqueIdProperty: source.metadata.uniqueIdProperty,
    pickable: true,
    autoHighlight: true,
    onClick: info => dispatch(setPickedInfo(info)),
    filled: true,
    getFillColor: d => {
      let color =
        colorScale && d.properties[selectedProperty.name]
          ? colorScale.get(d.properties[selectedProperty.name])
          : [0, 0, 0];
      return [...color, 150];
    },
    getFilterValue: d => Math.round(d.properties[selectedProperty.name]),
    stroked: true,
    getLineColor: [246, 190, 0, 255],
    getLineWidth: d => (isEqual(pickedInfo?.object, d) ? 3 : 0),
    lineWidthUnits: 'pixels',
    filterRange: filterRange || [
      selectedPropertyMetadata?.min,
      selectedPropertyMetadata?.max,
    ],
    updateTriggers: {
      getLineWidth: [pickedInfo],
      getFillColor: [selectedProperty, filterRange],
      getFilterValue: [selectedProperty],
    },
    transitions: {
      getLineWidth: 150,
    },
    extensions: [new DataFilterExtension({ filterSize: 1 })],
  };
};

export default configuration;
