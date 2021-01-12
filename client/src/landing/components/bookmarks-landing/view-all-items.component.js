import React from 'react';

import { Box, Typography, Link } from '@astrosat/astrosat-ui';

import { Items } from './items.component';

export const ViewAllItems = ({ items, chooseBookmark, toggle }) => (
  <Box margin="1rem 0" width="100%">
    <Box display="flex" justifyContent="space-between" marginBottom="1rem">
      <Typography variant="h2" gutterBottom>
        View All
      </Typography>
      <Link onClick={toggle}>Back to menu</Link>
    </Box>
    <Items items={items} chooseItem={chooseBookmark} />
  </Box>
);
