import React from 'react';

import faker from 'faker/locale/en_GB';

import Results from './results.component';

export default {
  title: 'Satellites/Results',
  argTypes: {
    onSceneClick: { action: true },
    onScenePin: { action: true },
    onSceneUnpin: { action: true },
    onInfoClick: { action: true },
    onSaveSearchSubmit: { action: true },
  },
};

const Template = args => <Results {...args} />;

export const NoScenes = Template.bind({});

export const WithScenes = Template.bind({});
WithScenes.args = {
  scenes: Array(5)
    .fill()
    .map((_, i) => ({
      id: `${i}`,
      created: faker.date.past().toISOString(),
      cloudCover: faker.random.number(15),
      tier: faker.random.arrayElement(['free', 'mid', 'high']),
      thumbnail_url: faker.image.imageUrl(),
    })),
};
