import React from 'react';

import faker from '@faker-js/faker/locale/en_GB';
import { MemoryRouter } from 'react-router-dom';

import { OrbDetails } from './orb-details.component';

export default {
  title: 'Mission Control/Store/Orbs/OrbDetails',
};

const Template = args => (
  <MemoryRouter>
    <OrbDetails match={{ params: { orbId: '1' } }} {...args} />
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
