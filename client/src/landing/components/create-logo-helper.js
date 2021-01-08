import React from 'react';

import { styled } from '@astrosat/astrosat-ui';

export const createLogo = logo => {
  const Component = styled(logo)(({ theme }) => ({
    height: theme.typography.pxToRem(80),
    color: theme.palette.text.primary,
  }));

  return <Component />;
};
