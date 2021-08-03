import * as React from 'react';

import { get } from 'lodash';
import { useSelector } from 'react-redux';

import { createCategorisationPath } from 'data-layers/categorisation.utils';

import {
  filterValueSelector,
  otherSelector,
  setFilterValue,
  setOther,
  setTimestamp,
  timestampSelector,
} from '../../layers.slice';
import { groupProperties } from './helpers/group-properties.js';
import PropertyRadio from './property-radio/property-radio.component';

/**
 * @param {{
 *   selectedLayer: import('typings').Source
 *   dispatch: import('redux').Dispatch
 * }} props
 */
export const IsolationPlusPropertyRadioGroup = ({
  selectedLayer,
  dispatch,
}) => {
  const otherStateKey = `${selectedLayer.authority}/${selectedLayer.namespace}`;
  const other = useSelector(state => otherSelector(otherStateKey)(state?.orbs));
  /** @type {import('typings').Source['source_id']}} */
  const selectedProperty = get(other, 'property');

  const propertyStateKey = `${selectedProperty?.source_id}/${selectedProperty?.name}`;
  const selectedTimestamp = useSelector(state =>
    timestampSelector(propertyStateKey)(state?.orbs),
  );

  const filterRange = useSelector(state =>
    filterValueSelector(propertyStateKey)(state?.orbs),
  );

  const propertyOther = useSelector(state =>
    otherSelector(propertyStateKey)(state?.orbs),
  );
  const clipRange = get(propertyOther, 'clipRange');

  const categoryPath = createCategorisationPath({
    categories: selectedLayer?.metadata?.application?.orbis?.categories,
  }).replace('.', ' > ');

  /**
   * @param {import('typings').Property} property
   */
  const handlePropertyChange = property => {
    dispatch(
      setOther({
        key: otherStateKey,
        other: {
          ...other,
          property:
            property.name === selectedProperty?.name &&
            selectedLayer?.source_id === selectedProperty?.source_id
              ? {}
              : { source_id: selectedLayer?.source_id, ...property },
        },
      }),
    );
  };

  /**
   * @param {[number, number]} filterValue
   */
  const handleSliderChange = filterValue =>
    dispatch(
      setFilterValue({
        key: propertyStateKey,
        filterValue,
      }),
    );

  /**
   * @param {React.ChangeEvent<{}>} _
   * @param {number} timestamp
   */
  const handleDateChange = (_, timestamp) =>
    dispatch(
      setTimestamp({
        key: propertyStateKey,
        timestamp,
      }),
    );

  const handleClipRangeChange = clipRange =>
    dispatch(
      setOther({
        key: propertyStateKey,
        other: { ...propertyOther, clipRange },
      }),
    );

  if (!selectedLayer?.metadata?.properties) return null;
  return groupProperties(selectedLayer.metadata.properties).map(properties => (
    <PropertyRadio
      key={`${selectedLayer.source_id}-property-${properties[0].name}`}
      layerSourceId={selectedLayer?.source_id}
      properties={properties}
      onPropertyChange={handlePropertyChange}
      onFilterSliderChange={handleSliderChange}
      selectedProperty={selectedProperty}
      filterRange={filterRange}
      categoryPath={categoryPath}
      onDateChange={handleDateChange}
      selectedTimestamp={selectedTimestamp}
      clipRange={clipRange}
      onClipRangeChange={handleClipRangeChange}
    />
  ));
};
