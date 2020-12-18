import { DataFilterExtension } from '@deck.gl/extensions';
import chroma from 'chroma-js';

import {
  filterRangeSelector,
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
  pickedInfo,
}) => {
  const source = activeSources?.find(source => source.source_id === id);
  const selectedProperty = propertySelector(orbState);
  const selectedPropertyMetadata = source?.metadata?.properties?.find(
    property => property.name === selectedProperty.name,
  );
  const filterRange = filterRangeSelector(orbState);
  const colorScale =
    selectedPropertyMetadata &&
    chroma
      .scale(selectedPropertyMetadata?.application?.orbis?.display?.color)
      .domain([selectedProperty?.min, selectedProperty?.max]);

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
    highlightColor: [0, 0, 0, 65],
    onClick: info => dispatch(setPickedInfo(info)),
    getLineColor: [246, 190, 0, 255],
    getLineWidth: d => (isEqual(pickedInfo?.object, d) ? 3 : 0),
    filled: true,
    getFillColor: d => [
      // @ts-ignore
      ...(colorScale
        ? colorScale(d.properties[selectedProperty.name]).rgb()
        : [0, 0, 0]),
      150,
    ],
    stroked: true,
    // getLineWidth: 1,
    lineWidthUnits: 'pixels',
    getFilterValue: d => Math.round(d.properties[selectedProperty.name]),
    filterRange: filterRange || [
      selectedPropertyMetadata?.min,
      selectedPropertyMetadata?.max,
    ],
    updateTriggers: {
      getFillColor: [selectedProperty, filterRange],
      getFilterValue: [selectedProperty],
      getLineWidth: [pickedInfo],
    },
    extensions: [new DataFilterExtension({ filterSize: 1 })],
  };
};

export default configuration;
