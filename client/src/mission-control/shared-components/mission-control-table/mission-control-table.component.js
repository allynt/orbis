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
    padding: theme.spacing(0.75, 1.25),
    border: 'none',
    maxWidth: '8rem',
  },
  head: {
    fontSize: '0.875rem',
    backgroundColor: 'transparent',
    border: '0',
  },
  body: {
    ...theme.typography.body1,
  },
  stickyHeader: {},
}));

export const MissionControlTableCell = ({ children = null, ...props }) => {
  const styles = useCellStyles({});
  return (
    <TableCell classes={styles} {...props}>
      {children}
    </TableCell>
  );
};

const useTableStyles = makeStyles(theme => ({
  container: {
    padding: `0 ${theme.spacing(6.5)}`,
  },
  table: {
    borderSpacing: `0 ${theme.spacing(1.25)}`,
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
          <MissionControlTableCell align="center" colSpan={5}>
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

  const handlePrevClick = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <TableContainer className={styles.container}>
      <Table stickyHeader className={styles.table}>
        <TableHead>
          <TableRow>
            {columnHeaders?.map(column => (
              <MissionControlTableCell align="left">
                {column}
              </MissionControlTableCell>
            ))}
          </TableRow>
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
          handlePrevClick={handlePrevClick}
          handleNextClick={handleNextClick}
        />
      ) : null}
    </TableContainer>
  );
};
