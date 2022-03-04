import React from 'react';

import { Select, MenuItem, makeStyles } from '@astrosat/astrosat-ui';

import { WALTHAM_FILTER_RANGE } from 'dashboard/WalthamForest/waltham.constants';

const useWalthamSelectStyles = makeStyles(theme => ({
  root: {
    padding: '0.5rem',
    width: '10rem',
  },
  select: {
    border: `1.5px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    maxWidth: '15rem',
    marginLeft: 'auto',
    '&:focus': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

/**
 * @param {{
 *  timeline: string[]
 *  value: string
 *  onSelect: (value: string) => void
 *  range?: number
 * }} props
 */
const WalthamCustomDateRange = ({
  timeline,
  value,
  onSelect,
  range = WALTHAM_FILTER_RANGE,
}) => {
  const styles = useWalthamSelectStyles({});
  return (
    <Select
      value={value ?? ''}
      onChange={({ target: { value } }) => onSelect(value)}
      // className={styles.select}
      classes={{ root: styles.root, select: styles.select }}
      disableUnderline
    >
      {timeline?.map(year => {
        const startYear = timeline[timeline.indexOf(year) - range];
        return !!startYear ? (
          <MenuItem key={year} value={year}>
            {startYear} - {year}
          </MenuItem>
        ) : null;
      })}
    </Select>
  );
};

export { WalthamCustomDateRange, useWalthamSelectStyles };
