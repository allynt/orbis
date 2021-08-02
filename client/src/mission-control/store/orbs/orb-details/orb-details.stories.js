import React from 'react';

import { Box } from '@astrosat/astrosat-ui';

import faker from 'faker/locale/en_GB';
import { MemoryRouter, Route } from 'react-router-dom';

import { OrbDetails } from './orb-details.component';

export default {
  title: 'Mission Control/Store/Orbs/OrbDetails',
};

const Template = args => (
  <MemoryRouter initialEntries={['/1']}>
    <Route
      component={routerProps => (
        <Box p={1}>
          <OrbDetails {...routerProps} {...args} />
        </Box>
      )}
      path={'/:id'}
    />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  orbs: [
    {
      id: 1,
      name: faker.commerce.productName(),
      description: faker.lorem.paragraphs(4),
      images: [faker.image.animals()],
    },
  ],
};
