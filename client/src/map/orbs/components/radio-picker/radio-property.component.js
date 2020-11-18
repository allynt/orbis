import React, { useState } from 'react';

import ReactTooltip from 'react-tooltip';

import { Radio, InfoIcon, Button } from '@astrosat/astrosat-ui';

import ColorMapRangeSlider from 'components/colormap-range-slider/colormap-range-slider.component';

import { FORMAT } from './radio-picker-constants';

import styles from './radio-picker.module.css';

const RadioProperty = ({
  data,
  onRadioClick,
  onToggleClick,
  onSliderChange,
  selectedProperty,
  colorScheme,
  categoryPath,
}) => {
  const isArray = Array.isArray(data);
  const initialProperty = isArray ? data[0] : data;

  const [selectedBand, setSelectedBand] = useState(initialProperty);

  return (
    <div className={styles.property}>
      <Radio
        className={styles.radio}
        label={
          initialProperty?.application?.orbis?.label || initialProperty.name
        }
        name="isolationPlus"
        value={initialProperty.name}
        checked={selectedProperty?.name === selectedBand.name}
        onClick={() => onRadioClick(initialProperty)}
      />
      <div className={styles.info}>
        <div
          data-tip
          data-for={`${initialProperty.name}-tooltip`}
          role="tooltip"
          className={styles.infoButton}
          aria-label="tooltip"
          data-scroll-hide="false"
        >
          <InfoIcon classes={styles.infoIcon} title={initialProperty.name} />
        </div>
        <ReactTooltip
          className={styles.tooltip}
          id={`${initialProperty.name}-tooltip`}
          place="right"
          effect="solid"
          arrowColor="var(--color-primary)"
          backgroundColor="var(--color-primary)"
          textColor="var(--color--text--dark)"
        >
          <p className={styles.categoryPath}>{categoryPath}</p>
          <p className={styles.description}>{initialProperty.description}</p>
        </ReactTooltip>
      </div>
      {selectedProperty?.name === selectedBand.name && (
        <div className={styles.displayMenu}>
          {isArray && (
            <>
              <label className={styles.label}>Select display type: </label>
              <div className={styles.buttons}>
                <Button
                  onClick={() => {
                    setSelectedBand(data[0]);
                    onToggleClick(data[0]);
                  }}
                  className={`${styles.button} ${
                    selectedProperty.type === FORMAT.percentage && styles.active
                  }`}
                >
                  Percentage
                </Button>
                <Button
                  onClick={() => {
                    setSelectedBand(data[1]);
                    onToggleClick(data[1]);
                  }}
                  className={`${styles.button} ${
                    selectedProperty.type === FORMAT.number && styles.active
                  }`}
                >
                  Number
                </Button>
              </div>
            </>
          )}
          <ColorMapRangeSlider
            type={selectedProperty?.type}
            color={colorScheme}
            domain={[selectedProperty?.min, selectedProperty?.max]}
            onChange={domain => onSliderChange(domain)}
          />
        </div>
      )}
    </div>
  );
};

export default RadioProperty;
