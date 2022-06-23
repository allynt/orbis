import React from 'react';

import { makeStyles, TextField as AuiTextField } from '@astrosat/astrosat-ui';

import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  textField: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    '&:last-of-type': {
      marginBottom: theme.spacing(4),
    },
  },
  label: {},
  shrink: {
    transform: `translate(${theme.spacing(2)}, 1.5px) scale(0.75)`,
  },
}));

/**
 * @param {import('@material-ui/core').TextFieldProps} props
 */
export const TextField = ({
  className,
  InputLabelProps,
  value = '',
  ...rest
}) => {
  const styles = useStyles();

  return (
    <AuiTextField
      className={clsx(styles.textField, className)}
      InputLabelProps={{
        ...InputLabelProps,
        classes: {
          ...InputLabelProps?.classes,
          shrink: clsx(styles.shrink, InputLabelProps?.classes?.shrink),
        },
      }}
      value={value}
      {...rest}
    />
  );
};
