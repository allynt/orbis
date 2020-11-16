import React from 'react';

import ReactTooltip from 'react-tooltip';

import { Radio, InfoIcon, Button } from '@astrosat/astrosat-ui';

import ColorMapRangeSlider from 'components/colormap-range-slider/colormap-range-slider.component';

import { FORMAT } from './radio-picker-constants';

import styles from './radio-picker.module.css';

const RadioProperty = ({
  key,
  property,
  pairedProperties,
  onRadioClick,
  onToggleClick,
  onSliderChange,
  selectedProperty,
  selectedBand,
  selectedUnit,
  colorScheme,
}) => {
  const bandProperty = property ? property : pairedProperties[0];
  return (
    <div key={key} className={styles.property}>
      <Radio
        className={styles.radio}
        label={bandProperty?.application?.orbis?.label || bandProperty.name}
        name="isolationPlus"
        value={bandProperty.name}
        // Percentage property is used to toggle the Radio on/off, as only one  // property can be dispatched.
        checked={selectedBand === bandProperty}
        onClick={() => onRadioClick(bandProperty)}
      />
      <div className={styles.info}>
        <div
          data-tip
          data-for={`${bandProperty.name}-tooltip`}
          role="tooltip"
          className={styles.infoButton}
          aria-label="tooltip"
          data-scroll-hide="false"
        >
          <InfoIcon classes={styles.infoIcon} title={bandProperty.name} />
        </div>
        <ReactTooltip
          className={styles.tooltip}
          id={`${bandProperty.name}-tooltip`}
          place="right"
          effect="solid"
          arrowColor="var(--color-primary)"
          backgroundColor="var(--color-primary)"
          textColor="var(--color--text--dark)"
        >
          <p>{bandProperty.name}</p>
        </ReactTooltip>
      </div>
      {selectedBand === bandProperty && (
        <div className={styles.displayMenu}>
          {pairedProperties && (
            <>
              <label className={styles.label}>Select display type: </label>
              <div className={styles.buttons}>
                <Button
                  onClick={() => onToggleClick(pairedProperties[0])}
                  className={`${styles.button} ${
                    selectedUnit === FORMAT.percentage && styles.active
                  }`}
                >
                  Percentage
                </Button>
                <Button
                  onClick={() => onToggleClick(pairedProperties[1])}
                  className={`${styles.button} ${
                    selectedUnit === FORMAT.number && styles.active
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
