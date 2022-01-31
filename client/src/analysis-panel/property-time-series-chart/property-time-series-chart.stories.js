import * as React from 'react';

import faker from '@faker-js/faker';
import isChromatic from 'chromatic/isChromatic';
import addDays from 'date-fns/addDays';

import { PropertyTimeSeriesChart } from './property-time-series-chart.component';

if (isChromatic()) faker.seed(1);

export default { title: 'Analysis Panel/Property Time Series Chart' };

const selectedProperty = { name: 'Dogs', units: '%' };

const Template = args => <PropertyTimeSeriesChart {...args} />;

export const Default = Template.bind({});

export const OneFeature = Template.bind({});
OneFeature.args = {
  selectedProperty,
  clickedFeatures: [
    {
      object: {
        properties: {
          Dogs: Array(20)
            .fill(undefined)
            .map((_, i) => ({
              timestamp: addDays(new Date(2077, 10, 24), i).toISOString(),
              value: faker.random.number(100),
            })),
        },
      },
    },
  ],
};

export const MultipleFeatures = Template.bind({});
MultipleFeatures.args = {
  selectedProperty,
  clickedFeatures: Array(3)
    .fill(undefined)
    .map(() => ({
      object: {
        properties: {
          Dogs: Array(20)
            .fill(undefined)
            .map((_, i) => ({
              timestamp: addDays(new Date(2077, 10, 24), i).toISOString(),
              value: faker.random.number(100),
            })),
        },
      },
    })),
};

export const Averaged = Template.bind({});
Averaged.args = {
  ...MultipleFeatures.args,
  selectedProperty: {
    name: 'Dogs',
    aggregation: 'mean',
  },
};
