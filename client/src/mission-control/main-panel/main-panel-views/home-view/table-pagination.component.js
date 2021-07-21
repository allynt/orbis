import React from 'react';
import {
  Box,
  Button,
  TableFooter,
  Pagination,
  makeStyles,
} from '@astrosat/astrosat-ui';

import { UsersViewTableRow } from 'mission-control/mission-control-table/mission-control-table.component';

const usePaginationStyles = makeStyles(() => ({
  root: {
    width: '100%',
    border: 'none',
  },
}));

const TablePaginationActions = props => {
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" width="100%">
      <Button
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        Prev
      </Button>
      <Button
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        Next
      </Button>
    </Box>
  );
};

export const UsersViewTablePagination = props => {
  const classes = usePaginationStyles({});
  return (
    <TableFooter>
      <UsersViewTableRow>
        <Pagination
          hideNextButton
          hidePrevButton
          shape="rounded"
          color="primary"
          {...props}
        />

        {/* <TablePagination
          classes={classes}
          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
          component="div"
          labelRowsPerPage="Show entries"
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            native: true,
          }}
          ActionsComponent={TablePaginationActions}
          {...props}
        /> */}
      </UsersViewTableRow>
    </TableFooter>
  );
};
