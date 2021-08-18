import React from 'react';

import {
  makeStyles,
  MenuItem,
  Pagination,
  Select,
  TableFooter,
  Typography,
} from '@astrosat/astrosat-ui';

import { ROWS_PER_PAGE_OPTIONS } from 'mission-control/mission-control.constants';

import { PaginationItem } from './pagination-item.component';

const useStyles = makeStyles(theme => ({
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pagination: {
    marginLeft: 'auto',
  },
}));

export const TablePaginationFooter = ({
  currentPage,
  rowsPerPage,
  pageCount,
  handleChangeRowsPerPage,
  handleChangePage,
}) => {
  const styles = useStyles({});
  return (
    <TableFooter className={styles.footer}>
      <Typography variant="h3">
        Show{' '}
        <Select
          fullWidth={false}
          value={rowsPerPage}
          onChange={e => handleChangeRowsPerPage(e.target.value)}
        >
          {ROWS_PER_PAGE_OPTIONS.map(entry => (
            <MenuItem key={entry} value={entry}>
              {entry}
            </MenuItem>
          ))}
        </Select>{' '}
        Entries
      </Typography>

      <Pagination
        className={styles.pagination}
        page={currentPage}
        count={pageCount}
        onChange={handleChangePage}
        renderItem={PaginationItem}
      />
    </TableFooter>
  );
};
