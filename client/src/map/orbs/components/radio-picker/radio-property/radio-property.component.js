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

import { InfoButtonTooltip } from 'components';
import { FORMAT } from '../radio-picker-constants';
import { SelectedPropertyControls } from '../selected-property-controls/selected-property-controls.component';

const useStyles = makeStyles(theme => ({
  property: {
    display: 'grid',
    gridTemplateColumns: `1fr ${theme.spacing(4)}`,
    marginBottom: theme.spacing(2),
    rowGap: theme.spacing(2),
  },
  infoButton: {
    justifySelf: 'flex-end',
    alignSelf: 'center',
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
 * @param {{
 *   selectedProperty: import('typings/orbis').Property
 *   onDateChange?: (event: React.ChangeEvent<{}>, date: number) => void
 *   selectedTimestamp?: number
 * }} props
 */
const RadioProperty = ({
  layerSourceId,
  data,
  onPropertyChange,
  onDateChange,
  selectedTimestamp,
  onSliderChange,
  selectedProperty,
  filterRange,
  categoryPath,
}) => {
  const styles = useStyles();

  /**
   * @param {string} type
   */
  const findPropertyByType = type => data.find(d => d.type === type);

  const initialProperty = findPropertyByType(FORMAT.percentage) || data[0];

  const propertyMatch = data.some(p => {
    return (
      selectedProperty?.name === p.name &&
      selectedProperty?.source_id === layerSourceId
    );
  });

  const handleRadioClick = () => {
    const payload = propertyMatch ? null : initialProperty;
    return onPropertyChange(payload);
  };

  /**
   * @param {string} type
   */
  const handleToggleClick = type => {
    const property = findPropertyByType(type);
    if (property.name === selectedProperty?.name) return;
    else onPropertyChange(property);
  };

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
          {data?.length > 1 && (
            <>
              <FormLabel className={styles.fullGrid}>
                Select display type:
              </FormLabel>
              <ButtonGroup size="small" className={styles.fullGrid}>
                <Button
                  onClick={() => handleToggleClick(FORMAT.percentage)}
                  className={clsx(styles.button, {
                    [styles.notActive]:
                      selectedProperty.type !== FORMAT.percentage,
                  })}
                >
                  Percentage
                </Button>
                <Button
                  onClick={() => handleToggleClick(FORMAT.number)}
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
            <SelectedPropertyControls
              selectedProperty={selectedProperty}
              filterRange={filterRange}
              onRangeFilterChange={onSliderChange}
              selectedTimestamp={selectedTimestamp}
              onDateChange={onDateChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default RadioProperty;
