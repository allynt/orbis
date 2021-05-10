import {
  Button,
  ButtonGroup,
  FormLabel,
  Grid,
  makeStyles,
} from '@astrosat/astrosat-ui';
import clsx from 'clsx';
import { capitalize } from 'lodash';
import React from 'react';

const useStyles = makeStyles(theme => ({
  buttonGroup: {
    width: '100%',
  },
  button: {
    width: '100%',
    padding: theme.spacing(1),
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
 * @param {import('typings/orbis').Property} property
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
 *  properties: import('typings/orbis').Property[]
 *  selectedProperty?: import('typings/orbis').Property
 *  onChange: (property: import('typings/orbis').Property) => void
 * }} props
 */
export const DisplayTypeToggleButtons = ({
  properties,
  selectedProperty,
  onChange,
}) => {
  const moreThanTwoProperties = properties.length > 2;
  const styles = useStyles();

  /**
   * @param {import('typings/orbis').Property} property
   */
  const handleClick = property => {
    if (property.name === selectedProperty?.name || !onChange) return;
    onChange(property);
  };

  return (
    <>
      <Grid item xs={moreThanTwoProperties ? 5 : 12}>
        <FormLabel>Select display type:</FormLabel>
      </Grid>
      <Grid item xs={moreThanTwoProperties ? 7 : 12} container justify="center">
        <ButtonGroup
          className={styles.buttonGroup}
          size="small"
          orientation={moreThanTwoProperties ? 'vertical' : 'horizontal'}
        >
          {properties.map(property => (
            <Button
              key={property.name}
              className={clsx(styles.button, {
                [styles.notActive]: selectedProperty?.name !== property.name,
              })}
              onClick={() => handleClick(property)}
            >
              {getButtonLabelForProperty(property)}
            </Button>
          ))}
        </ButtonGroup>
      </Grid>
    </>
  );
};
