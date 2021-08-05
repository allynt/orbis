import React from 'react';

import faker from 'faker/locale/en_GB';

import { OrbDetails } from './orb-details.component';

export default {
  title: 'Mission Control/Store/Orbs/OrbDetails',
};

const Template = args => (
  <OrbDetails match={{ params: { orbId: '1' } }} {...args} />
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
