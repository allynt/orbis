import React from 'react';

import { Button, makeStyles } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
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

export const PaginationItem = ({ type, page, selected, ...rest }) => {
  const styles = useStyles();
  return (
    <Button
      className={clsx(styles.button, styles[type], {
        [styles.selected]: selected,
      })}
      {...rest}
    >
      {type === 'page' ? page : type === 'previous' ? 'Prev' : 'Next'}
    </Button>
  );
};
