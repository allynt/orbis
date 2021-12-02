import React from 'react';

import faker from 'faker/locale/en_GB';

import { ChartWrapper } from 'dashboard/charts/chart-wrapper.component';

import ProtectedFeatureList from './protected-feature-list.component';

const TYPES = ['warning', 'not-good', 'neutral', 'good', 'very-good'];

export default {
  title: 'Dashboard/Nature Scotland/Protected Feature List',
  argTypes: { onSubmit: { action: 'onSubmit' } },
  args: {
    features: Array(30)
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

const Template = args => <ProtectedFeatureList {...args} />;

export const Default = Template.bind({});

export const InWrapper = args => (
  <ChartWrapper title="Protected Features">
    <ProtectedFeatureList {...args} />
  </ChartWrapper>
);
