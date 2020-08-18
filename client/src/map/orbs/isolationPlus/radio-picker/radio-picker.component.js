import React from 'react';
import { Radio } from '@astrosat/astrosat-ui';
import { useSelector } from 'react-redux';
import { propertySelector, setProperty } from '../isolation-plus.slice';

export const RadioPicker = ({ selectedLayer, dispatch }) => {
  const selectedProperty = useSelector(state =>
    propertySelector(state, selectedLayer.source_id),
  );
  if (!selectedLayer?.metadata?.properties) return null;
  return (
    <>
      {Object.keys(selectedLayer?.metadata?.properties).map(property => (
        <Radio
          key={property}
          label={property}
          name={selectedLayer?.source_id}
          value={property}
          checked={property === selectedProperty}
          onChange={e =>
            dispatch(
              setProperty({
                source_id: selectedLayer.source_id,
                property,
              }),
            )
          }
        />
      ))}
    </>
  );
};
