import * as React from 'react';

import { useSelector } from 'react-redux';

import { createCategorisationPath } from 'data-layers/categorisation.utils';
import {
  propertyFilterRangeSelector,
  propertySelector,
  setFilterRange,
  setProperty,
} from '../../slices/isolation-plus.slice';
import { groupProperties } from './helpers/group-properties.js';
import RadioProperty from './radio-property/radio-property.component';
import { Box } from '@astrosat/astrosat-ui';

/**
 * @param {{
 *   selectedLayer: import('typings/orbis').Source
 *   dispatch: import('redux').Dispatch
 * }} props
 */
export const RadioPicker = ({ selectedLayer, dispatch }) => {
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));

  const filterRange = useSelector(state => {
    return propertyFilterRangeSelector(selectedLayer?.source_id)(state?.orbs);
  });

  const selectedPropertyMetadata = selectedLayer?.metadata?.properties?.find(
    property => property.name === selectedProperty?.name,
  );
  const colorScheme =
    selectedPropertyMetadata?.application?.orbis?.display?.color;
  const categoryPath = createCategorisationPath({
    categories: selectedLayer?.metadata?.application?.orbis?.categories,
  }).replace('.', ' > ');

  /**
   * @param {Object} data
   */
  const selectProperty = data => {
    dispatch(
      setProperty(data ? { source_id: selectedLayer?.source_id, ...data } : {}),
    );
  };

  const filterData = selectedProperty
    ? filterRange[selectedProperty?.application?.orbis?.label]
    : filterRange;

  if (!selectedLayer?.metadata?.properties) return null;
  return (
    <Box display="flex" flexDirection="column" width="100%">
      {groupProperties(selectedLayer.metadata.properties).map((data, i) => (
        <React.Fragment key={i}>
          <RadioProperty
            layerSourceId={selectedLayer?.source_id}
            data={data}
            onPropertyChange={selectProperty}
            onSliderChange={data => dispatch(setFilterRange(data))}
            selectedProperty={selectedProperty}
            colorScheme={colorScheme}
            filterData={filterData}
            categoryPath={categoryPath}
          />
        </React.Fragment>
      ))}
    </Box>
  );
};
