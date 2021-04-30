import React from 'react';

import {
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  Typography,
} from '@astrosat/astrosat-ui';

import { InfoButtonTooltip } from 'components';
import { DisplayTypeToggleButtons } from '../display-type-toggle-buttons/display-type-toggle-buttons.component';
import { SelectedPropertyControls } from '../selected-property-controls/selected-property-controls.component';

const useStyles = makeStyles(theme => ({
  categoryPath: { fontStyle: 'italic' },
  description: { fontWeight: theme.typography.fontWeightBold },
  iconButton: { justifySelf: 'flex-end', alignSelf: 'center' },
}));

const TooltipContent = ({ categoryPath, description }) => {
  const styles = useStyles();
  return (
    <>
      <Typography className={styles.categoryPath} paragraph>
        {categoryPath}
      </Typography>
      <Typography className={styles.description}>{description}</Typography>
    </>
  );
};

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
const PropertyRadio = ({
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
    <Grid container spacing={2}>
      <Grid item xs={11}>
        <FormControlLabel
          checked={selectedPropertyIsInGroup}
          label={
            properties[0]?.application?.orbis?.label || properties[0]?.label
          }
          control={<Radio onClick={handleRadioClick} name="isolationPlus" />}
        />
      </Grid>
      <Grid item xs={1}>
        <InfoButtonTooltip
          iconButtonClassName={styles.iconButton}
          tooltipContent={
            <TooltipContent
              categoryPath={categoryPath}
              description={
                properties[0].application?.orbis?.description ||
                properties[0].description
              }
            />
          }
        />
      </Grid>
      {selectedPropertyIsInGroup && (
        <>
          {properties.length > 1 && (
            <DisplayTypeToggleButtons
              properties={properties}
              selectedProperty={selectedProperty}
              onChange={onPropertyChange}
            />
          )}
          <SelectedPropertyControls
            selectedProperty={selectedProperty}
            filterRange={filterRange}
            onRangeFilterChange={onSliderChange}
            selectedTimestamp={selectedTimestamp}
            onDateChange={onDateChange}
          />
        </>
      )}
    </Grid>
  );
};

export default PropertyRadio;
