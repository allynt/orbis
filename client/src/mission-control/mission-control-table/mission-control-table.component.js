import React from 'react';
import { Table, TableCell, TableRow, makeStyles } from '@astrosat/astrosat-ui';

const useTableStyles = makeStyles(() => ({
  table: {
    borderSpacing: '0 1rem',
  },
}));

const useRowStyles = makeStyles(theme => ({
  root: {},
}));

const useCellStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
  head: {
    ...theme.typography.h2,
  },
  body: {
    ...theme.typography.body1,
    padding: '0',
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

export const UsersViewTableRow = ({ children, ...props }) => {
  const styles = useRowStyles({});
  return (
    <TableRow {...props} classes={styles}>
      {children}
    </TableRow>
  );
};

export const UsersViewTable = ({ children }) => {
  const styles = useTableStyles({});
  return (
    <Table stickyHeader className={styles.table}>
      {children}
    </Table>
  );
};
