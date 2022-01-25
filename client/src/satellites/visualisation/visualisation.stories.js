import React from 'react';

import faker from '@faker-js/faker/locale/en_GB';

import Visualisation from './visualisation.component';

export default {
  title: 'Satellites/Visualisation',
  argTypes: {
    setCurrentVisualisation: { action: true },
    onSaveImageSubmit: { action: true },
  },
};

const Template = args => <Visualisation {...args} />;

export const Default = Template.bind({});
Default.args = {
  visualisations: Array(5)
    .fill()
    .map((_, i) => ({
      id: i,
      description: `Visualisation ${i} description`,
      label: `Visualisation ${i}`,
      thumbnail: faker.image.imageUrl(),
    })),
};
