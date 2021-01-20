import { DataFilterExtension } from '@deck.gl/extensions';
import { ColorScale } from 'utils/color';
import isEqual from 'lodash/isEqual';

import {
  filterRangeSelector,
  propertySelector,
  setClickedFeatures,
  clickedFeaturesSelector,
  addClickedFeatures,
  removeClickedFeatures,
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
  const filterRange = filterRangeSelector(orbState);
  const clickedFeatures = clickedFeaturesSelector(orbState);
  const selectedPropertyMetadata = source?.metadata?.properties?.find(
    property => property.name === selectedProperty.name,
  );
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

  /**
   * @param {import('typings/orbis').PolygonPickedMapFeature} info
   * @param {{srcEvent: PointerEvent}} event
   */
  const onClick = (info, event) => {
    const hasModifier = event.srcEvent.ctrlKey || event.srcEvent.metaKey;
    // If it's not been clicked already
    if (
      !clickedFeatures?.find(
        f => f.object.properties.index === info.object.properties.index,
      )
    ) {
      // If we're ctrl clicking
      if (hasModifier) {
        return dispatch(addClickedFeatures([info]));
      }
      return dispatch(setClickedFeatures([info]));
    }

    if (event.srcEvent.ctrlKey || event.srcEvent.metaKey) {
      return dispatch(removeClickedFeatures([info]));
    }

    return dispatch(setClickedFeatures([info]));
  };

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
    onClick,
    getLineColor: [246, 190, 0, 255],
    getLineWidth: d =>
      clickedFeatures
        ?.map(f => f.object.properties.index)
        .includes(d.properties.index)
        ? 3
        : 0,
    lineWidthUnits: 'pixels',
    getFillColor: d => {
      let color =
        colorScale && d.properties[selectedProperty.name]
          ? colorScale.get(d.properties[selectedProperty.name])
          : [0, 0, 0];
      return [...color, 150];
    },
    transitions: {
      getLineWidth: 150,
    },
    getFilterValue: d => Math.round(d.properties[selectedProperty.name]),
    filterRange: filterRange || [
      selectedPropertyMetadata?.min,
      selectedPropertyMetadata?.max,
    ],
    updateTriggers: {
      getFillColor: [selectedProperty, filterRange],
      getFilterValue: [selectedProperty],
      getLineWidth: [clickedFeatures],
    },
    extensions: [new DataFilterExtension({ filterSize: 1 })],
  };
};

export default configuration;
