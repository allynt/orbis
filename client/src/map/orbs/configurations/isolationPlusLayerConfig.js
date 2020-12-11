import { DataFilterExtension } from '@deck.gl/extensions';
import hexRgb from 'hex-rgb';
import { createColorScale } from 'utils/color';

import {
  filterRangeSelector,
  propertySelector,
  setPickedInfo,
} from '../slices/isolation-plus.slice';

const toRgbArray = rgbString =>
  rgbString
    .replace(/[^\d,]/g, '')
    .split(',')
    .map(Number);

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
  const filterRange = filterRangeSelector(orbState);
  const colorScale = createColorScale({
    color: selectedPropertyMetadata?.application?.orbis?.display?.color,
    domain: [selectedProperty?.min, selectedProperty?.max],
    reversed:
      selectedPropertyMetadata?.application?.orbis?.display?.colormap_reversed,
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
        typeof colorScale === 'function'
          ? colorScale(d.properties[selectedProperty.name])
          : [0, 0, 0];
      if (typeof color === 'string') {
        if (color.includes('#')) color = hexRgb(color, { format: 'array' });
        else color = toRgbArray(color);
      }
      if (!color) color = [0, 0, 0];
      return [...color.slice(0, 3), 150];
    },
    getFilterValue: d => Math.round(d.properties[selectedProperty.name]),
    filterRange: filterRange || [
      selectedPropertyMetadata?.min,
      selectedPropertyMetadata?.max,
    ],
    updateTriggers: {
      getFillColor: [selectedProperty, filterRange],
      getFilterValue: [selectedProperty],
    },
    extensions: [new DataFilterExtension({ filterSize: 1 })],
  };
};

export default configuration;
