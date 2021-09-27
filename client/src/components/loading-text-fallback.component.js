import React from 'react';

import {
  Typography as BaseTypography,
  CircularProgress,
  styled,
} from '@astrosat/astrosat-ui';

const Typography = styled(BaseTypography)(({ theme }) => ({
  margin: theme.spacing(2),
}));

/** @param {import('@material-ui/core').TypographyProps} props */
export const LoadingTextFallback = ({
  children = 'Loading...',
  variant = 'h4',
  // @ts-ignore
  component = 'p',
  ...rest
}) => (
  <Typography
    variant={variant}
    // @ts-ignore
    component={component}
    {...rest}
  >
    <CircularProgress size="1em" />
    {children}
  </Typography>
);
