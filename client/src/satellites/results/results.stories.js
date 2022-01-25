import React from 'react';

import faker from '@faker-js/faker/locale/en_GB';

import Results from './results.component';

export default {
  title: 'Satellites/Results',
  args: { isFetchingResults: false },
  argTypes: {
    onSceneClick: { action: true },
    onInfoClick: { action: true },
  },
};

const Template = args => <Results {...args} />;

export const NoScenes = Template.bind({});

export const Fetching = Template.bind({});
Fetching.args = {
  isFetchingResults: true,
};

export const WithScenes = Template.bind({});
WithScenes.args = {
  scenes: Array(5)
    .fill()
    .map((_, i) => ({
      id: `${i}`,
      created: faker.date.past().toISOString(),
      cloudCover: faker.random.number(15),
      thumbnail_url: faker.image.imageUrl(),
    })),
};
