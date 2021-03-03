import faker from 'faker';
import * as React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { PropertyTimeSeriesChart } from './property-time-series-chart.component';
import addDays from 'date-fns/addDays';
import isChromatic from 'chromatic/isChromatic';

const mockStore = configureMockStore();

if (isChromatic()) faker.seed(1);

export default { title: 'Analysis Panel/Property Time Series Chart' };

const selectedProperty = { name: 'Dogs' };

const Template = args => {
  return (
    <Provider
      store={mockStore({
        orbs: {
          isolationPlus: {
            property: selectedProperty,
            ...args.orbState,
          },
        },
      })}
    >
      <PropertyTimeSeriesChart {...args} />
    </Provider>
  );
};

export const Default = Template.bind({});
Default.args = {
  orbState: {},
};

export const OneFeature = Template.bind({});

const oneFeature = [
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
];

OneFeature.args = {
  selectedProperty,
  clickedFeatures: oneFeature,
  orbState: {
    clickedFeatures: oneFeature,
  },
};

export const MultipleFeatures = Template.bind({});

const multipleFeatures = Array(3)
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
  }));

MultipleFeatures.args = {
  selectedProperty,
  clickedFeatures: multipleFeatures,
  orbState: {
    clickedFeatures: multipleFeatures,
  },
};

export const Averaged = Template.bind({});
Averaged.args = {
  ...MultipleFeatures.args,
  selectedProperty: {
    name: 'Dogs',
    aggregation: 'mean',
  },
};
