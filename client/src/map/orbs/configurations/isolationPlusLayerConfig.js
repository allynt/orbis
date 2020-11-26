import { DataFilterExtension } from '@deck.gl/extensions';
import chroma from 'chroma-js';

import {
  filterDataSelector,
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
  const filterData = filterDataSelector(orbState);
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
    onClick: info => dispatch(setPickedInfo(info)),
    filled: true,
    getFillColor: d => [
      // @ts-ignore
      ...(colorScale
        ? colorScale(d.properties[selectedProperty.name]).rgb()
        : [0, 0, 0]),
      150,
    ],
    getFilterValue: d => Math.round(d.properties[selectedProperty.name]),
    filterRange: filterData.filterRange || [
      selectedPropertyMetadata?.min,
      selectedPropertyMetadata?.max,
    ],
    updateTriggers: {
      getFillColor: [selectedProperty, filterData],
      getFilterValue: [selectedProperty],
    },
    extensions: [new DataFilterExtension({ filterSize: 1 })],
  };
};

export default configuration;
