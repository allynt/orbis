import React from 'react';

import { Select, MenuItem } from '@astrosat/astrosat-ui';

export const StatusFilter = ({ status, options, label, onSubmit }) => {
  return (
    <Select
      name={label}
      value={status || 'ALL'}
      inputProps={{ 'aria-label': 'Status Select' }}
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
