import React from 'react';

import { Select, MenuItem } from '@astrosat/astrosat-ui';

import { OPTIONS } from '../popup-status-and-note/status-constants';

export const StatusFilter = ({ status, onSubmit }) => (
  <Select
    name="Status Select"
    value={status || 'ALL'}
    inputProps={{ 'aria-label': 'Status Select' }}
    onChange={e => onSubmit(e.target.value)}
  >
    <MenuItem value="ALL">All</MenuItem>
    {Object.entries(OPTIONS).map(([key, label]) => (
      <MenuItem key={key} value={key}>
        {label}
      </MenuItem>
    ))}
  </Select>
);
