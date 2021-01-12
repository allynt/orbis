import React from 'react';

import {
  Radio,
  Button,
  makeStyles,
  FormControlLabel,
  Typography,
  ButtonGroup,
  FormLabel,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';

import { InfoButtonTooltip, ColorMapRangeSlider } from 'components';
import { FORMAT } from '../radio-picker-constants';

const useStyles = makeStyles(theme => ({
  property: {
    display: 'grid',
    gridTemplateColumns: '1fr 2rem',
    marginBottom: '1.25rem',
    rowGap: '1.25rem',
  },
  radio: {
    width: '100% !important',
    gridColumn: '1 / 2',
  },
  info: {
    position: 'relative',
  },
  infoButton: {
    gridColumn: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.625em',
    padding: '0.4em',
    width: 'max-content',
    height: 'auto',
    marginLeft: '1em',
    backgroundColor: '#fff',
    borderRadius: '50%',
    transition: 'opacity 250ms ease',
    '&:hover': {
      opacity: 0.5,
    },
  },
  infoIcon: {
    color: '#333f48',
    width: '1em',
    height: 'auto',
  },
  tooltip: {
    maxWidth: '50ch',
  },
  categoryPath: {
    fontStyle: 'italic',
    marginBottom: '8px',
  },
  description: {
    fontWeight: 600,
  },
  displayMenu: {
    gridColumn: '1 / span 2',
  },
  label: {
    color: '#dcdcdc',
    fontSize: '0.75rem',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.3125rem',
    marginBottom: '1.25rem',
    width: '100%',
  },
  button: {
    color: '#fff',
    backgroundColor: '#171819',
    padding: '0.625rem',
    width: '50%',
    fontSize: '0.875rem',
    cursor: 'pointer',
    '&$active': {
      color: '#171819',
      backgroundColor: '#f6be00',
      cursor: 'not-allowed',
    },
    '&:first-child': {
      borderRadius: '0.5rem 0 0 0.5rem',
    },
    '&:last-child': {
      borderRadius: '0 0.5rem 0.5rem 0',
    },
  },
  active: {},
}));

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
  const styles = useStyles();
  const isArray = Array.isArray(data);

  const findPropertyByType = type => data.find(d => d.type === type);

  const initialProperty = isArray
    ? findPropertyByType(FORMAT.percentage)
    : data;

  const propertyMatch = isArray
    ? data.some(p => p.name === selectedProperty?.name)
    : data.name === selectedProperty?.name;

  const handleRadioClick = () =>
    onRadioClick(
      propertyMatch && isArray && selectedProperty?.type === FORMAT.number
        ? findPropertyByType(FORMAT.number)
        : initialProperty,
    );

  return (
    <div className={styles.property}>
      <FormControlLabel
        value={initialProperty.name}
        checked={propertyMatch}
        label={
          initialProperty?.application?.orbis?.label || initialProperty.label
        }
        control={<Radio onClick={handleRadioClick} name="isolationPlus" />}
      />
      <InfoButtonTooltip
        tooltipContent={
          <>
            <Typography className={styles.categoryPath}>
              {categoryPath}
            </Typography>
            <Typography className={styles.description}>
              {initialProperty?.application?.orbis?.description ||
                initialProperty.description}
            </Typography>
          </>
        }
      />
      {propertyMatch && (
        <div className={styles.displayMenu}>
          {isArray && (
            <>
              <FormLabel>Select display type: </FormLabel>
              <ButtonGroup>
                <Button
                  onClick={() =>
                    onToggleClick(findPropertyByType(FORMAT.percentage))
                  }
                  className={clsx(styles.button, {
                    [styles.active]:
                      selectedProperty.type === FORMAT.percentage,
                  })}
                >
                  Percentage
                </Button>
                <Button
                  onClick={() =>
                    onToggleClick(findPropertyByType(FORMAT.number))
                  }
                  className={clsx(styles.button, {
                    [styles.active]: selectedProperty.type === FORMAT.number,
                  })}
                >
                  Number
                </Button>
              </ButtonGroup>
            </>
          )}
          <ColorMapRangeSlider
            type={selectedProperty?.type}
            color={colorScheme}
            domain={[selectedProperty.min, selectedProperty.max]}
            clip={
              (selectedProperty.clip_min || selectedProperty.clip_max) && [
                selectedProperty.clip_min || selectedProperty.min,
                selectedProperty.clip_max || selectedProperty.max,
              ]
            }
            value={filterData}
            onChange={data => onSliderChange(data)}
            reversed={
              !!selectedProperty?.application?.orbis?.display?.colormap_reversed
            }
          />
        </div>
      )}
    </div>
  );
};

export default RadioProperty;
