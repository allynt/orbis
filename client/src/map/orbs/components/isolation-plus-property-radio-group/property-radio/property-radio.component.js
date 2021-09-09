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
  toggleButton: {
    minWidth: '6.875rem',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
  },
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

  /**
   * @param {import('typings').Property} newProperty
   */
  const handleToggleChange = (_, newProperty) => {
    if (!newProperty || newProperty.name === selectedProperty?.name) return;
    return onPropertyChange(newProperty);
  };

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
                component={ToggleButtonGroup}
                value={selectedProperty}
                onChange={handleToggleChange}
              >
                {properties.map(p => (
                  <ToggleButton
                    key={p.name}
                    selected={selectedProperty?.name === p.name}
                    value={p}
                    className={styles.toggleButton}
                  >
                    {getButtonLabelForProperty(p)}
                  </ToggleButton>
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
