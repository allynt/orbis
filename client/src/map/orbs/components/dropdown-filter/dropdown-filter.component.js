import React from 'react';

import { Select, MenuItem, makeStyles } from '@astrosat/astrosat-ui';

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
    <div className={styles.container}>
      <Select
        label={label}
        value={value || defaultValue}
        onChange={e => onChange(e.target.value)}
      >
        {options?.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
