import React from 'react';

import { Button, CircularProgress } from '@astrosat/astrosat-ui';

/**
 * @param {import('@material-ui/core').ButtonProps & {isLoading?: boolean}} props
 */
export const LoadingButton = ({ isLoading = false, children, ...rest }) => (
  <Button {...rest}>
    {isLoading ? <CircularProgress color="inherit" size={24} /> : children}
  </Button>
);
