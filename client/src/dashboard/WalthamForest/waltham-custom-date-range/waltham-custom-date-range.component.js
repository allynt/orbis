import React from 'react';

import { Select, MenuItem, makeStyles } from '@astrosat/astrosat-ui';

import { WALTHAM_YEAR_RANGE } from 'dashboard/WalthamForest/waltham.constants';

const useStyles = makeStyles(theme => ({
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
  range = WALTHAM_YEAR_RANGE,
}) => {
  const styles = useStyles({});
  return (
    <Select
      value={value ?? ''}
      onChange={({ target: { value } }) => onSelect(value)}
      className={styles.select}
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

export { WalthamCustomDateRange };
