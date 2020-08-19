import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { Radio, InfoIcon } from '@astrosat/astrosat-ui';

import { useClickaway } from 'hooks/useClickaway';
import InfoBox from 'components/info-box/info-box.component';
import { propertySelector, setProperty } from '../isolation-plus.slice';
import styles from './radio-picker.module.css';

export const RadioPicker = ({ selectedLayer, dispatch }) => {
  const selectedProperty = useSelector(state =>
    propertySelector(state, selectedLayer.source_id),
  );
  /** @type {[string | undefined, React.Dispatch<string | undefined>]} */
  const [visibleInfoProperty, setVisibleInfoProperty] = useState();
  const [ref] = useClickaway(() => setVisibleInfoProperty(undefined));

  if (!selectedLayer?.metadata?.properties) return null;
  return (
    <>
      {Object.keys(selectedLayer?.metadata?.properties).map(property => (
        <div key={property} className={styles.property}>
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
          <div className={styles.info}>
            <button
              className={styles.infoButton}
              onClick={() =>
                setVisibleInfoProperty(
                  visibleInfoProperty === property ? undefined : property,
                )
              }
            >
              <InfoIcon classes={styles.infoIcon} title={property} />
            </button>
            {visibleInfoProperty === property && (
              <InfoBox ref={ref} className={styles.description} arrow="left">
                <p>{selectedLayer.metadata.properties[property].description}</p>
              </InfoBox>
            )}
          </div>
        </div>
      ))}
    </>
  );
};
