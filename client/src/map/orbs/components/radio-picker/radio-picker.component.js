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

import { getLabel, sortPairs } from './radio-picker-helpers';
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

  // Some layers have only percentages, so can be rendered as regular Radios with ColorScales. Others have both percentages and numbers, and only these ones that require the toggle.
  const hasPairs = selectedLayer?.metadata?.properties?.some(
    p => p.type === FORMAT.number,
  );

  if (!selectedLayer?.metadata?.properties) return null;
  return hasPairs ? (
    <>
      {sortPairs(selectedLayer).map((pair, i) => {
        console.log(`Pair ${i}: `, pair);
        const [perc, num] = pair;
        return (
          <div key={perc.name} className={styles.property}>
            <Radio
              label={getLabel(perc)}
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
            {perc.name === selectedProperty?.name && (
              <ColorScale
                className={styles.colorScale}
                type={perc.type}
                scheme={colorScheme}
                domain={[perc.min, perc.max]}
              />
            )}
          </div>
        );
      })}
    </>
  ) : (
    <>
      {selectedLayer?.metadata?.properties.map((property, i) => {
        console.log(`Single Property ${i}: `, property);
        return (
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
              <ColorScale
                className={styles.colorScale}
                type={property.type}
                scheme={colorScheme}
                domain={[property.min, property.max]}
              />
            )}
          </div>
        );
      })}
    </>
  );
};
