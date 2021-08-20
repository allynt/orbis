import React, { useState } from 'react';

import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { TablePaginationFooter } from './table.pagination-footer.component';

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

export const MissionControlTableCell = props => {
  const styles = useCellStyles({});
  return <TableCell classes={styles} {...props} />;
};

const useTableStyles = makeStyles(theme => ({
  table: {
    borderCollapse: 'separate',
    borderSpacing: theme.spacing(0, 2),
  },
}));

export const MissionControlTable = ({
  rows,
  columnHeaders,
  initialCurrentPage = 0,
  initialRowsPerPage = 5,
  noDataMessage,
}) => {
  const styles = useTableStyles({});

  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const getTableContent = rows => {
    if (!rows || rows.length === 0) {
      return (
        <TableRow>
          <MissionControlTableCell
            align="center"
            colSpan={columnHeaders.length}
          >
            {noDataMessage}
          </MissionControlTableCell>
        </TableRow>
      );
    } else if (Array.isArray(rows) && rowsPerPage > 0) {
      return rows?.slice(
        currentPage * rowsPerPage,
        currentPage * rowsPerPage + rowsPerPage,
      );
    } else {
      return rows;
    }
  };

  const handleChangePage = (_, newPage) => {
    setCurrentPage(newPage - 1);
  };

  const handleChangeRowsPerPage = value => {
    setRowsPerPage(parseInt(value, 10));
    setCurrentPage(0);
  };

  return (
    <TableContainer>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>{columnHeaders}</TableRow>
        </TableHead>
        <TableBody>{getTableContent(rows)}</TableBody>
      </Table>
      {Array.isArray(rows) && rows.length > 0 ? (
        <TablePaginationFooter
          currentPage={currentPage + 1}
          rowsPerPage={rowsPerPage}
          pageCount={Math.ceil(rows?.length / rowsPerPage)}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleChangePage={handleChangePage}
        />
      ) : null}
    </TableContainer>
  );
};
