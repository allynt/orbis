import React from 'react';

import { Table, TableCell, TableRow, makeStyles } from '@astrosat/astrosat-ui';

const useTableStyles = makeStyles(theme => ({
  table: {
    borderSpacing: `0 ${theme.spacing(1.25)}`,
  },
}));

const useCellStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    '&:first-of-type': {
      borderRadius: '5px 0 0 5px',
    },
    '&:last-of-type': {
      borderRadius: '0 5px 5px 0',
    },
    padding: `0.375rem ${theme.spacing(1.25)}`,
    border: 'none',
    maxWidth: '8rem',
  },
  head: {
    ...theme.typography.h2,
    fontWeight: 'normal',
    fontSize: '0.875rem',
    backgroundColor: 'transparent',
    border: '0',
  },
  body: {
    ...theme.typography.body1,
  },
  stickyHeader: {},
}));

export const MissionControlTableCell = ({ children, ...props }) => {
  const styles = useCellStyles({});
  return (
    <TableCell classes={styles} {...props}>
      {children}
    </TableCell>
  );
};

export const MissionControlTableRow = ({ children, ...props }) => (
  <TableRow {...props}>{children}</TableRow>
);

export const MissionControlTable = ({ children }) => {
  const styles = useTableStyles({});
  return (
    <Table stickyHeader className={styles.table}>
      {children}
    </Table>
  );
};
