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

/**
 * @param {{
 *   selectedLayer: ({
 *     source_id: string
 *     metadata: {
 *       properties: {
 *         name: string
 *         description: string
 *         min: number
 *         max: number
 *         type: 'percentage' | 'decile' | 'continuous' | 'discrete'
 *       }[]
 *     }
 *   })
 *   dispatch: import('redux').Dispatch
 * }} props
 */
export const RadioPicker = ({ selectedLayer, dispatch }) => {
  const selectedProperty = useSelector(propertySelector);
  const colorScheme = useSelector(state =>
    colorSchemeSelector(state, selectedLayer.source_id),
  );

  if (!selectedLayer?.metadata?.properties) return null;
  return (
    <>
      {selectedLayer?.metadata?.properties.map(property => (
        <div key={property.name} className={styles.property}>
          <Radio
            className={styles.radio}
            label={property.name}
            name="isolationPlus"
            value={property.name}
            checked={property.name === selectedProperty?.name}
            onClick={() =>
              property.name === selectedProperty?.name
                ? dispatch(setProperty({}))
                : dispatch(
                    setProperty({
                      source_id: selectedLayer.source_id,
                      ...property,
                    }),
                  )
            }
          />
          <div className={styles.info}>
            <div
              data-tip
              data-for={`${property.name}-tooltip`}
              role="tooltip"
              className={styles.infoButton}
              aria-label="tooltip"
              data-scroll-hide="false"
            >
              <InfoIcon classes={styles.infoIcon} title={property.name} />
            </div>
            <ReactTooltip
              className={styles.tooltip}
              id={`${property.name}-tooltip`}
              place="right"
              effect="solid"
              arrowColor="var(--color-primary)"
              backgroundColor="var(--color-primary)"
              textColor="var(--color--text--dark)"
            >
              <p>{property.description}</p>
            </ReactTooltip>
          </div>
          {property.name === selectedProperty?.name && (
            <ColorScale
              className={styles.colorScale}
              type={property.type}
              scheme={colorScheme}
              domain={[property.min, property.max]}
            />
          )}
        </div>
      ))}
    </>
  );
};
