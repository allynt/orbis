import { Radio } from '@astrosat/astrosat-ui';
import InfoIcon from '@astrosat/astrosat-ui/dist/icons/info-icon';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { propertySelector, setProperty } from '../isolation-plus.slice';
import styles from './radio-picker.module.css';

export const RadioPicker = ({ selectedLayer, dispatch }) => {
  const selectedProperty = useSelector(state =>
    propertySelector(state, selectedLayer.source_id),
  );
  /** @type {[string | undefined, React.Dispatch<string | undefined>]} */
  const [visibleInfoProperty, setVisibleInfoProperty] = useState();

  if (!selectedLayer?.metadata?.properties) return null;
  return (
    <>
      {Object.keys(selectedLayer?.metadata?.properties).map(property => (
        <div className={styles.property}>
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
          <button
            className={styles.infoButton}
            onClick={() =>
              setVisibleInfoProperty(visibleInfoProperty ? undefined : property)
            }
          >
            <InfoIcon classes={styles.infoIcon} title={property} />
          </button>
          {visibleInfoProperty === property && (
            <p>{selectedLayer.metadata.properties[property].description}</p>
          )}
        </div>
      ))}
    </>
  );
};
