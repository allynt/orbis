import * as React from 'react';

import { Box } from '@astrosat/astrosat-ui';

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
import RadioProperty from './property-radio/radio-property.component';

/**
 * @param {{
 *   selectedLayer: import('typings/orbis').Source
 *   dispatch: import('redux').Dispatch
 * }} props
 */
export const IsolationPlusPropertyRadioGroup = ({
  selectedLayer,
  dispatch,
}) => {
  const otherStateKey = `${selectedLayer.authority}/${selectedLayer.namespace}`;
  const other = useSelector(state => otherSelector(otherStateKey)(state?.orbs));
  /** @type {import('typings/orbis').Property & {source_id: import('typings/orbis').Source['source_id']}} */
  const selectedProperty = get(other, 'property');

  const propertyStateKey = `${selectedProperty?.source_id}/${selectedProperty?.name}`;
  const selectedTimestamp = useSelector(state =>
    timestampSelector(propertyStateKey)(state?.orbs),
  );

  const filterRange = useSelector(state =>
    filterValueSelector(propertyStateKey)(state?.orbs),
  );

  const categoryPath = createCategorisationPath({
    categories: selectedLayer?.metadata?.application?.orbis?.categories,
  }).replace('.', ' > ');

  /**
   * @param {import('typings/orbis').Property} property
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

  if (!selectedLayer?.metadata?.properties) return null;
  return (
    <Box display="flex" flexDirection="column" width="100%">
      {groupProperties(selectedLayer.metadata.properties).map((data, i) => (
        <React.Fragment key={i}>
          <RadioProperty
            layerSourceId={selectedLayer?.source_id}
            properties={data}
            onPropertyChange={handlePropertyChange}
            onSliderChange={filterValue =>
              dispatch(
                setFilterValue({
                  key: propertyStateKey,
                  filterValue,
                }),
              )
            }
            selectedProperty={selectedProperty}
            filterRange={filterRange}
            categoryPath={categoryPath}
            onDateChange={(_, timestamp) =>
              dispatch(
                setTimestamp({
                  key: propertyStateKey,
                  timestamp,
                }),
              )
            }
            selectedTimestamp={selectedTimestamp}
          />
        </React.Fragment>
      ))}
    </Box>
  );
};
