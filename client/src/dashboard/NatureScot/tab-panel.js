import React from 'react';

import { Box } from '@astrosat/astrosat-ui';

// Generic Tab Panel
export const TabPanel = ({ value, index, children, ...rest }) => (
  <div role="tabpanel" hidden={value !== index} {...rest}>
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);
