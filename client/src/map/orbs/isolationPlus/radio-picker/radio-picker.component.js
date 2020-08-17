import React from 'react';
import { Radio } from '@astrosat/astrosat-ui';
import { useSelector } from 'react-redux';
import { propertySelector, setProperty } from '../isolation-plus.slice';

export const RadioPicker = ({ selectedLayer, dispatch }) => {
  const selectedProperty = useSelector(state =>
    propertySelector(state, selectedLayer.source_id),
  );

  return (
    <>
      {Object.keys(selectedLayer?.metadata?.properties)
        .filter(p => !p.includes('LSOA'))
        .map(property => (
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
