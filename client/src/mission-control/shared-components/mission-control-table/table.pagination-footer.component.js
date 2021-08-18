import React from 'react';

import {
  Button,
  ButtonBase,
  makeStyles,
  MenuItem,
  Pagination,
  Select,
  TableFooter,
  Typography,
} from '@astrosat/astrosat-ui';

import clsx from 'clsx';

import { ROWS_PER_PAGE_OPTIONS } from 'mission-control/mission-control.constants';

const useStyles = makeStyles(theme => ({
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pagination: {
    marginLeft: 'auto',
  },
  button: {
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(14),
    minWidth: 0,
    padding: theme.spacing(1, 1.5),
    borderRadius: 0,
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create(
      ['background-color', 'box-shadow', 'border', 'color'],
      {
        duration: theme.transitions.duration.short,
      },
    ),
    '&$selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.main,
    },
  },
  page: {
    color: theme.palette.grey[500],
  },
  previous: {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderRight: `1px solid ${theme.palette.grey[700]}`,
  },
  next: {
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    borderLeft: `1px solid ${theme.palette.grey[700]}`,
  },
  selected: {},
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
        renderItem={({ type, selected, page, ...rest }) => (
          // @ts-ignore
          <Button
            className={clsx(styles.button, styles[type], {
              [styles.selected]: selected,
            })}
            {...rest}
          >
            {type === 'page' ? page : type === 'previous' ? 'Prev' : 'Next'}
          </Button>
        )}
      />
    </TableFooter>
  );
};
