import React from 'react';

import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import { Radio, InfoIcon } from '@astrosat/astrosat-ui';

import {
  propertySelector,
  setProperty,
  colorSchemeSelector,
} from '../isolation-plus.slice';
import styles from './radio-picker.module.css';
import ColorScale from 'components/color-scale/color-scale.component';

export const RadioPicker = ({ selectedLayer, dispatch }) => {
  const selectedProperty = useSelector(state =>
    propertySelector(state, selectedLayer.source_id),
  );
  const colorScheme = useSelector(state =>
    colorSchemeSelector(state, selectedLayer.source_id),
  );

  if (!selectedLayer?.metadata?.properties) return null;
  return (
    <>
      {Object.keys(selectedLayer?.metadata?.properties).map(property => (
        <div key={property} className={styles.property}>
          <Radio
            className={styles.radio}
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
            <div
              data-tip
              data-for={`${property}-tooltip`}
              role="tooltip"
              className={styles.infoButton}
              aria-label="tooltip"
              data-scroll-hide="false"
            >
              <InfoIcon classes={styles.infoIcon} title={property} />
            </div>
            <ReactTooltip
              className={styles.tooltip}
              id={`${property}-tooltip`}
              place="right"
              effect="solid"
              arrowColor="var(--color-primary)"
              backgroundColor="var(--color-primary)"
              textColor="var(--color--text--dark)"
            >
              <p>{selectedLayer.metadata.properties[property].description}</p>
            </ReactTooltip>
          </div>
          {property === selectedProperty && (
            <ColorScale
              className={styles.colorScale}
              type={selectedLayer.metadata.properties[property].type}
              scheme={colorScheme}
              domain={[
                selectedLayer.metadata.properties[property].min,
                selectedLayer.metadata.properties[property].max,
              ]}
            />
          )}
        </div>
      ))}
    </>
  );
};
