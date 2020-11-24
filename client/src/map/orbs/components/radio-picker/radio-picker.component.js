import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import {
  propertySelector,
  setProperty,
  filterDataSelector,
  setFilterData,
} from '../../slices/isolation-plus.slice';

import { createCategorisationPath } from 'data-layers/categorisation.utils';

import RadioProperty from './radio-property/radio-property.component';

import { getProperties } from './helpers/get-properties.js';

/**
 * @param {{
 *   selectedLayer: Source
 *   dispatch: import('redux').Dispatch
 * }} props
 */
export const RadioPicker = ({ selectedLayer, dispatch }) => {
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));
  const filterData = useSelector(state => filterDataSelector(state?.orbs));

  const selectedPropertyMetadata = selectedLayer?.metadata?.properties?.find(
    property => property.name === selectedProperty?.name,
  );
  const colorScheme =
    selectedPropertyMetadata?.application?.orbis?.display?.color;
  const categoryPath = createCategorisationPath({
    categories: selectedLayer?.metadata?.application?.orbis?.categories,
  }).replace('.', ' > ');

  useEffect(() => {
    if (filterData.filterRange.some(n => n === undefined)) {
      dispatch(
        setFilterData({
          filterRange: [selectedProperty.min, selectedProperty.max],
        }),
      );
    }
  }, [selectedProperty, filterData, dispatch]);

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
      {getProperties(selectedLayer).map(data => (
        <RadioProperty
          data={data}
          onRadioClick={onRadioClick}
          onToggleClick={onToggleClick}
          onSliderChange={data => dispatch(setFilterData(data))}
          selectedProperty={selectedProperty}
          colorScheme={colorScheme}
          filterData={filterData}
          categoryPath={categoryPath}
        />
      ))}
    </>
  );
};
