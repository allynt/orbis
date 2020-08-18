import { Radio } from '@astrosat/astrosat-ui';
import InfoIcon from '@astrosat/astrosat-ui/dist/icons/info-icon';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { propertySelector, setProperty } from '../isolation-plus.slice';

export const RadioPicker = ({ selectedLayer, dispatch }) => {
  const selectedProperty = useSelector(state =>
    propertySelector(state, selectedLayer.source_id),
  );
  /** @type {[string | undefined, React.Dispatch<string | undefined>]} */
  const [visibleInfoProperty, setVisibleInfoProperty] = useState();

  return (
    <>
      {Object.keys(selectedLayer?.metadata?.properties)
        .filter(p => !p.includes('LSOA'))
        .map(property => (
          <>
            <Radio
              key={property}
              label={property}
              name={selectedLayer?.source_id}
              value={property}
              checked={property === selectedProperty}
              onChange={() =>
                dispatch(
                  setProperty({
                    source_id: selectedLayer.source_id,
                    property,
                  }),
                )
              }
            />
            <button onClick={() => setVisibleInfoProperty(property)}>
              <InfoIcon title={property} />
            </button>
            {visibleInfoProperty === property && (
              <p>{selectedLayer.metadata.properties[property].description}</p>
            )}
          </>
        ))}
    </>
  );
};
