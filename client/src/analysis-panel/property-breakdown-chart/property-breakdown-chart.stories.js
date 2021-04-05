import * as React from 'react';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { PropertyBreakdownChart } from './property-breakdown-chart.component';

export default { title: 'Analysis Panel/Property Breakdown Chart' };

const mockStore = configureMockStore();

const selectedProperty = {
  source_id: 'test/layer',
  aggregation: 'sum',
  breakdown: [
    'people aged 0-17',
    'people aged 18-39',
    'people aged 40-64',
    'people aged 65+',
  ],
};

const Template = args => {
  return (
    <Provider
      store={mockStore({
        data: {
          sources: [
            {
              source_id: 'test/layer',
              metadata: {
                properties: [
                  { name: 'people aged 0-17' },
                  { name: 'people aged 18-39' },
                  { name: 'people aged 40-64' },
                  { name: 'people aged 65+' },
                ],
              },
            },
          ],
          layers: ['test/layer'],
        },
        orbs: {
          isolationPlus: {
            property: selectedProperty,
            clickedFeatures: args.orbState.clickedFeatures,
          },
        },
      })}
    >
      <PropertyBreakdownChart {...args} />
    </Provider>
  );
};

export const NoClickedFeatures = Template.bind({});
NoClickedFeatures.args = {
  selectedProperty,
  orbState: {},
};

export const OneClickedFeature = Template.bind({});

const oneClickedFeature = [
  {
    object: {
      properties: {
        'people aged 0-17': 1,
        'people aged 18-39': 2,
        'people aged 40-64': 3,
        'people aged 65+': 4,
      },
    },
  },
];

OneClickedFeature.args = {
  ...NoClickedFeatures.args,
  clickedFeatures: oneClickedFeature,
  orbState: {
    clickedFeatures: oneClickedFeature,
  },
};

export const MultipleClickedFeatures = Template.bind({});

const multipleClickedFeatures = [
  ...OneClickedFeature.args.clickedFeatures,
  {
    object: {
      properties: {
        'people aged 0-17': 5,
        'people aged 18-39': 6,
        'people aged 40-64': 7,
        'people aged 65+': 8,
      },
    },
  },
  {
    object: {
      properties: {
        'people aged 0-17': 1,
        'people aged 18-39': 2,
        'people aged 40-64': 7,
        'people aged 65+': 8,
      },
    },
  },
];

MultipleClickedFeatures.args = {
  ...NoClickedFeatures.args,
  clickedFeatures: multipleClickedFeatures,
  orbState: {
    clickedFeatures: multipleClickedFeatures,
  },
};
