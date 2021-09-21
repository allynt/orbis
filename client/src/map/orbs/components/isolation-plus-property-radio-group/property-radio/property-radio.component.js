import React from 'react';

import {
  FormLabel,
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  ToggleButtonGroup,
  ToggleButton,
} from '@astrosat/astrosat-ui';

import { capitalize } from 'lodash';

import { InfoButtonTooltip } from 'components';

import { SelectedPropertyControls } from '../selected-property-controls/selected-property-controls.component';
import { TooltipContent } from './tooltip-content.component';

const useStyles = makeStyles(theme => ({
  grid: { '& + &': { marginTop: theme.spacing(0.5) } },
  iconButton: { justifySelf: 'flex-end', alignSelf: 'center' },
}));

/**
 * @param {import('typings').Property} property
 */
const getButtonLabelForProperty = property => {
  if (property.application?.orbis?.display?.property_toggle_label)
    return property.application.orbis.display.property_toggle_label;
  switch (property.type) {
    case 'decile':
    case 'percentage':
      return capitalize(property.type);
    case 'discrete':
      return 'Categories';
    default:
      return 'Number';
  }
};

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

  /**
   * @param {string} newPropertyName
   */
  const handleToggleChange = (_, newPropertyName) => {
    if (!newPropertyName || newPropertyName === selectedProperty?.name) return;

    const newProperty = properties.find(p => p.name === newPropertyName);
    return onPropertyChange(newProperty);
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
          {properties?.length > 1 ? (
            <>
              <Grid item>
                <FormLabel>Select display type:</FormLabel>
              </Grid>
              <Grid
                item
                container
                justifyContent="center"
                wrap="nowrap"
                size="small"
                component={ToggleButtonGroup}
                value={selectedProperty.name}
                onChange={handleToggleChange}
              >
                {properties.map(p => (
                  <Grid
                    item
                    component={ToggleButton}
                    key={p.name}
                    value={p.name}
                  >
                    {getButtonLabelForProperty(p)}
                  </Grid>
                ))}
              </Grid>
            </>
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
