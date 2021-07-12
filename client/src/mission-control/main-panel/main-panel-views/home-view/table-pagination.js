import React from 'react';
import { Box, IconButton, makeStyles } from '@astrosat/astrosat-ui';

export const usePaginationStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    border: 'none',
  },
}));

export const TablePaginationActions = props => {
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" width="100%">
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {'Prev'}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {'Next'}
      </IconButton>
    </Box>
  );
};
