import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import { Radio, InfoIcon, Button } from '@astrosat/astrosat-ui';

import ColorMapRangeSlider from 'components/colormap-range-slider/colormap-range-slider.component';
import {
  propertySelector,
  setProperty,
  setFilterRange,
} from '../../slices/isolation-plus.slice';

import { getRange, sortPairs } from './radio-picker-helpers';
import { FORMAT } from './radio-picker-constants';

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
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedUnit, setselectedUnit] = useState(FORMAT.percentage);

  const selectedPropertyMetadata = selectedLayer?.metadata?.properties?.find(
    property => property.name === selectedProperty?.name,
  );
  const colorScheme =
    selectedPropertyMetadata?.application?.orbis?.display?.color;
  const categoryPath = createCategorisationPath({
    categories: selectedLayer?.metadata?.application?.orbis?.categories,
  }).replace('.', ' > ');

  const onRadioClick = property => {
    setSelectedRange(selectedRange === property ? null : property);
    dispatch(
      setProperty({
        source_id: selectedLayer.source_id,
        ...property,
      }),
    );
  };

  const onButtonClick = property => {
    setselectedUnit(
      property.type === FORMAT.percentage ? FORMAT.percentage : FORMAT.number,
    );

    property.name === selectedProperty?.name
      ? dispatch(setProperty({}))
      : dispatch(
          setProperty({
            source_id: selectedLayer.source_id,
            ...property,
          }),
        );
  };

  if (!selectedLayer?.metadata?.properties) return null;
  return (
    <>
      {sortPairs(selectedLayer).map(pair => {
        const [perc, num] = pair;
        return (
          <div key={perc.name} className={styles.property}>
            <Radio
              label={getRange(perc)}
              name="isolationPlus"
              onClick={() => onRadioClick(perc)}
              value={perc.name}
              checked={selectedRange === perc}
            />
            <div className={styles.info}>
              <div
                data-tip
                data-for={`${perc.name}-tooltip`}
                role="tooltip"
                className={styles.infoButton}
                aria-label="tooltip"
                data-scroll-hide="false"
              >
                <InfoIcon classes={styles.infoIcon} title={perc.name} />
              </div>
              <ReactTooltip
                className={styles.tooltip}
                id={`${perc.name}-tooltip`}
                place="right"
                effect="solid"
                arrowColor="var(--color-primary)"
                backgroundColor="var(--color-primary)"
                textColor="var(--color--text--dark)"
              >
                <p>{perc.description}</p>
              </ReactTooltip>
            </div>
            {selectedRange === perc && (
              <div className={styles.filters}>
                <div className={styles.format}>
                  <label className={styles.label}>Select display type: </label>
                  <div className={styles.buttons}>
                    <Button
                      onClick={() => onButtonClick(perc)}
                      className={`${styles.button} ${
                        selectedUnit === FORMAT.percentage && styles.active
                      }`}
                    >
                      Percentage
                    </Button>
                    <Button
                      onClick={() => onButtonClick(num)}
                      className={`${styles.button} ${
                        selectedUnit === FORMAT.number && styles.active
                      }`}
                    >
                      Number
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
