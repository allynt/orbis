import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import {
  propertySelector,
  setProperty,
  filterRangeSelector,
  setFilterRange,
} from '../../slices/isolation-plus.slice';

import { createCategorisationPath } from 'data-layers/categorisation.utils';

import RadioProperty from './radio-property/radio-property.component';

import { groupProperties } from './helpers/group-properties.js';

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
    <>
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
    </>
  );
};
