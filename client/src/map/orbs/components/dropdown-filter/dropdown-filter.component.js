import React from 'react';

import { Select, MenuItem } from '@astrosat/astrosat-ui';

export const DropdownFilter = ({
  value,
  options,
  label,
  defaultValue = '',
  onSubmit,
}) => {
  return (
    <Select
      name={label}
      value={value || defaultValue}
      inputProps={{ 'aria-label': label }}
      onChange={e => onSubmit(e.target.value)}
    >
      {options?.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
};
