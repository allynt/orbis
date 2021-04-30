import {
  Button,
  ButtonGroup,
  FormLabel,
  makeStyles,
} from '@astrosat/astrosat-ui';
import clsx from 'clsx';
import React from 'react';
import { FORMAT } from '../radio-picker-constants';

const useStyles = makeStyles(theme => ({
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

export const DisplayTypeToggleButtons = ({ selectedProperty, onChange }) => {
  const styles = useStyles();
  return (
    <>
      <FormLabel className={styles.fullGrid}>Select display type:</FormLabel>
      <ButtonGroup size="small" className={styles.fullGrid}>
        <Button
          onClick={() => onChange(FORMAT.percentage)}
          className={clsx(styles.button, {
            [styles.notActive]: selectedProperty.type !== FORMAT.percentage,
          })}
        >
          Percentage
        </Button>
        <Button
          onClick={() => onChange(FORMAT.number)}
          className={clsx(styles.button, {
            [styles.notActive]: selectedProperty.type !== FORMAT.number,
          })}
        >
          Number
        </Button>
      </ButtonGroup>
    </>
  );
};
