import React from 'react';

import { Select, MenuItem } from '@astrosat/astrosat-ui';

import { OPTIONS } from '../popup-status-and-note/status-constants';

export const StatusFilter = ({ status, onSubmit }) => {
  return (
    <Select
      value={OPTIONS[status] || 'All'}
      inputProps={{ 'aria-label': 'Status Select' }}
      onChange={e => onSubmit(e.target.value)}
    >
      <MenuItem value="All">All</MenuItem>
      {Object.values(OPTIONS).map(option => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};
