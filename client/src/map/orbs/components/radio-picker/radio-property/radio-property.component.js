import React from 'react';

import { Radio, Button } from '@astrosat/astrosat-ui';

import ColorMapRangeSlider from 'components/colormap-range-slider/colormap-range-slider.component';
import { InfoIconTooltip } from 'components/info-icon-tooltip/info-icon-tooltip.component';
import { FORMAT } from '../radio-picker-constants';

import styles from './radio-property.module.css';

const RadioProperty = ({
  data,
  onRadioClick,
  onToggleClick,
  onSliderChange,
  selectedProperty,
  colorScheme,
  filterData,
  categoryPath,
}) => {
  const isArray = Array.isArray(data);

  const findPropertyByType = type => data.find(d => d.type === type);

  const initialProperty = isArray
    ? findPropertyByType(FORMAT.percentage)
    : data;

  const propertyMatch = isArray
    ? data.some(p => p.name === selectedProperty?.name)
    : data.name === selectedProperty?.name;

  return (
    <div className={styles.property}>
      <Radio
        className={styles.radio}
        label={
          initialProperty?.application?.orbis?.label || initialProperty.name
        }
        name="isolationPlus"
        value={initialProperty.name}
        checked={propertyMatch}
        onClick={() =>
          onRadioClick(
            propertyMatch && isArray && selectedProperty?.type === FORMAT.number
              ? findPropertyByType(FORMAT.number)
              : initialProperty,
          )
        }
      />
      <InfoIconTooltip>
        <p className={styles.categoryPath}>{categoryPath}</p>
        <p className={styles.description}>
          {initialProperty?.application?.orbis?.description ||
            initialProperty.description}
        </p>
      </InfoIconTooltip>
      {propertyMatch && (
        <div className={styles.displayMenu}>
          {isArray && (
            <>
              <label className={styles.label}>Select display type: </label>
              <div className={styles.buttons}>
                <Button
                  onClick={() =>
                    onToggleClick(findPropertyByType(FORMAT.percentage))
                  }
                  className={`${styles.button} ${
                    selectedProperty.type === FORMAT.percentage && styles.active
                  }`}
                >
                  Percentage
                </Button>
                <Button
                  onClick={() =>
                    onToggleClick(findPropertyByType(FORMAT.number))
                  }
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
            domain={[selectedProperty.min, selectedProperty.max]}
            value={filterData}
            property={selectedProperty}
            onChange={data => onSliderChange(data)}
          />
        </div>
      )}
    </div>
  );
};

export default RadioProperty;
