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
    maxWidth: '100%',
  },
  button: {
    width: props => (props.moreThanTwo ? undefined : '50%'),
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
  const moreThanTwo = properties.length > 2;
  const styles = useStyles({ moreThanTwo });

  /**
   * @param {import('typings/orbis').Property} property
   */
  const handleClick = property => {
    if (property.name === selectedProperty?.name || !onChange) return;
    onChange(property);
  };

  return (
    <>
      <Grid item xs={moreThanTwo ? 5 : 12}>
        <FormLabel>Select display type:</FormLabel>
      </Grid>
      <Grid item xs={moreThanTwo ? 7 : 12} container justify="center">
        <ButtonGroup
          className={styles.buttonGroup}
          size="small"
          orientation={moreThanTwo ? 'vertical' : 'horizontal'}
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
