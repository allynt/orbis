import React from 'react';

import {
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
} from '@astrosat/astrosat-ui';

import { InfoButtonTooltip } from 'components';

import { DisplayTypeToggleButtons } from '../display-type-toggle-buttons/display-type-toggle-buttons.component';
import { SelectedPropertyControls } from '../selected-property-controls/selected-property-controls.component';
import { TooltipContent } from './tooltip-content.component';

const useStyles = makeStyles(theme => ({
  grid: { '& + &': { marginTop: theme.spacing(0.5) } },
  iconButton: { justifySelf: 'flex-end', alignSelf: 'center' },
}));

/**
 * @param {{
 *   layerSourceId: import('typings').Source['source_id']
 *   properties: import('typings').Property[]
 *   onPropertyChange: (property?: import('typings').Property) => void
 *   selectedProperty: import('typings').Source['source_id']}
 *   onDateChange?: (event: React.ChangeEvent<{}>, date: number) => void
 *   selectedTimestamp?: number
 *   filterRange: [number, number]
 *   onFilterSliderChange: (value: [number, number]) => void
 *   categoryPath: string
 *   clipRange?: [number, number]
 *   onClipRangeChange: (value: [number, number]) => void
 * }} props
 */
const PropertyRadio = ({
  layerSourceId,
  properties,
  onPropertyChange,
  onDateChange,
  selectedTimestamp,
  filterRange,
  onFilterSliderChange,
  clipRange,
  onClipRangeChange,
  selectedProperty,
  categoryPath,
}) => {
  const styles = useStyles();
  const selectedPropertyIsInGroup =
    selectedProperty?.source_id === layerSourceId &&
    properties.some(p => p.name === selectedProperty?.name);

  const handleRadioClick = () => {
    return onPropertyChange(
      selectedPropertyIsInGroup ? selectedProperty : properties[0],
    );
  };

  return (
    <Grid container spacing={2} className={styles.grid}>
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
          {properties.length > 1 ? (
            <DisplayTypeToggleButtons
              properties={properties}
              selectedProperty={selectedProperty}
              onChange={onPropertyChange}
            />
          ) : null}
          <SelectedPropertyControls
            selectedProperty={selectedProperty}
            filterRange={filterRange}
            onRangeFilterChange={onFilterSliderChange}
            selectedTimestamp={selectedTimestamp}
            onDateChange={onDateChange}
            clipRange={clipRange}
            onClipRangeChange={onClipRangeChange}
          />
        </>
      )}
    </Grid>
  );
};

export default PropertyRadio;
