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
        name: 'Air Pollution Index Overall',
        type: 'percentage',
        min: 0,
        max: 100,
      },
      {
        name: 'Carbon Emissions Index Overall',
        type: 'percentage',
        min: 0,
        max: 100,
      },
    ],
  },
};

const pairsLayer = {
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
<<<<<<< HEAD
>>>>>>> fix(frontend): Update logic/regexes, add tests/stories and extract helpers/constants
=======

export const PairedOptions = () => (
  <Provider store={store}>
    <RadioPicker selectedLayer={pairsLayer} dispatch={action('Dispatch')} />
  </Provider>
);
>>>>>>> fix(frontend): Finish logic, tests, stories, styling
