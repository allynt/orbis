import chroma from 'chroma-js';
import {
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
    updateTriggers: {
      getFillColor: [selectedProperty],
    },
  };
};

export default configuration;
