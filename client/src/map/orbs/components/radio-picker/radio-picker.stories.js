import React from 'react';

import { Provider } from 'react-redux';

import store from 'store';
import { RadioPicker } from './radio-picker.component';

export default {
  title: 'Map/Radio Picker',
  decorators: [
    Story => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

const Template = args => <RadioPicker {...args} />;

export const NoOptions = Template.bind({});

export const Layer = Template.bind({});
Layer.args = {
  selectedLayer: {
    source_id: 'test/layer',
    metadata: {
      properties: [
        {
          name: 'test',
          application: {
            orbis: {
              label: 'Test',
            },
          },
          label: 'Test',
        },
      ],
    },
  },
};

export const PairedOptionsLayer = Template.bind({});
PairedOptionsLayer.args = {
  selectedLayer: {
    source_id: 'test/layer',
    metadata: {
      properties: [
        {
          name: 'Census 2011: % of people in the age band 40 - 64',
          type: 'percentage',
          min: 0,
          max: 100,
        },
        {
          name: 'Census 2011: number of people in the age band 40 - 64',
          type: 'continuous',
          min: 0,
          max: 365,
        },
        {
          name: 'Census 2011: % of people in the age band 65+',
          type: 'percentage',
          min: 0,
          max: 100,
        },
        {
          name: 'Census 2011: number of people in the age band 65+',
          type: 'continuous',
          min: 0,
          max: 365,
        },
      ],
    },
  },
};
