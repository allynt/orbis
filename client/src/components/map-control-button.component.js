import React from 'react';

import { Button, makeStyles } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  button: {
    padding: theme.spacing(1),
    zIndex: theme.zIndex.appBar,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.main,
    fontSize: '0.74rem',
    minWidth: 'unset',
    '&:hover': {
      backgroundColor: theme.palette.background.default,
    },
    '&$selected': {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.primary.main,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  selected: {},
}));

/**
 * @param {import('@material-ui/core').ButtonProps & {selected?: boolean}} props
 */
export const MapControlButton = ({ className, selected, ...rest }) => {
  const styles = useStyles();
  return (
    <Button
      className={clsx(styles.button, className, {
        [styles.selected]: selected,
      })}
      {...rest}
    />
  );
};
