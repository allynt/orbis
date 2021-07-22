import React from 'react';
import { Table, TableCell, TableRow, makeStyles } from '@astrosat/astrosat-ui';

const useTableStyles = makeStyles(() => ({
  table: {
    borderSpacing: '0 1rem',
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
    padding: `0 ${theme.spacing(4)}`,
  },
  head: {
    ...theme.typography.h2,
    backgroundColor: 'transparent',
    border: '0',
  },
  body: {
    ...theme.typography.body1,
  },
  stickyHeader: {},
}));

export const UsersViewTableCell = ({ children, ...props }) => {
  const styles = useCellStyles({});
  return (
    <TableCell classes={styles} {...props}>
      {children}
    </TableCell>
  );
};

export const UsersViewTableRow = ({ children, ...props }) => (
  <TableRow {...props}>{children}</TableRow>
);

export const UsersViewTable = ({ children }) => {
  const styles = useTableStyles({});
  return (
    <Table stickyHeader className={styles.table}>
      {children}
    </Table>
  );
};
