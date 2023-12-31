import React from 'react';

import { makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  fieldset: {
    border: '4px solid',
    borderColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  legend: {
    fontSize: '0.8125rem',
    fontWeight: 800,
    fontStyle: 'italic',
    padding: '0 0.5rem 0 0.5rem',
  },
}));

export const FieldWrapper = ({ title, children }) => {
  const styles = useStyles();

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{title}</legend>

      {children}
    </fieldset>
  );
};
