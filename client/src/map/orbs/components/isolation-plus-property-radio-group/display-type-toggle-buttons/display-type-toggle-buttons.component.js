import React from 'react';

import {
  FormLabel,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from '@astrosat/astrosat-ui';

import { capitalize } from 'lodash';

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
 *  properties: import('typings').Property[]
 *  selectedProperty?: import('typings').Property
 *  onChange: (property: import('typings').Property) => void
 * }} props
 */
export const DisplayTypeToggleButtons = ({
  properties,
  selectedProperty,
  onChange,
}) => {
  const moreThanTwoProperties = properties.length > 2;

  /**
   * @param {string} newPropertyName
   */
  const handleToggleChange = (_, newPropertyName) => {
    if (!newPropertyName || newPropertyName === selectedProperty?.name) return;

    const newProperty = properties.find(p => p.name === newPropertyName);
    return onChange(newProperty);
  };

  return (
    <>
      <Grid item xs={moreThanTwoProperties ? 5 : 12}>
        <FormLabel>Select display type:</FormLabel>
      </Grid>
      <Grid
        item
        xs={moreThanTwoProperties ? 7 : 12}
        container
        wrap="nowrap"
        component={ToggleButtonGroup}
        size="small"
        value={selectedProperty.name}
        onChange={handleToggleChange}
      >
        {properties.map(p => (
          <ToggleButton key={p.name} value={p.name}>
            {getButtonLabelForProperty(p)}
          </ToggleButton>
        ))}
      </Grid>
    </>
  );
};
