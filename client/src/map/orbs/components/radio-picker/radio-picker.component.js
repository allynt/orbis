import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import ColorMapRangeSlider from 'components/colormap-range-slider/colormap-range-slider.component';
import {
  propertySelector,
  setProperty,
  setFilterRange,
} from '../../slices/isolation-plus.slice';

import { SingleProperty, PairedProperty } from './properties.component';

import { sortPairs } from './radio-picker-helpers';
import { FORMAT } from './radio-picker-constants';

/**
 * @param {{
 *   selectedLayer: Source
 *   dispatch: import('redux').Dispatch
 * }} props
 */
export const RadioPicker = ({ selectedLayer, dispatch }) => {
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(FORMAT.percentage);

  const selectedPropertyMetadata = selectedLayer?.metadata?.properties?.find(
    property => property.name === selectedProperty?.name,
  );
  const colorScheme =
    selectedPropertyMetadata?.application?.orbis?.display?.color;
  const categoryPath = createCategorisationPath({
    categories: selectedLayer?.metadata?.application?.orbis?.categories,
  }).replace('.', ' > ');

  const onRadioClick = property => {
    console.log('Property: ', property);
    setSelectedRange(selectedRange === property ? null : property);
    dispatch(
      setProperty({
        source_id: selectedLayer.source_id,
        ...property,
      }),
    );
  };

  const onToggleClick = property => {
    if (property.name === selectedProperty?.name) return;

    setSelectedUnit(property.type);
    dispatch(
      setProperty({
        source_id: selectedLayer.source_id,
        ...property,
      }),
    );
  };

  // Some layers have only percentages or only numbers, so can be rendered as regular Radios with ColorScales. Others have both percentages and numbers, and these ones require the toggle.
  const hasPairs =
    selectedLayer?.metadata?.properties?.some(
      p => p.type === FORMAT.percentage,
    ) &&
    selectedLayer?.metadata?.properties?.some(p => p.type === FORMAT.number);

  if (!selectedLayer?.metadata?.properties) return null;
  return !hasPairs ? (
    <>
      {selectedLayer?.metadata?.properties.map(property => (
        <SingleProperty
          property={property}
          onRadioClick={onRadioClick}
          selectedProperty={selectedProperty}
          colorScheme={colorScheme}
        />
      ))}
    </>
  ) : (
    <>
      {sortPairs(selectedLayer).map(pair => (
        <PairedProperty
          pair={pair}
          onRadioClick={onRadioClick}
          onToggleClick={onToggleClick}
          selectedProperty={selectedProperty}
          selectedRange={selectedRange}
          selectedUnit={selectedUnit}
          colorScheme={colorScheme}
        />
      ))}
    </>
  );
};
