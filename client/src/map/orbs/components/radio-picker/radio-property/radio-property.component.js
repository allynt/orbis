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
import { DiscretePropertyLegend } from '../discrete-property-legend/discrete-property-legend.component';

const useStyles = makeStyles(theme => ({
  property: {
    display: 'grid',
    gridTemplateColumns: `1fr ${theme.spacing(4)}`,
    marginBottom: theme.spacing(2),
    rowGap: theme.spacing(2),
  },
  infoButton: {
    placeSelf: 'center',
  },
  categoryPath: {
    fontStyle: 'italic',
  },
  description: {
    fontWeight: 600,
  },
  fullGrid: {
    gridColumn: '1 / -1',
  },
  button: {
    width: '50%',
    cursor: 'not-allowed',
    '&$notActive': {
      color: theme.palette.secondary.contrastText,
      backgroundColor: theme.palette.secondary.dark,
      cursor: 'pointer',
    },
  },
  notActive: {},
}));

/**
 * @param {{selectedProperty: import('typings/orbis').Property}} props
 */
const RadioProperty = ({
  layerSourceId,
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

  const propertyMatch = (() => {
    const match = property =>
      selectedProperty?.name === property.name &&
      selectedProperty?.source_id === layerSourceId;

    return isArray ? data.some(property => match(property)) : match(data);
  })();

  const handleRadioClick = () =>
    onRadioClick(
      propertyMatch && isArray && selectedProperty?.type === FORMAT.number
        ? findPropertyByType(FORMAT.number)
        : initialProperty,
    );

  return (
    <div className={styles.property}>
      <FormControlLabel
        value={initialProperty?.name}
        checked={propertyMatch}
        label={
          initialProperty?.application?.orbis?.label || initialProperty?.label
        }
        control={<Radio onClick={handleRadioClick} name="isolationPlus" />}
      />
      <InfoButtonTooltip
        iconButtonClassName={styles.infoButton}
        tooltipContent={
          <>
            <Typography className={styles.categoryPath} paragraph>
              {categoryPath}
            </Typography>
            <Typography className={styles.description}>
              {initialProperty?.application?.orbis?.description ||
                initialProperty?.description}
            </Typography>
          </>
        }
      />
      {propertyMatch && (
        <>
          {isArray && (
            <>
              <FormLabel className={styles.fullGrid}>
                Select display type:
              </FormLabel>
              <ButtonGroup size="small" className={styles.fullGrid}>
                <Button
                  onClick={() =>
                    onToggleClick(findPropertyByType(FORMAT.percentage))
                  }
                  className={clsx(styles.button, {
                    [styles.notActive]:
                      selectedProperty.type !== FORMAT.percentage,
                  })}
                >
                  Percentage
                </Button>
                <Button
                  onClick={() =>
                    onToggleClick(findPropertyByType(FORMAT.number))
                  }
                  className={clsx(styles.button, {
                    [styles.notActive]: selectedProperty.type !== FORMAT.number,
                  })}
                >
                  Number
                </Button>
              </ButtonGroup>
            </>
          )}
          <div className={styles.fullGrid}>
            {selectedProperty.type === 'discrete' ? (
              <DiscretePropertyLegend property={selectedProperty} />
            ) : (
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
                  !!selectedProperty?.application?.orbis?.display
                    ?.colormap_reversed
                }
                precision={selectedProperty?.precision}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RadioProperty;
