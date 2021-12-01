import React from 'react';

import faker from 'faker/locale/en_GB';

import ProtectedFeature from './protected-feature.component';

const TYPES = ['warning', 'not-good', 'neutral', 'good', 'very-good'];

export default {
  title: 'Dashboard/Nature Scotland/Protected Features',
  argTypes: { onSubmit: { action: 'onSubmit' } },
  args: {
    buttons: [
      { label: 'button one' },
      { label: 'button two' },
      { label: 'button three' },
    ],
    features: Array(5)
      .fill()
      .map((_, i) => {
        return {
          id: i,
          icon: faker.image.imageUrl(),
          title: `Title ${i}`,
          description: `Description ${i}`,
          type: TYPES[Math.floor(Math.random() * TYPES.length)],
        };
      }),
  },
};

export const Default = args => <ProtectedFeature {...args} />;
