import React from 'react';

import {
  FormControlLabel,
  makeStyles,
  Radio,
  Typography,
} from '@astrosat/astrosat-ui';

import { InfoButtonTooltip } from 'components';
import { DisplayTypeToggleButtons } from '../display-type-toggle-buttons/display-type-toggle-buttons.component';
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
 *   layerSourceId: import('typings/orbis').Source['source_id']
 *   properties: import('typings/orbis').Property[]
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
  properties,
  onPropertyChange,
  onDateChange,
  selectedTimestamp,
  filterRange,
  onSliderChange,
  selectedProperty,
  categoryPath,
}) => {
  const styles = useStyles();
  const selectedPropertyIsInGroup =
    selectedProperty?.source_id === layerSourceId &&
    properties.some(p => p.name === selectedProperty?.name);

  const handleRadioClick = () => {
    onPropertyChange(
      selectedPropertyIsInGroup ? selectedProperty : properties[0],
    );
  };

  return (
    <div className={styles.property}>
      <FormControlLabel
        checked={selectedPropertyIsInGroup}
        label={properties[0]?.application?.orbis?.label || properties[0]?.label}
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
              {properties[0].application?.orbis?.description ||
                properties[0].description}
            </Typography>
          </>
        }
      />
      {selectedPropertyIsInGroup && (
        <>
          {properties.length > 1 && (
            <DisplayTypeToggleButtons
              properties={properties}
              selectedProperty={selectedProperty}
              onChange={onPropertyChange}
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
