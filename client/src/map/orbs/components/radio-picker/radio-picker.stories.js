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
