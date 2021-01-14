import * as React from 'react';

import { useSelector } from 'react-redux';

import { createCategorisationPath } from 'data-layers/categorisation.utils';
import {
  filterRangeSelector,
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
  const filterRange = useSelector(state => filterRangeSelector(state?.orbs));

  const selectedPropertyMetadata = selectedLayer?.metadata?.properties?.find(
    property => property.name === selectedProperty?.name,
  );
  const colorScheme =
    selectedPropertyMetadata?.application?.orbis?.display?.color;
  const categoryPath = createCategorisationPath({
    categories: selectedLayer?.metadata?.application?.orbis?.categories,
  }).replace('.', ' > ');

  const onRadioClick = property => {
    dispatch(
      setProperty(
        selectedProperty?.name === property.name
          ? {}
          : {
              source_id: selectedLayer.source_id,
              ...property,
            },
      ),
    );
  };

  const onToggleClick = property => {
    if (property.name === selectedProperty?.name) return;
    dispatch(
      setProperty({
        source_id: selectedLayer.source_id,
        ...property,
      }),
    );
  };

  if (!selectedLayer?.metadata?.properties) return null;
  return (
    <Box display="flex" flexDirection="column">
      {groupProperties(selectedLayer.metadata.properties).map((data, i) => (
        <React.Fragment key={i}>
          <RadioProperty
            data={data}
            onRadioClick={onRadioClick}
            onToggleClick={onToggleClick}
            onSliderChange={data => dispatch(setFilterRange(data))}
            selectedProperty={selectedProperty}
            colorScheme={colorScheme}
            filterData={filterRange}
            categoryPath={categoryPath}
          />
        </React.Fragment>
      ))}
    </Box>
  );
};
