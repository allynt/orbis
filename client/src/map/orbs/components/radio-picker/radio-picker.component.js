import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { activeDataSourcesSelector } from 'data-layers/data-layers.slice';

import {
  propertySelector,
  setProperty,
  setFilterRange,
} from '../../slices/isolation-plus.slice';

// import { SingleProperty, PairedProperty } from './properties.component';
import RadioProperty from './radio-property.component';

import { sortPairs } from './helpers/sort-pairs.js';
import { FORMAT } from './radio-picker-constants';

/**
 * @param {{
 *   selectedLayer: Source
 *   dispatch: import('redux').Dispatch
 * }} props
 */
export const RadioPicker = ({ selectedLayer, dispatch }) => {
  const activeSources = useSelector(activeDataSourcesSelector);
  // console.log('Sources: ', activeSources);
  // console.log('Layer: ', selectedLayer);
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));
  const [selectedBand, setSelectedBand] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(FORMAT.percentage);

  const selectedPropertyMetadata = selectedLayer?.metadata?.properties?.find(
    property => property.name === selectedProperty?.name,
  );
  const colorScheme =
    selectedPropertyMetadata?.application?.orbis?.display?.color;
  const categoryPath = createCategorisationPath({
    categories: selectedLayer?.metadata?.application?.orbis?.categories,
  }).replace('.', ' > ');

  useEffect(() => {
    if (!activeSources.includes(selectedLayer)) setSelectedBand(null);
    return () => dispatch(setProperty({}));
  }, [dispatch, activeSources, selectedLayer]);

  const onRadioClick = property => {
    setSelectedBand(selectedBand === property ? null : property);
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
      {selectedLayer?.metadata?.properties.map((property, i) => (
        <RadioProperty
          key={i}
          property={property}
          onRadioClick={onRadioClick}
          onToggleClick={onToggleClick}
          onSliderChange={domain => dispatch(setFilterRange(domain))}
          selectedProperty={selectedProperty}
          selectedBand={selectedBand}
          selectedUnit={selectedUnit}
          colorScheme={colorScheme}
        />
      ))}
    </>
  ) : (
    <>
      {sortPairs(selectedLayer).map((pair, i) => (
        <RadioProperty
          key={i}
          pairedProperties={pair}
          onRadioClick={onRadioClick}
          onToggleClick={onToggleClick}
          onSliderChange={domain => dispatch(setFilterRange(domain))}
          selectedProperty={selectedProperty}
          selectedBand={selectedBand}
          selectedUnit={selectedUnit}
          colorScheme={colorScheme}
        />
      ))}
    </>
  );
};
