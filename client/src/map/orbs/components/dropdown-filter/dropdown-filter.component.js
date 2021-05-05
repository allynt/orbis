import React from 'react';

import { TextField, MenuItem, makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
  },
}));

export const DropdownFilter = ({
  value,
  options,
  label,
  defaultValue = '',
  onChange,
}) => {
  const styles = useStyles();
  return (
    <TextField
      select
      label={label}
      value={value || defaultValue}
      onChange={e => onChange(e.target.value)}
      className={styles.container}
    >
      {options?.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  );
};
