import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import {
  propertySelector,
  setProperty,
  filterRangeSelector,
  setFilterRange,
  clipPositionSelector,
  setClipPosition,
} from '../../slices/isolation-plus.slice';

import { createCategorisationPath } from 'data-layers/categorisation.utils';

import RadioProperty from './radio-property/radio-property.component';

import { DEFAULT_CLIP_POSITION } from './radio-picker-constants';

import { getProperties } from './helpers/get-properties.js';

/**
 * @param {{
 *   selectedLayer: Source
 *   dispatch: import('redux').Dispatch
 * }} props
 */
export const RadioPicker = ({ selectedLayer, dispatch }) => {
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));
  const filterRange = useSelector(state => filterRangeSelector(state?.orbs));
  const clipPosition = useSelector(state => clipPositionSelector(state?.orbs));

  const selectedPropertyMetadata = selectedLayer?.metadata?.properties?.find(
    property => property.name === selectedProperty?.name,
  );
  const colorScheme =
    selectedPropertyMetadata?.application?.orbis?.display?.color;
  const categoryPath = createCategorisationPath({
    categories: selectedLayer?.metadata?.application?.orbis?.categories,
  }).replace('.', ' > ');

  useEffect(() => {
    if (filterRange.some(n => n === undefined)) {
      dispatch(setFilterRange([selectedProperty.min, selectedProperty.max]));
    }
  }, [selectedProperty, filterRange, dispatch]);

  const onRadioClick = property => {
    dispatch(setClipPosition(DEFAULT_CLIP_POSITION));

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

    dispatch(setClipPosition(DEFAULT_CLIP_POSITION));

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
          onSliderChange={domain => dispatch(setFilterRange(domain))}
          selectedProperty={selectedProperty}
          colorScheme={colorScheme}
          filterRange={filterRange}
          clipPosition={clipPosition}
          setClipPosition={position => dispatch(setClipPosition(position))}
          categoryPath={categoryPath}
        />
      ))}
    </>
  );
};
