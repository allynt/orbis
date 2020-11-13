import React from 'react';

import ReactTooltip from 'react-tooltip';

import { Radio, InfoIcon, Button } from '@astrosat/astrosat-ui';

import ColorMapRangeSlider from 'components/colormap-range-slider/colormap-range-slider.component';

import { getLabel } from './radio-picker-helpers';
import { FORMAT } from './radio-picker-constants';

import styles from './radio-picker.module.css';

export const SingleProperty = ({
  property,
  onRadioClick,
  onSliderChange,
  selectedProperty,
  colorScheme,
}) => (
  <div key={property.name} className={styles.property}>
    <Radio
      className={styles.radio}
      label={property?.application?.orbis?.label || property.name}
      name="isolationPlus"
      value={property.name}
      checked={property.name === selectedProperty?.name}
      onClick={() => onRadioClick(property)}
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
        onChange={domain => onSliderChange(domain)}
      />
    )}
  </div>
);

export const PairedProperty = ({
  pair,
  onRadioClick,
  onToggleClick,
  onSliderChange,
  selectedProperty,
  selectedRange,
  selectedUnit,
  colorScheme,
}) => {
  const [perc, num] = pair;
  console.log('SelectedPtroperty: ', selectedProperty);
  return (
    <div key={perc.name} className={styles.property}>
      <Radio
        label={getLabel(perc)}
        name="isolationPlus"
        // Percentage is set by default
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
        <div className={styles.toggles}>
          <label className={styles.label}>Select display type: </label>
          <div className={styles.buttons}>
            <Button
              onClick={() => onToggleClick(perc)}
              className={`${styles.button} ${
                selectedUnit === FORMAT.percentage && styles.active
              }`}
            >
              Percentage
            </Button>
            <Button
              onClick={() => onToggleClick(num)}
              className={`${styles.button} ${
                selectedUnit === FORMAT.number && styles.active
              }`}
            >
              Number
            </Button>
          </div>
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
