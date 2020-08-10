import React from 'react';
import { Radio } from '@astrosat/astrosat-ui';
import { useDispatch, useSelector } from 'react-redux';
import { propertySelector, setProperty } from '../isolation-plus.slice';

export const RadioPicker = ({ selectedLayer }) => {
  const dispatch = useDispatch();
  const selectedProperty = useSelector(state =>
    propertySelector(state, selectedLayer.source_id),
  );

  return (
    <div>
      {Object.keys(selectedLayer?.metadata?.properties)
        .filter(p => !p.includes('LSOA'))
        .map(property => (
          <Radio
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
    </div>
  );
};
