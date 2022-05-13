import React from 'react';

import { Box } from '@astrosat/astrosat-ui';

// Generic Tab Panel
const TabPanel = ({ value, index, children, ...rest }) => (
  <div role="tabpanel" hidden={value !== index} {...rest}>
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);

export default TabPanel;
