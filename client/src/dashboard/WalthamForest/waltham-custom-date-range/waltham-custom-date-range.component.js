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
    marginBottom: ({ pad }) => (pad ? '1rem' : '0'),
    '&:focus': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

/**
 * @param {{
 *  timeline: number[]
 *  value: number
 *  onSelect: (value: number) => void
 *  range?: number,
 *  pad?: boolean
 * }} props
 */
const WalthamCustomDateRange = ({
  timeline,
  value,
  onSelect,
  range = WALTHAM_FILTER_RANGE,
  pad = false,
}) => {
  const styles = useWalthamSelectStyles({ pad });
  return (
    <Select
      value={value ?? ''}
      onChange={({ target: { value } }) => onSelect(+value)}
      classes={{ root: styles.root, select: styles.select }}
      disableUnderline
    >
      {timeline?.map(year => {
        const startYear = Number(timeline[timeline.indexOf(year) - range]);

        const optionLabel = `
          ${startYear}-${startYear + 1} -
          ${year}-${year + 1}
        `;

        return !!startYear ? (
          <MenuItem key={year} value={year}>
            {optionLabel}
          </MenuItem>
        ) : null;
      })}
    </Select>
  );
};

export { WalthamCustomDateRange, useWalthamSelectStyles };
