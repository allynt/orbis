import * as React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { CategoryBreakdownChart } from './category-breakdown-chart.component';

export default { title: 'Analysis Panel/Category Breakdown Chart' };

const mockStore = configureMockStore();

const property = {
  type: 'discrete',
  name: 'fruit',
  label: 'Fruit',
  categories: {
    Apples: {
      color: '#8db600',
    },
    Oranges: {
      color: '#ffa500',
    },
    Lemons: {
      color: '#ffff00',
    },
    Limes: {
      color: '#32CD32',
    },
  },
};

const Template = args => {
  return (
    <Provider
      store={mockStore({
        orbs: {
          isolationPlus: {
            property,
            ...args.orbState,
          },
        },
      })}
    >
      <CategoryBreakdownChart selectedProperty={property} {...args} />
    </Provider>
  );
};

export const OneArea = Template.bind({});

const oneArea = [
  {
    object: {
      properties: {
        fruit: 'Apples',
      },
    },
  },
];

OneArea.args = {
  clickedFeatures: oneArea,
  orbState: {
    clickedFeatures: oneArea,
  },
};

export const Default = Template.bind({});

const multipleFeatures = [
  {
    object: {
      properties: {
        fruit: 'Apples',
      },
    },
  },
  {
    object: {
      properties: {
        fruit: 'Lemons',
      },
    },
  },
  {
    object: {
      properties: {
        fruit: 'Limes',
      },
    },
  },
];

Default.args = {
  clickedFeatures: multipleFeatures,
  orbState: {
    clickedFeatures: multipleFeatures,
  },
};
