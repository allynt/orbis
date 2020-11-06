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
  const [toggle, setToggle] = useState(null);
  const [format, setFormat] = useState('percentage');

  const selectedPropertyMetadata = selectedLayer?.metadata?.properties?.find(
    property => property.name === selectedProperty?.name,
  );
  const colorScheme =
    selectedPropertyMetadata?.application?.orbis?.display?.color;
  const categoryPath = createCategorisationPath({
    categories: selectedLayer?.metadata?.application?.orbis?.categories,
  }).replace('.', ' > ');

  const sortPairs = () => {
    let percentages = [];
    let numbers = [];
    let pairs = [];

    for (let property of selectedLayer?.metadata?.properties) {
      if (property.type === 'percentage') {
        percentages = [...percentages, property];
      } else if (property.type === 'continuous') {
        numbers = [...numbers, property];
      }
    }

    percentages.forEach(perc => {
      const range = perc.description.match(/\d+/)[0];
      const twin = numbers.find(num => num.description.includes(range));
      pairs = [...pairs, [perc, twin]];
    });

    return pairs;
  };

  const onRadioClick = perc => {
    setToggle(toggle ? null : perc);
    dispatch(
      setProperty({
        source_id: selectedLayer.source_id,
        ...perc,
      }),
    );
  };

  const onButtonClick = property => {
    setFormat(property.type === 'percentage' ? 'percentage' : 'number');

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
      {sortPairs().map((pair, i) => {
        const [perc, num] = pair;
        return (
          <div key={perc.name} className={styles.property}>
            <Radio
              label={`Age Range ${i}`}
              name="isolationPlus"
              onClick={() => onRadioClick(perc)}
              value={perc.name}
              checked={false}
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
            {toggle === perc && (
              <div className={styles.filters}>
                <div className={styles.format}>
                  <label className={styles.label}>Select display type: </label>
                  <div className={styles.buttons}>
                    <Button
                      onClick={() => onButtonClick(perc)}
                      className={`${styles.button} ${
                        format === 'percentage' && styles.active
                      }`}
                    >
                      Percentage
                    </Button>
                    <Button
                      onClick={() => onButtonClick(num)}
                      className={`${styles.button} ${
                        format === 'number' && styles.active
                      }`}
                    >
                      Number
                    </Button>
                  </div>
                </div>
                <div className={styles.format}>
                  <label className={styles.label}>Select data source: </label>
                  <div className={styles.buttons}>
                    <Button
                      onClick={() => console.log('Source 1')}
                      className={`${styles.button} ${
                        format === 'percentage' && styles.active
                      }`}
                    >
                      Census 2011 (OA)
                    </Button>
                    <Button
                      onClick={() => console.log('Source 1')}
                      className={`${styles.button} ${
                        format === 'number' && styles.active
                      }`}
                    >
                      ONS 2018 (LSOA)
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
