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
    minWidth: 'unset !important',
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
export const MapControlButton = React.forwardRef(
  ({ className, selected, ...rest }, ref) => {
    const styles = useStyles();
    return (
      <Button
        ref={ref}
        className={clsx(className, styles.button, {
          [styles.selected]: selected,
        })}
        {...rest}
      />
    );
  },
);
