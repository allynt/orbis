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
import { DisplayTypeToggleButtons } from '../display-type-toggle-buttons/display-type-toggle-buttons.component';

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
 *   layerSourceId: import('typings/orbis').Source['source_id']
 *   data: import('typings/orbis').Property[]
 *   onPropertyChange: (property?: import('typings/orbis').Property) => void
 *   selectedProperty: import('typings/orbis').Property & {source_id: import('typings/orbis').Source['source_id']}
 *   onDateChange?: (event: React.ChangeEvent<{}>, date: number) => void
 *   selectedTimestamp?: number
 *   filterRange: [number, number]
 *   onSliderChange: (value: [number, number]) => void
 *   categoryPath: string
 * }} props
 */
const RadioProperty = ({
  layerSourceId,
  data,
  onPropertyChange,
  onDateChange,
  selectedTimestamp,
  filterRange,
  onSliderChange,
  selectedProperty,
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
            <DisplayTypeToggleButtons
              properties={data}
              selectedProperty={selectedProperty}
              onChange={format => handleToggleClick(format)}
            />
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
