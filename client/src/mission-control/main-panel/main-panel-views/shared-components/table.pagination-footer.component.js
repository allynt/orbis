import React from 'react';
import clsx from 'clsx';
import {
  Button,
  Typography,
  TableFooter,
  Pagination,
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
  },
  prevButton: {
    borderRadius: '5px 0 0 5px',
    backgroundColor: theme.palette.background.default,
    color: '#fff',
    height: '2rem',
  },
  nextButton: {
    borderRadius: '0 5px 5px 0',
    backgroundColor: theme.palette.background.default,
    color: '#fff',
    height: '2rem',
  },
  pagination: {
    flexWrap: 'nowrap',
    borderRadius: '0',
    height: '2rem',
    backgroundColor: theme.palette.background.default,
    color: '#fff',
    margin: '0',
  },
}));

export const TablePaginationFooter = ({
  currentPage,
  pageCount,
  handleChangeRowsPerPage,
  handleChangePage,
  handlePrevClick,
  handleNextClick,
}) => {
  const styles = useStyles({});
  return (
    <div className={clsx(styles.layout, styles.footer)}>
      <div className={clsx(styles.layout, styles.showEntries)}>
        <Typography variant="h3">Show</Typography>
        <select onChange={e => handleChangeRowsPerPage(e.target.value)}>
          {ROWS_PER_PAGE_OPTIONS.map(entry => (
            <option>{entry}</option>
          ))}
        </select>
        <Typography variant="h3">Entries</Typography>
      </div>

      <div className={clsx(styles.layout, styles.buttons)}>
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
      </div>
    </div>
  );
};
