import faker from 'faker';
import * as React from 'react';
import { PropertyTimeSeriesChart } from './property-time-series-chart.component';
import addDays from 'date-fns/addDays';

export default { title: 'Analysis Panel/Property Time Series Chart' };

const Template = args => <PropertyTimeSeriesChart {...args} />;

export const Default = Template.bind({});

export const OneFeature = Template.bind({});
OneFeature.args = {
  selectedProperty: { name: 'Dogs' },
  clickedFeatures: [
    {
      object: {
        properties: {
          Dogs: Array(20)
            .fill(undefined)
            .map((_, i) => ({
              timestamp: addDays(new Date(), i).toISOString(),
              value: faker.random.number(100),
            })),
        },
      },
    },
  ],
};

export const MultipleFeatures = Template.bind({});
MultipleFeatures.args = {
  selectedProperty: { name: 'Dogs' },
  clickedFeatures: Array(3)
    .fill(undefined)
    .map(() => ({
      object: {
        properties: {
          Dogs: Array(20)
            .fill(undefined)
            .map((_, i) => ({
              timestamp: addDays(new Date(), i).toISOString(),
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
