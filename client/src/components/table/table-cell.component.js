import React from 'react';

import { makeStyles, TableCell } from '@astrosat/astrosat-ui';

const useCellStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    '&:first-of-type': {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
    '&:last-of-type': {
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
    border: 'none',
  },
  head: {
    fontSize: '0.875rem',
    backgroundColor: 'transparent',
    border: '0',
    padding: theme.spacing(0, 2),
  },
  body: {
    ...theme.typography.body1,
  },
}));

/**
 * @param {import('@material-ui/core').TableCellProps} props
 */
export const OrbisTableCell = ({ classes, padding, ...props }) => {
  const styles = useCellStyles();
  return (
    <TableCell
      classes={{ ...styles, ...classes }}
      padding="normal"
      {...props}
    />
  );
};
