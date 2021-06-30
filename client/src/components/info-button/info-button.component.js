import React from 'react';

import { IconButton, InfoIcon, makeStyles } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  button: {
    fontSize: theme.typography.pxToRem(8),
    padding: theme.typography.pxToRem(2),
    height: 'min-content',
    width: 'min-content',
    backgroundColor: theme.palette.text.primary,
    color: theme.palette.background.default,
    '&:hover, &:active, &:focus': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

/**
 *
 * @param {import('@material-ui/core').IconButtonProps} props
 */
export const InfoButton = ({ className, color = 'inherit', ...rest }) => {
  const styles = useStyles();
  return (
    <IconButton
      className={clsx(className, styles.button)}
      color="inherit"
      {...rest}
    >
      <InfoIcon titleAccess="Info" fontSize="inherit" />
    </IconButton>
  );
};
