import React from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
  Typography,
  TableFooter,
  Pagination,
  Select,
  MenuItem,
  makeStyles,
} from '@astrosat/astrosat-ui';
import { ROWS_PER_PAGE_OPTIONS } from 'mission-control/mission-control.constants';

const useStyles = makeStyles(theme => ({
  layout: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    width: '100%',
  },
  showEntries: {
    width: 'fit-content',
  },
  buttons: {
    width: 'fit-content',
  },
  button: {
    padding: '0',
    boxShadow: 'none',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.common.white,
    height: '2rem',
  },
  prevButton: {
    borderRadius: '5px 0 0 5px',
  },
  nextButton: {
    borderRadius: '0 5px 5px 0',
  },
  pagination: {
    flexWrap: 'nowrap',
    height: '2rem',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.common.white,
    '& Button': {
      borderRadius: '0',
      margin: '0',
      padding: '0',
    },
  },
}));

export const TablePaginationFooter = ({
  currentPage,
  rowsPerPage,
  pageCount,
  handleChangeRowsPerPage,
  handleChangePage,
  handlePrevClick,
  handleNextClick,
}) => {
  const styles = useStyles({});
  return (
    <TableFooter className={clsx(styles.layout, styles.footer)}>
      <Box className={clsx(styles.layout, styles.showEntries)}>
        <Typography variant="h3">Show</Typography>
        <Select
          value={rowsPerPage}
          onChange={e => handleChangeRowsPerPage(e.target.value)}
        >
          {ROWS_PER_PAGE_OPTIONS.map(entry => (
            <MenuItem value={entry}>{entry}</MenuItem>
          ))}
        </Select>
        <Typography variant="h3">Entries</Typography>
      </Box>

      <Box className={clsx(styles.layout, styles.buttons)}>
        <Button
          className={clsx(styles.button, styles.prevButton)}
          onClick={handlePrevClick}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        <Pagination
          className={clsx(styles.layout, styles.pagination)}
          hideNextButton
          hidePrevButton
          color="primary"
          page={currentPage}
          count={pageCount}
          onChange={handleChangePage}
        />
        <Button
          className={clsx(styles.button, styles.nextButton)}
          onClick={handleNextClick}
          disabled={currentPage === pageCount}
        >
          Next
        </Button>
      </Box>
    </TableFooter>
  );
};
