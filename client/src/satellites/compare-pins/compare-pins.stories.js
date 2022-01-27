import React from 'react';

import faker from '@faker-js/faker/locale/en_GB';

import ComparePins from './compare-pins.component';

export default { title: 'Satellites/ComparePins' };

const Template = args => <ComparePins {...args} />;

export const NoScenes = Template.bind({});
NoScenes.args = {};

export const WithScenes = Template.bind({});
WithScenes.args = {
  pinnedScenes: Array(4)
    .fill()
    .map((_, i) => ({
      id: i,
      created: faker.date.past().toISOString(),
      cloudCover: faker.random.number(100),
      thumbnail_url: faker.random.image(),
    })),
};
