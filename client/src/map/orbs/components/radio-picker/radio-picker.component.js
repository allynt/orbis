import React from 'react';

import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import { Radio, InfoIcon } from '@astrosat/astrosat-ui';

import {
  propertySelector,
  setProperty,
} from '../../slices/isolation-plus.slice';
import styles from './radio-picker.module.css';
import ColorScale from 'components/color-scale/color-scale.component';
import ColorMapRangeSlider from 'components/colormap-range-slider/colormap-range-slider.component';

/**
 * @param {{
 *   selectedLayer: Source
 *   dispatch: import('redux').Dispatch
 * }} props
 */
export const RadioPicker = ({ selectedLayer, dispatch }) => {
  const selectedProperty = useSelector(state => propertySelector(state?.orbs));
  const selectedPropertyMetadata = selectedLayer?.metadata?.properties?.find(
    property => property.name === selectedProperty?.name,
  );
  const colorScheme =
    selectedPropertyMetadata?.application?.orbis?.display?.color;

  if (!selectedLayer?.metadata?.properties) return null;
  return (
    <>
      {selectedLayer?.metadata?.properties.map(property => (
        <div key={property.name} className={styles.property}>
          <Radio
            className={styles.radio}
            label={property?.application?.orbis?.label || property.name}
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
            <ColorMapRangeSlider
              type={property.type}
              color={colorScheme}
              domain={[property.min, property.max]}
            />
          )}
        </div>
      ))}
    </>
  );
};
