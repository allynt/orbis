import React from 'react';

import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import { Radio, InfoIcon } from '@astrosat/astrosat-ui';

import ColorMapRangeSlider from 'components/colormap-range-slider/colormap-range-slider.component';
import {
  propertySelector,
  setProperty,
  setFilterRange,
} from '../../slices/isolation-plus.slice';

import styles from './radio-picker.module.css';
import { createCategorisationPath } from 'data-layers/categorisation.utils';

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
  const categoryPath = createCategorisationPath({
    categories: selectedLayer?.metadata?.application?.orbis?.categories,
  }).replace('.', ' > ');

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
              <p className={styles.categoryPath}>{categoryPath}</p>
              <p className={styles.description}>{property.description}</p>
            </ReactTooltip>
          </div>
          {property.name === selectedProperty?.name && (
            <ColorMapRangeSlider
              type={property.type}
              color={colorScheme}
              domain={[property.min, property.max]}
              onChange={domain => dispatch(setFilterRange(domain))}
            />
          )}
        </div>
      ))}
    </>
  );
};
