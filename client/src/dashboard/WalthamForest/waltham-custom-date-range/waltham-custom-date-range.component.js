import React from 'react';

import { Select, MenuItem, makeStyles } from '@astrosat/astrosat-ui';

const useStyles = makeStyles(theme => ({
  select: {
    border: `1.5px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    maxWidth: '15rem',
    '&:focus': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const WalthamCustomDateRange = ({ timeline, value, onSelect }) => {
  const styles = useStyles({});
  return (
    <Select
      value={value ?? ''}
      onChange={({ target: { value } }) => onSelect(value)}
      classes={{ root: styles.select }}
      disableUnderline
    >
      {timeline?.map(year => {
        const startYear = timeline[timeline.indexOf(year) - 4];
        return !!startYear ? (
          <MenuItem key={year} value={year}>
            {timeline[timeline.indexOf(year) - 4]} - {year}
          </MenuItem>
        ) : null;
      })}
    </Select>
  );
};

export { WalthamCustomDateRange };
