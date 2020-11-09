import React from 'react';

import { Provider } from 'react-redux';

import { action } from '@storybook/addon-actions';

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

<<<<<<< HEAD
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
=======
const defaultSelectedLayer = {
  source_id: 'test/layer',
  metadata: {
    properties: [
      {
        name: 'Census 2011: % of people in the age band 40 - 64',
        type: 'percentage',
      },
      {
        name: 'Census 2011: number of people in the age band 40 - 64',
        type: 'continuous',
      },
      {
        name: 'Census 2011: % of people in the age band 65+',
        type: 'percentage',
      },
      {
        name: 'Census 2011: number of people in the age band 65+',
        type: 'continuous',
      },
    ],
  },
};

export const Options = () => {
  return (
    <Provider store={store}>
      <RadioPicker
        selectedLayer={defaultSelectedLayer}
        dispatch={action('Dispatch')}
      />
    </Provider>
  );
};

export const NoOptions = () => (
  <Provider store={store}>
    <RadioPicker
      selectedLayer={{ source_id: 'test/layer' }}
      dispatch={action('Dispatch')}
    />
  </Provider>
);
>>>>>>> fix(frontend): Update logic/regexes, add tests/stories and extract helpers/constants
